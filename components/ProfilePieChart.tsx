import { getServerSideProps } from "@/pages/search/[id]";
import { InferGetServerSidePropsType } from "next";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ProfilePieChart({ result }: any) {

    const options = {
        plugins: {
            legend: {
                labels: {
                    color: 'rgba(255, 255, 255)',
                    font: {
                        size: 16
                    }
                }
            }
        }
    }

    const data = {
        labels: ['Fat', 'Protein', 'Carbohydrate'],
        datasets: [
            {
                label: 'Grams',
                data: [result.fat, result.protein, result.carbohydrate],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                ],
                borderWidth: 1,
            }
        ]
    }

    return (
        <div className="w-[300px]">
            <Pie data={data} options={options} />
        </div>
    )
}