import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs';

export default async function handler(
    req, res
) {

    try{
        const prisma = new PrismaClient();
        //Only POST mothod is accepted
        if (req.method === 'POST') {
            const {newPassword, confirmPassword, profile_id} = req.body

            if(!profile_id){
                res.status(500).json({message: 'Aucun utilisateur trouvé'})   
            }

            const resUser = await prisma.user.update({
                where:{
                    id: profile_id
                },
                data:{
                    password: await hash(confirmPassword, 12), 
                }
            })
            
            if(!resUser){
                res.status(500).json({message: 'Aucun utilisateur trouvé'})   
            }else{
                res.status(200).json({message: 'Mot de passe changé'})
            }
        }
    }catch(e){
        console.log(e)
    }
}