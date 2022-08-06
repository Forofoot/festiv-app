import { PrismaClient } from '@prisma/client'

export default async function handler(
    req, res
) {

    try{
        const prisma = new PrismaClient()
        const {user_id} = req.body
        const user = await prisma.user.findUnique({
            where: {
                id: user_id,
            },
            select:{
                likes:{
                    select:{
                        post_id:true
                    }
                }
            }
        })

        res.status(200).json(user)
    }catch(e){
        console.log(e)
    }
}