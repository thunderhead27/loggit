import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query

    console.log(id);

    const deletedPost = await prisma.mealPost.delete({
        where: {
            //@ts-ignore
            id
        }
    })

    res.status(201).send({
        message: 'Deleted meal post!',
        deletedPost
    })
}