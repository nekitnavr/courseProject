import passport, { use } from 'passport'
import {prisma} from '../lib/prisma.js'
import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import bcrypt from 'bcrypt'

passport.use(new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password'
    },
    async (email, password, done)=>{
        try {
            const user = await prisma.user.findUnique({where: {email: email}})
            if (!user) return done(null, false, {message: `User doesn't exist`})
            const isValid = await bcrypt.compare(password, user.password)
            if (!isValid) return done(null, false, {message: 'Incorrect password'})
            if (user.blocked == true) return done(null, false, {message: 'User blocked'})
            const {password: discardedPassword, ...userWithoutPassword} = user
            return done(null, userWithoutPassword)
        } catch (error) {
            return done(error)
        }
    }
))

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secret: process.env.JWT_SECRET
}

const cookieExtractor = (req: any) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies.token
  }
  return token;
};

passport.use(new JwtStrategy(
    {
        jwtFromRequest: cookieExtractor,
        secretOrKey: process.env.JWT_SECRET!
    }, 
    async (payload, done)=>{
        try {
            const user = await prisma.user.findUnique({
                where:{
                    id: payload.id
                }
            })
            if (!user) return done(null, false, {message: `User doesn't exist`})
            if (user.blocked == true) return done(null, false, {message: 'User blocked'})
            const {password: discardedPassword, ...userWithoutPassword} = user
            return done(null, userWithoutPassword)
        } catch (error) {
            return done(error)
        }
    }
))