"use client";

import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface RecentsActivityData {
  id: string;
  borrowDate: string;
  title: string;
  author: string;
  borrowerName: string;
}

export default function RecentsActivity() {
  const [recentActivities, setRecentActivities] = useState<
    RecentsActivityData[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem("token");
  const { role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchRecentActivities = async () => {
      try {
        setIsLoading(true);

        let response: Response;
        if (role !== "student") {
          response = await fetch(
            "http://localhost:3001/borrowedBook/recent-activity",
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        } else {
          response = await fetch(
            "http://localhost:3001/borrowedBook/recent-activity-student",
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        }

        if (response.ok) {
          const data: RecentsActivityData[] = await response.json();
          setRecentActivities(data);
        } else {
          console.error("Failed to fetch recent activity");
        }
      } catch (error) {
        console.error("Error fetching recent activities", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentActivities();
  }, [token]);

  return (
    <div
      className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
      style={{ maxHeight: "500px" }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            Recent Activities
          </h2>
        </div>
      </div>

      {/* Content */}
      <div className="divide-y divide-gray-100">
        {isLoading ? (
          <div className="p-6 space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse flex space-x-4">
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : recentActivities.length > 0 ? (
          recentActivities.map((activity) => (
            <div
              onClick={() => router.push(`/borrowed-book/${activity.id}`)}
              key={activity.id}
              className="px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
            >
              <div className="flex items-start space-x-3">
                <div className="bg-indigo-100 text-indigo-600 p-2 rounded-lg flex-shrink-0">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-800 truncate">
                    {activity.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {activity.author}
                  </p>
                  <div className="flex items-center mt-2 space-x-2">
                    <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                      Borrowed by: {activity.borrowerName}
                    </span>
                    {activity.borrowDate && (
                      <span className="text-xs bg-gray-50 text-gray-600 px-2 py-0.5 rounded-full">
                        {new Date(activity.borrowDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-6 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No recent activities
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              All borrowing activities will appear here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
