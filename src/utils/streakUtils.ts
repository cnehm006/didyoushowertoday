// Utility to calculate current streak: counts consecutive days up to today with a shower. Resets to 0 if a day is missed.
export function calculateCurrentStreak(showerData: any[]): number {
  if (!showerData || showerData.length === 0) return 0;

  // Create a set of all dates with a shower
  const showeredDates = new Set(
    showerData.filter(e => e.showered).map(e => e.date)
  );

  let streak = 0;
  const today = new Date();

  for (let i = 0; i < 365; i++) { // up to 1 year back, but will break early
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    if (showeredDates.has(dateStr)) {
      streak++;
    } else {
      // As soon as a day is missed, streak ends
      break;
    }
  }
  return streak;
} 