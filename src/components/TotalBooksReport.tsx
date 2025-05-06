"use client";

import { PieChart, Pie, Cell } from "recharts";

const data = [
  { name: "New", value: 44.4, color: "#4f46e5" },
  { name: "Issued", value: 33.3, color: "#10b981" },
  { name: "Lost", value: 11.1, color: "#f87171" },
  { name: "Returned", value: 11.1, color: "#facc15" },
];

export default function TotalBooksReport() {
  return (
    <div className="p-4 shadow rounded bg-white">
      <h3 className="mb-4 font-semibold">Total Books Report</h3>
      <PieChart width={300} height={200}>
        <Pie
          data={data}
          dataKey="value"
          outerRadius={80}
          innerRadius={50}
          label
        >
          {data.map((entry, index) => (
            <Cell key={index} fill={entry.color} />
          ))}
        </Pie>
      </PieChart>
    </div>
  );
}
