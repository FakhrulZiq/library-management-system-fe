"use client";

import { BookOpen, X, Upload, Book } from "lucide-react";

interface CardProps {
  title: string;
  count: number;
  icon: React.ReactNode;
  color?: string;
}

const Card = ({ title, count, icon, color = "bg-white" }: CardProps) => (
  <div className={`p-4 shadow rounded-lg ${color} flex-1`}>
    <div className="flex items-center justify-between">
      <div>
        <h4 className="text-gray-500">{title}</h4>
        <p className="text-2xl font-bold">{count}</p>
      </div>
      {icon}
    </div>
  </div>
);

export default function SummaryCards() {
  return (
    <div className="grid grid-cols-4 gap-4">
      <Card
        title="New Books Added"
        count={250}
        icon={<BookOpen className="text-indigo-600" size={24} />}
      />
      <Card
        title="Lost Books"
        count={20}
        icon={<X className="text-red-600" size={24} />}
      />
      <Card
        title="Borrowed Books"
        count={576}
        icon={<Upload className="text-green-600" size={24} />}
      />
      <Card
        title="Available Books"
        count={6875}
        icon={<Book className="text-blue-600" size={24} />}
      />
    </div>
  );
}
