"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  EyeIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "@/context/authContext";
import { toast, ToastContainer } from "react-toastify";

interface Student {
  id: string;
  email: string;
  role: string;
  name: string;
  matricOrStaffNo: number;
  status: string;
}

interface StudentResponse {
  startRecord: number;
  endRecord: number;
  nextPage: number;
  total: number;
  totalPages: number;
  data: Student[];
}

export default function StudentList() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({
    pageNum: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  });
  const router = useRouter();
  const { role, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/user/listUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          search,
          roles: ["student"],
          pageNum: pagination.pageNum,
          pageSize: pagination.pageSize,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        console.info('🚀 ~ fetchBooks ~ errData:', errData)
        toast.error(errData.message || "Failed to fetch students");
      }

      const data: StudentResponse = await res.json();
      setStudents(data.data);
      setPagination((prev) => ({
        ...prev,
        total: data.total,
        totalPages: data.totalPages,
      }));
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    fetchBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.pageNum, pagination.pageSize]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, pageNum: 1 }));
    fetchBooks();
  };

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, pageNum: newPage }));
  };

  return (
    <div className="container mx-auto px-4 text-gray-700 py-8">
      <h1 className="text-2xl font-bold mb-6">Student List</h1>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-6 w-full">
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
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Matric No
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
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {student.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.role}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.matricOrStaffNo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.status}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2">
                      <button
                        onClick={() => router.push(`/user/${student.id}`)}
                        className="relative group p-1 cursor-pointer"
                        title="View"
                      >
                        <EyeIcon className="w-5 h-5 text-blue-600" />
                        <span className="absolute left-1/2 -top-6 -translate-x-1/2 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          View
                        </span>
                      </button>
                      {role === "admin" && (
                        <>
                          <button
                            onClick={() =>
                              router.push(`/user/update/${student.id}`)
                            }
                            className="relative group p-1"
                            title="Update"
                          >
                            <PencilSquareIcon className="w-5 h-5 text-yellow-600" />
                            <span className="absolute left-1/2 -top-6 -translate-x-1/2 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                              Update
                            </span>
                          </button>
                          <button
                            onClick={() => handleDelete(student.id)}
                            className="relative group p-1"
                            title="Delete"
                          >
                            <TrashIcon className="w-5 h-5 text-red-600" />
                            <span className="absolute left-1/2 -top-6 -translate-x-1/2 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                              Delete
                            </span>
                          </button>
                        </>
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
                Students
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
      <ToastContainer position="top-right" />
    </div>
  );
}
