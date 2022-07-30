import { PrismaClient } from '@prisma/client'

export default async function handler(
    req, res
) {

    try{
        const {id, currentUser} = req.body
        const prisma = new PrismaClient();

        const searchFollow = await prisma.follow.findFirst({
            where:{
                follower_id: currentUser,
                following_id:id
            }
        })

        if(searchFollow){
            const deletefollow = await prisma.follow.delete({
                where:{
                    id: searchFollow.id
                }
            })
            res.status(200).json("lezgoooo")
        }else{
            const createfollow = await prisma.follow.create({
                data:{
                    follower_id:currentUser,
                    following_id:id
                }
            })
            res.status(200).json("lezgoooo")
        }
        
    }catch(e){
        console.log(e)
    }
}