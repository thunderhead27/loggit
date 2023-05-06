import { getServerSideProps } from "@/pages/search/[id]";
import { InferGetServerSidePropsType } from "next";

export default function NutritionsFact({ result, servings, weight }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    return (
        <div className="flex flex-col font-sans w-[290px] bg-white border-2 border-black p-2">
            <h1 className="text-4xl font-black tracking-tighter">Nutrition Facts</h1>
            <div className="border-b border-black"></div>
            <div className="flex flex-row justify-between font-black tracking-tighter">
                <div>{servings <= 1 ? "1 Serving" : `${servings} Servings`}</div>
                <div>({weight}g)</div>
            </div>
            <div className="border-8 border-black my-1"></div>
            <div className="flex flex-row justify-between">
                <div className="flex flex-col">
                    <div className="font-black tracking-tighter text-sm">Amount per serving</div>
                    <div className="text-2xl font-black tracking-tighter">Calories</div>
                </div>
                <div className="self-end text-3xl font-black tracking-tighter">{result.nf_calories * servings}</div>
            </div>
            <div className="border-2 border-black my-1"></div>
            <div className="relative right-0 ml-auto text-sm font-black tracking-tighter">% Daily Value*</div>
            <div className="border border-gray-400"></div>
            <div className="flex flex-row justify-between">
                <div className="text-sm"><span className="font-black tracking-tighter">Total Fat</span> {result.nf_total_fat * servings}g</div>
                <div className="font-black tracking-tighter">{Math.round(result.nf_total_fat * servings * 100 / 78)}%</div>
            </div>
            <div className="border border-gray-400"></div>
            <div className="flex flex-row justify-between">
                <div className="text-sm pl-4">Saturated Fat {result.nf_saturated_fat * servings}g</div>
                <div className="font-black tracking-tighter">{Math.round(result.nf_saturated_fat * servings * 100 / 20)}%</div>
            </div>
            <div className="border border-gray-400"></div>
            <div className="flex flex-row justify-between">
                <div className="text-sm"><span className="font-black tracking-tighter">Cholesterol</span> {result.nf_cholesterol * servings}mg</div>
                <div className="font-black tracking-tighter">{Math.round(result.nf_cholesterol * 100 * servings / 313)}%</div>
            </div>
            <div className="border border-gray-400"></div>
            <div className="flex flex-row justify-between">
                <div className="text-sm"><span className="font-black tracking-tighter">Sodium</span> {result.nf_sodium * servings}mg</div>
                <div className="font-black tracking-tighter">{Math.round(result.nf_sodium * 100 * servings / 2305)}%</div>
            </div>
            <div className="border border-gray-400"></div>
            <div className="flex flex-row justify-between">
                <div className="text-sm"><span className="font-black tracking-tighter">Total Carbohydrate</span> {result.nf_total_carbohydrate * servings}g</div>
                <div className="font-black tracking-tighter">{Math.round(result.nf_total_carbohydrate * servings * 100 / 280)}%</div>
            </div>
            <div className="border border-gray-400"></div>
            <div className="flex flex-row justify-between">
                <div className="text-sm pl-4">Dietary Fiber {result.nf_dietary_fiber * servings}g</div>
                <div className="font-black tracking-tighter">{Math.round(result.nf_dietary_fiber * servings * 100 / 28)}%</div>
            </div>
            <div className="border border-gray-400"></div>
            <div className="flex flex-row justify-between">
                <div className="text-sm pl-4">Total Sugar {result.nf_sugars * servings}g</div>
            </div>
            <div className="border border-gray-400"></div>
            <div className="flex flex-row justify-between">
                <div className="text-sm"><span className="font-black tracking-tighter">Protein</span> {result.nf_protein * servings}g</div>
            </div>
            <div className="border-8 border-black"></div>
            <div className="flex flex-row justify-between pt-1">
                <div className="text-sm">Potassium {result.nf_potassium * servings}mg</div>
                <div className="font-black tracking-tighter">{Math.round(result.nf_potassium * servings * 100 / 5250)}%</div>
            </div>
            <div className="border-2 border-black"></div>
            <div className="text-xs pt-1">* The % Daily Value (DV) tells you how much a nutrient in a serving of food contributes to a daily diet. 2,000 calories a day is used for general nutrition advice.</div>
        </div>
    )
}