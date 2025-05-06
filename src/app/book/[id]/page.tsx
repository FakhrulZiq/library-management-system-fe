// /app/book/[id]/page.tsx (if using App Router)
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { BookOpenIcon } from "@heroicons/react/24/solid";
import { useAuth } from "@/context/authContext";
import { toast } from "react-hot-toast";
import { BorrowSuccessModal } from "@/components/BorrowSuccessModal";

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
      .then((data) => setBook(data))
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

      if (!response.ok) throw new Error("Failed to borrow the book");

      const result = await response.json();
      setBorrowData(result);
    } catch (error) {
      toast.error("Failed to borrow book");
      console.error("Borrow error:", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
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
          <p>
            <span className="font-semibold">Title:</span> {book.bookTitle}
          </p>
          <p>
            <span className="font-semibold">Author:</span> {book.bookAuthor}
          </p>
          <p>
            <span className="font-semibold">Price:</span> RM {book.price}
          </p>
          <p>
            <span className="font-semibold">Barcode No:</span> {book.barcodeNo}
          </p>
          <p>
            <span className="font-semibold">Published Year:</span>{" "}
            {book.published_year}
          </p>
          {role === "admin" && (
            <>
              <p>
                <span className="font-semibold">Quantity:</span> {book.quantity}
              </p>
            </>
          )}
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={handleBorrow}
          className="bg-indigo-600 text-white px-4 py-2 cursor-pointer rounded hover:bg-indigo-700 transition"
        >
          Borrow Book
        </button>
      </div>

      {borrowData && (
        <BorrowSuccessModal
          data={borrowData}
          onClose={() => setBorrowData(null)}
        />
      )}
    </div>
  );
}
