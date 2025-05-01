// src/pages/MomPregnancy.jsx
import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import  api  from '../lib/api';

export default function MomPregnancy() {
  const queryClient = useQueryClient();
  const [lastPeriod, setLastPeriod] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [week, setWeek] = useState('');
  const [msg, setMsg] = useState('');
  const [trimesterGroup, setTrimesterGroup] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchPregnancyDetails = async () => {
      try {
        const response = await api.getPregnancyDetails();
        const { last_period_date, due_date, current_week, trimester_group } = response.data;
        setLastPeriod(last_period_date || '');
        setDueDate(due_date || '');
        setWeek(current_week || '');
        setTrimesterGroup(trimester_group || '');
      } catch (error) {
        console.error('Error fetching pregnancy details:', error);
      }
    };
    fetchPregnancyDetails();
  }, [token]);

  const pregnancyMutation = useMutation({
    mutationFn: (data) =>
      api.updatePregnancyDetails({
        last_period_date: data.lastPeriod,
        due_date: data.dueDate,
        current_week: data.week,
      }),
    onSuccess: (response) => {
      setMsg('Pregnancy details saved!');
      setTrimesterGroup(response.data.trimester_group || '');
      // Auto-join trimester community
      api.getTrimesterCommunities(response.data.trimester_group.toLowerCase()).then((res) => {
        const community = res.data.communities[0];
        if (community) {
          api.joinCommunity(community.id);
        }
      });
      queryClient.invalidateQueries(['communities']);
    },
    onError: () => {
      setMsg('Error saving details');
    },
  });

  const submit = async (e) => {
    e.preventDefault();
    pregnancyMutation.mutate({ lastPeriod, dueDate, week });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Pregnancy Details</h2>
      {trimesterGroup && (
        <p className="text-gray-700">
          You are in the <span className="font-semibold">{trimesterGroup}</span> group.
        </p>
      )}
      <form onSubmit={submit} className="space-y-4">
        <input
          type="date"
          className="w-full p-3 border rounded"
          value={lastPeriod}
          onChange={(e) => setLastPeriod(e.target.value)}
        />
        <input
          type="date"
          className="w-full p-3 border rounded"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <input
          type="number"
          placeholder="Current week"
          className="w-full p-3 border rounded"
          value={week}
          onChange={(e) => setWeek(e.target.value)}
        />
        <button className="bg-blue-button text-white px-6 py-2 rounded font-inria">
          Submit
        </button>
        {msg && <p className="text-green mt-2">{msg}</p>}
      </form>
    </div>
  );
}