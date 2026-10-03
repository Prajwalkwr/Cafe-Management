import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { cleanString } from '../../shared/validation.js';

export async function login(req, res, next) {
  try {
    const email = cleanString(req.body?.email, 120).toLowerCase();
    const password = String(req.body?.password ?? '');
    if (!email || !password) {
      return res.status(400).json({ message: 'Enter your email and password.' });
    }

    const user = await User.findOne({ email });
    const matches = user ? await bcrypt.compare(password, user.passwordHash) : false;
    if (!user || !matches) {
      return res.status(401).json({ message: 'Those sign-in details are not correct.' });
    }

    const token = jwt.sign({ sub: user._id.toString(), role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '8h',
    });

    return res.json({
      token,
      user: { name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    return next(error);
  }
}

export async function me(req, res, next) {
  try {
    const user = await User.findById(req.admin.sub).select('name email role');
    if (!user) {
      return res.status(401).json({ message: 'Your session has ended. Please sign in again.' });
    }
    return res.json({ user });
  } catch (error) {
    return next(error);
  }
}
