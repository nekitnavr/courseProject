import express from 'express'
import {prisma} from '../lib/prisma.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import passport from 'passport'
import { UserModel } from '../generated/prisma/models.js'
import { isAuthenticated } from '../middleware/isAuthenticated.js'

const router = express.Router()
const saltRounds = 10

router.post('/api/login', async (req, res, next)=>{
    passport.authenticate('local', {session: false}, (err:any, user: Omit<UserModel, 'password'>, info: any)=>{
        if (err) return res.send(err)
        if (!user) return res.status(404).send({ message: info.message })
        if (user.blocked == true) return res.status(403).send({ message: info.message })
            
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET as string,
            { expiresIn: '7d' }
        )

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        res.send({user})
    })(req, res, next)
})

router.post('/api/signup', async (req,res)=>{
    const {name, password, email} = req.body

    const hashedPassword = await bcrypt.hash(password, saltRounds)
    
    prisma.user.create({data:{
        name: name,
        password: hashedPassword,
        email: email,
    }}).then((user)=>{
        res.send('user created')
    }).catch(err=>{
        if (err.code == 'P2002') res.status(409).send('User already exists')
        else res.status(500).send('Error creating user')
    })
})

router.post('/api/logout', (req, res) => {
  res.clearCookie('token');
  res.send('Logged out');
})

router.get('/api/verifyToken', async (req,res)=>{
    try {
        const token = req.cookies.token
        if (!token) return res.status(401).send('Not authenticated')
        const userFromToken = jwt.verify(token, process.env.JWT_SECRET!) as Omit<UserModel, 'password'>
        const user = await prisma.user.findUnique({where: {id: userFromToken.id, email: userFromToken.email}})
        if (!user) return res.status(401).send(`User doesn't exist`)
        if (userFromToken.role != user.role) return res.status(401).send('Wrong role')
        if (user.blocked == true) return res.status(401).send('User blocked')
        const {password: _, ...noPassUser} = user
        res.send(noPassUser)
    } catch (error) {
        return res.status(401).send('Invalid token')
    }
})

export default router