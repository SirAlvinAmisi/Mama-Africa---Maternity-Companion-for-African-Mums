import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function PopularGroups({ groups }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentGroups = groups.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(groups.length / itemsPerPage);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-cyan-700">Popular Groups</h2>

      {currentGroups.map((group) => (
        <div key={group.id} className="flex items-center gap-4 mb-4">
          <Link to={`/communities/${group.id}`} className="flex items-center gap-4 flex-1 no-underline text-black">
            <img 
              src={group.image || "https://via.placeholder.com/150"} 
              alt={group.name} 
              className="w-16 h-16 rounded-full object-cover" 
            />
            <div>
              <h3 className="text-lg font-semibold">{group.name}</h3>
              <p className="text-gray-500">{group.members || 0} members</p>
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

      {/* Pagination for Popular Groups */}
      <div className="flex justify-center mt-4 gap-4">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-cyan-600 text-white rounded disabled:bg-gray-400"
        >
          Previous
        </button>

        <span className="text-gray-700 pt-2">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() => setCurrentPage(prev => (indexOfLastItem < groups.length ? prev + 1 : prev))}
          disabled={indexOfLastItem >= groups.length}
          className="px-3 py-1 bg-cyan-600 text-white rounded disabled:bg-gray-400"
        >
          Next
        </button>
      </div>

    </div>
  );
}

export default PopularGroups;
