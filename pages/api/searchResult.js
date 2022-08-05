import { PrismaClient } from '@prisma/client'

export default async function handler(
    req, res
) {

    try{
        const {search} = req.body
        const prisma = new PrismaClient();


        const findUsers = await prisma.user.findMany({
            where:{
                pseudo:{
                    contains:search
                }
            },select:{
                pseudo:true,
                avatar:true,
            },
            take:4
        })
        res.status(200).json(findUsers)
        
    }catch(e){
        console.log(e)
    }
}