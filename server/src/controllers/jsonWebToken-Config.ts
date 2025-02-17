import dotenv from 'dotenv';
dotenv.config();

export const SECRET_KEY = process.env.SECRET_KEY || 'default_secret';