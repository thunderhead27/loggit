/* eslint-disable */
import Layout from "@/components/Layout";
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from 'axios';
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

  :focus {
    outline: none;
}
`

interface FormValues {
    name: string
    email: string
    password: string
    confirmPassword: string
}


function RegisterScreen() {
    const [error, setError] = useState(false);
    const { data: session } = useSession();
    const router = useRouter();
    const { redirect } = router.query;

    useEffect(() => {
        if (session?.user) {

            //@ts-ignore
            router.push(redirect || '/profile');
        }
    }, [router, session, redirect])

    const { handleSubmit, register, getValues, formState: { errors }, } = useForm<FormValues>();

    //@ts-ignore
    const submitHandler = async ({ name, email, password }) => {
        try {
            await axios.post('/api/auth/signup', {
                name,
                email,
                password,
            })

            const result = await signIn('credentials', {
                redirect: false,
                name,
                email,
                password
            });

            //@ts-ignore
            if (result.error) {
                // console.log(result.error);
                setError(true);
                //@ts-ignore
                console.log(result.error);
            }
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className="flex flex-col h-screen text-white">
            <Layout>
                <h1 className="mx-12 text-3xl text-white font-bold">Sign Up</h1>
                <form className="flex flex-col gap-y-4 bg-cOrange w-[300px] xl:w-[600px] rounded-md py-8 px-6">
                    {error && <div className="text-lg font-bold">User already exists.</div>}
                    <div className="xl:text-2xl flex flex-row gap-x-6">
                        <div>
                            <label className="font-bold text-xl" htmlFor="firstName">Name</label>
                            <Input type="text" {...register('name', {
                                required: true
                            })} className="w-full focus:outline-none rounded-sm" id="firstName" autoFocus></Input>
                            {errors.name &&
                                <div className="text-xs absolute font-bold">Please enter name</div>
                            }
                        </div>
                    </div>
                    <div className="xl:text-2xl">
                        <label className="font-bold text-xl" htmlFor="email">Email</label>
                        <Input type="email" {...register('email', {
                            required: true, pattern: {
                                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                                message: 'Please enter valid email',
                            }
                        })} className="w-full focus:outline-none rounded-sm" id="email" autoFocus></Input>
                        {errors.email &&
                            <div className="text-xs absolute font-bold">Please enter email</div>
                        }
                    </div>
                    <div className="xl:text-2xl">
                        <label className="font-bold text-xl" htmlFor="password">Password</label>
                        <Input type="password" {...register('password', {
                            required: 'Please enter password',
                            minLength: { value: 6, message: 'Password is more than 5 characters' }
                        })} className="w-full focus:outline-none rounded-sm" id="password" autoFocus></Input>
                        {errors.password &&
                            <div className="text-xs absolute font-bold">{errors.password.message}</div>
                        }
                    </div>
                    <div className="xl:text-2xl">
                        <label className="font-bold text-xl" htmlFor="confirmPassword">Confirm Password</label>
                        <Input type="password" {...register('confirmPassword', {
                            required: 'Please enter password',
                            validate: (value) => value === getValues('password'),
                            minLength: { value: 6, message: 'Password is more than 5 characters' }
                        })} className="w-full focus:outline-none rounded-sm" id="confirmPassword" autoFocus></Input>
                        {errors.confirmPassword &&
                            <div className="text-xs absolute font-bold">{errors.confirmPassword.message}</div>
                        }
                        {errors.confirmPassword && errors.confirmPassword.type === 'validate' &&
                            <div className="text-xs absolute font-bold">PASSWORDS DO NOT MATCH</div>
                        }
                    </div>
                    <div>
                        <button className="text-white font-bold py-2 px-4 border-2 border-white" onClick={handleSubmit(submitHandler)}>Register</button>
                    </div>
                </form>
            </Layout>
        </div>
    )
}

export default RegisterScreen;