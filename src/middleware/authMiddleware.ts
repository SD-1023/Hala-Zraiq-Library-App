import { Request, Response, NextFunction } from 'express';
import { Session, User, sequelize } from '../database';
import { Model, DataType } from 'sequelize';

interface UserInstance extends Model {
    id: number;
    email: string;
    password: string;
};

interface CustomRequest extends Request {
    user?: UserInstance; 
}

interface SessionInstance extends Model {
    id: number;
    userId: number;
    token: string;
}

export const authenticateUser = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        // Extract the Bearer token from Authorization header
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1]; // Get the token part after 'Bearer'

        if (!token) {
            return res.status(401).json({ error: 'Unauthorized: Missing token' });
        }

        // Find the session with the given token
        const session = await Session.findOne({ where: { token: token } }) as SessionInstance | null;

        if (!session) {
            return res.status(401).json({ error: 'Unauthorized: Invalid token' });
        }

        // Find the user associated with the session
        const user = await User.findByPk(session.userId) as UserInstance | null;

        if (!user) {
            return res.status(401).json({ error: 'Unauthorized: User not found' });
        }

        // Attach the user information to the request object
        req.user = user;

        // Continue to the next middleware or route handler
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



