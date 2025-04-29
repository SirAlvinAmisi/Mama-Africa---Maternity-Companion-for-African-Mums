import HealthProfessionalScheduler from "../components/Scheduler/HealthProfessionalScheduler";

export default function HealthProfessionalPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-purple-700 text-center mb-8">Doctor Appointment Manager</h1>
      <HealthProfessionalScheduler />
    </div>
  );
}
