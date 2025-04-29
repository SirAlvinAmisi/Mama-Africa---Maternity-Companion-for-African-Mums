export default function PeriodFields({ lmp, cycleLength, onLmpChange, onCycleChange }) {
    return (
      <>
        <label className="text-gray-700 font-semibold">
          Last Period (LMP)
          <span className="text-sm font-normal text-gray-500 ml-2">
            (First day of your last period)
          </span>
        </label>
        <input
          type="date"
          value={lmp}
          onChange={onLmpChange}
          className="border border-gray-300 rounded p-2 w-full mb-4"
          required
        />
  
        <label className="text-gray-700 font-semibold">
          Cycle Length (days)
          <span className="text-sm font-normal text-gray-500 ml-2">
            (Typically 21-35 days)
          </span>
        </label>
        <input
          type="number"
          min="21"
          max="35"
          value={cycleLength}
          onChange={onCycleChange}
          className="border border-gray-300 rounded p-2 w-full"
          required
        />
      </>
    );
  }