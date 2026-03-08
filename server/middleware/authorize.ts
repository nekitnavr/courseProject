import { NextFunction, Request, Response } from "express";
import passport from "passport";
import { UserModel } from "../generated/prisma/models";

export function authorize(rolesWithAccess: string[]){
    return (req: Request, res: Response, next: NextFunction)=>{
        if (!req.user) return res.status(401).send({message: 'Not authenticated'})
        
        const userRole = req.user.role
        if (!rolesWithAccess.includes(userRole)) {
            return res.status(403).send({message: `Action not authorized`})
        }

        next()
    }
}