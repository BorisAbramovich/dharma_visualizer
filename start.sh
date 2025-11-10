#!/bin/bash

# Dharma Visualizer Startup Script

echo "🧘 Starting Dharma Visualizer..."
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 is not installed. Please install Python 3.8+ first."
    exit 1
fi

# Check if Node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Start backend
echo "🔧 Starting FastAPI backend..."
cd backend

# Install Python dependencies if needed
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

source venv/bin/activate
pip install -q -r requirements.txt

# Start backend in background
python main.py &
BACKEND_PID=$!
echo "✅ Backend running on http://localhost:8000 (PID: $BACKEND_PID)"

cd ..

# Start frontend
echo "🎨 Starting React frontend..."
cd frontend

# Install npm dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing npm dependencies..."
    npm install
fi

# Start frontend
npm run dev &
FRONTEND_PID=$!
echo "✅ Frontend running on http://localhost:3000 (PID: $FRONTEND_PID)"

echo ""
echo "🌟 Dharma Visualizer is ready!"
echo "   Backend:  http://localhost:8000"
echo "   Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for Ctrl+C
trap "echo ''; echo '🛑 Shutting down...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT
wait
