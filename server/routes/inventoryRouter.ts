import express from 'express'
import {prisma} from '../lib/prisma.js'
import Field from '../types/Field.js'
import IdElement from '../types/IdElement.js'
import { typeMap } from '../lib/helpers.js'
import { authorize } from '../middleware/authorize.js'

const router = express.Router()

router.use(authorize(['USER', 'ADMIN']))

router.get('/api/users', async (req,res)=>{
    try {
        let searchString = req.query.searchString as string
        const users = await prisma.$queryRaw`
            SELECT name, email FROM "User" 
            WHERE to_tsvector('english', name || ' ' || email) @@ plainto_tsquery('english', ${searchString}) 
            LIMIT 10;
        `
        res.send(users)
    } catch (error) {
        console.log(error);
        res.send(error)
    }
})
router.get('/api/inventory/usersWithAccess', async (req, res)=>{
    const inventoryId = req.query.inventoryId as string
    try {
        const users = await prisma.inventory.findUnique({
            where:{
                id: inventoryId
            },
            select:{
                usersWithAccess: {
                    omit: {
                        password: true
                    }
                }
            }
        })
        
        res.send(users?.usersWithAccess)
    } catch (error) {
        res.send(error)
    }
})
router.get('/api/user/accessibleInventories', async (req,res)=>{
    const userId = req.query.userId as string
    if (!userId) return res.status(400).send('User ID required')
    try{
        const inventories = await prisma.user.findUnique({
            where:{
                id: parseInt(userId)
            },
            select:{
                accessibleInventories: {
                    orderBy: {
                        createdAt: 'asc'
                    },
                    include:{
                        tags: true,
                        category: true
                    }
                }
            }
        })
        res.send(inventories?.accessibleInventories)
    }catch(err){
        res.send(err)
    }
})
router.patch('/api/inventory/removeAccess', async (req,res)=>{
    try {
        const {users, inventoryId} = req.body
        
        await prisma.inventory.update({
            where: {
                id: inventoryId
            },
            data:{
                usersWithAccess: {
                    disconnect: users.map((userId: number)=>({id:userId}))
                }
            }
        })
        
        res.send('Access removed')
    } catch (error) {
        res.send(error)
    }
})
router.patch('/api/inventory/addAccess', async (req,res)=>{
    try {
        const {user, inventoryId} = req.body

        await prisma.inventory.update({
            where: {
                id: inventoryId
            },
            data:{
                usersWithAccess:{
                    connect: {
                        email: user.email
                    }
                }
            }
        })
        
        res.send('Access aded')
    } catch (error) {
        res.send(error)
    }
})
router.patch('/api/inventory/addField', async (req,res)=>{
    const {field, inventoryId} = req.body
    if (!inventoryId) res.status(400).send('Inventory ID required')

    field.fieldType = field.fieldType.replace('-', '_')

    try {
        const slotsTaken:number[] = []
        const foundFields = await prisma.field.findMany({
            where: {
                inventoryId: inventoryId
            },
            select: {
                fieldType: true,
                slotNumber: true,
                order: true
            },
            orderBy: {
                order: 'desc'
            }
        })
        
        // console.log(foundFields);
        
        foundFields.forEach(el => {
            if (el.fieldType == field.fieldType) {
                slotsTaken.push(el.slotNumber)
            }
        });
        
        // console.log(slotsTaken);
        
        for (let i = 1; i <= 3; i++) {
            if (!slotsTaken.includes(i)) {
                // console.log(i);
                await prisma.field.create({
                    data: {
                        slotNumber: i,
                        ...field,
                        order: foundFields[0]?.order+1 || 0,
                        inventory: {
                            connect:{
                                id: inventoryId
                            }
                        }
                    }
                })
                return res.send('Field added')
            }
        }

        
        res.status(400).send('All slots occupied')
    } catch (error) {
        res.send(error)
        console.log(error)
    }
})
router.patch('/api/inventory/hideFields', async (req, res)=>{
    const {selectedFields} = req.body

    try {
        await prisma.field.updateMany({
            where: {
                id: {in: selectedFields}
            },
            data: {
                display: false
            }
        })
        res.send('Fields hidden')
    } catch (error) {
        res.send(error)
    }
})
router.patch('/api/inventory/showFields', async (req, res)=>{
    const {selectedFields} = req.body

    try {
        await prisma.field.updateMany({
            where: {
                id: {in: selectedFields}
            },
            data: {
                display: true
            }
        })
        res.send('Fields shown')
    } catch (error) {
        res.send(error)
    }
})
router.patch('/api/inventory/updateCustomId', async (req,res)=>{
    const {separator, idElements, inventoryId} = req.body
    let { configId } = req.body

    // console.log(req.body)
    const incomingIds = idElements
                .map((el: IdElement) => el.id as Number)
                .filter((el: Number)=>el !== undefined)

    try {
        if (idElements?.length == 0 && configId) {
            await prisma.idConfig.delete({where: {id: configId}})
            return res.send('Custom id deleted')
        }
    
        await prisma.$transaction(async (tx)=>{
            const config = await tx.idConfig.upsert({
                where: { id: configId, inventoryId: inventoryId },
                update: {
                    separator: separator || '',
                },
                create: {
                    inventory: {
                        connect: {
                            id: inventoryId
                        }
                    },
                    separator: separator || ''
                }
            })

            configId = config.id

            if (idElements?.length > 0) {
                await tx.idElement.deleteMany({
                    where: {
                        idConfigId: configId,
                        id: {notIn: incomingIds}
                    }
                })

                for (const el of idElements) {
                    await tx.idElement.upsert({
                        where: {
                            id: el.id || -1
                        },
                        update: {
                            idElementType: el.idElementType,
                            fixedText: el?.fixedText
                        },
                        create: {
                            idConfig: {
                                connect: {
                                    id: configId
                                }
                            },
                            idElementType: el.idElementType,
                            fixedText: el?.fixedText
                        }
                    })
                }
            }
        })
        
        res.send('Custom ID updated')
    } catch (error) {
        console.log(error)
        res.send(error)
    }

})
router.patch('/api/inventory/settings', async (req, res)=>{
    const {settings, inventoryId} = req.body
    if (!inventoryId) return res.status(400).send('Inventory ID required')
    try {
        await prisma.inventory.update({
            where: { id: inventoryId },
            data: {
                title: settings.title,
                description: settings.description,
                accessType: settings.accessType,
                category:{
                    connect:{
                        id: parseInt(settings.category)
                    }
                },
                tags:{
                    set:[],
                    connectOrCreate: settings.tags.map((tag: string) =>({
                        where: {tagName: tag},
                        create: {tagName: tag}
                    }))
                }
            }
        })

        res.send('Updated inventory settings')
    } catch (error) {
        res.send(error)
    }
})
router.delete('/api/inventory/deleteFields', async (req,res)=>{
    try {
        let selectedFields = req.query['selectedFields[]'] as string[]
        if (!Array.isArray(selectedFields)) selectedFields = [selectedFields]
        const inventoryId = req.query['inventoryId'] as string
        if (!inventoryId) return res.status(400).send('Inventory id required')

        await prisma.$transaction(async (tx)=>{
            const deleteData:any = {}
            for (let i = 0; i < selectedFields.length; i++) {
                const fieldId = selectedFields[i];
                const field = await tx.field.findUnique({where: {id: fieldId}})
                if(!field) throw new Error(`Field doesn't exist`)
                const inDbName = typeMap[field.fieldType]+field.slotNumber
                deleteData[inDbName] = null
            }
            await tx.item.updateMany({
                where: {inventoryId: inventoryId},
                data:{
                    ...deleteData
                }
            })
            await tx.field.deleteMany({ where: {id: {in: selectedFields}} })
            const fields = await tx.field.findMany({
                where: { inventoryId: inventoryId },
                orderBy: { order: 'asc' },
                select: { id: true, order: true }
            })
            for (let i = 0; i < fields.length; i++) {
                const field = fields[i];
                await tx.field.update({
                    where: { id: field.id },
                    data: { order: i }
                })
            }
        })
        
        res.send('Fields deleted')
    } catch (error:any) {
        res.status(400).send(error.message)
    }
    // const deleted = await prisma.item.deleteMany({where: {id: {in: selectedFields}}})
})
router.delete('/api/inventories', async (req,res)=>{
    try {
        let selectedInventories = req.query['selectedInventories[]'] as string[]
        if (!Array.isArray(selectedInventories)) selectedInventories = [selectedInventories]
        await prisma.inventory.deleteMany({
            where: {
                id: {
                    in: selectedInventories
                }
            }
        })
        res.send('Inventories deleted')
    } catch (error) {
        res.send(error)
    }
})
router.post('/api/createInventory', async (req, res)=>{
    const {
        title,
        description,
        accessType,
        creatorId,
        customItemId,
        category,
        tags,
        fields
    } = req.body

    try{
        await prisma.$transaction(async (tx) =>{
            const inventory = await tx.inventory.create({data:{
                title: title,
                description: description,
                accessType: accessType,
                category:{
                    connect:{
                        id: parseInt(category)
                    }
                },
                creator:{
                    connect:{
                        id: parseInt(creatorId)
                    }
                },
                tags:{
                    connectOrCreate: tags.map((tag: string) =>({
                        where: {tagName: tag},
                        create: {tagName: tag}
                    }))
                }
            }, include:{tags:true}})

            if (fields) {
                const fieldsToCreate = fields.map((field:Field, index:Number)=>({
                    title: field.title,
                    description: field.description,
                    display: field.display,
                    fieldType: field.fieldType.replace('-', '_'),
                    order: index,
                    slotNumber: field.slot,
                    inventoryId: inventory.id,
                }))
                
                if (fieldsToCreate.length > 0) {
                    const createdFields = await tx.field.createMany({data:fieldsToCreate})
                }
            }

            if (customItemId) {
                if (customItemId.idElements.length > 0) {
                    const createdId = await tx.idConfig.create({
                        data:{
                            inventory:{
                                connect:{
                                    id: inventory.id
                                }
                            },
                            idElements: {
                                create: customItemId.idElements
                            },
                            separator: customItemId.separator
                        }
                    })
                }
            }
        })

        res.send('Inventory created')
    }catch(error){
        console.log(error);
        res.send(error)
    }
})

export default router