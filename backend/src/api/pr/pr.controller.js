import { getRepoPullRequests, octokit } from "../../core/github/github.client.js";

export const getRepoPRs = async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const { state } = req.query;
    const { accessToken } = req.user;

    if (!owner || !repo) {
      return res.status(400).json({
        error: "Owner and repo name are required"
      });
    }

    console.log(`Fetching PRs for: ${owner}/${repo} (state: ${state || 'all'})`);
    const pullRequests = await getRepoPullRequests(owner, repo, state || 'all', accessToken);

    const formattedPRs = pullRequests.map(pr => ({
      id: pr.id,
      number: pr.number,
      title: pr.title,
      state: pr.state,
      html_url: pr.html_url,
      user: {
        login: pr.user.login,
        avatar_url: pr.user.avatar_url,
      },
      created_at: pr.created_at,
      updated_at: pr.updated_at,
      merged_at: pr.merged_at,
      draft: pr.draft,
      labels: pr.labels,
      milestone: pr.milestone,
      head: {
        ref: pr.head.ref,
        sha: pr.head.sha,
      },
      base: {
        ref: pr.base.ref,
        sha: pr.base.sha,
      }
    }));

    res.json({
      success: true,
      count: formattedPRs.length,
      data: formattedPRs
    });
  } catch (error) {
    console.error('Error fetching pull requests:', error);

    if (error.status === 404) {
      return res.status(404).json({
        error: "Repository not found"
      });
    }

    res.status(500).json({
      error: "Failed to fetch pull requests",
      message: error.message
    });
  }
};

export const getPRDetails = async (req, res) => {
  try {
    const { owner, repo, pull_number } = req.params;
    const { accessToken } = req.user;

    if (!owner || !repo || !pull_number) {
      return res.status(400).json({
        error: "Owner, repo, and PR number are required"
      });
    }

    console.log(`Fetching PR #${pull_number} for: ${owner}/${repo}`);

    // Use user-specific client
    const { Octokit } = await import("@octokit/rest");
    const client = new Octokit({ auth: accessToken });

    const { data: pr } = await client.rest.pulls.get({
      owner,
      repo,
      pull_number: parseInt(pull_number)
    });

    res.json({
      success: true,
      data: pr
    });
  } catch (error) {
    console.error('Error fetching PR details:', error);

    if (error.status === 404) {
      return res.status(404).json({
        error: "Pull request not found"
      });
    }

    res.status(500).json({
      error: "Failed to fetch pull request details",
      message: error.message
    });
  }
};
