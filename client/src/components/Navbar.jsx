import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import africaIcon from '../assets/map.png';

const Navbar = () => {
  const isLoggedIn = !!localStorage.getItem('access_token');
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') === 'dark');

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('role');
    navigate('/');
  };

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <nav className="bg-cyan-200 text-gray-600 dark:text-white shadow">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between px-4 py-4">
        
        {/* Logo */}
        <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold">
  <Link to="/" className="flex items-center space-x-1">
    <span className="text-green text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">Mama</span>
    <img
      src={africaIcon}
      alt="Africa icon"
      className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14"
    />
    <span className="text-red-600 text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">frika</span>
  </Link>
</div>

        <button
          className="text-black dark:text-white sm:hidden text-3xl"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>

        {/* Navigation Links */}
        <div
  className={`${
    isOpen ? 'flex flex-col items-start gap-4 text-sm bg-cyan-200 text-gray-600' : 'hidden'
  } sm:flex sm:flex-row sm:items-center sm:gap-4 font-bold sm:text-cyan-900 text-lg absolute sm:static left-0 w-full sm:w-auto transition-all duration-300 ease-in-out top-16 sm:top-auto p-4 sm:p-0 z-50`}
>
  <Link to="/" className="hover:underline">Home</Link>
  <Link to="/specialists" className="hover:underline">Specialists</Link>
  <Link to="/communities" className="hover:underline">Communities</Link>
  {!isLoggedIn ? (
    <>
      <Link to="/login" className="hover:underline">Login</Link>
      <Link to="/signup" className="hover:underline">Sign Up</Link>
    </>
  ) : (
    <>
      <Link to="/profile" className="hover:underline">Profile</Link>
      <button onClick={handleLogout} className="hover:underline">Logout</button>
    </>
  )}
</div>

      </div>
    </nav>
  );
};

export default Navbar;
