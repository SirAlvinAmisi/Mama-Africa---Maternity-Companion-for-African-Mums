import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const isLoggedIn = !!localStorage.getItem('access_token');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('role');
    navigate('/'); // Go back Home after logout
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-cyan-600 text-white">
      
      {/* Left side - Logo */}
      <div className="text-2xl font-bold">
        <Link to="/">Mama 🌍frika</Link>
      </div>

      {/* Center - Static Navigation Links */}
      <div className="text-2xl font-bold flex gap-4 items-center">
        <Link to="/" className="hover:underline text-3xl">🏠</Link>
        <Link to="/specialists" className="hover:underline">Specialists</Link>
        <Link to="/communities" className="hover:underline">Communities</Link>
      </div>

      {/* Right side - Auth Links */}
      <div className="text-2xl font-bold flex gap-4 items-center">
        {!isLoggedIn ? (
          <>
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/signup" className="hover:underline">Sign Up</Link>
          </>
        ) : (
          <>
            {/* 👇 Added Profile link when logged in */}
            <Link to="/profile" className="hover:underline">Profile</Link>

            <button
              onClick={handleLogout}
              className="hover:underline"
            >
              Logout
            </button>
          </>
        )}
      </div>

    </nav>
  );
};

export default Navbar;
