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
import { ConfirmationModal } from "@/components/ConfirmationMessageModal";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify/unstyled";

interface Book {
  id: string;
  bookTitle: string;
  bookAuthor: string;
  published_year: string;
  quantity: number;
  barcodeNo: string;
}

interface BookResponse {
  startRecord: number;
  endRecord: number;
  nextPage: number;
  total: number;
  totalPages: number;
  data: Book[];
  message?: string;
}

export default function BookList() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({
    pageNum: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const router = useRouter();
  const { role, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/book/listBook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          search,
          pageNum: pagination.pageNum,
          pageSize: pagination.pageSize,
        }),
      });
      const data: BookResponse = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to fetch books");
      }

      setBooks(data.data);
      setPagination((prev) => ({
        ...prev,
        total: data.total,
        totalPages: data.totalPages,
      }));
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.pageNum, pagination.pageSize, search]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, pageNum: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, pageNum: newPage }));
  };

  const handleDelete = (bookId: string) => {
    setBookToDelete(bookId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!bookToDelete) return;

    setDeleteLoading(true);
    setDeleteError(null);

    try {
      const res = await fetch(`http://localhost:3001/book/${bookToDelete}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to delete book");
      }

      // Refresh the book list after successful deletion
      await fetchBooks();
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting book:", error);
      setDeleteError(
        error instanceof Error ? error.message : "Failed to delete book"
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setBookToDelete(null);
    setDeleteError(null);
  };

  return (
    <div className="container mx-auto px-4 text-gray-700 py-8">
      <h1 className="text-2xl font-bold mb-6">Book Inventory</h1>

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
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Year
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Barcode
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {books.map((book) => (
                  <tr key={book.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {book.bookTitle}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {book.bookAuthor}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {book.published_year}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {book.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {book.barcodeNo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2">
                      <button
                        onClick={() => router.push(`/book/${book.id}`)}
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
                            onClick={() => router.push(`/book/${book.id}`)}
                            className="relative group p-1 cursor-pointer"
                            title="Update"
                          >
                            <PencilSquareIcon className="w-5 h-5 text-yellow-600" />
                            <span className="absolute left-1/2 -top-6 -translate-x-1/2 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                              Update
                            </span>
                          </button>
                          <button
                            onClick={() => handleDelete(book.id)}
                            className="relative group p-1 cursor-pointer"
                            title="Delete"
                            disabled={deleteLoading}
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
                of <span className="font-medium">{pagination.total}</span> books
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
      {showDeleteModal && (
        <ConfirmationModal
          message="Are you sure you want to delete this book? This action cannot be undone."
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
          confirmText={deleteLoading ? "Deleting..." : "Delete"}
          cancelText="Cancel"
          type="delete"
        />
      )}

      {deleteError && (
        <p className="text-sm text-red-600 mt-2">{deleteError}</p>
      )}

      {deleteError && (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50">
          <span className="block sm:inline">{deleteError}</span>
          <button
            onClick={() => setDeleteError(null)}
            className="absolute top-0 right-0 px-2 py-1"
          >
            &times;
          </button>
        </div>
      )}
      <ToastContainer position="top-right" />
    </div>
  );
}
