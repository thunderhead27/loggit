export interface MealPost {
    id: string
    foodId: string
    brandName?: string
    name: string
    userId: string
    createdAt: string
    category: string
    servingQty: number
    servingUnit: string
    nfCalories: number
    nfTotalFat: number
    nfSaturatedFat: number
    nfCholesterol: number
    nfSodium: number
    nfTotalCarbohydrate: number
    nfFiber: number
    nfSugar: number
    nfProtein: number
}