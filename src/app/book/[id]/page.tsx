"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { BookOpenIcon } from "@heroicons/react/24/solid";
import { useAuth } from "@/context/authContext";
import { BorrowSuccessModal } from "@/components/BorrowSuccessModal";
import { toast, ToastContainer } from "react-toastify";
import { ConfirmationModal } from "@/components/ConfirmationMessageModal";

export type Book = {
  id: string;
  bookTitle: string;
  bookAuthor: string;
  price: number;
  barcodeNo: string;
  published_year: number;
  imageUrl: string;
  quantity: string;
};

export default function BookDetailPage() {
  const [borrowData, setBorrowData] = useState(null);
  const { id } = useParams();
  const { role } = useAuth();
  const [book, setBook] = useState<Book | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editBook, setEditBook] = useState<Book | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [bookToUpdate, setBookToUpdate] = useState<string | null>(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`http://localhost:3001/book/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized or not found");
        return res.json();
      })
      .then((data) => {
        setBook(data);
        setEditBook(data);
      })
      .catch((err) => console.error("Failed to fetch book", err));
  }, [id]);

  if (!book) return <p className="p-6">Loading...</p>;

  const handleBorrow = async () => {
    const token = localStorage.getItem("token");
    const studentId = localStorage.getItem("id");

    try {
      const response = await fetch(
        "http://localhost:3001/borrowedBook/borrow",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            studentId,
            bookId: book?.id,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message || "Failed to borrow the book");
      } else {
        setBorrowData(result);
      }
    } catch (error) {
      toast.error("Failed to borrow book");
      console.error("Borrow error:", error);
    }
  };

  const handleUpdateBook = (bookId: string) => {
    setBookToUpdate(bookId);
    setShowUpdateModal(true);
  };

  const confirmUpdate = async () => {
    if (!bookToUpdate) return;

    setUpdateLoading(true);
    setUpdateError(null);
    const token = localStorage.getItem("token");

    const { id, ...bookWithoutId } = editBook || {};

    try {
      const response = await fetch(
        `http://localhost:3001/book/${bookToUpdate}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(bookWithoutId),
        }
      );

      const updated = await response.json();

      if (!response.ok) {
        throw new Error(updated.message || "Failed to update book");
      }

      setBook(updated);
      setShowUpdateModal(false);
      setIsEditing(false);
      toast.success("Book updated successfully");
    } catch (error) {
      setUpdateError(
        error instanceof Error ? error.message : "Failed to delete book"
      );
      console.error("Update error:", error);
    } finally {
      setUpdateLoading(false);
    }
  };

  const cancelUpdate = () => {
    setShowUpdateModal(false);
    setBookToUpdate(null);
    setUpdateError(null);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <button
        onClick={() => router.back()}
        className="mb-4 text-sm text-blue-600 cursor-pointer hover:underline"
      >
        ← Back
      </button>
      <h1 className="text-2xl font-bold mb-6 flex text-gray-700 items-center gap-2">
        <BookOpenIcon className="w-6 h-6 text-indigo-600" />
        Book Detail
      </h1>

      <div className="bg-white shadow-lg rounded-lg p-6 flex gap-6">
        <Image
          src={book.imageUrl || "/image/book-cover.png"}
          alt={book.bookTitle}
          width={150}
          height={220}
          className="rounded object-cover"
        />

        <div className="space-y-2 text-gray-700">
          {isEditing ? (
            <>
              <div className="flex items-center gap-2">
                <label className="whitespace-nowrap font-semibold">
                  Title:
                </label>
                <input
                  className="border rounded p-1 w-full"
                  value={editBook?.bookTitle || ""}
                  onChange={(e) =>
                    setEditBook((prev) => ({
                      ...prev!,
                      bookTitle: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="flex items-center gap-2">
                <label className="whitespace-nowrap font-semibold">
                  Author:
                </label>
                <input
                  className="border rounded p-1 w-full"
                  value={editBook?.bookAuthor || ""}
                  onChange={(e) =>
                    setEditBook((prev) => ({
                      ...prev!,
                      bookAuthor: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="flex items-center gap-2">
                <label className="whitespace-nowrap font-semibold">
                  Price:
                </label>
                <input
                  className="border rounded p-1 w-full"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={
                    editBook?.price !== undefined
                      ? (editBook.price / 100).toFixed(2)
                      : ""
                  }
                  onChange={(e) => {
                    const rawValue = e.target.value.replace(/\D/g, ""); // remove non-digits
                    const cents = parseInt(rawValue || "0", 10);
                    setEditBook((prev) => ({
                      ...prev!,
                      price: cents,
                    }));
                  }}
                />
              </div>

              <div className="flex items-center gap-2">
                <label className="whitespace-nowrap font-semibold">
                  Barcode No:
                </label>
                <input
                  className="border rounded p-1 w-full"
                  value={editBook?.barcodeNo || ""}
                  onChange={(e) =>
                    setEditBook((prev) => ({
                      ...prev!,
                      barcodeNo: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="flex items-center gap-2">
                <label className="whitespace-nowrap font-semibold">
                  Published Year:
                </label>
                <input
                  className="border rounded p-1 w-full"
                  type="number"
                  value={editBook?.published_year || 0}
                  onChange={(e) =>
                    setEditBook((prev) => ({
                      ...prev!,
                      published_year: Number(e.target.value),
                    }))
                  }
                />
              </div>

              {(role === "admin" || role === "librarian") && (
                <div className="flex items-center gap-2">
                  <label className="whitespace-nowrap font-semibold">
                    Quantity:
                  </label>
                  <input
                    className="border rounded p-1 w-full"
                    type="number"
                    value={editBook?.quantity || ""}
                    onChange={(e) =>
                      setEditBook((prev) => ({
                        ...prev!,
                        quantity: e.target.value,
                      }))
                    }
                  />
                </div>
              )}
            </>
          ) : (
            <>
              <p>
                <span className="font-semibold">Title:</span> {book.bookTitle}
              </p>
              <p>
                <span className="font-semibold">Author:</span> {book.bookAuthor}
              </p>
              <p>
                <span className="font-semibold">Price:</span> RM{" "}
                {(book.price / 100).toFixed(2)}
              </p>
              <p>
                <span className="font-semibold">Barcode No:</span>{" "}
                {book.barcodeNo}
              </p>
              <p>
                <span className="font-semibold">Published Year:</span>{" "}
                {book.published_year}
              </p>
              {(role === "admin" || role === "librarian") && (
                <p>
                  <span className="font-semibold">Quantity:</span>{" "}
                  {book.quantity}
                </p>
              )}
            </>
          )}
        </div>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={handleBorrow}
          className="bg-indigo-600 text-white px-4 py-2 cursor-pointer rounded hover:bg-indigo-700 transition"
        >
          Borrow Book
        </button>
        {(role === "admin" || role === "librarian") && (
          <div className="flex gap-4">
            {isEditing ? (
              <>
                <button
                  onClick={() => handleUpdateBook(book.id)}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditBook(book);
                  }}
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
                title="Delete"
                disabled={updateLoading}
              >
                Update
              </button>
            )}
          </div>
        )}
      </div>

      {borrowData && (
        <BorrowSuccessModal
          data={borrowData}
          onClose={() => setBorrowData(null)}
        />
      )}
      {showUpdateModal && (
        <ConfirmationModal
          message="Are you sure you want to update this book?"
          onConfirm={confirmUpdate}
          onCancel={cancelUpdate}
          confirmText={updateLoading ? "Updating..." : "Update"}
          cancelText="Cancel"
          type="update"
        />
      )}

      {updateError && (
        <p className="text-sm text-red-600 mt-2">{updateError}</p>
      )}

      {updateError && (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50">
          <span className="block sm:inline">{updateError}</span>
          <button
            onClick={() => setUpdateError(null)}
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
