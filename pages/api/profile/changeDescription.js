import { PrismaClient } from '@prisma/client'

export default async function handler(
    req, res
) {

    try{
        const prisma = new PrismaClient();
        //Only POST mothod is accepted
        if (req.method === 'POST') {
            const {description, profile_id} = req.body

            if(!profile_id){
                res.status(500).json({message: 'Aucun utilisateur trouvé'})   
            }

            const resUser = await prisma.user.update({
                where:{
                    id: profile_id
                },
                data:{
                    description
                }
            })
            
            if(!resUser){
                res.status(500).json({message: 'Aucun utilisateur trouvé'})   
            }else{
                res.status(200).json({message: 'Description changée'})
            }
        }
    }catch(e){
        console.log(e)
    }
}