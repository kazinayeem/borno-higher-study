import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'borno-higher-study-super-secret-key-2025';

// Mock in-memory persistence for authentication when database is in transition / zero-friction mode
interface StoredUser {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: 'SUPER_ADMIN' | 'DATA_EDITOR' | 'DATA_REVIEWER' | 'STUDENT';
  savedUniversityIds: string[];
  savedScholarshipIds: string[];
  targetCountry?: string;
  targetDegree?: string;
}

const USERS_STORE: Map<string, StoredUser> = new Map([
  [
    'admin@borno.edu',
    {
      id: 'usr-admin-1',
      email: 'admin@borno.edu',
      passwordHash: bcrypt.hashSync('BornoAdmin2025!', 10),
      name: 'Borno System Administrator',
      role: 'SUPER_ADMIN',
      savedUniversityIds: ['uni-aalto', 'uni-tum'],
      savedScholarshipIds: ['sch-finland-gov', 'sch-daad-epos'],
      targetCountry: 'finland',
      targetDegree: 'MASTER',
    },
  ],
  [
    'student@borno.edu',
    {
      id: 'usr-student-1',
      email: 'student@borno.edu',
      passwordHash: bcrypt.hashSync('Student2025!', 10),
      name: 'Rahim Chowdhury',
      role: 'STUDENT',
      savedUniversityIds: ['uni-aalto', 'uni-tudelft'],
      savedScholarshipIds: ['sch-finland-gov'],
      targetCountry: 'finland',
      targetDegree: 'MASTER',
    },
  ],
]);

export const register = async (req: Request, res: Response) => {
  const { email, password, name, role = 'STUDENT' } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }

  const existing = USERS_STORE.get(email.toLowerCase());
  if (existing) {
    return res.status(400).json({ error: 'User with this email already exists.' });
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const newUser: StoredUser = {
    id: `usr-${Date.now()}`,
    email: email.toLowerCase(),
    passwordHash,
    name,
    role: role === 'SUPER_ADMIN' ? 'STUDENT' : role, // Prevent self-elevation to super admin
    savedUniversityIds: [],
    savedScholarshipIds: [],
  };

  USERS_STORE.set(newUser.email, newUser);

  const token = jwt.sign(
    { id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return res.status(201).json({
    token,
    user: {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      savedUniversityIds: newUser.savedUniversityIds,
      savedScholarshipIds: newUser.savedScholarshipIds,
    },
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const user = USERS_STORE.get(email.toLowerCase());
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      savedUniversityIds: user.savedUniversityIds,
      savedScholarshipIds: user.savedScholarshipIds,
      targetCountry: user.targetCountry,
      targetDegree: user.targetDegree,
    },
  });
};

export const getProfile = (req: Request, res: Response) => {
  // Provided by auth middleware
  const user = (req as any).user;
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const stored = USERS_STORE.get(user.email);
  if (!stored) {
    return res.status(404).json({ error: 'User record not found.' });
  }

  return res.json({
    id: stored.id,
    email: stored.email,
    name: stored.name,
    role: stored.role,
    savedUniversityIds: stored.savedUniversityIds,
    savedScholarshipIds: stored.savedScholarshipIds,
    targetCountry: stored.targetCountry,
    targetDegree: stored.targetDegree,
  });
};

export const toggleSaveUniversity = (req: Request, res: Response) => {
  const user = (req as any).user;
  const { universityId } = req.body;

  const stored = USERS_STORE.get(user.email);
  if (!stored) return res.status(404).json({ error: 'User not found' });

  const idx = stored.savedUniversityIds.indexOf(universityId);
  if (idx > -1) {
    stored.savedUniversityIds.splice(idx, 1);
  } else {
    stored.savedUniversityIds.push(universityId);
  }

  return res.json({
    savedUniversityIds: stored.savedUniversityIds,
    isSaved: stored.savedUniversityIds.includes(universityId),
  });
};

export const toggleSaveScholarship = (req: Request, res: Response) => {
  const user = (req as any).user;
  const { scholarshipId } = req.body;

  const stored = USERS_STORE.get(user.email);
  if (!stored) return res.status(404).json({ error: 'User not found' });

  const idx = stored.savedScholarshipIds.indexOf(scholarshipId);
  if (idx > -1) {
    stored.savedScholarshipIds.splice(idx, 1);
  } else {
    stored.savedScholarshipIds.push(scholarshipId);
  }

  return res.json({
    savedScholarshipIds: stored.savedScholarshipIds,
    isSaved: stored.savedScholarshipIds.includes(scholarshipId),
  });
};
