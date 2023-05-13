/* eslint-disable */
import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import { useForm } from 'react-hook-form'
import { useRouter } from "next/router";
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import styled from 'styled-components'

const Input = styled.input`
  font-size: 2rem;
  color: white;
  width: 500px;
  border: none;
  border-radius: 40px;
  padding-left: 16px;
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  background-color: #323050;

   @media (max-width: 768px) {
    font-size: 1.2rem;
    width: 300px;
  }

  :focus {
    outline: none;
}
`

interface FormValues {
    email: string
    password: string
}

//@ts-ignore
export default function LoginScreen(props) {
    const [error, setError] = useState(false);
    const { data: session } = useSession();
    const router = useRouter();
    const { redirect } = router.query;

    const { handleSubmit, register, formState: { errors } } = useForm<FormValues>();

    const submitHandler = async ({ email, password }: any) => {
        try {
            const result = await signIn('credentials', {
                redirect: false,
                email,
                password
            });
            if (result!.error) {
                // console.log(result.error);
                setError(true);
            }
        } catch (err) {
            console.log(err)
            throw new Error('Invalid email or password');
        }
    }


    useEffect(() => {
        if (session?.user) {
            //@ts-ignore
            router.push(redirect || '/profile');
        }
    }, [router, session, redirect])

    return (
        <div className="flex flex-col font-lato h-screen">
            <Layout>
                <div className="flex flex-col items-center">
                    <h1 className="my-12 text-3xl text-white font-bold">Login</h1>
                    <form className="flex flex-col gap-y-4 bg-cOrange w-[300px] xl:w-[600px] rounded-md py-8">
                        {error && <div className="text-lg font-bold text-white">Invalid email or password.  Please try again.</div>}
                        <div className="xl:text-2xl flex flex-col">
                            <label className="font-bold text-xl text-white" htmlFor="email">Email</label>
                            <Input type="email" {...register('email', {
                                required: "Please enter email", pattern: {
                                    value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                                    message: 'Please enter valid email',
                                }
                            })} id="email" autoFocus></Input>
                            {errors.email &&
                                <div className="text-xs text-white font-bold">{errors.email.message}</div>
                            }
                        </div>
                        <div className="xl:text-2xl flex flex-col">
                            <label className="font-bold text-xl text-white" htmlFor="password">Password</label>
                            <Input type="password" {...register('password', {
                                required: 'Please enter password',
                                minLength: { value: 6, message: 'Password is more than 5 characters' }
                            })} id="password" autoFocus></Input>
                            {errors.password &&
                                <div className="text-xs text-white font-bold">{errors.password.message}</div>
                            }
                        </div>
                        <div>
                            <button className="bg-cBrown text-white font-bold px-4 py-2 border-white border-2" onClick={handleSubmit(submitHandler)}>Login</button>
                        </div>
                        <div className="flex flex-row text-white">
                            <p className="">Don&apos;t have an account? &nbsp;</p>
                            <Link className="underline font-bold" href="/register">Sign up</Link>
                        </div>
                    </form>
                </div>
            </Layout>
        </div>
    )
}