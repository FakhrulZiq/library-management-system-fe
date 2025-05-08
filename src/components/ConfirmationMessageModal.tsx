"use client";

type ConfirmationModalProps = {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  type?: "delete" | "update" | "default";
};

export function ConfirmationModal({
  message,
  onConfirm,
  onCancel,
  confirmText = "Yes",
  cancelText = "Cancel",
  type,
}: ConfirmationModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      <div className="bg-white p-6 z-50 text-gray-600 rounded-xl shadow-xl w-full max-w-sm text-center">
        <h2 className="text-xl font-bold mb-4">Are you sure?</h2>
        <p className="mb-6">{message}</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg text-white ${
              type === "delete"
                ? "bg-red-500 hover:bg-red-600"
                : type === "update"
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
