import React from 'react';
import { Link } from 'react-router-dom';

function PopularGroups({ groups }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-cyan-700">Popular Groups</h2>
      {groups.map((group) => (
        <div key={group.id} className="flex items-center gap-4 mb-4">
          {/* Make the whole card clickable using Link */}
          <Link to={`/communities/${group.id}`} className="flex items-center gap-4 flex-1 no-underline text-black">
            <img src={group.image} alt={group.name} className="w-16 h-16 rounded-full object-cover" />
            <div>
              <h3 className="text-lg font-semibold">{group.name}</h3>
              <p className="text-gray-500">{group.members} members</p>
            </div>
          </Link>
          <Link
            to={`/communities/${group.id}`}
            className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700 transition"
          >
            JOIN
          </Link>
        </div>
      ))}
    </div>
  );
}

export default PopularGroups;
