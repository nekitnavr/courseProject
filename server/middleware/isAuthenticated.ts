import { NextFunction, Request, Response } from "express";
import passport from "passport";
import { UserModel } from "../generated/prisma/models";

declare global {
  namespace Express {
    interface User {
      id: string | number
      email: string
      role: string
      blocked: boolean
    }
  }
}

export function isAuthenticated(req: Request, res: Response, next: NextFunction){
    passport.authenticate('jwt', {session: false}, (err: any, user: Omit<UserModel, 'password'>, info: any)=>{
        if (err) return next(err)
        if (!user) return res.status(401).send('Not authenticated')
        req.user = user
        next()
    })(req,res, next)
}