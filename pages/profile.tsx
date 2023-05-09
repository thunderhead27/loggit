import Layout from "@/components/Layout";
import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { authOptions } from "./api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import axios from 'axios';
import prisma from "@/lib/prisma";
import moment from 'moment';
import ProfilePieChart from "@/components/ProfilePieChart";
import { use, useEffect, useState } from "react";
import styled from 'styled-components';
import MacroPieChart from "@/components/MacroPieChart";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from 'next/router';

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
  font-size: 1.2rem;
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

interface FormValues1 {
    age: number
    weight: number
    foot: number
    inches: number
}

interface FormValues2 {
    calories: number
    fat: number
    fatPercentage: number
    carbohydrate: number
    carbPercentage: number
    protein: number
    proteinPercentage: number
}

export default function ProfileScreen({ meals, dailyMacro, previousDayMacro, userId }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const [openMacro, setOpenMacro] = useState(false)
    const [activity, setActivity] = useState("1.2");
    const [gender, setGender] = useState('male');

    const [setOwn, setSetOwn] = useState('percentage');

    const [calories, setCalories] = useState(2000);
    const [fat, setFat] = useState(65);
    const [carbohydrate, setCarbohydrate] = useState(300);
    const [protein, setProtein] = useState(50);
    const [fatPercentage, setFatPercentage] = useState(30);
    const [carbPercentage, setCarbPercentage] = useState(60);
    const [proteinPercentage, setProteinPercentage] = useState(10);


    const { register, handleSubmit, formState: { errors } } = useForm<FormValues1>();

    const { control, register: register2, handleSubmit: handleSubmit2, formState: { errors: errors2 } } = useForm<FormValues2>();

    const router = useRouter();

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setActivity(event.target.value);
    };

    const onGenderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setGender(event.target.value);
    }

    const onSetOwnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSetOwn(event.target.value);
    }

    const onCaloriesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCalories(parseInt(event.target.value))
    }

    const onFatChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFat(parseInt(event.target.value))
    }

    const onFatPercentageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFatPercentage(parseInt(event.target.value))

        const calcFat = Math.round(parseInt(event.target.value) * calories / 900)
        setFat(calcFat)
    }

    const onCarbohydrateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCarbohydrate(parseInt(event.target.value))
    }

    const onCarbPercentageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCarbPercentage(parseInt(event.target.value))

        const calcCarb = Math.round(parseInt(event.target.value) * calories / 400)
        setCarbohydrate(calcCarb)
    }

    const onProteinChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setProtein(parseInt(event.target.value))
    }

    const onProteinPercentageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setProteinPercentage(parseInt(event.target.value))

        const calcProtein = Math.round(parseInt(event.target.value) * calories / 400)
        setProtein(calcProtein)
    }

    const onCalcSubmit: SubmitHandler<FormValues1> = (data) => {
        let tdee;

        console.log(data)
        if (gender === 'male') {
            tdee = Math.round(((10 * (Number(data.weight) * 0.453592)) + (6.25 * 2.54 * ((Number(data.foot) * 12) + Number(data.inches))) - (5 * Number(data.age)) + 5) * Number(activity));
            setCalories(tdee);

        } else {
            tdee = Math.round((10 * Number(data.weight) * 0.453592) + (6.25 * 2.54 * ((Number(data.foot) * 12) + Number(data.inches)) - 5 * Number(data.age) - 161) * Number(activity));
            setCalories(tdee);
        }

        console.log(tdee)
    }

    const onMacroSubmit: SubmitHandler<FormValues2> = async () => {

        await axios.put('/api/macro', {
            calories,
            fat,
            carbohydrate,
            protein,
            id: dailyMacro.id
        })

        router.reload();
    }

    const result = [fat, protein, carbohydrate];

    const activityLevel = [
        { label: 'Sedentary', value: "1.2" },
        { label: 'Lightly active', value: "1.375" },
        { label: 'Moderately active', value: "1.55" },
        { label: 'Very active', value: "1.725" },
        { label: 'Extra active', value: "1.9" },
    ]

    useEffect(() => {
        const addMacro = async () => {
            if (!previousDayMacro) {
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

        if (!dailyMacro) {
            addMacro()
        }
    })

    return (
        <div className="flex flex-col font-lato h-screen text-white">
            <Layout>
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
                                <div className="flex flex-row items-center gap-x-4 pt-12 mb-4">
                                    <label>Age</label>
                                    <Input className="w-12" type="number" {...register("age", { valueAsNumber: true, required: true })} />
                                    <span>years</span>
                                </div>
                                {errors.age && <div className="text-xs absolute">Age required</div>
                                }
                                <div className="flex flex-row items-center gap-x-4 pt-4 mb-4">
                                    <label>Weight</label>
                                    <Input className="w-24" type="number" {...register("weight", { valueAsNumber: true, required: true })} />
                                    <span>lbs</span>
                                </div>
                                {errors.weight && <div className="text-xs absolute">Weight required</div>
                                }
                                <div className="flex flex-row items-center gap-x-4 pt-4 mb-4">
                                    <label>Height</label>
                                    <Input className="w-12" type="number" {...register("foot", { valueAsNumber: true, required: true })} />
                                    <span>foot</span>
                                    <Input className="w-12" type="number" {...register("inches", { valueAsNumber: true, required: true })} />
                                    <span>inches</span>
                                </div>
                                <div className="flex flex-row gap-x-4">
                                    {errors.foot && <div className="text-xs">Foot required</div>
                                    }
                                    {errors.inches && <div className="text-xs">Inches required</div>
                                    }
                                </div>

                                <div className="flex flex-row items-center gap-x-4 pt-4">
                                    <label>Activity level</label>
                                    <Select className="text-xl" options={activityLevel} value={activity} onChange={handleChange} />
                                </div>
                                <button className="bg-[#45214A] text-white py-2 px-4 rounded-md mt-4" onClick={handleSubmit(onCalcSubmit)}>Calculate</button>
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
                                    <div className="flex flex-row gap-x-4 mb-4 self-start items-center">
                                        <label>Calories</label>
                                        <Controller
                                            name="calories"
                                            rules={{
                                                required: { value: true, message: "Required" },
                                            }}
                                            control={control}
                                            render={({ field }) => (
                                                <Input {...field} {...register2("calories", { valueAsNumber: true })} type="number" className="w-20" value={calories} onChange={onCaloriesChange} />
                                            )}
                                        />
                                    </div>
                                    {errors2.calories && <div className="text-xs">Calories required</div>
                                    }
                                    <SetOwn className="flex flex-col gap-y-4" open={setOwn === "percentage"}>
                                        <div className="flex flex-row gap-x-4 items-center">
                                            <label>Fat</label>
                                            <Controller
                                                name="fatPercentage"
                                                rules={{
                                                    required: { value: true, message: "Required" },
                                                }}
                                                control={control}
                                                render={({ field: { value, onChange, ...field } }) => (
                                                    <Input {...field} {...register2("fatPercentage", { valueAsNumber: true })} type="number" className="w-12" value={fatPercentage} onChange={onFatPercentageChange} />
                                                )}
                                            />
                                            <span>%</span>
                                        </div>
                                        {errors2.fatPercentage && <div className="text-xs">Fat percentage required</div>
                                        }
                                        <div className="flex flex-row gap-x-4 items-center">
                                            <label>Carbohydrate</label>
                                            <Controller
                                                name="carbPercentage"
                                                rules={{
                                                    required: { value: true, message: "Required" },
                                                }}
                                                control={control}
                                                render={({ field: { value, onChange, ...field } }) => (
                                                    <Input {...field} {...register2("carbPercentage", { valueAsNumber: true })} type="number" className="w-12" value={carbPercentage} onChange={onCarbPercentageChange} />
                                                )}
                                            />
                                            <span>%</span>
                                        </div>
                                        {errors2.carbPercentage && <div className="text-xs">Carb percentage required</div>
                                        }
                                        <div className="flex flex-row gap-x-4 items-center">
                                            <label>Protein</label>
                                            <Controller
                                                name="proteinPercentage"
                                                rules={{
                                                    required: { value: true, message: "Required" },
                                                }}
                                                control={control}
                                                render={({ field: { value, onChange, ...field } }) => (
                                                    <Input {...field} {...register2("proteinPercentage", { valueAsNumber: true })} type="number" className="w-12" value={proteinPercentage} onChange={onProteinPercentageChange} />
                                                )}
                                            />
                                            <span>%</span>
                                        </div>
                                        {errors2.proteinPercentage && <div className="text-xs">Protein percentage required</div>
                                        }
                                    </SetOwn>
                                    <SetOwn className="flex flex-col gap-y-4" open={setOwn === "grams"}>
                                        <div className="flex flex-row gap-x-4 items-center">
                                            <label>Fat</label>
                                            <Controller
                                                name="fat"
                                                rules={{
                                                    required: { value: true, message: "Required" },
                                                }}
                                                control={control}
                                                render={({ field: { value, onChange, ...field } }) => (
                                                    <Input {...field} {...register2("fat", { valueAsNumber: true })} type="number" className="w-12" value={fat} onChange={onFatChange} />
                                                )}
                                            />
                                            <span>g</span>
                                        </div>
                                        {errors2.fat && <div className="text-xs">Fat required</div>
                                        }
                                        <div className="flex flex-row gap-x-4 items-center">
                                            <label>Carbohydrate</label>
                                            <Controller
                                                name="carbohydrate"
                                                rules={{
                                                    required: { value: true, message: "Required" },
                                                }}
                                                control={control}
                                                render={({ field: { value, onChange, ...field } }) => (
                                                    <Input {...field} {...register2("carbohydrate", { valueAsNumber: true })} type="number" className="w-12" value={carbohydrate} onChange={onCarbohydrateChange} />
                                                )}
                                            />
                                            <span>g</span>
                                        </div>
                                        {errors2.carbohydrate && <div className="text-xs">Carbohydrate required</div>
                                        }
                                        <div className="flex flex-row gap-x-4 items-center">
                                            <label>Protein</label>
                                            <Controller
                                                name="protein"
                                                rules={{
                                                    required: { value: true, message: "Required" },
                                                }}
                                                control={control}
                                                render={({ field: { value, onChange, ...field } }) => (
                                                    <Input {...field} {...register2("protein", { valueAsNumber: true })} type="number" className="w-12" value={protein} onChange={onProteinChange} />
                                                )}
                                            />
                                            <span>g</span>
                                        </div>
                                        {errors2.protein && <div className="text-xs">Protein required</div>
                                        }
                                    </SetOwn>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-center text-[#323050] text-3xl font-bold">
                            <h1>Projected Macro</h1>
                            <MacroPieChart result={result} />
                        </div>
                        <div className="flex flex-row absolute bottom-12 right-12 gap-x-12 self-end">
                            <button className="bg-[#5D8A66] px-4 py-2 rounded-md font-bold" onClick={handleSubmit2(onMacroSubmit)}>Set</button>
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