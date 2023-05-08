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
            message: 'Macro updated successfully',
            newMacro
        })
    }




}