import express from 'express';
import bcrypt from 'bcrypt';
import { prisma } from '../db.js';
import { signAccess, signRefresh, verifyRefresh, isAdmin } from '../auth/jwt.js';
import { requireAuth } from '../auth/middleware.js';

const router = express.Router();

const publicUser = (u) => ({
  id: u.id,
  email: u.email,
  phone: u.phone,
  firstName: u.firstName,
  lastName: u.lastName,
  image: u.image,
  roles: u.roles,
  isAdmin: isAdmin(u),
  status: u.status,
  emailVerified: u.emailVerified,
});

router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: 'missing_fields' });
    }

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return res.status(409).json({ error: 'email_taken' });

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        email,
        phone: phone || null,
        passwordHash,
        firstName,
        lastName,
        roles: ['INVESTOR'],
        status: 'ACTIVE',
      },
    });

    return res.status(201).json({
      access: signAccess(user),
      refresh: signRefresh(user),
      user: publicUser(user),
    });
  } catch (err) {
    console.error('register error:', err);
    return res.status(500).json({ error: 'server_error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'missing_fields' });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: 'invalid_credentials' });

    const okPw = await bcrypt.compare(password, user.passwordHash);
    if (!okPw) return res.status(401).json({ error: 'invalid_credentials' });

    return res.json({
      access: signAccess(user),
      refresh: signRefresh(user),
      user: publicUser(user),
    });
  } catch (err) {
    console.error('login error:', err);
    return res.status(500).json({ error: 'server_error' });
  }
});

router.get('/me', requireAuth, async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  if (!user) return res.status(404).json({ error: 'user_not_found' });
  return res.json(publicUser(user));
});

router.post('/refresh', async (req, res) => {
  const { refresh } = req.body;
  if (!refresh) return res.status(400).json({ error: 'missing_refresh' });

  try {
    const payload = verifyRefresh(refresh);
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) return res.status(401).json({ error: 'user_not_found' });

    return res.json({ access: signAccess(user), refresh: signRefresh(user) });
  } catch {
    return res.status(401).json({ error: 'invalid_refresh' });
  }
});

router.post('/logout', async (_req, res) => res.status(204).end());

export default router;
