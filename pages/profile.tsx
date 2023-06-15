import Layout from "@/components/Layout";
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { authOptions } from "./api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import { useSession } from "next-auth/react";
import axios from "axios";
import prisma from "@/lib/prisma";
import moment from "moment";
import ProfilePieChart from "@/components/ProfilePieChart";
import { use, useEffect, useState } from "react";
import styled from "styled-components";
import MacroPieChart from "@/components/MacroPieChart";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/router";
import Search from "@/components/Search";
import TodaysConsumptionPieChart from "@/components/TodayConsumptionPieChart";
import Datepicker from "react-tailwindcss-datepicker";

interface Props {
  readonly open: boolean;
}

const Modal = styled.div<Props>`
  position: absolute;
  margin: auto auto auto auto;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  border-radius: 20px;
  z-index: 20;

  ${({ open }) => (open ? `visibility: visible` : `visibility: hidden`)};
`;

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
`;

const SetOwn = styled.div<Props>`
  ${({ open }) => (open ? `display: flex` : `display: none`)};
`;

const Select = ({ label, value, options, onChange }: any) => {
  return (
    <label>
      {label}
      <select value={value} onChange={onChange}>
        {options.map((option: any) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
};

interface FormValues1 {
  age: number;
  weight: number;
  foot: number;
  inches: number;
}

interface FormValues2 {
  calories: number;
  fat: number;
  fatPercentage: number;
  carbohydrate: number;
  carbPercentage: number;
  protein: number;
  proteinPercentage: number;
}

let todaysDate: any;

export default function ProfileScreen({
  meals,
  dailyMacro,
  previousDayMacro,
  userId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [openMacro, setOpenMacro] = useState(false);
  const [openMeal, setOpenMeal] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [deleteId, setDeleteId] = useState("");

  const [activity, setActivity] = useState("1.2");
  const [mealOfDay, setMealOfDay] = useState("breakfast");
  const [gender, setGender] = useState("male");

  const [setOwn, setSetOwn] = useState("percentage");

  const [calories, setCalories] = useState(2000);
  const [fat, setFat] = useState(65);
  const [carbohydrate, setCarbohydrate] = useState(300);
  const [protein, setProtein] = useState(50);
  const [fatPercentage, setFatPercentage] = useState(30);
  const [carbPercentage, setCarbPercentage] = useState(60);
  const [proteinPercentage, setProteinPercentage] = useState(10);

  const [date, setDate] = useState({
    startDate: null,
    endDate: null,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues1>();

  const {
    control,
    register: register2,
    handleSubmit: handleSubmit2,
    formState: { errors: errors2 },
  } = useForm<FormValues2>();

  const router = useRouter();
  const { data: session } = useSession();

  const { query } = router;
  const itemId = query.item;

  if (query.date) {
    const currentDate = query.date;
    todaysDate = currentDate + "T23:59:59.000Z";
  } else {
    todaysDate = new Date().toISOString();
  }

  const parsedDate = new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(todaysDate));

  const quantity = Number(query.quantity);

  useEffect(() => {
    if (itemId) {
      setOpenMeal(true);
    }
  }, [itemId]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setActivity(event.target.value);
  };

  const handleMealChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setMealOfDay(event.target.value);
  };

  const onGenderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGender(event.target.value);
  };

  const onSetOwnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSetOwn(event.target.value);
  };

  const onCaloriesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCalories(parseInt(event.target.value));
  };

  const onFatChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFat(parseInt(event.target.value));
  };

  const onFatPercentageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFatPercentage(parseInt(event.target.value));

    const calcFat = Math.round((parseInt(event.target.value) * calories) / 900);
    setFat(calcFat);
  };

  const onCarbohydrateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCarbohydrate(parseInt(event.target.value));
  };

  const onCarbPercentageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCarbPercentage(parseInt(event.target.value));

    const calcCarb = Math.round(
      (parseInt(event.target.value) * calories) / 400
    );
    setCarbohydrate(calcCarb);
  };

  const onProteinChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProtein(parseInt(event.target.value));
  };

  const onProteinPercentageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setProteinPercentage(parseInt(event.target.value));

    const calcProtein = Math.round(
      (parseInt(event.target.value) * calories) / 400
    );
    setProtein(calcProtein);
  };

  const onDateChange = (newValue: any) => {
    setDate(newValue);
    router.push(`/profile?date=${newValue.startDate}`);
    setDate({
      startDate: null,
      endDate: null,
    });
  };

  const onCalcSubmit: SubmitHandler<FormValues1> = (data) => {
    let tdee;

    console.log(data);
    if (gender === "male") {
      tdee = Math.round(
        (10 * (Number(data.weight) * 0.453592) +
          6.25 * 2.54 * (Number(data.foot) * 12 + Number(data.inches)) -
          5 * Number(data.age) +
          5) *
          Number(activity)
      );
      setCalories(tdee);
    } else {
      tdee = Math.round(
        10 * Number(data.weight) * 0.453592 +
          (6.25 * 2.54 * (Number(data.foot) * 12 + Number(data.inches)) -
            5 * Number(data.age) -
            161) *
            Number(activity)
      );
      setCalories(tdee);
    }

    console.log(tdee);
  };

  const onMacroSubmit: SubmitHandler<FormValues2> = async () => {
    await axios.put("/api/macro", {
      calories,
      fat,
      carbohydrate,
      protein,
      id: dailyMacro.id,
    });

    router.reload();
  };

  const onMealSubmit = async () => {
    if (query.date) {
      todaysDate = new Date(query.date + "T23:59:59.000Z");
      await axios.post("/api/mealpost", {
        userId,
        itemId,
        quantity,
        mealOfDay,
        todaysDate,
      });
      router.push(`/profile?date=${query.date}`);
    } else {
      await axios.post("/api/mealpost", {
        userId,
        itemId,
        quantity,
        mealOfDay,
        todaysDate,
      });
      router.push("/profile");
    }

    setOpenMeal(false);
  };

  const onDeleteSubmit = async (id: string) => {
    await axios.delete(`/api/deleteMeal/${id}`);
    setOpenDelete(false);
    router.reload();
  };

  const result = [fat, protein, carbohydrate];

  const activityLevel = [
    { label: "Sedentary", value: "1.2" },
    { label: "Lightly active", value: "1.375" },
    { label: "Moderately active", value: "1.55" },
    { label: "Very active", value: "1.725" },
    { label: "Extra active", value: "1.9" },
  ];

  const mealOption = [
    { label: "Breakfast", value: "breakfast" },
    { label: "Lunch", value: "lunch" },
    { label: "Dinner", value: "dinner" },
    { label: "Snack", value: "snack" },
  ];

  useEffect(() => {
    const addMacro = async () => {
      const date = new Date(todaysDate).toISOString();

      if (!previousDayMacro) {
        await axios.post("/api/macro", {
          calories: 2000,
          fat: 75,
          carbohydrate: 300,
          protein: 30,
          userId: userId,
          date,
        });
      } else {
        await axios.post("/api/macro", {
          calories: previousDayMacro.calories,
          fat: previousDayMacro.fat,
          carbohydrate: previousDayMacro.carbohydrate,
          protein: previousDayMacro.protein,
          userId: userId,
          date,
        });
      }

      router.reload();
    };

    if (!dailyMacro) {
      addMacro();
    }
  }, [dailyMacro, previousDayMacro]);

  const breakfastCat = meals.filter(
    (meal: any) => meal.category === "breakfast"
  );
  const lunchCat = meals.filter((meal: any) => meal.category === "lunch");
  const dinnerCat = meals.filter((meal: any) => meal.category === "dinner");
  const snackCat = meals.filter((meal: any) => meal.category === "snack");

  const totalCalories = meals.reduce(
    (acc: any, cur: any) => acc + cur.calories,
    0
  );
  const totalFat = meals.reduce((acc: any, cur: any) => acc + cur.fat, 0);
  const totalProtein = meals.reduce(
    (acc: any, cur: any) => acc + cur.protein,
    0
  );
  const totalCarbohydrate = meals.reduce(
    (acc: any, cur: any) => acc + cur.carbohydrate,
    0
  );
  const totalSugar = meals.reduce((acc: any, cur: any) => acc + cur.sugar, 0);
  const totalCholesterol = meals.reduce(
    (acc: any, cur: any) => acc + cur.cholesterol,
    0
  );

  const totalMacro = [totalFat, totalProtein, totalCarbohydrate];

  return (
    <div className="flex flex-col font-lato text-white xl:h-screen">
      {session?.user ? (
        <Layout>
          <div className="pt-12">
            <Search />
          </div>
          <div className="flex flex-row items-center gap-x-8">
            <h1 className="my-12 text-3xl text-white font-bold">
              Profile for {parsedDate}
            </h1>
            <div>
              <Datepicker
                asSingle={true}
                value={date}
                onChange={onDateChange}
                useRange={false}
                placeholder="MM-DD-YYYY"
              />
            </div>
          </div>

          <div className="flex flex-col gap-y-8 xl:flex-row xl:w-[1000px] justify-between">
            {dailyMacro === null ? null : (
              <div className="flex flex-col items-center">
                <h1 className="text-lg">Diet Macro</h1>
                <ProfilePieChart result={dailyMacro} />
                <button
                  className="my-12 border-2 border-white px-4 py-2"
                  onClick={() => setOpenMacro(true)}
                >
                  Change Macro
                </button>
              </div>
            )}
            {meals.length === 0 ? null : (
              <div className="flex flex-col items-center">
                <h1 className="text-lg">Today&apos;s Macro</h1>
                <TodaysConsumptionPieChart result={totalMacro} />
              </div>
            )}
            <div className="flex flex-col border-2 border-white p-4">
              <h1 className="text-lg mb-4">Total Consumption</h1>
              <h2>Calories: {totalCalories}</h2>
              <h2>Fat: {totalFat} g</h2>
              <h2>Carbohydrate: {totalCarbohydrate} g</h2>
              <h2>Sugar: {totalSugar} g</h2>
              <h2>Protein: {totalProtein} g</h2>
              <h2>Cholesterol: {totalCholesterol} mg</h2>
            </div>
          </div>
          <Modal
            open={openMacro}
            className="bg-gray-200 w-[300px] h-[300px] xl:w-[1000px] xl:h-[1000px]"
          >
            <div className="flex flex-col items-center">
              <div className="flex flex-col xl:flex-row gap-x-12 text-[#323050]">
                <div className="py-12">
                  <h1 className="text-3xl font-bold">Calculate your macro</h1>
                  <div className="flex flex-row items-center gap-x-4 pt-12">
                    <h2>Gender</h2>
                    <div className="flex flex-row gap-x-4">
                      <div>
                        <label className="mr-2">Male</label>
                        <input
                          type="radio"
                          value="male"
                          checked={gender === "male"}
                          onChange={onGenderChange}
                        />
                      </div>
                      <div>
                        <label className="mr-2">Female</label>
                        <input
                          type="radio"
                          value="female"
                          checked={gender === "female"}
                          onChange={onGenderChange}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row items-center gap-x-4 pt-12 mb-4">
                    <label>Age</label>
                    <Input
                      className="w-12"
                      type="number"
                      {...register("age", {
                        valueAsNumber: true,
                        required: true,
                      })}
                    />
                    <span>years</span>
                  </div>
                  {errors.age && (
                    <div className="text-xs absolute">Age required</div>
                  )}
                  <div className="flex flex-row items-center gap-x-4 pt-4 mb-4">
                    <label>Weight</label>
                    <Input
                      className="w-24"
                      type="number"
                      {...register("weight", {
                        valueAsNumber: true,
                        required: true,
                      })}
                    />
                    <span>lbs</span>
                  </div>
                  {errors.weight && (
                    <div className="text-xs absolute">Weight required</div>
                  )}
                  <div className="flex flex-row items-center gap-x-4 pt-4 mb-4">
                    <label>Height</label>
                    <Input
                      className="w-12"
                      type="number"
                      {...register("foot", {
                        valueAsNumber: true,
                        required: true,
                      })}
                    />
                    <span>foot</span>
                    <Input
                      className="w-12"
                      type="number"
                      {...register("inches", {
                        valueAsNumber: true,
                        required: true,
                      })}
                    />
                    <span>inches</span>
                  </div>
                  <div className="flex flex-row gap-x-4">
                    {errors.foot && (
                      <div className="text-xs">Foot required</div>
                    )}
                    {errors.inches && (
                      <div className="text-xs">Inches required</div>
                    )}
                  </div>

                  <div className="flex flex-row items-center gap-x-4 pt-4">
                    <label>Activity level</label>
                    <Select
                      className="text-xl"
                      options={activityLevel}
                      value={activity}
                      onChange={handleChange}
                    />
                  </div>
                  <button
                    className="bg-[#45214A] text-white py-2 px-4 rounded-md mt-4"
                    onClick={handleSubmit(onCalcSubmit)}
                  >
                    Calculate
                  </button>
                </div>
                <span className="self-center text-xl">or</span>
                <div className="py-12">
                  <h1 className="text-3xl font-bold">Set your own</h1>
                  <div className="flex flex-col items-center gap-y-4 pt-12">
                    <div className="flex flex-row gap-x-4 pb-8">
                      <div>
                        <label className="mr-2">Percentage</label>
                        <input
                          type="radio"
                          value="percentage"
                          checked={setOwn === "percentage"}
                          onChange={onSetOwnChange}
                        />
                      </div>
                      <div>
                        <label className="mr-2">Grams</label>
                        <input
                          type="radio"
                          value="grams"
                          checked={setOwn === "grams"}
                          onChange={onSetOwnChange}
                        />
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
                          <Input
                            {...field}
                            {...register2("calories", {
                              valueAsNumber: true,
                            })}
                            type="number"
                            className="w-20"
                            value={calories}
                            onChange={onCaloriesChange}
                          />
                        )}
                      />
                    </div>
                    {errors2.calories && (
                      <div className="text-xs">Calories required</div>
                    )}
                    <SetOwn
                      className="flex flex-col gap-y-4"
                      open={setOwn === "percentage"}
                    >
                      <div className="flex flex-row gap-x-4 items-center">
                        <label>Fat</label>
                        <Controller
                          name="fatPercentage"
                          rules={{
                            required: { value: true, message: "Required" },
                          }}
                          control={control}
                          render={({
                            field: { value, onChange, ...field },
                          }) => (
                            <Input
                              {...field}
                              {...register2("fatPercentage", {
                                valueAsNumber: true,
                              })}
                              type="number"
                              className="w-12"
                              value={fatPercentage}
                              onChange={onFatPercentageChange}
                            />
                          )}
                        />
                        <span>%</span>
                      </div>
                      {errors2.fatPercentage && (
                        <div className="text-xs">Fat percentage required</div>
                      )}
                      <div className="flex flex-row gap-x-4 items-center">
                        <label>Carbohydrate</label>
                        <Controller
                          name="carbPercentage"
                          rules={{
                            required: { value: true, message: "Required" },
                          }}
                          control={control}
                          render={({
                            field: { value, onChange, ...field },
                          }) => (
                            <Input
                              {...field}
                              {...register2("carbPercentage", {
                                valueAsNumber: true,
                              })}
                              type="number"
                              className="w-12"
                              value={carbPercentage}
                              onChange={onCarbPercentageChange}
                            />
                          )}
                        />
                        <span>%</span>
                      </div>
                      {errors2.carbPercentage && (
                        <div className="text-xs">Carb percentage required</div>
                      )}
                      <div className="flex flex-row gap-x-4 items-center">
                        <label>Protein</label>
                        <Controller
                          name="proteinPercentage"
                          rules={{
                            required: { value: true, message: "Required" },
                          }}
                          control={control}
                          render={({
                            field: { value, onChange, ...field },
                          }) => (
                            <Input
                              {...field}
                              {...register2("proteinPercentage", {
                                valueAsNumber: true,
                              })}
                              type="number"
                              className="w-12"
                              value={proteinPercentage}
                              onChange={onProteinPercentageChange}
                            />
                          )}
                        />
                        <span>%</span>
                      </div>
                      {errors2.proteinPercentage && (
                        <div className="text-xs">
                          Protein percentage required
                        </div>
                      )}
                    </SetOwn>
                    <SetOwn
                      className="flex flex-col gap-y-4"
                      open={setOwn === "grams"}
                    >
                      <div className="flex flex-row gap-x-4 items-center">
                        <label>Fat</label>
                        <Controller
                          name="fat"
                          rules={{
                            required: { value: true, message: "Required" },
                          }}
                          control={control}
                          render={({
                            field: { value, onChange, ...field },
                          }) => (
                            <Input
                              {...field}
                              {...register2("fat", { valueAsNumber: true })}
                              type="number"
                              className="w-12"
                              value={fat}
                              onChange={onFatChange}
                            />
                          )}
                        />
                        <span>g</span>
                      </div>
                      {errors2.fat && (
                        <div className="text-xs">Fat required</div>
                      )}
                      <div className="flex flex-row gap-x-4 items-center">
                        <label>Carbohydrate</label>
                        <Controller
                          name="carbohydrate"
                          rules={{
                            required: { value: true, message: "Required" },
                          }}
                          control={control}
                          render={({
                            field: { value, onChange, ...field },
                          }) => (
                            <Input
                              {...field}
                              {...register2("carbohydrate", {
                                valueAsNumber: true,
                              })}
                              type="number"
                              className="w-12"
                              value={carbohydrate}
                              onChange={onCarbohydrateChange}
                            />
                          )}
                        />
                        <span>g</span>
                      </div>
                      {errors2.carbohydrate && (
                        <div className="text-xs">Carbohydrate required</div>
                      )}
                      <div className="flex flex-row gap-x-4 items-center">
                        <label>Protein</label>
                        <Controller
                          name="protein"
                          rules={{
                            required: { value: true, message: "Required" },
                          }}
                          control={control}
                          render={({
                            field: { value, onChange, ...field },
                          }) => (
                            <Input
                              {...field}
                              {...register2("protein", {
                                valueAsNumber: true,
                              })}
                              type="number"
                              className="w-12"
                              value={protein}
                              onChange={onProteinChange}
                            />
                          )}
                        />
                        <span>g</span>
                      </div>
                      {errors2.protein && (
                        <div className="text-xs">Protein required</div>
                      )}
                    </SetOwn>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center text-[#323050] text-3xl font-bold">
                <h1>Projected Macro</h1>
                <MacroPieChart result={result} />
              </div>
              <div className="flex flex-row absolute bottom-12 right-12 gap-x-12 self-end">
                <button
                  className="bg-[#5D8A66] px-4 py-2 rounded-md font-bold"
                  onClick={handleSubmit2(onMacroSubmit)}
                >
                  Set
                </button>
                <button
                  className="bg-[#45214A] px-4 py-2 rounded-md font-bold"
                  onClick={() => setOpenMacro(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </Modal>
          <Modal
            open={openMeal}
            className="flex flex-col items-center w-[300px] h-[300px] bg-white text-[#323050]"
          >
            <h1 className="py-8 text-2xl">Add to</h1>
            <Select
              className="text-3xl"
              options={mealOption}
              value={mealOfDay}
              onChange={handleMealChange}
            />
            <button
              className="bg-[#45214A] text-white mt-16 py-2 px-4 rounded-md"
              onClick={onMealSubmit}
            >
              Ok
            </button>
          </Modal>
          <div className="flex flex-col py-12">
            {meals ? (
              <div className="flex flex-col gap-y-4 xl:flex-row gap-x-96">
                <div className="flex flex-col gap-y-4 items-center">
                  <div className="flex flex-col items-center">
                    <h1 className="text-xl border-b-2 border-white mb-2">
                      Breakfast
                    </h1>
                    <div className="mb-4">
                      {breakfastCat.map((item: any) => (
                        <div
                          className="flex flex-row mb-2 items-center"
                          key={item.id}
                        >
                          <div className="w-[300px] xl:w-[800px]">
                            {item.servingQty === 1 ? "1" : item.servingQty}{" "}
                            <span className="underline">
                              {item.name} ({item.brandName})
                            </span>{" "}
                            {item.calories} calories, {item.fat} g fat,{" "}
                            {item.protein} g protein, {item.carbohydrate} g
                            carbohydrate, {item.sugar} g sugar,{" "}
                            {item.cholesterol} mg cholesterol
                          </div>
                          <div
                            className="cursor-pointer"
                            onClick={() => {
                              setOpenDelete(true);
                              setDeleteId(item.id);
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-6 h-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                              />
                            </svg>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <h1 className="text-xl border-b-2 border-white mb-2">
                      Lunch
                    </h1>
                    <div className="mb-4">
                      {lunchCat.map((item: any) => (
                        <div
                          className="flex flex-row mb-2 items-center"
                          key={item.id}
                        >
                          <div className="w-[300px] xl:w-[800px]">
                            {item.servingQty === 1 ? "1" : item.servingQty}{" "}
                            <span className="underline">
                              {item.name} ({item.brandName})
                            </span>{" "}
                            {item.calories} calories, {item.fat} g fat,{" "}
                            {item.protein} g protein, {item.carbohydrate} g
                            carbohydrate, {item.sugar} g sugar,{" "}
                            {item.cholesterol} mg cholesterol
                          </div>
                          <div
                            className="cursor-pointer"
                            onClick={() => {
                              setOpenDelete(true);
                              setDeleteId(item.id);
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-6 h-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                              />
                            </svg>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <h1 className="text-xl border-b-2 border-white mb-2">
                      Dinner
                    </h1>
                    <div className="mb-4">
                      {dinnerCat.map((item: any) => (
                        <div
                          className="flex flex-row mb-2 items-center"
                          key={item.id}
                        >
                          <div className="w-[300px] xl:w-[800px]">
                            {item.servingQty === 1 ? "1" : item.servingQty}{" "}
                            <span className="underline">
                              {item.name} ({item.brandName})
                            </span>{" "}
                            {item.calories} calories, {item.fat} g fat,{" "}
                            {item.protein} g protein, {item.carbohydrate} g
                            carbohydrate, {item.sugar} g sugar,{" "}
                            {item.cholesterol} mg cholesterol
                          </div>
                          <div
                            className="cursor-pointer"
                            onClick={() => {
                              setOpenDelete(true);
                              setDeleteId(item.id);
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-6 h-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                              />
                            </svg>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <h1 className="text-xl border-b-2 border-white mb-2">
                      Snacks
                    </h1>
                    <div className="mb-4">
                      {snackCat.map((item: any) => (
                        <div
                          className="flex flex-row mb-2 items-center"
                          key={item.id}
                        >
                          <div className="w-[300px] xl:w-[800px]">
                            {item.servingQty === 1 ? "1" : item.servingQty}{" "}
                            <span className="underline">
                              {item.name} ({item.brandName})
                            </span>{" "}
                            {item.calories} calories, {item.fat} g fat,{" "}
                            {item.protein} g protein, {item.carbohydrate} g
                            carbohydrate, {item.sugar} g sugar,{" "}
                            {item.cholesterol} mg cholesterol
                          </div>
                          <div
                            className="cursor-pointer"
                            onClick={() => {
                              setOpenDelete(true);
                              setDeleteId(item.id);
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-6 h-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                              />
                            </svg>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-white font-bold">
                <p>Your log is empty. Fill it with something!</p>
              </div>
            )}
          </div>
          <Modal
            className="w-[300px] h-[200px] bg-white text-[#323050]"
            open={openDelete}
          >
            <div className="flex flex-col items-center gap-y-4">
              <h1 className="pt-8">Do you wish to delete this item?</h1>
              <div className="flex flex-row gap-x-8">
                <button
                  className="bg-[#5D8A66] text-white mt-16 py-2 px-4 rounded-md"
                  onClick={() => onDeleteSubmit(deleteId)}
                >
                  Yes
                </button>
                <button
                  className="bg-[#45214A] text-white mt-16 py-2 px-4 rounded-md"
                  onClick={() => setOpenDelete(false)}
                >
                  No
                </button>
              </div>
            </div>
          </Modal>
        </Layout>
      ) : (
        <Layout>Access Denied</Layout>
      )}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (context.query.date) {
    const currentDate = context.query.date;
    todaysDate = new Date(currentDate + "T23:59:59.000Z");
  } else {
    todaysDate = new Date().toISOString();
  }

  console.log(todaysDate);

  const yesterdaysDate = moment(todaysDate).subtract(1, "d").toISOString();

  const meals = await prisma.mealPost.findMany({
    where: {
      createdAt: {
        lte: todaysDate,
        gt: yesterdaysDate,
      },
      //@ts-ignore
      userId: session?.user.id,
    },
  });

  //@ts-ignore
  const dailyMacro = await prisma.macro.findFirst({
    where: {
      createdAt: {
        lte: todaysDate,
        gt: yesterdaysDate,
      },
      userId: session?.user.id,
    },
  });

  //@ts-ignore
  const previousDayMacro = await prisma.macro.findFirst({
    where: {
      createdAt: {
        lte: yesterdaysDate,
      },
      userId: session?.user.id,
    },
  });

  return {
    props: {
      meals: JSON.parse(JSON.stringify(meals)),
      dailyMacro: JSON.parse(JSON.stringify(dailyMacro)),
      previousDayMacro: JSON.parse(JSON.stringify(previousDayMacro)),
      userId: session ? session?.user.id : null,
    },
  };
};

ProfileScreen.auth = true;
