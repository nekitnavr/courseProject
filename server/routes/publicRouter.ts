import express from 'express'
import {prisma} from '../lib/prisma.js'
import generateId from '../lib/generateId.js'
import { FieldModel } from '../generated/prisma/models.js'
import { Prisma } from '../generated/prisma/client.js'
import { typeMap } from '../lib/helpers.js'

const router = express.Router()

router.get('/api/tag', async (req, res)=>{
    try {
        const tagId = parseInt(req.query.tagId as string)
        if (!tagId) return res.status(400).send('Tag ID required')
        
        const tag = await prisma.tag.findUnique({
            where: {
                id: tagId
            },
            include: {
                inventories: {
                    include: {
                        tags: true,
                        category: true
                    }
                }
            }
        })
        if (!tag) return res.status(404).send('No tag found')

        res.send(tag)
    } catch (error) {
        res.send(error)
    }    
})
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
                fields: {
                    orderBy: {
                        order: 'asc'
                    }
                },
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
            category: true,
            creator: {
                select: {
                    name: true
                }
            }
        },
        take: 5
    })
    
    res.send(popularInventories)
})
router.get('/api/latestInventories', async (req, res)=>{
    const latestInventories = await prisma.inventory.findMany({
        orderBy:{
            createdAt: 'desc'
        },
        include:{
            tags: true,
            category: true,
            creator: {
                select: {
                    name: true
                }
            }
        },
        take: 5
    })
    
    res.send(latestInventories)
})
router.get('/api/user/inventories', async (req,res)=>{
    const userId = req.query.userId as string

    if (!userId) return res.status(400).send('user ID required')
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
})
router.post('/api/inventory/createItem', async (req, res)=>{
    const {fieldValues, inventoryId, onConflictCustomId} = req.body

    let customId = onConflictCustomId

    // console.log(fieldValues);

    try {
        await prisma.$transaction(async (tx) =>{
            const inventory = await tx.inventory.findUnique({
                where: {
                    id: inventoryId
                },
                select:{
                    id: true,
                    customItemId: {
                        include: {
                            idElements: true
                        }
                    },
                    fields: {
                        orderBy: {
                            order: 'asc'
                        }
                    },
                    customItemIdSequence: true
                }
            })
            // console.log(inventory);
            
            if (!inventory) {
                throw Error('Inventory does not exist')
            }
            
            if (inventory?.customItemId && !onConflictCustomId) {
                const sequenceNumber = inventory?.customItemIdSequence
                customId = generateId(inventory.customItemId.idElements, inventory.customItemId.separator || '', sequenceNumber)
            }

            const itemData: any = {
                customId: customId,
                inventory:{
                    connect:{
                        id: inventory?.id
                    }
                },
            }
            inventory.fields.forEach((field: FieldModel, index)=>{
                let val = fieldValues[index].value
                if (field.fieldType == 'NUMERIC') {
                    val = parseInt(val)
                    val = isNaN(val) ? null : val
                }
                itemData[typeMap[field.fieldType]+field.slotNumber] = val
            })
            
            const item = await tx.item.create({data:itemData})
            if (item) {
                await tx.inventory.update({
                    where: {
                        id: inventory.id
                    },
                    data: {
                        customItemIdSequence: {increment: 1}
                    }
                })
            }
        })
        
        res.send('Item created')
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2002") {
                return res.status(409).send({status: 'P2002', customId: customId})
            }
        }
        res.send(error)
    }
})
router.patch('/api/inventory/editItem', async (req,res)=>{
    const {fieldValues, itemId} = req.body

    if (!itemId) return res.status(400).send('Item ID required')
    
    try {
        const editData:any = {}
        for (let i = 0; i < fieldValues.length; i++) {
            const field = await prisma.field.findUnique({
                where: {
                    id: fieldValues[i].fieldId
                },
                select:{
                    fieldType: true,
                    slotNumber: true
                }
            })
            if (!field) throw Error(`Field doesn't exist`)
            const inDbName = typeMap[field.fieldType]+field.slotNumber
            let val = fieldValues[i].value
            if (field.fieldType == 'NUMERIC') {
                val = parseInt(val)
                val = isNaN(val) ? null : val
            }
            editData[inDbName] = val
        }

        await prisma.item.update({
            where: {id: itemId}, 
            data:{
                ...editData
            }
        })
        
        res.send('Item edited')
    } catch (error) {
        res.send(error)
    }
    
})
router.delete('/api/inventory/deleteItems', async (req,res)=>{
    let selectedItems = req.query['selectedItems[]'] as string[]
    if (!Array.isArray(selectedItems)) selectedItems = [selectedItems]

    const deleted = await prisma.item.deleteMany({where: {id: {in: selectedItems}}})

    res.send('Items deleted')
})


export default router