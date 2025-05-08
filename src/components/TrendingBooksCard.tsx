"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface TrendingBook {
  id: string;
  title: string;
  author: string;
  borrowCount: number;
}

export default function TrendingBooksCard() {
  const [trendingBooks, setTrendingBooks] = useState<TrendingBook[]>([]);
  const token = localStorage.getItem("token");
  const router = useRouter();

  useEffect(() => {
    const fetchTrendingBooks = async () => {
      try {
        const response = await fetch(
          "http://localhost:3001/borrowedBook/trending-book",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data: TrendingBook[] = await response.json();
          setTrendingBooks(data);
        } else {
          console.error("Failed to fetch trending books");
        }
      } catch (error) {
        console.error("Error fetching trending books", error);
      }
    };

    fetchTrendingBooks();
  }, [token]);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            Trending Books
          </h2>
        </div>
      </div>

      <ul className="space-y-3">
        {trendingBooks.length > 0 ? (
          trendingBooks.map((book) => (
            <li
              key={book.id}
              onClick={() => router.push(`/book/${book.id}`)}
              className="group flex items-center cursor-pointer justify-between p-3 hover:bg-gray-50 rounded-lg transition-all duration-200 border border-gray-100 hover:border-gray-200"
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                    <span className="text-indigo-600 font-medium">
                      {book.borrowCount}
                    </span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-indigo-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <p className="font-medium text-gray-800 group-hover:text-indigo-600 transition-colors">
                    {book.title}
                  </p>
                  <p className="text-sm text-gray-500">{book.author}</p>
                </div>
              </div>
              <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full">
                {book.borrowCount}{" "}
                {book.borrowCount === 1 ? "borrow" : "borrows"}
              </span>
            </li>
          ))
        ) : (
          <p className="text-gray-500">No trending books found.</p>
        )}
      </ul>
    </div>
  );
}
