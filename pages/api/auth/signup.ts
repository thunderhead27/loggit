import bcryptjs from 'bcryptjs';
import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { createId } from '@paralleldrive/cuid2';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return;
    }

    console.log(req.body);

    const { name, email, password } = req.body;

    if (!name ||
        !email ||
        !email.includes('@') ||
        !password ||
        password.trim().length < 5
    ) {
        res.status(422).json({
            message: 'Validation error',
        });
        return;
    }

    const existingUser = await prisma.user.findFirst({
        where: {
            email: email
        }
    });

    if (existingUser) {
        res.status(422).json({ message: 'User exists already!' });
        return;
    }

    const newUser = await prisma.user.create({
        data: {
            id: createId(),
            name: name,
            email: email,
            password: bcryptjs.hashSync(password),
        }
    })



    res.status(201).send({
        message: 'Created user!',
        newUser
    })
}
