export const getPendingStorySettings = () => {
  const settings = localStorage.getItem('pendingStorySettings');
  if (settings) {
    localStorage.removeItem('pendingStorySettings');
    return JSON.parse(settings);
  }
  return null;
};