/**
 * Wait Time Estimation Logic
 */
export const calculateWaitTime = (position, priorityLevel) => {
  if (position <= 0) return 0;
  
  switch (priorityLevel.toUpperCase()) {
    case 'EMERGENCY':
      return Math.floor(Math.random() * 5) + 1; // 1-5 mins
    case 'URGENT':
      // position * 8-10 mins
      return position * (Math.floor(Math.random() * 3) + 8);
    case 'NORMAL':
    default:
      // position * 15-20 mins
      return position * (Math.floor(Math.random() * 6) + 15);
  }
};
