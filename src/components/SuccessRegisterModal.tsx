"use client";

type SuccessModalProps = {
  message: string;
  onClose: () => void;
  buttonText: string;
};

export default function SuccessModal({
  message,
  onClose,
  buttonText,
}: SuccessModalProps) {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center">
      <div className="fixed inset-0 bg-white/30 backdrop-blur-sm rounded-lg shadow-lg p-6 backdrop-blur-sm" />
      <div className="bg-white p-6 z-20 rounded-xl shadow-xl w-full max-w-sm text-center">
        <h2 className="text-xl font-bold mb-4">Registration Successful!</h2>
        <p className="mb-6">{message}</p>
        <button
          onClick={onClose}
          className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-green-600"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}
