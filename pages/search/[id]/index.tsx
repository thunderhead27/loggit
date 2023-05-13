import Layout from "@/components/Layout";
import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import axios from 'axios';
import Search from "@/components/Search";
import NutritionsFact from "@/components/NutritionFacts";
import PieChart from "@/components/PieChart";
import { useState } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";


export default function SearchItem({ result }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const { data: session } = useSession();
    const router = useRouter();
    const { query } = router;

    const [servings, setServings] = useState(1);
    const [weight, setWeight] = useState(Math.round(result.serving_qty * 28.3495))

    const addHandler = () => {
        const newServing = Math.floor(servings) + 1;
        setServings(newServing);
        const newWeight = Math.round(result.serving_qty * 28.3495) * newServing;
        setWeight(newWeight);
    }

    const subtractHandler = () => {
        const newServing = Math.floor(servings) - 1;
        setServings(newServing);
        const newWeight = Math.round(result.serving_qty * 28.3495) * newServing;
        setWeight(newWeight);
    }

    const weightOnChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setWeight(Number(e.target.value));
        const newServing = Number(e.target.value) / Math.round(result.serving_qty * 28.3495);
        setServings(newServing);
    }

    const addToFoodLog = () => {
        router.push(`/profile?item=${result.nix_item_id}&quantity=${servings}`)
    }

    return (
        <div className="flex flex-col xl:h-screen">
            <Layout>
                <div className="flex flex-col">
                    <div className="flex flex-col font-lato text-center my-12 text-white font-bold">
                        <h1 className="text-3xl">{result.food_name}</h1>
                        <h1>{result.brand_name}</h1>
                    </div>
                    <div className="flex flex-col xl:flex-row gap-x-12 gap-y-8">
                        <NutritionsFact result={result} weight={weight} servings={servings} />
                        <div className="w-[300px]">
                            <PieChart result={result} />
                        </div>
                    </div>
                    <div className="flex flex-col font-lato items-center mt-12 gap-y-12">
                        <div className="flex flex-row gap-x-4">
                            <button className="flex flex-row items-center place-content-center bg-[#5D8A66] text-white h-6 w-6 rounded-sm text-2xl" disabled={servings <= 1} onClick={subtractHandler}>-</button>
                            <input value={servings} className="w-10 rounded-sm text-center"></input>
                            <button className="flex flex-row items-center place-content-center bg-[#5D8A66] text-white h-6 w-6 text-2xl rounded-sm" onClick={addHandler}>+</button>
                            <div className="text-white">Servings</div>
                        </div>
                        <div className="flex flex-row gap-x-4">
                            <input type="number" value={weight} onChange={weightOnChangeHandler} className="w-12 rounded-sm text-center"></input>
                            <div className="text-white">Grams</div>
                        </div>

                        {session?.user ?
                            <div className="mb-12">
                                <button className="text-white font-bold border-2 border-white px-4 py-2" onClick={addToFoodLog}>Add to food log</button>
                            </div>
                            :
                            <div className="flex flex-col items-center gap-y-4 text-white">
                                <button className="text-white text-lg border-2 border-white px-4 py-2" onClick={() => router.push('/login')}>Login to add to food log</button>
                                or
                                <button className="text-white text-lg border-2 border-white px-4 py-2" onClick={() => router.push('/register')}>Sign up</button>
                            </div>
                        }
                    </div>
                </div>
            </Layout>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const { query } = ctx;

    console.log(query);


    const res = await axios.get(`https://trackapi.nutritionix.com/v2/search/item?nix_item_id=${query.id}`, {
        headers: {
            'x-app-id': process.env.NUTRITIONIX_ID,
            'x-app-key': process.env.NUTRITIONIX_KEY
        },
    })

    const result = res.data.foods[0];

    return { props: { result } }
}