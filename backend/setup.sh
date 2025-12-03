echo "🚀 Setting up RepoSensei Backend..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+"
    exit 1
fi

echo "✓ Node.js $(node -v) detected"

if [ ! -f .env ]; then
    echo "⚠️  Creating .env file..."
    cp .env.example .env
    echo "✓ Created .env file"
    echo ""
    echo "📝 IMPORTANT: Update .env with your credentials:"
    echo "   - GITHUB_PERSONAL_ACCESS_TOKEN"
    echo "   - JWT_SECRET"
    echo ""
fi

echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✓ Dependencies installed"
echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Update .env with your GitHub token"
echo "  2. Run: npm run dev"
echo "  3. Test: curl http://localhost:5000/api/health"