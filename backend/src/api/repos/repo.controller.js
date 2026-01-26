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

  console.log(`Fetching details for: ${owner}/${repo}`);

  try {
    const repoDetails = await getRepoDetails(owner, repo);
    const languages = await getRepoLanguages(owner, repo);

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

  console.log(`Fetching structure for: ${owner}/${repo}`);
  const { tree, defaultBranch } = await getRepoTree(owner, repo);

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

  if (!path) {
    return next(new AppError("File path is required", 400));
  }

  console.log(`Fetching file content for: ${owner}/${repo}/${path} (ref: ${ref || 'default'})`);

  try {
    const content = await getFileContent(owner, repo, path, ref);

    if (content === null) {
      return next(new AppError("File not found or is not a text file", 404));
    }

    res.json({
      success: true,
      data: content
    });
  } catch (error) {
    if (error.status === 404) {
      return next(new AppError("File not found", 404));
    }
    throw error;
  }
});
