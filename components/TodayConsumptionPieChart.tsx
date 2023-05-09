import { getServerSideProps } from "@/pages/search/[id]";
import { InferGetServerSidePropsType } from "next";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function TodaysConsumptionPieChart({ result }: any) {

    const options = {
        plugins: {
            legend: {
                labels: {
                    color: 'white',
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
                data: [result[0], result[1], result[2]],
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