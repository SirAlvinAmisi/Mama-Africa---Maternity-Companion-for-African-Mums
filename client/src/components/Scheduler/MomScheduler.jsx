import { useState } from "react";
import CalculatorForm from "../calculator/CalculatorForm";
import CalculatorResults from "../calculator/CalculatorResults";

export default function MomScheduler() {
  const [triggerRefresh, setTriggerRefresh] = useState(false);

  return (
  <div className="w-full max-w-6xl px-4 mx-auto">
    <CalculatorForm onCalculated={() => setTriggerRefresh(prev => !prev)} />
    <CalculatorResults trigger={triggerRefresh} />
  </div>
);

}
