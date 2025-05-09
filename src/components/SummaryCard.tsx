"use client";

import { useAuth } from "@/context/authContext";
import { BookOpenCheck, BookX, Library, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface CardProps {
  title: string;
  count: string;
  icon: React.ReactNode;
  color?: string;
}

interface Dashboard {
  borrowedCount: number;
  lostedCount: number;
  totalFine: number;
  totalAvailableBook: number;
}

const Card = ({ title, count, icon, color = "bg-white" }: CardProps) => (
  <div className={`p-4 shadow-lg rounded-lg ${color} flex-1`}>
    <div className="flex items-center justify-between">
      <div>
        <h4 className="text-gray-500">{title}</h4>
        <p className="text-2xl font-bold text-gray-500">{count}</p>
      </div>
      {icon}
    </div>
  </div>
);

export default function SummaryCards() {
  const [dashboardData, setDashboardData] = useState<Dashboard>();
  const [qouta, setQouta] = useState<number>(0);

  const { role } = useAuth();

  const fethDashboard = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        "http://localhost:3001/borrowedBook/dashboard",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errData = await response.json();
        toast.error(errData.message || "Failed to get dashboard data");
        return;
      }

      const data: Dashboard = await response.json();
      setDashboardData(data);

      if (role === "student") {
        const availableQuota = 5 - (data.borrowedCount + data.lostedCount);
        setQouta(availableQuota);
      }
    } catch (error) {
      console.warn(error);
      toast.error("An error occurred during fetch dashboard data");
    }
  };

  useEffect(() => {
    fethDashboard();
  }, []);

  return (
    <div className="grid grid-cols-4 gap-4">
      <Card
        title={role !== "student" ? "Total Fine" : "Fine"}
        count={`RM ${((dashboardData?.totalFine ?? 0) / 100).toFixed(2)}`}
        icon={<Wallet className="text-indigo-600" size={28} />}
      />
      <Card
        title={role !== "student" ? "Total Lost Books" : "Lost Books"}
        count={`${dashboardData?.lostedCount ?? 0}`}
        icon={<BookX className="text-red-600" size={28} />}
      />
      <Card
        title={role !== "student" ? "Total Borrowed Books" : "Borrowed Books"}
        count={`${dashboardData?.borrowedCount ?? 0}`}
        icon={<BookOpenCheck className="text-green-600" size={28} />}
      />
      <Card
        title={role !== "student" ? "Available Books" : "Available Quota"}
        count={`${
          role === "student" ? qouta : dashboardData?.totalAvailableBook ?? 0
        }`}
        icon={<Library className="text-blue-600" size={28} />}
      />
    </div>
  );
}
