export type User = {
    email: string;
    name: string;
    role: string;
    id: number;
    userId?: number;
};

declare global {
    namespace Express {
        export interface Request {
            user?: User;
            jwtPayload?: JWTPayload;
        }
    }
}

export interface RequestWithUser extends Request {
    user?: {
        id: number;
        name: string;
        email: string;
        role: string;
    };
}