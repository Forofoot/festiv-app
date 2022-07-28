import { PrismaClient } from '@prisma/client'

export default async function handler(
    req, res
) {

    try{
        const {id, commentContent, currentUserId} = req.body
        const prisma = new PrismaClient();

        const createComment = await prisma.comment.create({
            data:{
                content:commentContent,
                post_id:id,
                user_id:currentUserId                
            }
        })
        res.status(200).json("lezgoooo")
        
    }catch(e){
        console.log(e)
    }
}