import { 
  getUserRepos as fetchUserRepos,
  getRepoDetails,
  getRepoTree,
  getRepoLanguages 
} from "../../core/github/github.client.js";

export const getUserRepos = async (req, res) => {
  try {
    const { username } = req.query;
    
    if (!username) {
      return res.status(400).json({ 
        error: "Username is required",
        message: "Please provide a GitHub username in the query parameters"
      });
    }

    console.log(`Fetching repos for user: ${username}`);
    const repos = await fetchUserRepos(username);
    
    const formattedRepos = repos.map(repo => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      description: repo.description,
      html_url: repo.html_url,
      clone_url: repo.clone_url,
      private: repo.private,
      language: repo.language,
      stargazers_count: repo.stargazers_count,
      forks_count: repo.forks_count,
      open_issues_count: repo.open_issues_count,
      created_at: repo.created_at,
      updated_at: repo.updated_at,
      default_branch: repo.default_branch,
    }));

    res.json({
      success: true,
      count: formattedRepos.length,
      data: formattedRepos
    });
  } catch (error) {
    console.error('Error in getUserRepos:', error);
    
    if (error.status === 404) {
      return res.status(404).json({ 
        error: "User not found",
        message: `GitHub user '${req.query.username}' does not exist`
      });
    }
    
    res.status(500).json({ 
      error: "Failed to fetch repositories",
      message: error.message
    });
  }
};

export const getRepoInfo = async (req, res) => {
  try {
    const { owner, repo } = req.params;
    
    if (!owner || !repo) {
      return res.status(400).json({ 
        error: "Owner and repo name are required"
      });
    }

    console.log(`Fetching details for: ${owner}/${repo}`);
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
    console.error('Error in getRepoInfo:', error);
    
    if (error.status === 404) {
      return res.status(404).json({ 
        error: "Repository not found",
        message: `Repository '${req.params.owner}/${req.params.repo}' does not exist`
      });
    }
    
    res.status(500).json({ 
      error: "Failed to fetch repository details",
      message: error.message
    });
  }
};

export const getRepoStructure = async (req, res) => {
  try {
    const { owner, repo } = req.params;
    
    if (!owner || !repo) {
      return res.status(400).json({ 
        error: "Owner and repo name are required"
      });
    }

    console.log(`Fetching structure for: ${owner}/${repo}`);
    const tree = await getRepoTree(owner, repo);
    
    const structure = {
      files: tree.filter(item => item.type === 'blob'),
      directories: tree.filter(item => item.type === 'tree'),
      total_items: tree.length
    };

    res.json({
      success: true,
      data: structure
    });
  } catch (error) {
    console.error('Error in getRepoStructure:', error);
    
    res.status(500).json({ 
      error: "Failed to fetch repository structure",
      message: error.message
    });
  }
};