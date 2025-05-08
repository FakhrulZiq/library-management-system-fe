"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

interface UserData {
  email: string;
  role: string;
  name: string;
  status: string;
  matricOrStaffNo: string;
  imageUrl?: string;
}

export default function UserPage() {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`http://localhost:3001/user/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized or not found");
        return res.json();
      })
      .then((data) => {
        setUser(data);
      })
      .catch((err) => console.error("Failed to fetch user", err));
  }, [id]);

  if (!user) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-md rounded text-gray-800">
      <button
        onClick={() => router.back()}
        className="mb-4 text-sm text-blue-600 cursor-pointer hover:underline"
      >
        ← Back
      </button>

      <h1 className="text-2xl font-bold mb-4">{user.name}</h1>

      <div className="space-y-4 text-sm">
        <div className="flex justify-center">
          <Image
            src={
              user.imageUrl ||
              "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?t=st=1746633792~exp=1746637392~hmac=33e02072fef3bf8143cf780095cf7521ce7bce9b1b8bd7e71f4bbf59638b1217&w=1380"
            }
            alt={user.name}
            width={128}
            height={128}
            className="rounded-full"
          />
        </div>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Role:</strong> {user.role}
        </p>
        <p>
          <strong>Status:</strong> {user.status}
        </p>
        <p>
          <strong>Matric/Staff No:</strong> {user.matricOrStaffNo}
        </p>
      </div>
    </div>
  );
}
