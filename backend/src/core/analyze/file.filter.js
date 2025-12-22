const IGNORED_PATHS = [
  "node_modules",
  ".git",
  "dist",
  "build",
  ".next",
  "coverage",
];

export const shouldIncludeFile = (path) => {
  return !IGNORED_PATHS.some((ignored) => path.includes(ignored));
};
