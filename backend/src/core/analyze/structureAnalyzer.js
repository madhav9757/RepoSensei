import { getRepoTree, getFileContent, getRepoDetails } from "../github/github.client.js";
import { structureRules } from "./structureRules.js";

export const analyzeRepoStructure = async (owner, repo) => {
  try {
    console.log(`Analyzing repository: ${owner}/${repo}`);
    
    const [repoDetails, tree] = await Promise.all([
      getRepoDetails(owner, repo),
      getRepoTree(owner, repo)
    ]);

    const files = tree.filter(item => item.type === 'blob');
    const filePaths = files.map(f => f.path);
    const directories = tree.filter(item => item.type === 'tree');
    const dirPaths = directories.map(d => d.path);

    const missingRequiredFiles = structureRules.requiredFiles.filter(
      file => !filePaths.includes(file)
    );

    const missingRecommendedFolders = structureRules.recommendedFolders.filter(
      folder => !dirPaths.some(path => path.startsWith(folder))
    );

    const fileTypes = analyzeFileTypes(filePaths);
    const issues = [];
    
    if (!filePaths.includes('README.md')) {
      issues.push({
        severity: 'high',
        type: 'missing_file',
        message: 'README.md is missing. This is essential for documenting your project.'
      });
    }

    const hasPackageJson = filePaths.includes('package.json');
    const hasJsFiles = filePaths.some(f => f.endsWith('.js') || f.endsWith('.ts'));
    
    if (hasJsFiles && !hasPackageJson) {
      issues.push({
        severity: 'high',
        type: 'missing_file',
        message: 'package.json is missing for what appears to be a Node.js project.'
      });
    }

    if (!filePaths.includes('.gitignore')) {
      issues.push({
        severity: 'medium',
        type: 'missing_file',
        message: '.gitignore is missing. This may lead to committing sensitive files.'
      });
    }

    if (!filePaths.some(f => f.startsWith('LICENSE'))) {
      issues.push({
        severity: 'low',
        type: 'missing_file',
        message: 'LICENSE file is missing. Consider adding one for clarity on usage rights.'
      });
    }

    if (hasJsFiles && !dirPaths.some(d => d === 'src' || d === 'lib')) {
      issues.push({
        severity: 'medium',
        type: 'structure',
        message: 'Consider organizing source code in a "src" or "lib" folder.'
      });
    }

    const hasTests = dirPaths.some(d => 
      d.includes('test') || d.includes('tests') || d.includes('__tests__')
    );
    
    if (!hasTests && filePaths.length > 5) {
      issues.push({
        severity: 'medium',
        type: 'missing_tests',
        message: 'No test directory found. Consider adding tests for your code.'
      });
    }

    const score = calculateScore({
      missingRequiredFiles: missingRequiredFiles.length,
      missingRecommendedFolders: missingRecommendedFolders.length,
      issues: issues.length,
      totalFiles: files.length,
      hasTests
    });

    const recommendations = generateRecommendations({
      missingRequiredFiles,
      missingRecommendedFolders,
      issues,
      fileTypes,
      hasTests
    });

    return {
      success: true,
      repository: {
        owner,
        name: repo,
        full_name: `${owner}/${repo}`,
        url: repoDetails.html_url,
        description: repoDetails.description,
        language: repoDetails.language,
      },
      analysis: {
        score,
        totalFiles: files.length,
        totalDirectories: directories.length,
        missingRequiredFiles,
        missingRecommendedFolders,
        issues,
        fileTypes,
        hasTests,
      },
      recommendations,
      analyzedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error analyzing repository:', error);
    throw error;
  }
};

function analyzeFileTypes(filePaths) {
  const types = {};
  filePaths.forEach(path => {
    const ext = path.split('.').pop();
    if (ext && path.includes('.')) {
      types[ext] = (types[ext] || 0) + 1;
    }
  });
  return types;
}

function calculateScore({ missingRequiredFiles, missingRecommendedFolders, issues, totalFiles, hasTests }) {
  let score = 100;
  score -= missingRequiredFiles * 15;
  score -= missingRecommendedFolders * 5;
  
  issues.forEach(issue => {
    if (issue.severity === 'high') score -= 10;
    else if (issue.severity === 'medium') score -= 5;
    else score -= 2;
  });
  
  if (hasTests) score += 10;
  return Math.max(0, Math.min(100, score));
}

function generateRecommendations({ missingRequiredFiles, missingRecommendedFolders, issues, fileTypes, hasTests }) {
  const recommendations = [];
  
  if (missingRequiredFiles.length > 0) {
    recommendations.push({
      priority: 'high',
      category: 'documentation',
      title: 'Add Required Files',
      description: `Add these essential files: ${missingRequiredFiles.join(', ')}`,
      files: missingRequiredFiles
    });
  }
  
  if (missingRecommendedFolders.length > 0) {
    recommendations.push({
      priority: 'medium',
      category: 'structure',
      title: 'Improve Folder Structure',
      description: `Consider adding these folders: ${missingRecommendedFolders.join(', ')}`,
      folders: missingRecommendedFolders
    });
  }
  
  if (!hasTests) {
    recommendations.push({
      priority: 'high',
      category: 'testing',
      title: 'Add Tests',
      description: 'Add a test directory and start writing tests for your code.',
      suggestedFolders: ['tests', '__tests__', 'test']
    });
  }
  
  if (fileTypes.js || fileTypes.ts) {
    recommendations.push({
      priority: 'medium',
      category: 'tooling',
      title: 'Add Development Tools',
      description: 'Consider adding ESLint, Prettier, and other development tools.',
      suggestedFiles: ['.eslintrc.js', '.prettierrc', '.editorconfig']
    });
  }
  
  return recommendations;
}

export const analyzeRepoFromUrl = async (repoUrl) => {
  const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  
  if (!match) {
    throw new Error('Invalid GitHub repository URL');
  }
  
  const [, owner, repo] = match;
  const repoName = repo.replace('.git', '');
  
  return analyzeRepoStructure(owner, repoName);
};
