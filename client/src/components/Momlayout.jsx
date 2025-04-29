import { NavLink, Outlet } from 'react-router-dom';

export default function MomLayout() {
  const tabs = [
    { to: 'register', label: 'Register' },
    { to: 'profile',   label: 'Profile' },
    { to: 'pregnancy', label: 'Pregnancy' },
    { to: 'development', label: 'Tip' },
    { to: 'reminders', label: 'Reminders' },
    { to: 'upload-scan', label: 'Upload Scan' },
    { to: 'ask-question', label: 'Ask Question' },
    { to: 'content',   label: 'Content' },
  ];

  return (
    <div className="min-h-screen bg-light-blue flex flex-col">
      <nav className="bg-white shadow">
        <ul className="container mx-auto flex space-x-4 p-4">
          {tabs.map(tab => (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg font-inria 
                 ${isActive ? 'bg-blue-button text-white' : 'text-blue-button hover:bg-blue-button/20'}`
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </ul>
      </nav>
      <div className="flex-1 container mx-auto p-6 bg-white rounded-lg shadow-md mt-4">
        <Outlet />
      </div>
    </div>
  );
}
