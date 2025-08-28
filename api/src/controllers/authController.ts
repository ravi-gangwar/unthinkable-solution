import { Request, Response } from "express";
import { client } from "../db";
import bcrypt from "bcrypt";

export class AuthController {
    // User Signup
    static async signup(req: Request, res: Response) {
        try {
            const { name, email, password } = req.body;

            if (!name || !email || !password) {
                return res.status(400).json({
                    success: false,
                    message: "Name, email, and password are required"
                });
            }

            if (password.length < 6) {
                return res.status(400).json({
                    success: false,
                    message: "Password must be at least 6 characters long"
                });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            const result = await client.query(`
                INSERT INTO users (name, email, password)
                VALUES ($1, $2, $3)
                RETURNING id, name, email, created_at
            `, [name, email, hashedPassword]);

            res.json({
                success: true,
                data: result.rows[0],
                message: "User created successfully"
            });
        } catch (error: any) {
            if (error.code === '23505') {
                res.status(409).json({
                    success: false,
                    message: "Email already exists"
                });
            } else {
                console.log("Error creating user:", error);
                res.status(500).json({
                    success: false,
                    message: "Failed to create user"
                });
            }
        }
    }

    // User Login
    static async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: "Email and password are required"
                });
            }

            // Find user by email
            const userResult = await client.query(`
                SELECT id, name, email, password, created_at
                FROM users 
                WHERE email = $1
            `, [email]);

            if (userResult.rows.length === 0) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid email or password"
                });
            }

            const user = userResult.rows[0];

            // Check password
            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid email or password"
                });
            }

            // Remove password from response
            const { password: _, ...userWithoutPassword } = user;

            res.json({
                success: true,
                data: userWithoutPassword,
                message: "Login successful"
            });
        } catch (error: any) {
            console.log("Error during login:", error);
            res.status(500).json({
                success: false,
                message: "Failed to login"
            });
        }
    }

    // Get user profile
    static async getUserProfile(req: Request, res: Response) {
        try {
            const { userId } = req.params;
            
            const result = await client.query(`
                SELECT id, name, email, created_at
                FROM users 
                WHERE id = $1
            `, [userId]);

            if (result.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }

            res.json({
                success: true,
                data: result.rows[0]
            });
        } catch (error: any) {
            console.log("Error fetching user:", error);
            res.status(500).json({
                success: false,
                message: "Failed to fetch user"
            });
        }
    }
}
