import Layout from "@/components/Layout";
import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { authOptions } from "./api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import axios from 'axios';
import prisma from "@/lib/prisma";
import moment from 'moment';
import ProfilePieChart from "@/components/ProfilePieChart";
import { useEffect, useState } from "react";
import styled from 'styled-components';

interface Props {
    readonly open: boolean;
}

const MacroModal = styled.div<Props>`
    position: absolute;
    margin: auto auto auto auto;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    border-radius: 20px;

    ${({ open }) => (open ? `visibility: visible` : `visibility: hidden`)};
`

const Input = styled.input`
  font-size: 1.5rem;
  color: white;
  border: none;
  border-radius: 5px;
  text-align: center;
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  background-color: #323050;

  :focus {
    outline: none;
}
`

const SetOwn = styled.div<Props>`
    ${({ open }) => (open ? `display: flex` : `display: none`)};
`

const Select = ({ label, value, options, onChange }: any) => {
    return (
        <label>
            {label}
            <select value={value} onChange={onChange}>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                ))}
            </select>
        </label>
    );
};


export default function ProfileScreen({ meals, dailyMacro, previousDayMacro, userId }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const [openMacro, setOpenMacro] = useState(false)
    const [activity, setActivity] = useState("1.2");
    const [gender, setGender] = useState('');
    const [age, setAge] = useState();
    const [setOwn, setSetOwn] = useState('');


    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setActivity(event.target.value);
    };

    const onGenderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setGender(event.target.value);
    }

    const onSetOwnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSetOwn(event.target.value);
    }

    const activityLevel = [
        { label: 'Sedentary', value: "1.2" },
        { label: 'Lightly active', value: "1.375" },
        { label: 'Moderately active', value: "1.55" },
        { label: 'Very active', value: "1.725" },
        { label: 'Extra active', value: "1.9" },
    ]

    useEffect(() => {
        const addMacro = async () => {
            if (previousDayMacro === undefined) {
                await axios.post('/api/macro', {
                    calories: 2000,
                    fat: 75,
                    carbohydrate: 300,
                    protein: 30,
                    userId: userId
                })
            } else {
                await axios.post('/api/macro', {
                    calories: previousDayMacro.calories,
                    fat: previousDayMacro.fat,
                    carbohydrate: previousDayMacro.carbohydrate,
                    protein: previousDayMacro.protein,
                    userId: userId
                })
            }
        }

        if (dailyMacro === undefined) {
            addMacro()
        }
    })

    return (
        <div className="flex flex-col font-lato h-screen text-white">
            <Layout>
                {console.log(dailyMacro)}
                <h1 className="my-12 text-3xl text-white font-bold">Profile</h1>
                <div className="flex flex-row">
                    {dailyMacro === undefined ? null :
                        <div className="flex flex-col items-center">
                            <h1 className="text-lg">Daily Macro</h1>
                            <ProfilePieChart result={dailyMacro} />
                            <button className="my-12 border-2 border-white px-4 py-2" onClick={() => setOpenMacro(true)}>Change Macro</button>
                        </div>
                    }
                    {meals === undefined ? null :
                        <div className="flex flex-col items-center">
                            <h1 className="text-lg">Today&apos;s Consumption</h1>
                            <ProfilePieChart result={meals} />
                        </div>
                    }
                </div>
                <MacroModal open={openMacro} className="bg-gray-200 w-[300px] h-[300px] xl:w-[1000px] xl:h-[1000px]">
                    <div className="flex flex-col items-center">
                        <div className="flex flex-col xl:flex-row gap-x-12 text-[#323050]">
                            <div className="py-12">
                                <h1 className="text-3xl font-bold">Calculate your macro</h1>
                                <div className="flex flex-row items-center gap-x-4 pt-12">
                                    <h2>Gender</h2>
                                    <div className="flex flex-row gap-x-4">
                                        <div>
                                            <label className="mr-2">Male</label>
                                            <input type="radio" value="male" checked={gender === 'male'} onChange={onGenderChange} />
                                        </div>
                                        <div>
                                            <label className="mr-2">Female</label>
                                            <input type="radio" value="female" checked={gender === 'female'} onChange={onGenderChange} />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-row items-center gap-x-4 pt-12">
                                    <label>Age</label>
                                    <Input className="w-12" />
                                    <span>years</span>
                                </div>
                                <div className="flex flex-row items-center gap-x-4 pt-4">
                                    <label>Weight</label>
                                    <Input className="w-24" />
                                    <span>lbs</span>
                                </div>
                                <div className="flex flex-row items-center gap-x-4 pt-4">
                                    <label>Height</label>
                                    <Input className="w-12" />
                                    <span>foot</span>
                                    <Input className="w-12" />
                                    <span>inches</span>
                                </div>
                                <div className="flex flex-row items-center gap-x-4 pt-4">
                                    <label>Activity level</label>
                                    <Select className="text-xl" options={activityLevel} value={activity} onChange={handleChange} />
                                </div>
                            </div>
                            <span className="self-center text-xl">or</span>
                            <div className="py-12">
                                <h1 className="text-3xl font-bold">Set your own</h1>
                                <div className="flex flex-col items-center gap-y-4 pt-12">
                                    <div className="flex flex-row gap-x-4 pb-8">
                                        <div>
                                            <label className="mr-2">Percentage</label>
                                            <input type="radio" value="percentage" checked={setOwn === 'percentage'} onChange={onSetOwnChange} />
                                        </div>
                                        <div>
                                            <label className="mr-2">Grams</label>
                                            <input type="radio" value="grams" checked={setOwn === 'grams'} onChange={onSetOwnChange} />
                                        </div>
                                    </div>
                                    <div className="flex flex-row gap-x-4 self-start items-center">
                                        <label>Calories</label>
                                        <Input className="w-16" />
                                    </div>
                                    <SetOwn className="flex flex-col gap-y-4" open={setOwn === "percentage"}>
                                        <div className="flex flex-row gap-x-4 items-center">
                                            <label>Fat</label>
                                            <Input className="w-10" />
                                            <span>%</span>
                                        </div>
                                        <div className="flex flex-row gap-x-4 items-center">
                                            <label>Carbohydrate</label>
                                            <Input className="w-10" />
                                            <span>%</span>
                                        </div>
                                        <div className="flex flex-row gap-x-4 items-center">
                                            <label>Protein</label>
                                            <Input className="w-10" />
                                            <span>%</span>
                                        </div>
                                    </SetOwn>
                                    <SetOwn className="flex flex-col gap-y-4" open={setOwn === "grams"}>
                                        <div className="flex flex-row gap-x-4 items-center">
                                            <label>Fat</label>
                                            <Input className="w-10" />
                                            <span>g</span>
                                        </div>
                                        <div className="flex flex-row gap-x-4 items-center">
                                            <label>Carbohydrate</label>
                                            <Input className="w-10" />
                                            <span>g</span>
                                        </div>
                                        <div className="flex flex-row gap-x-4 items-center">
                                            <label>Protein</label>
                                            <Input className="w-10" />
                                            <span>g</span>
                                        </div>
                                    </SetOwn>
                                </div>
                            </div>
                        </div>
                        <div className="text-[#323050] text-3xl font-bold">
                            <h1>Projected Macro</h1>
                        </div>
                        <div className="flex flex-row absolute bottom-12 right-12 gap-x-12 self-end">
                            <button className="bg-[#5D8A66] px-4 py-2 rounded-md font-bold">Set</button>
                            <button className="bg-[#45214A] px-4 py-2 rounded-md font-bold" onClick={() => setOpenMacro(false)}>Cancel</button>
                        </div>
                    </div>
                </MacroModal>
            </Layout>
        </div>
    )
}


export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
    const session = await getServerSession(context.req, context.res, authOptions)

    const todaysDate = new Date().toISOString()
    const yesterdaysDate = moment(todaysDate).subtract(1, 'd').toISOString();

    const meals = await prisma.mealPost.findMany({
        where: {
            createdAt: {
                gte: todaysDate
            },
            userId: session?.user.id
        }
    })

    const dailyMacro = await prisma.macro.findFirst({
        where: {
            createdAt: {
                lte: todaysDate,
                gt: yesterdaysDate
            },
            userId: session?.user.id
        }
    })

    const previousDayMacro = await prisma.macro.findFirst({
        where: {
            createdAt: {
                lte: yesterdaysDate
            },
            userId: session?.user.id
        }
    })

    return { props: { meals: JSON.parse(JSON.stringify(meals)), dailyMacro: JSON.parse(JSON.stringify(dailyMacro)), previousDayMacro: JSON.parse(JSON.stringify(previousDayMacro)), userId: session?.user.id } }
}