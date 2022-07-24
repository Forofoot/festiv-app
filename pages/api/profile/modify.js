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
            const {email} = data.fields
            const {pseudo} = data.fields
            const {password} = data.fields
            const {description} = data.fields
            const {currentUserPseudo} = data.fields
            const {currentAvatar} = data.fields

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
                
                if(userResult){
                    if(!password){
                        try{
                            if(!file){
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
                                
                                res.status(200).json({
                                    pseudo: userModified.pseudo,
                                    avatar: userModified.avatar
                                })
                            }else{
                                const deleteOldImage = await cloudinary.uploader.destroy(
                                    currentAvatar
                                );
                                
                                const imageData = await uploadAvatar(file.path);
                                console.log(imageData.public_id)
                                const userModified = await prisma.user.update({
                                    where:{
                                        pseudo: currentUserPseudo
                                    },
                                    data:{
                                        email,
                                        pseudo,
                                        description,
                                        avatarPublicId: imageData.public_id,
                                        avatar: imageData.url
                                    }
                                })
                                
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
                            if(!file){
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
                                
                                res.status(200).json({
                                    pseudo: userModified.pseudo
                                })
                            }else{
                                const deleteOldImage = await cloudinary.uploader.destroy(
                                    currentAvatar
                                );

                                const imageData = await uploadAvatar(file.path);
                                
                                console.log(currentAvatar)
                                const userModified = await prisma.user.update({
                                    where:{
                                        pseudo: currentUserPseudo
                                    },
                                    data:{
                                        email,
                                        pseudo,
                                        description,
                                        avatar:imageData.url,
                                        avatarPublicId: imageData.public_id,
                                        password: await hash(password, 12)
                                    }
                                })
                                
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