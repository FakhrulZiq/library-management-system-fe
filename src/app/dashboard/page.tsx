import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";
import SummaryCards from "@/components/SummaryCard";
import TotalBooksReport from "@/components/TotalBooksReport";

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 bg-gray-100 min-h-screen">
          <SummaryCards />
          <div className="grid grid-cols-2 gap-4 mt-6">
            <TotalBooksReport />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
