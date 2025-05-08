"use client";

import { ConfirmationModal } from "@/components/ConfirmationMessageModal";
import { BookOpenIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function BorrowedBookDetailPage() {
  const { id } = useParams();
  const [borrowedBookDetails, setBorrowedBookDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showReturnOrLostModal, setShowReturnOrLostModal] = useState(false);
  const [statusToUpdate, setStatusToUpdate] = useState<string | null>(null);
  const [returnLoading, setReturnOrLostLoading] = useState(false);
  const [returnOrLostError, setReturnOrLostError] = useState<string | null>(
    null
  );
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`http://localhost:3001/borrowedBook/transactions/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized or not found");
        return res.json();
      })
      .then((data) => {
        setBorrowedBookDetails(data);
      })
      .catch((err) => {
        toast.error("Failed to fetch transaction details");
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleReturnOrLost = (status: "Returned" | "Losted") => {
    setStatusToUpdate(status);
    setShowReturnOrLostModal(true);
  };

  const confirmReturnOrLost = async () => {
    if (!statusToUpdate) return;

    setReturnOrLostLoading(true);
    setReturnOrLostError(null);

    const token = localStorage.getItem("token");

    try {
      let fine = 0;
      if (borrowedBookDetails.remainingDay < 0) {
        fine = Math.abs(borrowedBookDetails.remainingDay) * 100;
      }

      const res = await fetch("http://localhost:3001/borrowedBook/return", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          borrowedBookId: id,
          status: statusToUpdate,
          fine:
            statusToUpdate === "Losted" ? borrowedBookDetails.book.price : fine,
        }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      toast.success(
        `Book marked as ${
          statusToUpdate === "Returned" ? "Returned" : "Losted"
        }`
      );
      const updated = await res.json();
      setBorrowedBookDetails(updated);
      setShowReturnOrLostModal(false);
    } catch (error) {
      setReturnOrLostError(
        error instanceof Error ? error.message : "Failed to return book"
      );
      console.error(error);
    } finally {
      setReturnOrLostLoading(false);
    }
  };

  const cancelReturnOrLost = () => {
    setShowReturnOrLostModal(false);
    setStatusToUpdate(null);
    setReturnOrLostError(null);
  };

  if (loading) return <p className="p-6">Loading...</p>;

  if (!borrowedBookDetails) return <p className="p-6">No data found.</p>;

  const {
    book,
    user,
    borrowDate,
    returnDate,
    dueDate,
    remainingDay,
    status,
    fine,
  } = borrowedBookDetails;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <button
        onClick={() => router.back()}
        className="mb-4 text-sm text-blue-600 cursor-pointer hover:underline"
      >
        ← Back
      </button>
      <h1 className="text-2xl font-bold mb-6 flex text-gray-700 items-center gap-2">
        <BookOpenIcon className="w-6 h-6 text-indigo-600" />
        Borrow Transaction Detail
      </h1>

      <div className="bg-white shadow-md rounded-lg p-6 space-y-4 text-gray-800">
        <div>
          <span className="font-semibold">Student Name:</span> {user.name}
        </div>
        <div>
          <span className="font-semibold">Matric/Staff No:</span>{" "}
          {user.matricOrStaffNo}
        </div>
        <div>
          <span className="font-semibold">Borrow Date:</span> {borrowDate}
        </div>
        <div>
          <span className="font-semibold">Due Date:</span> {dueDate}
        </div>
        <div>
          <span className="font-semibold">Return Date:</span>{" "}
          {returnDate || "-"}
        </div>
        <div>
          <span className="font-semibold">Remaining Days:</span>{" "}
          {remainingDay === null
            ? "Returned"
            : remainingDay < 0
            ? `${Math.abs(remainingDay)} Days Overdue`
            : `${remainingDay} Day`}
        </div>
        <div>
          <span className="font-semibold">Status:</span> {status}
        </div>
        {fine > 0 && (
          <div>
            <span className="font-semibold">Fine:</span> RM{" "}
            {(fine / 100).toFixed(2)}
          </div>
        )}

        {/* Book Info Card */}
        <div className="flex gap-4 mt-5">
          <Image
            src={book.imageUrl || "/image/book-cover.png"}
            alt={book.title}
            width={120}
            height={160}
            className="object-cover rounded border"
          />
          <div className="flex flex-col justify-between">
            <div>
              <div className="text-lg font-semibold text-gray-900">
                {book.title}
              </div>
              <div className="text-gray-600 italic">by {book.author}</div>
            </div>
          </div>
        </div>
      </div>

      {status !== "Returned" && status !== "Losted" && (
        <div className="mt-6 flex gap-4 justify-end">
          <button
            onClick={() => handleReturnOrLost("Losted")}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          >
            Lost
          </button>
          <button
            onClick={() => handleReturnOrLost("Returned")}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Return
          </button>
        </div>
      )}
      {showReturnOrLostModal && (
        <ConfirmationModal
          message={
            statusToUpdate === "Losted"
              ? `Marking this book as lost will result in a fine of RM ${(
                  book.price / 100
                ).toFixed(2)}. Are you sure?`
              : borrowedBookDetails.remainingDay < 0
              ? `Returning this book late will result in a fine of RM ${(
                  Math.abs(borrowedBookDetails.remainingDay) * 1
                ).toFixed(2)}. Are you sure?`
              : "Thank you for returning the book. Are you sure?"
          }
          onConfirm={confirmReturnOrLost}
          onCancel={cancelReturnOrLost}
          confirmText={returnLoading ? "Processing..." : "Confirm"}
          cancelText="Cancel"
          type={statusToUpdate === "Losted" ? "delete" : "update"}
        />
      )}

      {returnOrLostError && (
        <p className="text-sm text-red-600 mt-2">{returnOrLostError}</p>
      )}

      {returnOrLostError && (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50">
          <span className="block sm:inline">{returnOrLostError}</span>
          <button
            onClick={() => setReturnOrLostError(null)}
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
