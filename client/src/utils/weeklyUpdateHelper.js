import weeklyUpdates from '../data/weeklyUpdates';

// Returns a random weekly update (e.g. before profile is filled)
export function getRandomWeeklyUpdate() {
  const randomWeek = Math.floor(Math.random() * 40) + 1;
  return { week: randomWeek, ...weeklyUpdates[randomWeek] };
}

// Returns the weekly update based on last period date
export function getWeeklyUpdateByDate(lastPeriodDate) {
  if (!lastPeriodDate) return null;

  const lpd = new Date(lastPeriodDate);
  const today = new Date();

  const diffInTime = today.getTime() - lpd.getTime();
  const diffInWeeks = Math.floor(diffInTime / (1000 * 60 * 60 * 24 * 7));

  const currentWeek = Math.min(Math.max(diffInWeeks, 1), 40); // Clamp between 1 and 40

  return { week: currentWeek, ...weeklyUpdates[currentWeek] };
}

// Returns update by week number (for use after saving pregnancy info)
export function getWeeklyUpdateByWeek(weekNumber) {
  const week = Math.min(Math.max(weekNumber, 1), 40); // Clamp between 1–40
  return { week, ...weeklyUpdates[week] };
}
// Add this at the bottom or anywhere in weeklyUpdateHelper.js
export function getCurrentWeek() {
  const lmp = localStorage.getItem("lmp");
  if (!lmp) return 1;

  const startDate = new Date(lmp);
  const now = new Date();
  const diffInWeeks = Math.floor((now - startDate) / (1000 * 60 * 60 * 24 * 7));
  return Math.min(Math.max(1, diffInWeeks), 40);
}

// Export all updates if needed elsewhere
export const WEEKLY_UPDATES = weeklyUpdates;
