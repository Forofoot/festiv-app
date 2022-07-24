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
            
            if(userResult){
                if(!password){
                    if(!file){
                        const userModified = await prisma.user.update({
                            where:{
                                pseudo: currentUserPseudo
                            },
                            data:{
                                description
                            }
                        })
                        
                        res.status(200).json({
                            pseudo: userModified.pseudo,
                            avatar: userModified.avatar
                        })
                    }else{
                        /*const deleteOldImage = await cloudinary.uploader.destroy(
                            currentAvatar
                        );*/
                        
                        const imageData = await uploadAvatar(file.path);
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
                        
                        res.status(200).json({
                            pseudo: userModified.pseudo,
                            avatar: userModified.avatar
                        })
                    }
                    res.status(500).json({
                        message: 'Cet utilisateur existe déjà'
                    })
                }else{
                    if(!file){
                        const userModified = await prisma.user.update({
                            where:{
                                pseudo: currentUserPseudo
                            },
                            data:{
                                description,
                                password: await hash(password, 12)
                            }
                        })
                        
                        res.status(200).json({
                            pseudo: userModified.pseudo,
                            avatar: userModified.avatar
                        })
                    }else{
                        /*const deleteOldImage = await cloudinary.uploader.destroy(
                            currentAvatar
                        );*/

                        const imageData = await uploadAvatar(file.path);

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
                        res.status(200).json({
                            pseudo: userModified.pseudo,
                            avatar: userModified.avatar
                        })
                    }
                    res.status(500).json({ message: 'Cet utilisateur existe déjà'})
                }
            }else{
                res.status(500).json({ message: 'Utilisateur introuvable'})
            }
        }
    }catch(e){
        console.log(e)
        res.status(500).json({message: 'Erreur lors du post'})
    }
}