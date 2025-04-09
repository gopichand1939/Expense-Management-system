import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

/**
 * ✅ Signup handler
 * - Changed return type from Promise<Response> ❌ to Promise<void> ✅
 */
const signup = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password, role } = req.body;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    res.status(400).json({ message: 'User already exists' });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword, role },
  });

  res.status(201).json({ message: 'User created', user });
};

/**
 * ✅ Login handler
 * - Changed return type from Promise<Response> ❌ to Promise<void> ✅
 */
const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }

  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: '1d',
  });

  res.status(200).json({ message: 'Login success', token });
};

// ✅ NAMED exports only — no default export!
export { signup, login };
