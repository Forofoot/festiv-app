import { PrismaClient } from '@prisma/client'

export default async function handler(
    req, res
) {

    try{
        const prisma = new PrismaClient();

        const createPost = await prisma.post.create({
            data:{
                content: 'Test Festival '+Math.floor(Math.random() * 1000) + 1,
                festival_id:1,
                user_id:21
            }
        })
        if(createPost){
            res.status(200).json("lezgoooo")
        }
        res.status(500).json('po marché')
    }catch(e){
        console.log(e)
    }
}