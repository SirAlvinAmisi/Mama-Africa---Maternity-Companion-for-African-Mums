import React from 'react';


function PopularGroups({ groups }) {
  return (
    <div className="popular-groups-card">
      <h2><span className="highlight">Popular Groups</span></h2>
      {groups.map((group, index) => (
        <div className="group" key={group.id}>
          <img src={group.image} alt={group.name} />
          <div>
            <h3>{group.name}</h3>
            <p>{group.members} members</p>
          </div>
          <button className="join-button">JOIN</button>
        </div>
      ))}
    </div>
  );
}

export default PopularGroups;
