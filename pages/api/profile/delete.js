import { hash } from 'bcryptjs';
import { PrismaClient } from '@prisma/client'

export default async function handler(
    req, res
) {

    try{
        const prisma = new PrismaClient();
        //Only POST mothod is accepted
        if (req.method === 'POST') {
            const {currentUser} = req.body

            if(!currentUser){
                res.status(500).json({message: 'Aucun utilisateur trouvé'})   
            }

            const resUser = await prisma.user.delete({
                where:{
                    id: currentUser
                }
            })
            if(!resUser){
                res.status(500).json({message: 'Aucun utilisateur trouvé'})   
            }else{
                res.status(200).json({message: 'Utilisateur supprimé'})
            }
        }
    }catch(e){
        console.log(e)
    }
}