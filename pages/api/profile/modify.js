import { hash } from 'bcryptjs';
import { PrismaClient } from '@prisma/client'

export default async function handler(
    req, res
) {

    try{
        const prisma = new PrismaClient();
        //Only POST mothod is accepted
        if (req.method === 'POST') {
            //Getting email and password from body
            const { email, password, pseudo, description, currentUserPseudo } = req.body
            //Validate
            if (!email || !pseudo) {
                res.status(422).json({ message: 'Données invalides' })
            }
    
            if(currentUserPseudo){
                const userResult = await prisma.user.findUnique({
                    where:{
                        pseudo: currentUserPseudo
                    }
                })

                await prisma.$disconnect()
                if(userResult){
                    if(!password){
                        try{
                            const userModified = await prisma.user.update({
                                where:{
                                    pseudo: currentUserPseudo
                                },
                                data:{
                                    email,
                                    pseudo,
                                    description
                                }
                            })
                            await prisma.$disconnect()
                            res.status(200).json({
                                pseudo: userModified.pseudo
                            })
                        }catch(error){
                            res.status(500).json({
                                message: 'Cet utilisateur existe déjà'
                            })
                        }
                    }else{
                        try{
                            const userModified = await prisma.user.update({
                                where:{
                                    pseudo: currentUserPseudo
                                },
                                data:{
                                    email,
                                    pseudo,
                                    description,
                                    password: await hash(password, 12)
                                }
                            })
                            await prisma.$disconnect()
                            res.status(200).json({
                                pseudo: userModified.pseudo
                            })
                        }catch(error){
                            res.status(500).json({ message: 'Cet utilisateur existe déjà'})
                        }
                    }
                }else{
                    res.status(500).json({ message: 'Utilisateur introuvable'})
                }
            }
        }else{
            res.status(500).json({ message: 'Erreur lors de la sauvegarde'})   
        }
    }catch(e){
        console.log(e)
    }
}