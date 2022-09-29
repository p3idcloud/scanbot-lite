import dayjs from 'dayjs';

// Capitalize
export function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
  
// Lowercase
export function lowercase(string) {
    return string.toLowerCase();
}

export const generateHistoryName = () => {
    return dayjs().format("YYYY-MM-DD HH:mm") + " SCAN";
}
  