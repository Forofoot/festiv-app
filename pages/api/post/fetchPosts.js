import { PrismaClient } from '@prisma/client'

export default async function handler(
    req, res
) {

    try{
        const {user_id} = req.body
        const prisma = new PrismaClient();

        const data = await prisma.post.findMany({
            where:{
                "OR":[
                {
                    user:{
                        followings:{
                            some:{
                                follower_id:user_id
                            }
                        }
                    }
                },
                {
                    user_id:user_id
                }],
            },
            orderBy:{
                updatedAt:'desc'
            },
            select:{
                id:true,
                content:true,
                image:true,
                user_id:true,
                user:{
                    select:{
                        pseudo:true,
                        avatar:true,
                        followings:{
                            select:{
                                follower_id:true,
                                following_id:true
                            }
                        }
                    }
                },
                festival:{
                    select:{
                    title:true
                    }
                },
                comments:{
                    select:{
                    content: true,
                    updatedAt:true,
                    user:{
                        select:{
                        pseudo:true,
                        avatar:true
                        }
                    }
                    },
                    take:2,
                    orderBy:{
                    updatedAt:'desc'
                    }
                },
                likes:{
                    select:{
                        user:{
                            select:{
                            pseudo:true
                            }
                        }
                    }
                }
            }
        })

        res.status(200).json(data)
    }catch(e){
        console.log(e)
    }
}