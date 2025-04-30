import React from 'react';

export default function ProfileSection() {
  return (
    <section>
      <h2>Profile Details</h2>
      <p>Name: Dr. Jane Doe</p>
      <p>Status: <span className="verified">Verified</span></p>
    </section>
  );
}