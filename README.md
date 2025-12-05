# 🎉 RepoSensei - Setup Complete!

Your frontend and backend are now **fully integrated and working**! 

## ✅ What's Working

- ✅ **Backend (Node.js + Express)** running on port 5000
- ✅ **Frontend (React + Vite)** running on port 3000
- ✅ **API Integration** - Frontend successfully communicates with backend
- ✅ **Services** - Both running via supervisor with auto-restart
- ✅ **CORS** - Properly configured for cross-origin requests

## 🔑 Add Your API Keys

To enable full functionality, add your API keys to `/app/backend/.env`:

### 1. GitHub Personal Access Token (Required for repo features)

```bash
# Open the .env file
nano /app/backend/.env

# Update this line with your token:
GITHUB_PERSONAL_ACCESS_TOKEN=ghp_your_actual_token_here
```

**Get your GitHub token:**
1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Select scopes: `repo`, `read:user`
4. Copy the token and paste it in `.env`

### 2. AI/LLM Keys (Optional - for AI suggestions)

Add either OpenAI or Anthropic key:

```bash
# For OpenAI
OPENAI_API_KEY=sk-your_openai_key_here

# OR for Anthropic
ANTHROPIC_API_KEY=sk-ant-your_anthropic_key_here
```

### 3. GitHub OAuth (Optional - for GitHub login)

```bash
GITHUB_CLIENT_ID=your_github_oauth_client_id
GITHUB_CLIENT_SECRET=your_github_oauth_client_secret
```

**Get OAuth credentials:**
1. Go to https://github.com/settings/developers
2. Click "New OAuth App"
3. Set callback URL: `http://localhost:5000/api/auth/github/callback`
4. Copy Client ID and Secret

## 🔄 Restart Backend After Adding Keys

After adding your keys, restart the backend:

```bash
supervisorctl restart backend
```

## 🧪 Test the Integration

### Test Backend Health
```bash
curl http://localhost:5000/api/health
```

### Test with Your GitHub Username
```bash
curl "http://localhost:5000/api/repos?username=YOUR_GITHUB_USERNAME"
```

### Access the Frontend
Open your browser to: **http://localhost:3000**

## 📊 Available Endpoints

### Backend API (http://localhost:5000/api)

- `GET /health` - Health check
- `GET /repos?username={user}` - Get user repositories
- `GET /repos/:owner/:repo` - Get specific repo details
- `GET /repos/:owner/:repo/structure` - Get repo file structure
- `POST /analyze` - Analyze a repository
- `GET /analyze/:owner/:repo` - Get analysis for a repo
- `GET /pr/:owner/:repo` - Get pull requests
- `GET /suggestions/:owner/:repo` - Get AI suggestions

## 📱 Frontend Routes

- `/` - Home page
- `/dashboard` - User dashboard (lists repos)
- `/repo/:id` - Repository details
- `/analysis/:id` - Analysis results

## 🔧 Service Management

```bash
# Check status
supervisorctl status

# Restart services
supervisorctl restart backend
supervisorctl restart frontend
supervisorctl restart all

# View logs
tail -f /var/log/supervisor/backend.out.log
tail -f /var/log/supervisor/frontend.out.log
```

## 🐛 Troubleshooting

### Frontend can't connect to backend
- Check if backend is running: `supervisorctl status backend`
- Check backend logs: `tail -n 50 /var/log/supervisor/backend.err.log`
- Verify .env file exists: `ls -la /app/backend/.env`

### GitHub API errors
- Verify your token in `/app/backend/.env`
- Check rate limits: https://api.github.com/rate_limit
- Ensure token has correct scopes

### Port conflicts
```bash
# Check what's using ports
lsof -i :5000
lsof -i :3000
```

## 🎯 Next Steps

1. **Add your GitHub token** to start analyzing repos
2. **Add AI keys** to enable intelligent suggestions
3. **Test the dashboard** at http://localhost:3000/dashboard
4. **Customize** the frontend or backend as needed

## 📝 File Locations

- **Backend**: `/app/backend/`
- **Frontend**: `/app/frontend/`
- **Backend .env**: `/app/backend/.env`
- **Frontend .env**: `/app/frontend/.env`
- **Supervisor config**: `/etc/supervisor/conf.d/reposensei.conf`

---

**Your website is ready! Just add your API keys and you're good to go! 🚀**
