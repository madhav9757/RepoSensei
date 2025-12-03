export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const formatDate = (date) => new Date(date).toISOString();

