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
            const { firstName, lastName, email, password } = req.body
            //Validate
            if (!firstName || !lastName || !email || !password) {
                res.status(422).json({ message: 'Données invalides' })
                return
            }
    
            const userExist = await prisma.user.findUnique({
                where:{
                    email
                }
            })
    
            //Hash password
            if(userExist){
                res.status(500).json({ message: 'Existe déjà'})
            }
             
            const newUser = await prisma.user.create({
                data:{
                    firstName,
                    lastName,
                    email,
                    password: await hash(password, 12),
                }
            })
            //Send success response
            res.status(201).json(newUser);
            
            await prisma.$disconnect()
            //Close DB connection
        } else {
            //Response for other than POST method
            res.status(500).json({ message: 'Erreur' });
        }
    }catch(e){
        console.log(e)
    }
}