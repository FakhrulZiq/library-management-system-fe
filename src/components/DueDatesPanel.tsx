"use client";

import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface BorrowedBookDueDate {
  id: string;
  title: string;
  author: string;
  dueDate: string;
  borrowerName: string;
  remainingDay: number;
}

export default function DueDatesPanel() {
  const [dueDates, setDueDates] = useState<BorrowedBookDueDate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetchDueDates();
  }, []);

  const fetchDueDates = async () => {
    const token = localStorage.getItem("token");

    try {
      setIsLoading(true);
      let response: Response;
      if (role !== "student") {
        response = await fetch(
          `http://localhost:3001/borrowedBook/incoming-due`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        response = await fetch(
          `http://localhost:3001/borrowedBook/incoming-due-student`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
      const data: BorrowedBookDueDate[] = await response.json();
      setDueDates(data);
    } catch (error) {
      console.error("Error fetching due dates", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRemainingDaysStyle = (remainingDay: number) => {
    if (remainingDay < 0) return "bg-red-100 text-red-800";
    if (remainingDay === 0) return "bg-amber-100 text-amber-800";
    if (remainingDay > 1) return "bg-blue-100 text-blue-800";
    return "bg-green-100 text-green-800";
  };

  return (
    <div
      className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden h-full flex flex-col"
      style={{ maxHeight: "300px" }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            Incoming Due Dates
          </h2>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse flex justify-between items-center py-3"
              >
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        ) : dueDates.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {dueDates.map((item) => (
              <li
                onClick={() => router.push(`/borrowed-book/${item.id}`)}
                key={item.id}
                className="hover:bg-gray-50 cursor-pointer transition-colors duration-150"
              >
                <div className="px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {item.title}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {item.author}
                      </p>
                    </div>
                    <div className="flex flex-col items-end ml-2">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${getRemainingDaysStyle(
                          item.remainingDay
                        )}`}
                      >
                        {item.remainingDay}
                      </span>
                      <span className="text-xs text-gray-500 mt-1">
                        {item.dueDate}
                      </span>
                    </div>
                  </div>
                  {item.borrowerName && (
                    <div className="mt-1 flex items-center">
                      <svg
                        className="w-3 h-3 text-gray-400 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <span className="text-xs text-gray-500">
                        {item.borrowerName}
                      </span>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-6 text-center flex flex-col items-center justify-center h-full">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No due books found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              All books are returned on time
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
