import { useEffect, useState } from 'react';
import axios from 'axios';

export default function MomDevelopment() {
  const [tip, setTip] = useState('');
  useEffect(() => {
    axios
      .get('http://localhost:5000/mums/fetal_development', {
        headers:{ Authorization:`Bearer ${localStorage.token}` }
      })
      .then(res => setTip(res.data.tip))
      .catch(console.error);
  }, []);
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Fetal Development Tip</h2>
      <p className="text-gray-700">{tip}</p>
    </div>
  );
}
