import { PrismaClient } from '@prisma/client'

export default async function handler(
    req, res
) {

    try{
        const {content, festival_id, user_id} = req.body
        const prisma = new PrismaClient();

        const createPost = await prisma.post.create({
            data:{
                content:content,
                festival_id: festival_id,
                user_id: user_id
            }
        })
        res.status(200).json("lezgoooo")
        
    }catch(e){
        console.log(e)
    }
}