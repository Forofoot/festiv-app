import { PrismaClient } from '@prisma/client'

export default async function handler(
    req, res
) {

    try{
        const {id} = req.body
        const prisma = new PrismaClient();

        const deletePost = await prisma.post.delete({
            where:{
                id
            }
        })
        res.status(200).json("lezgoooo")
        
    }catch(e){
        console.log(e)
    }
}