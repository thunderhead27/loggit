import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { calories, fat, carbohydrate, protein, userId } = req.body
        const newMacro = await prisma.macro.create({
            data: {
                userId,
                calories,
                fat,
                carbohydrate,
                protein
            }
        })
        res.send({
            message: 'Macro created successfully',
            newMacro
        })
    }

    if (req.method === 'PUT') {
        const { calories, fat, carbohydrate, protein, id } = req.body

        console.log(req.body)

        const updatedMacro = await prisma.macro.update({
            where: {
                id
            },
            data: {
                calories,
                fat,
                carbohydrate,
                protein
            }
        })
        res.send({
            message: 'Macro updated successfully',
            updatedMacro
        })
    }



}