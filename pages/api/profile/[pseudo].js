import { hash } from 'bcryptjs';
import { PrismaClient } from '@prisma/client'
import { IncomingForm } from "formidable";
import { uploadAvatar } from "../../../utils/cloudinary";
import { getImage } from "../../../utils/formidable";

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
        //Only POST method is accepted

        const imageUploaded = await getImage(req);

        const currentUserPseudo = await req.query.pseudo
        if(currentUserPseudo){
            const userResult = await prisma.user.findUnique({
                where:{
                    pseudo: currentUserPseudo
                }
            })
            await prisma.$disconnect()
            if(userResult){
                if(imageUploaded){
                    if(userResult.avatarPublicId){
                        const deleteOldImage = await cloudinary.uploader.destroy(
                            userResult.avatarPublicId
                        );
                    }
                    const imageData = await uploadAvatar(imageUploaded.filepath);
                    const userModified = await prisma.user.update({
                        where:{
                            pseudo: currentUserPseudo
                        },
                        data:{
                            avatarPublicId: imageData.public_id,
                            avatar: imageData.url
                        }
                    })
                    await prisma.$disconnect()
                    res.status(200).json({
                        pseudo: userModified.pseudo,
                        avatar: userModified.avatar,
                        id: userModified.id
                    })
                }else{
                    res.status(500).json({
                        message: 'Erreur lors de l\'ajout'
                    })
                }
            }else{
                res.status(500).json({ message: 'Utilisateur introuvable'})
            }
        }
    }catch(e){
        console.log(e)
        res.status(500).json({message : 'Erreur sa mère'})
    }
}