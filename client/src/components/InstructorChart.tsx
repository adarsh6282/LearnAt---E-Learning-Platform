import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  Title,
  PointElement,
} from "chart.js";
import { instructorCourseChart, instructorIncomeChart } from "../services/instructor.services";

ChartJS.register({
  CategoryScale,
  LinearScale,
  LineElement,
  BarElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
});

interface ChartProps {
  type: "course" | "income";
}

interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string;
  borderColor?: string;
  fill?: boolean;
  tension?: number;
  borderRadius?: number;
}

interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

const InstructorChart = ({ type }: ChartProps) => {
  const [chartData, setChartData] = useState<ChartData|null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        let labels: string[] = [];
        let data: number[] = [];

        if (type === "course") {
          const res = await instructorCourseChart()
          labels = res.data.map((item: {title:string,enrolledCount:number}) => item.title);
          data = res.data.map((item: {title:string,enrolledCount:number}) => item.enrolledCount);
        } else if (type === "income") {
          const res = await instructorIncomeChart()
          labels = res.data.map((item: {month:string,revenue:number}) => item.month);
          data = res.data.map((item: {month:string,revenue:number}) => item.revenue);
        }

        setChartData({
          labels,
          datasets: [
            {
              label: type === "course" ? "Enrolled Students" : "Revenue",
              data,
              backgroundColor: type === "course" ? "#0ea5e9" : "#10b981",
              borderColor: type === "income" ? "#10b981" : undefined,
              fill: type === "income",
              tension: 0.4,
              borderRadius: type === "course" ? 8 : 0,
            },
          ],
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [type]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text:
          type === "course"
            ? "Course Enrollment Statistics"
            : "Monthly Revenue",
        font: {
          size: 18,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          autoSkip: false,
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        beginAtZero: true,
        precision: 0,
      },
    },
  };

  if (loading)
    return <p className="text-center text-gray-400">Loading chart...</p>;

  return (
    <div className="w-full p-4 bg-white rounded-xl shadow-lg">
      {chartData &&
        (type === "course" ? (
          <Bar data={chartData} options={options} />
        ) : (
          <Bar data={chartData} options={options} />
        ))}
    </div>
  );
};

export default InstructorChart;
