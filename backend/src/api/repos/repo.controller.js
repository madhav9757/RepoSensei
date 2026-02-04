import {
  getUserRepos as fetchUserRepos,
  getRepoDetails,
  getRepoTree,
  getRepoLanguages,
  getFileContent
} from "../../core/github/github.client.js";
import { catchAsync } from "../../core/utils/catchAsync.js";
import AppError from "../../core/utils/AppError.js";

export const getUserRepos = catchAsync(async (req, res, next) => {
  const { username, accessToken } = req.user;

  if (!username || !accessToken) {
    return next(new AppError("Unauthorized - Missing user info", 401));
  }

  const repos = await fetchUserRepos(username, accessToken);

  res.json({
    success: true,
    count: repos.length,
    data: repos,
  });
});


export const getRepoInfo = catchAsync(async (req, res, next) => {
  const { owner, repo } = req.params;
  const { accessToken } = req.user;

  console.log(`Fetching details for: ${owner}/${repo}`);

  try {
    const repoDetails = await getRepoDetails(owner, repo, accessToken);
    const languages = await getRepoLanguages(owner, repo, accessToken);

    res.json({
      success: true,
      data: {
        ...repoDetails,
        languages
      }
    });
  } catch (error) {
    if (error.status === 404) {
      return next(new AppError(`Repository '${owner}/${repo}' does not exist`, 404));
    }
    throw error; // Pass to catchAsync -> next
  }
});

export const getRepoStructure = catchAsync(async (req, res, _next) => {
  const { owner, repo } = req.params;
  const { accessToken } = req.user;

  console.log(`Fetching structure for: ${owner}/${repo}`);
  const { tree, defaultBranch } = await getRepoTree(owner, repo, accessToken);

  const structure = {
    default_branch: defaultBranch,
    files: tree.filter(item => item.type === 'blob'),
    directories: tree.filter(item => item.type === 'tree'),
    total_items: tree.length
  };

  res.json({
    success: true,
    data: structure
  });
});

export const getRepoContent = catchAsync(async (req, res, next) => {
  const { owner, repo } = req.params;
  const { path, ref } = req.query;
  const { accessToken } = req.user;

  if (!path) {
    return next(new AppError("File path is required", 400));
  }

  const cleanPath = (path.startsWith('/') ? path.slice(1) : path).trim();

  console.log(`Fetching file content for: ${owner}/${repo}/${cleanPath} (ref: ${ref || 'default'})`);

  try {
    const content = await getFileContent(owner, repo, cleanPath, ref, accessToken);

    if (content === null) {
      return next(new AppError("File not found or is not a text file", 404));
    }

    res.json({
      success: true,
      data: content
    });
  } catch (error) {
    if (error.status === 404) {
      return next(new AppError(`File not found: ${cleanPath} (Branch: ${ref || 'default'}). Ensure file exists and you have access.`, 404));
    }
    throw error;
  }
});
