import { PrismaClient } from '@prisma/client'

export default async function handler(
    req, res
) {

    try{
        const {id, currentUser} = req.body
        const prisma = new PrismaClient();

        const searchPost = await prisma.postLiked.findFirst({
            where:{
                post_id: id,
                user_id:32
            }
        })

        if(searchPost){
            const deletePost = await prisma.postLiked.delete({
                where:{
                    id: searchPost.id
                }
            })
            res.status(200).json("lezgoooo")
        }
        
    }catch(e){
        console.log(e)
    }
}