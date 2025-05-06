import { Book } from "@/app/book/[id]/page";

type BorrowedBook = {
  book: Book;
  dueDate: string;
  status: string;
  remainingBookCanBorrow: string;
};

export function BorrowSuccessModal({
  data,
  onClose,
}: {
  data: BorrowedBook;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-auto">
        <h2 className="text-xl font-semibold text-green-700 mb-4">
          Book Borrowed Successfully!
        </h2>

        <div className="space-y-2 text-gray-700 text-sm">
          <p>
            <strong>Title:</strong> {data.book.bookTitle}
          </p>
          <p>
            <strong>Author:</strong> {data.book.bookAuthor}
          </p>
          <p>
            <strong>Due Date:</strong> {data.dueDate}
          </p>
          <p>
            <strong>Status:</strong> {data.status}
          </p>
          <p>
            <strong>Remaining Borrow Quota:</strong>{" "}
            {data.remainingBookCanBorrow}
          </p>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}
