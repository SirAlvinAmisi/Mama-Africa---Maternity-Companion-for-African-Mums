import { Link } from 'react-router-dom';

const Navbar = () => {
  const isLoggedIn = !!localStorage.getItem('access_token'); // Check if token exists

  return (
    <nav className="flex justify-between items-center p-4 bg-cyan-600 text-white">
      <div className="text-2xl font-bold">
        Mama Afrika
      </div>
      <div className="flex gap-4">
        {!isLoggedIn && (
          <>
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/signup" className="hover:underline">Sign Up</Link>
          </>
        )}
        {isLoggedIn && (
          <>
            <Link to="/profile" className="hover:underline">Profile</Link>
            <button
              onClick={() => {
                localStorage.removeItem('access_token');
                localStorage.removeItem('role');
                window.location.href = '/login'; // Force logout and go to login
              }}
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
