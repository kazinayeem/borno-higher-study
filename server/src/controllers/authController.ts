import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../services/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'borno-higher-study-super-secret-key-2025';

export const register = async (req: Request, res: Response) => {
  const { email, password, name, fullName, targetCountry, targetDegree, role = 'STUDENT' } = req.body;
  const userName = name || fullName;

  if (!email || !password || !userName) {
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
        name: userName,
        role: role === 'SUPER_ADMIN' ? 'STUDENT' : role, // Prevent self-elevation to super admin
        targetCountry: targetCountry || null,
        targetDegree: targetDegree || null,
        studentProfile: {
          create: {
            preferredCountries: targetCountry ? JSON.stringify([targetCountry]) : '[]',
            educationLevel: targetDegree || null,
          },
        },
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

export const superAdminLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Administrator email and password are required.' });
  }

  const normalizedEmail = email.toLowerCase().trim();

  try {
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid administrator credentials.' });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid administrator credentials.' });
    }

    // Strict backend role enforcement: must have SUPER_ADMIN or ADMIN role
    if (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN') {
      return res.status(403).json({
        error: 'Access denied: You do not possess Super Admin privileges. Please use the Student Portal login.',
      });
    }

    // Log super admin login in AuditLog
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'SUPER_ADMIN_LOGIN',
        entityType: 'AUTH',
        entityId: user.id,
        details: `Super Admin ${user.email} authenticated successfully.`,
      },
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '12h' } // Shorter, more secure administrative session
    );

    return res.json({
      message: 'Super Admin authentication successful.',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Super Admin login error:', error);
    return res.status(500).json({ error: 'Super Admin authentication service unavailable.' });
  }
};

export const studentLogin = async (req: Request, res: Response) => {
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
        studentProfile: true,
        contributorApp: true,
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
      message: 'Student authentication successful.',
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
        profile: user.studentProfile,
        isContributor: user.role === 'CONTRIBUTOR' || user.contributorApp?.status === 'APPROVED',
      },
    });
  } catch (error) {
    console.error('Student login error:', error);
    return res.status(500).json({ error: 'Authentication failed.' });
  }
};

export const requestPasswordReset = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email address is required.' });
  }

  const normalizedEmail = email.toLowerCase().trim();

  try {
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      // Do not reveal email existence to prevent user enumeration
      return res.json({
        message: 'If an account exists with this email, instructions to reset your password have been issued.',
      });
    }

    // Generate secure 6-digit reset code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const tokenHash = bcrypt.hashSync(resetCode, 8);
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: tokenHash,
        passwordResetExpires: expires,
      },
    });

    return res.json({
      message: 'Password reset code generated. Use the code sent to your email or development console to proceed.',
      devResetCode: process.env.NODE_ENV !== 'production' ? resetCode : undefined,
      devCode: process.env.NODE_ENV !== 'production' ? resetCode : undefined,
    });
  } catch (error) {
    console.error('Password reset request error:', error);
    return res.status(500).json({ error: 'Failed to initiate password reset.' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { email, resetCode, code, newPassword } = req.body;
  const verificationCode = resetCode || code;

  if (!email || !verificationCode || !newPassword) {
    return res.status(400).json({ error: 'Email, reset code, and new password are required.' });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
  }

  const normalizedEmail = email.toLowerCase().trim();

  try {
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user || !user.passwordResetToken || !user.passwordResetExpires) {
      return res.status(400).json({ error: 'Invalid or expired password reset request.' });
    }

    if (new Date() > user.passwordResetExpires) {
      return res.status(400).json({ error: 'Reset code has expired. Please request a new one.' });
    }

    const isValidCode = await bcrypt.compare(verificationCode, user.passwordResetToken);
    if (!isValidCode) {
      return res.status(400).json({ error: 'Invalid reset code.' });
    }

    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(newPassword, salt);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: newHash,
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    });

    await prisma.notification.create({
      data: {
        userId: user.id,
        title: 'Security Alert: Password Changed',
        message: 'Your account password was successfully updated.',
        type: 'INFO',
      },
    });

    return res.json({
      success: true,
      message: 'Password updated successfully. You may now sign in with your new credentials.',
    });
  } catch (error) {
    console.error('Password reset confirmation error:', error);
    return res.status(500).json({ error: 'Failed to reset password.' });
  }
};

export const reauthenticateAdmin = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { password } = req.body;

  if (!user) {
    return res.status(401).json({ error: 'Authentication required.' });
  }
  if (!password) {
    return res.status(400).json({ error: 'Current password is required for confirmation.' });
  }

  try {
    const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
    if (!dbUser) return res.status(404).json({ error: 'User not found.' });

    const valid = await bcrypt.compare(password, dbUser.passwordHash);
    if (!valid) {
      return res.status(403).json({ error: 'Re-authentication failed: Invalid password.' });
    }

    return res.json({
      confirmed: true,
      verified: true,
      message: 'Password re-authentication confirmed for sensitive administrative operation.',
    });
  } catch (error) {
    console.error('Re-authentication error:', error);
    return res.status(500).json({ error: 'Failed to verify credentials.' });
  }
};
