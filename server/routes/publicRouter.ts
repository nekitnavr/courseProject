import express from 'express'
import {prisma} from '../lib/prisma.js'

const router = express.Router()

router.get('/api/user', async (req,res)=>{
    const userId = req.query.id as string

    if (!userId) return res.status(400).send('User ID required')
    try {
        const user = await prisma.user.findUnique({
            where:{
                id: parseInt(userId)
            },
            omit:{
                password: true
            }
        })
        res.send(user)
    } catch (error) {
        res.send(error)
    }
})

router.get('/api/categories', async (req,res)=>{
    const cats = await prisma.category.findMany()
    res.send(cats)
})

router.get('/api/tags', async (req,res)=>{
    const tagSearch = req.query.tagSearch as string
    const tags = await prisma.tag.findMany({
        where: {
            tagName: {
                startsWith: tagSearch
            }
        },
        omit:{
            id: true
        }
    })
    res.send(tags)
})

router.get('/api/inventory/items', async (req, res)=>{
    const inventoryId = req.query.inventoryId as string
    try {
        const items = await prisma.item.findMany({
            where:{
                inventoryId: inventoryId
            },
            orderBy: {
                createdAt: "desc"
            }
        })
        res.send(items)
    } catch (error) {
        res.send(error)
    }
})

router.get('/api/inventory/fields', async (req, res)=>{
    const inventoryId = req.query.inventoryId as string
    try {
        const fields = await prisma.field.findMany({
            where:{
                inventoryId: inventoryId
            }
        })
        res.send(fields)
    } catch (error) {
        res.send(error)
    }
})

router.get('/api/inventory', async (req,res)=>{
    const inventoryId = req.query.id as string
    if (!inventoryId) return res.status(400).send('Inventory ID required')
    try {
        const inventory = await prisma.inventory.findUnique({
            where:{
                id: inventoryId
            },
            include:{
                tags: true,
                fields: true,
                items: {
                    orderBy: {
                        createdAt: "desc"
                    }
                },
                customItemId: {
                    include: {
                        idElements: true
                    }
                },
                usersWithAccess: {
                    select: {
                        id: true,
                        email: true,
                        name: true
                    }
                }
            },
        })

        res.send(inventory)
    } catch (err) {
        console.log(err)
        res.send(err)
    }
})

router.get('/api/popularInventories', async (req, res)=>{
    const popularInventories = await prisma.inventory.findMany({
        orderBy:{
            items: {
                _count: 'desc'
            }
        },
        include:{
            tags: true,
            category: true
        },
        take: 5
    })
    
    res.send(popularInventories)
})

router.get('/api/user/inventories', async (req,res)=>{
    const userId = req.query.userId as string

    if (!userId) {
        res.status(400).send('user ID required')
    }else{
        try{
            const inventories = await prisma.inventory.findMany({
                where:{
                    creatorId: parseInt(userId)
                },
                include:{
                    category: true,
                    tags: {
                        omit: {
                            id: true
                        }
                    },
                },
                omit:{
                    categoryId: true,
                    description: true,
                    creatorId: true
                },
                orderBy: {
                    createdAt: 'asc'
                }
            })
            res.send(inventories)
        }catch(err){
            res.send(err)
        }
    }
})

export default router