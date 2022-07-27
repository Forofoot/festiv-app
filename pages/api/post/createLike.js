import { PrismaClient } from '@prisma/client'

export default async function handler(
    req, res
) {

    try{
        const {id, currentUser} = req.body
        const prisma = new PrismaClient();

        const createPost = await prisma.postLiked.create({
            data:{
                like:true,
                post_id:id,
                user_id:32
            }
        })
        res.status(200).json("lezgoooo")
        
    }catch(e){
        console.log(e)
    }
}