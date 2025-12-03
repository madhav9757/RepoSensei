import { analyzeRepoFromUrl, analyzeRepoStructure } from "../../core/analyze/structureAnalyzer.js";

export const analyzeRepoByUrl = async (req, res) => {
  try {
    const { repoUrl } = req.body;
    
    if (!repoUrl) {
      return res.status(400).json({ 
        error: "repoUrl is required",
        example: { repoUrl: "https://github.com/owner/repo" }
      });
    }

    console.log(`Analyzing repository from URL: ${repoUrl}`);
    const report = await analyzeRepoFromUrl(repoUrl);
    
    res.json(report);
  } catch (error) {
    console.error('Error analyzing repository:', error);
    
    if (error.message.includes('Invalid')) {
      return res.status(400).json({ 
        error: error.message,
        message: "Please provide a valid GitHub repository URL"
      });
    }
    
    res.status(500).json({ 
      error: "Failed to analyze repository",
      message: error.message
    });
  }
};

export const analyzeRepoByOwner = async (req, res) => {
  try {
    const { owner, repo } = req.params;
    
    if (!owner || !repo) {
      return res.status(400).json({ 
        error: "Owner and repo name are required"
      });
    }

    console.log(`Analyzing repository: ${owner}/${repo}`);
    const report = await analyzeRepoStructure(owner, repo);
    
    res.json(report);
  } catch (error) {
    console.error('Error analyzing repository:', error);
    
    if (error.status === 404) {
      return res.status(404).json({ 
        error: "Repository not found",
        message: `Repository '${req.params.owner}/${req.params.repo}' does not exist`
      });
    }
    
    res.status(500).json({ 
      error: "Failed to analyze repository",
      message: error.message
    });
  }
};
