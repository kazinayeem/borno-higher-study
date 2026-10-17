import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../services/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'borno-higher-study-super-secret-key-2025';

export const register = async (req: Request, res: Response) => {
  const { email, password, name, role = 'STUDENT' } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }

  const normalizedEmail = email.toLowerCase().trim();

  try {
    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      return res.status(400).json({ error: 'User with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        email: normalizedEmail,
        passwordHash,
        name,
        role: role === 'SUPER_ADMIN' ? 'STUDENT' : role, // Prevent self-elevation to super admin
      },
    });

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
        savedUniversityIds: [],
        savedScholarshipIds: [],
      },
    });
  } catch (error) {
    console.error('Registration error in SQLite:', error);
    return res.status(500).json({ error: 'Failed to create user account.' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const normalizedEmail = email.toLowerCase().trim();

  try {
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      include: {
        savedUniversities: true,
        savedScholarships: true,
      },
    });

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

    const savedUniversityIds = user.savedUniversities.map((s) => s.universityId);
    const savedScholarshipIds = user.savedScholarships.map((s) => s.scholarshipId);

    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        savedUniversityIds,
        savedScholarshipIds,
        targetCountry: user.targetCountry,
        targetDegree: user.targetDegree,
      },
    });
  } catch (error) {
    console.error('Login error in SQLite:', error);
    return res.status(500).json({ error: 'Authentication failed.' });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  const user = (req as any).user;
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const stored = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        savedUniversities: true,
        savedScholarships: true,
      },
    });

    if (!stored) {
      return res.status(404).json({ error: 'User record not found.' });
    }

    const savedUniversityIds = stored.savedUniversities.map((s) => s.universityId);
    const savedScholarshipIds = stored.savedScholarships.map((s) => s.scholarshipId);

    return res.json({
      id: stored.id,
      email: stored.email,
      name: stored.name,
      role: stored.role,
      savedUniversityIds,
      savedScholarshipIds,
      targetCountry: stored.targetCountry,
      targetDegree: stored.targetDegree,
    });
  } catch (error) {
    console.error('Get profile error in SQLite:', error);
    return res.status(500).json({ error: 'Failed to fetch user profile.' });
  }
};

export const toggleSaveUniversity = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { universityId } = req.body;

  if (!user || !universityId) {
    return res.status(400).json({ error: 'Invalid user or university ID.' });
  }

  try {
    const existing = await prisma.savedUniversity.findUnique({
      where: {
        userId_universityId: {
          userId: user.id,
          universityId,
        },
      },
    });

    if (existing) {
      await prisma.savedUniversity.delete({
        where: { id: existing.id },
      });
    } else {
      await prisma.savedUniversity.create({
        data: {
          userId: user.id,
          universityId,
        },
      });
    }

    const updatedSaves = await prisma.savedUniversity.findMany({
      where: { userId: user.id },
      select: { universityId: true },
    });

    const savedIds = updatedSaves.map((s) => s.universityId);

    return res.json({
      savedUniversityIds: savedIds,
      isSaved: savedIds.includes(universityId),
    });
  } catch (error) {
    console.error('Error toggling saved university:', error);
    return res.status(500).json({ error: 'Could not toggle save university.' });
  }
};

export const toggleSaveScholarship = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { scholarshipId } = req.body;

  if (!user || !scholarshipId) {
    return res.status(400).json({ error: 'Invalid user or scholarship ID.' });
  }

  try {
    const existing = await prisma.savedScholarship.findUnique({
      where: {
        userId_scholarshipId: {
          userId: user.id,
          scholarshipId,
        },
      },
    });

    if (existing) {
      await prisma.savedScholarship.delete({
        where: { id: existing.id },
      });
    } else {
      await prisma.savedScholarship.create({
        data: {
          userId: user.id,
          scholarshipId,
        },
      });
    }

    const updatedSaves = await prisma.savedScholarship.findMany({
      where: { userId: user.id },
      select: { scholarshipId: true },
    });

    const savedIds = updatedSaves.map((s) => s.scholarshipId);

    return res.json({
      savedScholarshipIds: savedIds,
      isSaved: savedIds.includes(scholarshipId),
    });
  } catch (error) {
    console.error('Error toggling saved scholarship:', error);
    return res.status(500).json({ error: 'Could not toggle save scholarship.' });
  }
};
