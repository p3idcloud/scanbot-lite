import dayjs from 'dayjs';

export const getInitialName = name => {
    if (name <= 2) {
      return name;
    }
    if (name) {
      return (
        name
          .match(/(\b\S)?/g)
          .join('')
          .substr(0, 2)
          .toUpperCase() ?? 'AA'
      );
    }
    return 'AA';
};

export const capitalize = text => {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function lowercase(string) {
  return string.toLowerCase();
}

export const generateHistoryName = () => {
  return dayjs().format("YYYY-MM-DD HH:mm") + " SCAN";
}