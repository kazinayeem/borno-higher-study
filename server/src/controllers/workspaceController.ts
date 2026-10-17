import { Request, Response } from 'express';
import { prisma } from '../services/db.js';

export const getMyWorkspaces = async (req: Request, res: Response) => {
  const user = (req as any).user;
  if (!user) return res.status(401).json({ error: 'Authentication required.' });

  try {
    const memberships = await prisma.workspaceMember.findMany({
      where: { userId: user.id },
      include: {
        workspace: {
          include: {
            members: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const workspaces = memberships.map((m) => ({
      ...m.workspace,
      myRole: m.role,
    }));

    return res.json({ workspaces });
  } catch (error) {
    console.error('Error fetching workspaces:', error);
    return res.status(500).json({ error: 'Failed to retrieve workspaces.' });
  }
};

export const createWorkspace = async (req: Request, res: Response) => {
  const user = (req as any).user;
  if (!user) return res.status(401).json({ error: 'Authentication required.' });

  const { name, description } = req.body;
  if (!name) return res.status(400).json({ error: 'Workspace name is required.' });

  try {
    const workspace = await prisma.workspace.create({
      data: {
        name,
        description,
        ownerId: user.id,
        members: {
          create: {
            userId: user.id,
            role: 'OWNER',
          },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
          },
        },
      },
    });

    return res.status(201).json({
      message: 'Collaborative workspace created successfully.',
      workspace,
    });
  } catch (error) {
    console.error('Error creating workspace:', error);
    return res.status(500).json({ error: 'Failed to create workspace.' });
  }
};

export const inviteMember = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { workspaceId } = req.params;
  const { email, role = 'EDITOR' } = req.body;

  if (!email) return res.status(400).json({ error: 'Member email is required.' });

  try {
    // Check permission: user must be OWNER of this workspace
    const membership = await prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId: user.id,
        },
      },
    });

    if (!membership || membership.role !== 'OWNER') {
      return res.status(403).json({ error: 'Only workspace owners can add collaborators.' });
    }

    const invitee = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!invitee) {
      return res.status(404).json({ error: 'No registered student found with this email.' });
    }

    const newMember = await prisma.workspaceMember.upsert({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId: invitee.id,
        },
      },
      update: { role },
      create: {
        workspaceId,
        userId: invitee.id,
        role,
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return res.json({
      message: `${invitee.name} has been added to the workspace.`,
      member: newMember,
    });
  } catch (error) {
    console.error('Error inviting workspace member:', error);
    return res.status(500).json({ error: 'Failed to add workspace collaborator.' });
  }
};
