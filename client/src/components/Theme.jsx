import { useEffect, useState } from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';

const ThemeChange = () => {
  const [dark, setDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.theme === 'dark' || (
        !localStorage.theme &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
      );
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;

    if (dark) {
      root.classList.add('dark');
      localStorage.theme = 'dark';
    } else {
      root.classList.remove('dark');
      localStorage.theme = 'light';
    }
  }, [dark]);

  // Optional: Sync with system preference changes
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = (e) => {
      if (!('theme' in localStorage)) {
        setDark(e.matches);
      }
    };
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, []);

  return (
    <button
      onClick={() => setDark(!dark)}
      aria-label={`Switch to ${dark ? 'light' : 'dark'} mode`}
      role="switch"
      aria-checked={dark}
      className="p-2 rounded-full transition bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
    >
      {dark ? (
        <MoonIcon className="h-6 w-6 text-yellow-300" />
      ) : (
        <SunIcon className="h-6 w-6 text-orange-500" />
      )}
    </button>
  );
};

export default ThemeChange;
