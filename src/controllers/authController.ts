import { Request, Response, NextFunction } from 'express';
import { Session, User, sequelize } from '../database';
import bcrypt from 'bcrypt'

interface IUser {
    id: number;
    email: string;
    password: string;
}

import crypto from 'crypto';

const generateSessionToken = (): string => {
    return crypto.randomBytes(48).toString('hex');
};


const saltRounds=10;

export const signin = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } }) as IUser | null;

        if (!user) {
            return res.status(401).json({ error: 'Unauthorized: User not found' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Unauthorized: Invalid password' });
        }

        // Generate session token
        const sessionToken = generateSessionToken();

        // Store the session token in the database
        await Session.create({ userId: user.id, token: sessionToken });

        // Return the token in the response
        res.json({ sessionToken });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



export const signup = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = await User.create({ email, password: hashedPassword }) as unknown as IUser;

        // Generate session token
        const sessionToken = generateSessionToken();

        // Store the session token in the database
        await Session.create({ userId: newUser.id, token: sessionToken });

        // Return the token in the response
        res.status(201).json({ sessionToken });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const changePassword = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user as IUser;

        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }


        const { oldPassword, newPassword } = req.body;
        console.log(req.body);
        if (!oldPassword || !newPassword) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid old password' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.update({ password: hashedPassword }, { where: { id: user.id } });
        await Session.destroy({ where: { userId: user.id } });

        res.status(200).json({ message: 'Password changed successfully. Please log in again.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

