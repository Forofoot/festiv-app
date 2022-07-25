import { hash } from 'bcryptjs';
import { PrismaClient } from '@prisma/client'
import { IncomingForm } from "formidable";
import { uploadAvatar } from "../../../utils/cloudinary";

const cloudinary = require("cloudinary").v2;

export const config = {
    api: {
      bodyParser: false,
    },
  };
  


export default async function handler(
    req, res
) {

    try{
        const prisma = new PrismaClient();
        //Only POST mothod is accepted
        if (req.method === 'POST') {

            const data = await new Promise(function (resolve, reject) {
                const form = new IncomingForm({ keepExtensions: true });
                form.parse(req, function (err, fields, files) {
                  if (err) return reject(err);
                  resolve({ fields, files });
                });
              });
            
            const file = data.files.image
            const {password} = data.fields
            const {description} = data.fields
            const {currentUserPseudo} = data.fields
            const {currentAvatar} = data.fields
    
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
                            if(!file.filepath){
                                const userModified = await prisma.user.update({
                                    where:{
                                        pseudo: currentUserPseudo
                                    },
                                    data:{
                                        description
                                    }
                                })
                                await prisma.$disconnect()
                                res.status(200).json({
                                    pseudo: userModified.pseudo,
                                    avatar: userModified.avatar
                                })
                            }else{
                                const deleteOldImage = await cloudinary.uploader.destroy(
                                    currentAvatar
                                );
                                
                                const imageData = await uploadAvatar(file.filepath);
                                console.log(imageData.public_id)
                                const userModified = await prisma.user.update({
                                    where:{
                                        pseudo: currentUserPseudo
                                    },
                                    data:{
                                        description,
                                        avatarPublicId: imageData.public_id,
                                        avatar: imageData.url
                                    }
                                })
                                await prisma.$disconnect()
                                res.status(200).json({
                                    pseudo: userModified.pseudo,
                                    avatar: userModified.avatar
                                })
                            }
                        }catch(error){
                            res.status(500).json({
                                message: 'Cet utilisateur existe déjà'
                            })
                        }
                    }else{
                        try{
                            if(!file.filepath){
                                const userModified = await prisma.user.update({
                                    where:{
                                        pseudo: currentUserPseudo
                                    },
                                    data:{
                                        description,
                                        password: await hash(password, 12)
                                    }
                                })
                                await prisma.$disconnect()
                                res.status(200).json({
                                    pseudo: userModified.pseudo,
                                    avatar: userModified.avatar
                                })
                            }else{
                                const deleteOldImage = await cloudinary.uploader.destroy(
                                    currentAvatar
                                );

                                const imageData = await uploadAvatar(file.filepath);
                                
                                console.log(currentAvatar)
                                const userModified = await prisma.user.update({
                                    where:{
                                        pseudo: currentUserPseudo
                                    },
                                    data:{
                                        description,
                                        avatar:imageData.url,
                                        avatarPublicId: imageData.public_id,
                                        password: await hash(password, 12)
                                    }
                                })
                                await prisma.$disconnect()
                                res.status(200).json({
                                    pseudo: userModified.pseudo,
                                    avatar: userModified.avatar
                                })
                            }
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