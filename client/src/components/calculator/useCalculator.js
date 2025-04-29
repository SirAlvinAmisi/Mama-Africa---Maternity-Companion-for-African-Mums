import { useState } from "react";
import { addDays, format, addWeeks } from "date-fns";

export default function useCalculator() {
  const [lmp, setLmp] = useState('');
  const [cycleLength, setCycleLength] = useState(28);
  const [dueDate, setDueDate] = useState('');
  const [milestones, setMilestones] = useState([]);

  const calculatePregnancy = (mode) => {
    if (!lmp) return;

    const lmpDate = new Date(lmp);
    let estimatedDueDate = addDays(lmpDate, 280); // Default 40 weeks

    if (mode === "period") {
      // Adjust based on cycle length
      const adjustment = (cycleLength - 28) * 1;
      estimatedDueDate = addDays(estimatedDueDate, adjustment);
    }

    setDueDate(format(estimatedDueDate, "yyyy-MM-dd"));

    const generatedMilestones = [
      { name: "First Ultrasound (12 Weeks)", date: format(addWeeks(lmpDate, 12), "yyyy-MM-dd") },
      { name: "Anatomy Scan (20 Weeks)", date: format(addWeeks(lmpDate, 20), "yyyy-MM-dd") },
      { name: "Glucose Screening (24 Weeks)", date: format(addWeeks(lmpDate, 24), "yyyy-MM-dd") },
      { name: "Prenatal Classes (28 Weeks)", date: format(addWeeks(lmpDate, 28), "yyyy-MM-dd") },
    ];
    setMilestones(generatedMilestones);
  };

  const resetCalculator = () => {
    setLmp('');
    setCycleLength(28);
    setDueDate('');
    setMilestones([]);
  };

  return {
    lmp, setLmp,
    cycleLength, setCycleLength,
    dueDate, milestones,
    calculatePregnancy,
    resetCalculator
  };
}
