"use client";

import { Cell, Pie, PieChart, Tooltip } from "recharts";

const data = [
  { name: "New", value: 44.4, color: "#4f46e5" },
  { name: "Issued", value: 33.3, color: "#10b981" },
  { name: "Lost", value: 11.1, color: "#f87171" },
  { name: "Returned", value: 11.1, color: "#facc15" },
];

export default function TotalBooksReport() {
  return (
    <div
      className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden h-full flex flex-col"
      style={{ maxHeight: "300px" }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            Total Books Report
          </h2>
        </div>
      </div>

      {/* Content - Split Layout */}
      <div className="flex-1 flex flex-col md:flex-row pr-6 gap-4">
        {/* Chart - Left Side */}
        <div className="w-full md:w-1/2 flex items-center justify-center">
          <PieChart width={240} height={240}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              dataKey="value"
              outerRadius={80}
              innerRadius={50}
              paddingAngle={2}
              label={({ name, percent }) => `${(percent * 100).toFixed(1)}%`}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  stroke="#fff"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [`${value}%`, "Percentage"]}
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            />
          </PieChart>
        </div>

        <div className="w-full md:w-1/2 flex flex-col justify-center">
          <div className="space-y-3">
            <h3 className="font-medium text-gray-800">Distribution</h3>
            {data.map((item, index) => (
              <div key={index} className="flex items-center">
                <span
                  className="w-4 h-4 rounded-full mr-3"
                  style={{ backgroundColor: item.color }}
                ></span>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-700">{item.name}</span>
                    <span className="text-sm font-medium text-gray-900">
                      {item.value}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1">
                    <div
                      className="h-1.5 rounded-full"
                      style={{
                        width: `${item.value}%`,
                        backgroundColor: item.color,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
