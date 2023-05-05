import NextAuth from 'next-auth';
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from "@/lib/prisma";
import bcryptjs from 'bcryptjs'


export const authOptions: NextAuthOptions = {
    session: {
        strategy: 'jwt',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user?.id) token._id = user.id;
            if (user?.name) token.name = user.name;

            return Promise.resolve(token);
        },
        async session({ session, token }) {
            if (token?.id) session.user.id = token.id;
            if (token?.name) session.user.name = token.name;

            return Promise.resolve(session);
        }
    },
    secret: process.env.AUTH_SECRET,


    providers: [
        CredentialsProvider({
            credentials: {
                email: { label: "email", type: "text" },
                password: { label: "password", type: "password" },
            },

            async authorize(credentials: Record<string, string> | undefined) {
                if (credentials == undefined) {
                    throw new Error('Credentials not defined.');
                }

                const user = await prisma.user.findFirst({
                    where: {
                        email: credentials.email
                    }
                });

                console.log(user);

                //@ts-ignore
                if (user && bcryptjs.compareSync(credentials.password, user.password)) {
                    const returnedUser = {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                    } as any

                    return Promise.resolve(returnedUser)
                }
                throw new Error('Invalid email or password');
            }
        })
    ],

    adapter: PrismaAdapter(prisma),
};

export default NextAuth(authOptions);
