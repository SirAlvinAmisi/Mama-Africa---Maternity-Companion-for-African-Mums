import CalculatorForm from "../calculator/CalculatorForm";

export default function MomScheduler() {
  return (
    <div className="flex flex-col md:flex-row gap-8 p-6">
      <div className="w-full md:w-1/2">
        <CalculatorForm />
      </div>
      <div className="w-full md:w-1/2 bg-purple-50 rounded-2xl p-4">
        {/* Placeholder for Calendar */}
        <h2 className="text-2xl font-bold text-purple-700 mb-4">Appointment Calendar</h2>
        <div className="text-gray-500">
          (Calendar component will be shown here)
        </div>
      </div>
    </div>
  );
}
