import express from 'express'
import {prisma} from '../lib/prisma.js'
import { authorize } from '../middleware/authorize.js'

const router = express.Router()

router.use(authorize(['ADMIN']))

router.patch('/api/users/delete', async (req,res)=>{
    try {
        const {userIds} = req.body

        await prisma.user.deleteMany({
            where: {
                id: {
                    in: userIds
                }
            }
        })

        res.send('Users deleted')
    } catch (error) {
        res.send(error)
    }
})
router.patch('/api/users/block', async (req,res)=>{
    try {
        const {userIds} = req.body

        await prisma.user.updateMany({
            where: {
                id: {
                    in: userIds
                }
            },
            data: {
                blocked: true
            }
        })
        
        res.send('Users blocked')
    } catch (error) {
        res.send(error)
    }
})
router.patch('/api/users/unblock', async (req,res)=>{
    try {
        const {userIds} = req.body

        await prisma.user.updateMany({
            where: {
                id: {
                    in: userIds
                }
            },
            data: {
                blocked: false
            }
        })
        
        res.send('Users unblocked')
    } catch (error) {
        res.send(error)
    }
})
router.patch('/api/users/makeAdmin', async (req,res)=>{
    try {
        const {userIds} = req.body

        await prisma.user.updateMany({
            where: {
                id: {
                    in: userIds
                }
            },
            data: {
                role: "ADMIN"
            }
        })
        
        res.send('Users assigned role ADMIN')
    } catch (error) {
        res.send(error)
    }
})
router.patch('/api/users/makeUser', async (req,res)=>{
    try {
        const {userIds} = req.body

        await prisma.user.updateMany({
            where: {
                id: {
                    in: userIds
                }
            },
            data: {
                role: "USER"
            }
        })
        
        res.send('Users assigned role USER')
    } catch (error) {
        res.send(error)
    }
})
router.get('/api/allUsers', async (req,res)=>{
    try {
        const users = await prisma.user.findMany({
            select:{
                id: true,
                name: true,
                email: true,
                blocked: true,
                role: true
            }
        })

        res.send(users)
    } catch (error) {
        res.send(error)
    }
})

export default router