import { PrismaClient } from '@prisma/client'
import { IncomingForm } from "formidable";
import { uploadPost } from "../../../utils/cloudinary";

export const config = {
    api: {
      bodyParser: false,
    },
};
export default async function handler(
    req, res
) {

    try{
        const data = await new Promise(function (resolve, reject) {
            const form = new IncomingForm({ keepExtensions: true });
            form.parse(req, function (err, fields, files) {
              if (err) return reject(err);
              resolve({ fields, files });
            });
        });
        const image = data.files.image;
        const {content} = data.fields
        const {user} = data.fields
        const {festival} = data.fields

        const prisma = new PrismaClient();

        const userExist = await prisma.user.findUnique({
            where:{
                id : parseInt(user)
            }
        })

        if(!userExist){
            res.status(500).json({message: 'aucun user trouvé'})
        }else{
            if(image){
                const imageData = await uploadPost(image.filepath);
                if(imageData){
                    const createPost = await prisma.post.create({
                        data:{
                            content:content,
                            festival_id: parseInt(festival),
                            user_id: parseInt(user),
                            image: imageData.url,
                            imagePublicId: imageData.public_id
                        }
                    })
                    res.status(200).json({message: 'Post créé'})
                }else{
                    res.status(500).json({message: 'Aucune image'})
                }
            }else{
                res.status(500).json({message: 'Image introuvable'})
            }
        }
    }catch(e){
        res.status(500).json({message: e})
    }
}