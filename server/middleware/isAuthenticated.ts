import { NextFunction, Request, Response } from "express";
import passport from "passport";
import { UserModel } from "../generated/prisma/models";

export function isAuthenticated(req: Request, res: Response, next: NextFunction){
    passport.authenticate('jwt', {session: false}, (err: any, user: Omit<UserModel, 'password'>, info: any)=>{
        if (err) return next(err)
        if (!user) return res.status(401).send('Unathorized')
        req.user = user
        next()
    })(req,res, next)
}