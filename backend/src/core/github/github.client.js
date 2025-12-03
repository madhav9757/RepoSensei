import { Octokit } from "@octokit/rest";
import dotenv from "dotenv";

dotenv.config();

// Create Octokit instance
export const octokit = new Octokit({
  auth: process.env.GITHUB_PERSONAL_ACCESS_TOKEN,
  userAgent: 'RepoSensei v1.0',
  timeZone: 'UTC',
});

// Get authenticated user repos
export const getAuthenticatedUserRepos = async () => {
  try {
    const { data } = await octokit.rest.repos.listForAuthenticatedUser({
      sort: 'updated',
      per_page: 100,
    });
    return data;
  } catch (error) {
    console.error('Error fetching authenticated user repos:', error.message);
    throw error;
  }
};

// Get user repos by username
export const getUserRepos = async (username) => {
  try {
    const { data } = await octokit.rest.repos.listForUser({
      username,
      sort: 'updated',
      per_page: 100,
    });
    return data;
  } catch (error) {
    console.error(`Error fetching repos for ${username}:`, error.message);
    throw error;
  }
};

// Get repository content
export const getRepoContent = async (owner, repo, path = '') => {
  try {
    const { data } = await octokit.rest.repos.getContent({
      owner,
      repo,
      path,
    });
    return data;
  } catch (error) {
    console.error(`Error fetching repo content:`, error.message);
    throw error;
  }
};

// Get repository tree
export const getRepoTree = async (owner, repo) => {
  try {
    const { data: repoData } = await octokit.rest.repos.get({
      owner,
      repo,
    });
    
    const defaultBranch = repoData.default_branch;
    
    const { data: refData } = await octokit.rest.git.getRef({
      owner,
      repo,
      ref: `heads/${defaultBranch}`,
    });
    
    const treeSha = refData.object.sha;
    
    const { data: treeData } = await octokit.rest.git.getTree({
      owner,
      repo,
      tree_sha: treeSha,
      recursive: true,
    });
    
    return treeData.tree;
  } catch (error) {
    console.error(`Error fetching repo tree:`, error.message);
    throw error;
  }
};

// Get repository details
export const getRepoDetails = async (owner, repo) => {
  try {
    const { data } = await octokit.rest.repos.get({
      owner,
      repo,
    });
    return data;
  } catch (error) {
    console.error(`Error fetching repo details:`, error.message);
    throw error;
  }
};

// Get pull requests
export const getRepoPullRequests = async (owner, repo, state = 'all') => {
  try {
    const { data } = await octokit.rest.pulls.list({
      owner,
      repo,
      state,
      per_page: 100,
    });
    return data;
  } catch (error) {
    console.error(`Error fetching pull requests:`, error.message);
    throw error;
  }
};

// Get repository languages
export const getRepoLanguages = async (owner, repo) => {
  try {
    const { data } = await octokit.rest.repos.listLanguages({
      owner,
      repo,
    });
    return data;
  } catch (error) {
    console.error(`Error fetching repo languages:`, error.message);
    throw error;
  }
};

// Get file content
export const getFileContent = async (owner, repo, path) => {
  try {
    const { data } = await octokit.rest.repos.getContent({
      owner,
      repo,
      path,
    });
    
    if (data.type === 'file' && data.content) {
      const content = Buffer.from(data.content, 'base64').toString('utf-8');
      return content;
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching file content:`, error.message);
    throw error;
  }
};

export default octokit;