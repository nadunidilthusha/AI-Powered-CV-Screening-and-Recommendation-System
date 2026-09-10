// TODO: implement formatting helpers (dates, file sizes, statuses, etc.)
export const formatDate = (date) => new Date(date).toLocaleDateString();

export const formatFileSize = (bytes) => `${(bytes / 1024).toFixed(1)} KB`;
