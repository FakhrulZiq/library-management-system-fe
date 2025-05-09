import DueDatesPanel from "@/components/DueDatesPanel";
import ProtectedRoute from "@/components/ProtectedRoute";
import RecentsActivity from "@/components/RecentsActivity";
import Sidebar from "@/components/Sidebar";
import SummaryCards from "@/components/SummaryCard";
import TotalBooksReport from "@/components/TotalBooksReport";
import TrendingBooksCard from "@/components/TrendingBooksCard";

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <div className="flex h-screen overflow-hidden">
        <div className="sticky top-0 h-screen">
          <Sidebar />
        </div>
        <main className="flex-1 overflow-y-auto bg-gray-100">
          <div className="p-6">
            <SummaryCards />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
              <TotalBooksReport />
              <DueDatesPanel />
              <TrendingBooksCard />
              <RecentsActivity />
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
