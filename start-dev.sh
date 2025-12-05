#!/bin/bash

# RepoSensei Quick Start Script
# This script starts both backend and frontend in development mode

set -e

echo "🚀 Starting RepoSensei Development Environment..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✓ Node.js $(node -v) detected"
echo ""

# Function to check if port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# Check if ports are available
if check_port 5000; then
    echo "⚠️  Port 5000 is already in use. Kill the process? (y/n)"
    read -r response
    if [[ "$response" == "y" ]]; then
        lsof -ti:5000 | xargs kill -9 2>/dev/null || true
        echo "✓ Port 5000 freed"
    else
        echo "❌ Cannot start backend on port 5000. Exiting."
        exit 1
    fi
fi

if check_port 5173; then
    echo "⚠️  Port 5173 is already in use. Kill the process? (y/n)"
    read -r response
    if [[ "$response" == "y" ]]; then
        lsof -ti:5173 | xargs kill -9 2>/dev/null || true
        echo "✓ Port 5173 freed"
    else
        echo "❌ Cannot start frontend on port 5173. Exiting."
        exit 1
    fi
fi

echo ""

# Check backend setup
echo "📦 Checking backend setup..."
if [ ! -d "backend/node_modules" ]; then
    echo "Installing backend dependencies..."
    cd backend && npm install && cd ..
fi

if [ ! -f "backend/.env" ]; then
    echo "⚠️  Backend .env file not found!"
    echo "Creating .env from .env.example..."
    cp backend/.env.example backend/.env
    echo ""
    echo "❗ IMPORTANT: Edit backend/.env with your credentials before continuing!"
    echo "   - Add GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET"
    echo "   - Add GITHUB_PERSONAL_ACCESS_TOKEN"
    echo "   - Set JWT_SECRET (min 32 characters)"
    echo ""
    echo "Press Enter when ready to continue..."
    read -r
fi

echo "✓ Backend setup complete"
echo ""

# Check frontend setup
echo "📦 Checking frontend setup..."
if [ ! -d "frontend/node_modules" ]; then
    echo "Installing frontend dependencies..."
    cd frontend && npm install && cd ..
fi

if [ ! -f "frontend/.env" ]; then
    echo "Creating frontend .env file..."
    echo "VITE_API_URL=http://localhost:5000/api" > frontend/.env
fi

echo "✓ Frontend setup complete"
echo ""

# Start backend in background
echo "🔧 Starting backend server..."
cd backend
npm run dev > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo "Waiting for backend to be ready..."
for i in {1..30}; do
    if curl -s http://localhost:5000/api/health > /dev/null 2>&1; then
        echo "✓ Backend is ready!"
        break
    fi
    sleep 1
    if [ $i -eq 30 ]; then
        echo "❌ Backend failed to start. Check backend.log for errors."
        kill $BACKEND_PID 2>/dev/null || true
        exit 1
    fi
done

echo ""

# Start frontend in background
echo "🎨 Starting frontend server..."
cd frontend
npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

# Wait for frontend to start
echo "Waiting for frontend to be ready..."
for i in {1..30}; do
    if curl -s http://localhost:5173 > /dev/null 2>&1; then
        echo "✓ Frontend is ready!"
        break
    fi
    sleep 1
    if [ $i -eq 30 ]; then
        echo "❌ Frontend failed to start. Check frontend.log for errors."
        kill $BACKEND_PID 2>/dev/null || true
        kill $FRONTEND_PID 2>/dev/null || true
        exit 1
    fi
done

echo ""
echo "✅ RepoSensei is running!"
echo ""
echo "🌐 Frontend:  http://localhost:5173"
echo "🔧 Backend:   http://localhost:5000/api"
echo "📊 Health:    http://localhost:5000/api/health"
echo ""
echo "📝 Logs:"
echo "   Backend:  tail -f backend.log"
echo "   Frontend: tail -f frontend.log"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Trap Ctrl+C to clean up
trap 'echo ""; echo "🛑 Stopping servers..."; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo "✓ Servers stopped"; exit 0' INT

# Keep script running
wait