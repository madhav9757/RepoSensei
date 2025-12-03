AI-powered GitHub repository analyzer and code quality assistant.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Create .env file
cp .env.example .env

# 3. Add your GitHub token to .env
# Get token: https://github.com/settings/tokens

# 4. Start server
npm run dev
```

Server runs at: http://localhost:5000

## API Endpoints

### Health Check
```bash
GET /api/health
```

### Repositories
```bash
# Get user repos
GET /api/repos?username=octocat

# Get repo details
GET /api/repos/:owner/:repo

# Get repo structure
GET /api/repos/:owner/:repo/structure
```

### Analysis
```bash
# Analyze by URL
POST /api/analyze
Body: { "repoUrl": "https://github.com/owner/repo" }

# Analyze by owner/repo
GET /api/analyze/:owner/:repo
```

### Pull Requests
```bash
# Get all PRs
GET /api/pr/:owner/:repo

# Get PRs by state
GET /api/pr/:owner/:repo?state=open

# Get specific PR
GET /api/pr/:owner/:repo/:number
```

## Environment Variables

Required:
- `GITHUB_PERSONAL_ACCESS_TOKEN` - GitHub API token
- `JWT_SECRET` - JWT signing secret

Optional:
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `FRONTEND_URL` - Frontend URL for CORS

## Project Structure

```
backend/
├── src/
│   ├── api/              # API routes & controllers
│   ├── core/             # Core business logic
│   │   ├── ai/           # AI services
│   │   ├── analyze/      # Analysis logic
│   │   ├── config/       # Configuration
│   │   ├── github/       # GitHub client
│   │   └── utils/        # Utilities
│   ├── app.js            # Express app
│   └── server.js         # Entry point
├── .env                  # Environment variables
└── package.json
```

## Development

```bash
# Start dev server with hot reload
npm run dev

# Lint code
npm run lint

# Format code
npm run format
```

## Testing

```bash
# Run API tests
./test-api.sh

# Or manually test
curl http://localhost:5000/api/health
```

## Features

- ✅ Repository structure analysis
- ✅ Code quality scoring
- ✅ Best practices detection
- ✅ Pull request management
- ✅ Intelligent recommendations
- ⏳ AI-powered suggestions (coming soon)

## Tech Stack

- Node.js 18+
- Express.js
- Octokit (GitHub API)
- JWT Authentication
- Helmet & CORS Security

## Error Handling

All endpoints return consistent format:

```json
{
  "error": "Error type",
  "message": "Detailed message"
}
```

Status codes:
- 200 - Success
- 400 - Bad Request
- 404 - Not Found
- 500 - Server Error

## Rate Limiting

- 100 requests per 15 minutes per IP
- Configurable via environment variables

## Security

- Helmet.js security headers
- CORS configuration
- Rate limiting
- JWT authentication
- Environment variable protection

## Troubleshooting

**Port in use:**
```bash
lsof -ti:5000 | xargs kill -9
```

**GitHub rate limit:**
Use Personal Access Token in .env

**Module errors:**
```bash
rm -rf node_modules package-lock.json
npm install
```

## Contributing

1. Fork repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## License

MIT License

## Support

- Issues: GitHub Issues
- Email: support@reposensei.com

---

Made with ❤️ by RepoSensei Team