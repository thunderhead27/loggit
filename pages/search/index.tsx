import Layout from "@/components/Layout";
import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import axios from 'axios';
import Search from "@/components/Search";
import { useRouter } from 'next/router'

export default function SearchScreen({ result }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const router = useRouter();
    const { query } = router;

    const handleClick = (food: any) => {
        if (query.date) {
            router.push(`/search/${food.nix_item_id}/${query.date}`)
        } else {
            router.push(`/search/${food.nix_item_id}`)
        }
    }

    return (
        <div className="flex flex-col xl:h-screen">
            <Layout>
                <div className="flex flex-col items-center text-gray-50 ">
                    <div className="pt-12">
                        <Search />
                    </div>
                    <h1 className="mt-12 py-12 text-3xl">Search Results</h1>
                    <div className="flex flex-col xl:flex-row justify-between gap-x-[200px]">
                        <div className="bg-[#323050BF] xl:w-[1200px] h-[800px] overflow-y-auto rounded-xl px-10 w-[300px] mb-12">
                            <h2 className="text-xl text-center font-bold py-6">Branded</h2>
                            <div className="border-b-2"></div>
                            <ul className="flex flex-col">
                                {result.branded.map((food: any, i: number) => (
                                    <li className="cursor-pointer underline mb-2" onClick={() => handleClick(food)} key={i}>{i + 1}. {food.food_name} ({food.brand_name_item_name})</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </Layout >
        </div >
    )
}

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const { query } = ctx;


    const res = await axios.get(`https://trackapi.nutritionix.com/v2/search/instant?query=${query.query}`, {
        headers: {
            'x-app-id': process.env.NUTRITIONIX_ID,
            'x-app-key': process.env.NUTRITIONIX_KEY
        },
    })

    const result = res.data;

    return { props: { result } }
}