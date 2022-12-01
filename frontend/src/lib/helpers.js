import dayjs from 'dayjs';
import PDFMerger from 'pdf-merger-js';

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
  if (!text) return null;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function lowercase(string) {
  return string.toLowerCase();
}

export const generateHistoryName = () => {
  return dayjs().format("YYYY-MM-DD HH:mm") + " SCAN";
}

export const mergePdf = async (blobs) => {
  try {
    const merger = new PDFMerger();
    for await (const blob of blobs) {
      await merger.add(blob);
    }
    const mergedPdf = await merger.saveAsBlob();
    return [mergedPdf, null];
  } catch (error) {
    return [null, error];
  }
}