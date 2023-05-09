import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import moment from 'moment';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const { userId, itemId, quantity, mealOfDay } = req.body;

    const response = await axios.get(`https://trackapi.nutritionix.com/v2/search/item?nix_item_id=${itemId}`, {
        headers: {
            'x-app-id': process.env.NUTRITIONIX_ID,
            'x-app-key': process.env.NUTRITIONIX_KEY
        },
    })

    const result = response.data.foods[0];

    console.log(result)

    const newMealPost = await prisma.mealPost.create({
        data: {
            userId: userId,
            foodId: itemId,
            brandName: result.brand_name,
            name: result.food_name,
            servingQty: quantity,
            servingUnit: result.serving_unit,
            calories: result.nf_calories,
            carbohydrate: result.nf_total_carbohydrate,
            cholesterol: result.nf_cholesterol,
            fiber: result.nf_dietary_fiber,
            protein: result.nf_protein,
            saturatedFat: result.nf_saturated_fat,
            sodium: result.nf_sodium,
            sugar: result.nf_sugars,
            fat: result.nf_total_fat,
            category: mealOfDay
        }
    })

    res.status(201).send({
        message: 'Created meal post!',
        newMealPost
    })
}