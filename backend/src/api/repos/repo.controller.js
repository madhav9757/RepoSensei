import { 
  getUserRepos as fetchUserRepos,
  getRepoDetails,
  getRepoTree,
  getRepoLanguages 
} from "../../core/github/github.client.js";

export const getUserRepos = async (req, res) => {
  try {
    const { username, accessToken } = req.user;

    if (!username || !accessToken) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const repos = await fetchUserRepos(username, accessToken);

    res.json({
      success: true,
      count: repos.length,
      data: repos,
    });
  } catch (error) {
    console.error("getUserRepos error:", error);

    res.status(500).json({
      error: "Failed to fetch repositories",
      message: error.response?.data?.message || error.message || "GitHub API error",
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