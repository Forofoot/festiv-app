import { hash } from 'bcryptjs';
import { PrismaClient } from '@prisma/client'

export default async function handler(
    req, res
) {

    try{
        const prisma = new PrismaClient();
        //Only POST mothod is accepted
        if (req.method === 'POST') {
            const {user} = req.body

            if(!user){
                res.status(500).json({message: 'Aucun utilisateur trouvé'})   
            }

            const userFollowings = await prisma.user.findUnique({
                where:{
                    id: user
                },
                select:{
                    followers:{
                        select:{
                            following:{
                                select:{
                                    pseudo:true
                                }
                            }
                        }
                    }
                }
            })
            res.status(200).json(userFollowings)
        }
    }catch(e){
        console.log(e)
    }
}