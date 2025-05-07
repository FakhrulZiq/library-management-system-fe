"use client";

import { ConfirmationModal } from "@/components/ConfirmationMessageModal";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AddBookPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [books, setBooks] = useState([
    {
      title: "",
      author: "",
      published_year: "",
      quantity: 1,
      barcodeNo: "",
      price: 0,
    },
  ]);

  const handleChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    const newBooks = [...books];
    newBooks[index] = {
      ...newBooks[index],
      [field]:
        field === "quantity" || field === "price" ? Number(value) : value,
    };
    setBooks(newBooks);
  };

  const addMoreBook = () => {
    setBooks([
      ...books,
      {
        title: "",
        author: "",
        published_year: "",
        quantity: 1,
        barcodeNo: "",
        price: 0,
      },
    ]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowAddModal(true);
  };

  const confirmAdd = async () => {
    setAddLoading(true);
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:3001/book/addManyBook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(books),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Failed to add books");
      } else {
        toast.success("Books added successfully!");
        setBooks([
          {
            title: "",
            author: "",
            published_year: "",
            quantity: 1,
            barcodeNo: "",
            price: 0,
          },
        ]);
        setShowAddModal(false);
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setAddLoading(false);
    }
  };

  const cancelAdd = () => {
    setShowAddModal(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white text-gray-600 rounded-xl shadow-md mt-6">
      <h1 className="text-2xl font-bold mb-4">Add Books</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {books.map((book, index) => (
          <div
            key={index}
            className="grid grid-cols-2 gap-6 border p-4 rounded"
          >
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                value={book.title}
                onChange={(e) => handleChange(index, "title", e.target.value)}
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Author</label>
              <input
                type="text"
                value={book.author}
                onChange={(e) => handleChange(index, "author", e.target.value)}
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Published Year
              </label>
              <input
                type="text"
                value={book.published_year}
                onChange={(e) =>
                  handleChange(index, "published_year", e.target.value)
                }
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Barcode No
              </label>
              <input
                type="text"
                value={book.barcodeNo}
                onChange={(e) =>
                  handleChange(index, "barcodeNo", e.target.value)
                }
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Quantity</label>
              <input
                type="number"
                value={book.quantity}
                onChange={(e) =>
                  handleChange(index, "quantity", e.target.value)
                }
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Price (RM)
              </label>
              <input
                type="text"
                value={(book.price / 100).toFixed(2)}
                onChange={(e) => {
                  const raw = e.target.value.replace(/\D/g, "");
                  const cents = raw === "" ? 0 : parseInt(raw);
                  handleChange(index, "price", cents);
                }}
                inputMode="numeric"
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>
          </div>
        ))}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={addMoreBook}
            className="bg-gray-300 px-4 py-2 rounded cursor-pointer hover:bg-gray-400"
          >
            + Add Another Book
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 cursor-pointer rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
      </form>

      {showAddModal && (
        <ConfirmationModal
          message="Are you sure you want to add these books?"
          onConfirm={confirmAdd}
          onCancel={cancelAdd}
          confirmText={addLoading ? "Adding..." : "Add"}
          cancelText="Cancel"
          type="update"
        />
      )}

      <ToastContainer position="top-right" />
    </div>
  );
}
