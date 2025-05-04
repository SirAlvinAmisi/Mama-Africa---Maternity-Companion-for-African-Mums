import { useEffect, useState } from 'react';

const ThemeChange = () => {
  const [dark, setDark] = useState(() => {
    return localStorage.theme === 'dark' || window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    }
  }, [dark]);

  return (
    <button
      onClick={() => setDark(!dark)}
      className="p-2 text-sm font-medium rounded transition bg-gray-200 dark:bg-gray-800 dark:text-white text-gray-900 hover:bg-gray-300 dark:hover:bg-gray-700"
    >
      {dark ? '🌙 Dark' : '☀️ Light'}
    </button>
  );
};

export default ThemeChange;
