import MomScheduler from "../components/Scheduler/MomScheduler";

export default function MomPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-purple-700 text-center mb-8">My Tracker</h1>
      <MomScheduler />
    </div>
  );
}
