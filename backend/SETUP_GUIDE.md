## Prerequisites

1. **Node.js 18+**
   ```bash
   node -v  # Should be v18 or higher
   ```

2. **npm or yarn**
   ```bash
   npm -v
   ```

3. **GitHub Account**

## Step-by-Step Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Get GitHub Personal Access Token

1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Give it a name: "RepoSensei"
4. Select scopes:
   - ✅ repo (Full control of repositories)
   - ✅ read:user
   - ✅ user:email
5. Click "Generate token"
6. **Copy the token immediately** (you won't see it again!)

### 3. Configure Environment

```bash
# Create .env file
cp .env.example .env

# Edit .env and add your token
nano .env
```

Required values:
```env
GITHUB_PERSONAL_ACCESS_TOKEN=ghp_your_token_here
JWT_SECRET=your-secret-key-at-least-32-chars
```

### 4. Start the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

You should see:
```
🚀 RepoSensei backend running on http://localhost:5000
```

### 5. Test the API

```bash
# Health check
curl http://localhost:5000/api/health

# Get repositories
curl http://localhost:5000/api/repos?username=octocat
```

## Verification

If setup is successful, you should see:

1. ✅ Server starts without errors
2. ✅ Health endpoint returns OK
3. ✅ Can fetch GitHub data

## Common Issues

### "Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
```

### "Port 5000 already in use"
```bash
# Change PORT in .env
PORT=5001

# Or kill process using port
lsof -ti:5000 | xargs kill -9
```

### "GitHub API rate limit"
- Make sure GITHUB_PERSONAL_ACCESS_TOKEN is set
- Check rate limit: https://api.github.com/rate_limit

### "Unauthorized" errors
- Verify token is correct
- Ensure token has required scopes
- Token might be expired - generate new one

## Next Steps

1. Test all endpoints with test-api.sh
2. Review API documentation
3. Start building frontend
4. Add AI integrations (optional)

## Production Deployment

For production:

1. Set NODE_ENV=production
2. Use strong JWT_SECRET
3. Configure proper CORS
4. Enable HTTPS
5. Set up monitoring
6. Use PM2 or similar

## Getting Help

- Check logs in console
- Review error messages
- Test with curl commands
- Check GitHub token permissions

## Success Checklist

- [ ] Dependencies installed
- [ ] .env file created
- [ ] GitHub token added
- [ ] Server starts successfully
- [ ] Health check returns OK
- [ ] Can fetch repos from GitHub
- [ ] Analysis endpoint works
- [ ] No errors in console

If all checked, you're ready to go! 🎉