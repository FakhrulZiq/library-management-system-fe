"use client";

import { useAuth } from "@/context/authContext";
import {
  ArrowUturnLeftIcon,
  EyeIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface BorrowedBook {
  id: string;
  borrowDate: string;
  returnDate: string;
  dueDate: string;
  remainingDay: number;
  status: string;
  book: BookDetail;
}

interface BookDetail {
  title: string;
  author: string;
}

interface BorrowedBookResponse {
  startRecord: number;
  endRecord: number;
  nextPage: number;
  total: number;
  totalPages: number;
  data: BorrowedBook[];
}

export default function BookList() {
  const [borrowedBooks, setBorrowedBooks] = useState<BorrowedBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [pendingStatuses, setPendingStatuses] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);

  const [pagination, setPagination] = useState({
    pageNum: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  });
  const router = useRouter();
  const { isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  const fetchBorrowedBooks = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/borrowedBook/student", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          search,
          statuses: selectedStatus,
          pageNum: pagination.pageNum,
          pageSize: pagination.pageSize,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch borrow books");
      }

      const data: BorrowedBookResponse = await res.json();
      setBorrowedBooks(data.data);
      setPagination((prev) => ({
        ...prev,
        total: data.total,
        totalPages: data.totalPages,
      }));
    } catch (error) {
      console.error("Error fetching borrowed books:", error);
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    fetchBorrowedBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, pagination.pageNum, pagination.pageSize, selectedStatus]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSelectedStatus(pendingStatuses);
    setPagination((prev) => ({ ...prev, pageNum: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, pageNum: newPage }));
  };

  const toggleFilterDropdown = () => setShowFilterDropdown((prev) => !prev);

  const handlePendingStatusChange = (status: string) => {
    setPendingStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  return (
    <div className="container mx-auto px-4 text-gray-700 py-8">
      <h1 className="text-2xl font-bold mb-6">Borrowed Book List</h1>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-6 w-full relative">
        <div className="flex items-center space-x-2 w-full">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Search by title or author"
            />
          </div>

          {/* Filter Button */}
          <div className="relative">
            <button
              type="button"
              onClick={toggleFilterDropdown}
              className="px-3 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-sm flex items-center"
            >
              <FunnelIcon className="w-4 h-4 mr-1" />
              Filter
            </button>

            {/* Dropdown */}
            {showFilterDropdown && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg p-3 z-10">
                <label className="flex items-center space-x-2 text-sm mb-2">
                  <input
                    type="checkbox"
                    checked={pendingStatuses.includes("Borrowed")}
                    onChange={() => handlePendingStatusChange("Borrowed")}
                  />
                  <span>Borrowed</span>
                </label>
                <label className="flex items-center space-x-2 text-sm mb-2">
                  <input
                    type="checkbox"
                    checked={pendingStatuses.includes("Losted")}
                    onChange={() => handlePendingStatusChange("Losted")}
                  />
                  <span>Losted</span>
                </label>
                <label className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={pendingStatuses.includes("Returned")}
                    onChange={() => handlePendingStatusChange("Returned")}
                  />
                  <span>Returned</span>
                </label>
              </div>
            )}
          </div>

          {/* Search Button */}
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white cursor-pointer rounded-md text-sm hover:bg-indigo-700"
          >
            Search
          </button>
        </div>
      </form>

      {/* Book List */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Borrow Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Remaining Day
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {borrowedBooks.map((borrowedBook) => (
                  <tr key={borrowedBook.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {borrowedBook.book.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {borrowedBook.book.author}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {borrowedBook.borrowDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {borrowedBook.dueDate}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm ${
                        borrowedBook.status === "Losted"
                          ? "text-red-700"
                          : borrowedBook.remainingDay < 0
                          ? "text-red-500"
                          : "text-green-700"
                      }`}
                    >
                      {borrowedBook.status === "Losted"
                        ? "Losted"
                        : borrowedBook.remainingDay === null
                        ? "Returned"
                        : borrowedBook.remainingDay < 0
                        ? `${Math.abs(borrowedBook.remainingDay)} Days Overdue`
                        : `${borrowedBook.remainingDay} Day`}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm ${
                        borrowedBook.status === "Losted"
                          ? "text-red-700"
                          : borrowedBook.remainingDay < 0
                          ? "text-red-500"
                          : "text-green-700"
                      }`}
                    >
                      {" "}
                      {borrowedBook.status}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2">
                      <button
                        onClick={() =>
                          router.push(`/borrowed-book/${borrowedBook.id}`)
                        }
                        className="relative group p-1 cursor-pointer"
                        title="View"
                      >
                        <EyeIcon className="w-5 h-5 text-blue-600" />
                        <span className="absolute left-1/2 -top-6 -translate-x-1/2 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          View
                        </span>
                      </button>

                      {borrowedBook.status === "Borrowed" && (
                        <button
                          onClick={() =>
                            router.push(`/borrowed-book/${borrowedBook.id}`)
                          }
                          className="relative group p-1 cursor-pointer"
                          title="Return"
                        >
                          <ArrowUturnLeftIcon className="w-5 h-5 text-green-600" />
                          <span className="absolute left-1/2 -top-6 -translate-x-1/2 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            Return
                          </span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            {/* Item info */}
            <div>
              <p className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">
                  {pagination.pageNum * pagination.pageSize -
                    pagination.pageSize +
                    1}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {Math.min(
                    pagination.pageNum * pagination.pageSize,
                    pagination.total
                  )}
                </span>{" "}
                of <span className="font-medium">{pagination.total}</span>{" "}
                borrowed books
              </p>
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-4">
              {/* Page Size */}
              <label className="text-sm flex items-center space-x-2">
                <span>Page Size:</span>
                <select
                  value={pagination.pageSize}
                  onChange={(e) =>
                    setPagination((prev) => ({
                      ...prev,
                      pageSize: parseInt(e.target.value, 10),
                      pageNum: 1, // reset to first page
                    }))
                  }
                  className="border rounded-md px-2 py-1 text-sm"
                >
                  {[10, 20, 30, 50, 100].map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </label>

              {/* Page Number */}
              <label className="text-sm flex items-center space-x-2">
                <span>Page:</span>
                <select
                  value={pagination.pageNum}
                  onChange={(e) =>
                    handlePageChange(parseInt(e.target.value, 10))
                  }
                  className="border rounded-md px-2 py-1 text-sm"
                >
                  {Array.from(
                    { length: pagination.totalPages },
                    (_, i) => i + 1
                  ).map((page) => (
                    <option key={page} value={page}>
                      {page}
                    </option>
                  ))}
                </select>
                <span>of {pagination.totalPages}</span>
              </label>

              {/* Prev / Next */}
              <button
                onClick={() => handlePageChange(pagination.pageNum - 1)}
                disabled={pagination.pageNum === 1}
                className="px-4 py-2 border rounded-md text-sm font-medium disabled:opacity-50"
              >
                ◀
              </button>
              <button
                onClick={() => handlePageChange(pagination.pageNum + 1)}
                disabled={pagination.pageNum === pagination.totalPages}
                className="px-4 py-2 border rounded-md text-sm font-medium disabled:opacity-50"
              >
                ▶
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
