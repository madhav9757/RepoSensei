export const structureRules = {
  requiredFiles: [
    "README.md",
    ".gitignore"
  ],
  
  recommendedFolders: [
    "src",
    "docs",
    "tests"
  ],
  
  configFiles: {
    node: ["package.json", ".nvmrc", ".npmrc"],
    python: ["requirements.txt", "setup.py", "pyproject.toml"],
    docker: ["Dockerfile", "docker-compose.yml"],
    ci: [".github/workflows", ".gitlab-ci.yml", "circle.yml"],
    editor: [".editorconfig", ".vscode", ".idea"]
  },
  
  qualityIndicators: {
    documentation: ["README.md", "CONTRIBUTING.md", "CHANGELOG.md", "docs/"],
    testing: ["tests/", "test/", "__tests__/", "spec/", ".spec.", ".test."],
    ci_cd: [".github/workflows/", ".gitlab-ci.yml", "circle.yml"],
    linting: [".eslintrc", ".pylintrc", ".rubocop.yml"],
    formatting: [".prettierrc", ".editorconfig", "pyproject.toml"],
    security: [".env.example", "SECURITY.md", ".npmrc"],
    licensing: ["LICENSE", "LICENSE.md", "LICENSE.txt"]
  },
  
  antiPatterns: {
    files: [".env", "node_modules/", ".DS_Store", "*.log"],
    naming: ["Untitled", "temp", "tmp", "old"]
  },
  
  fileSizeWarnings: {
    maxReadmeSize: 50000,
    maxConfigSize: 10000,
    warnLargeFiles: 1000000
  }
};

export const languageRules = {
  javascript: {
    required: ["package.json"],
    recommended: [".eslintrc", ".prettierrc", "tsconfig.json"],
    structure: ["src/", "tests/", "dist/", "build/"]
  },
  typescript: {
    required: ["package.json", "tsconfig.json"],
    recommended: [".eslintrc", ".prettierrc"],
    structure: ["src/", "tests/", "dist/"]
  },
  python: {
    required: ["requirements.txt"],
    recommended: ["setup.py", ".pylintrc", "pyproject.toml"],
    structure: ["src/", "tests/", "docs/"]
  },
  java: {
    required: ["pom.xml"],
    recommended: ["build.gradle"],
    structure: ["src/main/", "src/test/"]
  },
  go: {
    required: ["go.mod"],
    recommended: ["go.sum"],
    structure: ["cmd/", "pkg/", "internal/"]
  }
};

export const scoreWeights = {
  requiredFiles: 15,
  recommendedFolders: 5,
  hasTests: 10,
  hasCI: 5,
  hasDocumentation: 5,
  hasLicense: 5,
  highSeverityIssue: 10,
  mediumSeverityIssue: 5,
  lowSeverityIssue: 2
};