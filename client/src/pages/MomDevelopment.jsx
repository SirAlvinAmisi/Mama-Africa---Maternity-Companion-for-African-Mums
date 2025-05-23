import { useEffect, useState } from 'react';
import { getFetalDevelopment } from '../lib/api'; 

export default function MomDevelopment() {
  const [tip, setTip] = useState('');

  useEffect(() => {
    const fetchTip = async () => {
      try {
        const data = await getFetalDevelopment(); // ✅ Replaces axios
        setTip(data.tip);
      } catch (error) {
        console.error("Failed to fetch fetal development tip:", error);
      }
    };

    fetchTip();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Fetal Development Tip</h2>
      <p className="text-gray-700">{tip}</p>
    </div>
  );
}
