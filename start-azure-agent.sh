#!/bin/bash

# Start Azure AI Agent Integration
# This script starts both the Python backend and the frontend development server

echo "🚀 Starting Campaign Impact Hub with Azure AI Agent Integration"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3 and try again."
    exit 1
fi

# Recommend virtual environment
if [ -z "$VIRTUAL_ENV" ]; then
    echo "⚠️  Warning: Not running in a virtual environment"
    echo "   It's recommended to create one with: python3 -m venv venv && source venv/bin/activate"
    echo "   Press Ctrl+C to cancel or wait 5 seconds to continue..."
    sleep 5
fi

# Check if dependencies are installed
if ! python3 -c "import flask" &> /dev/null; then
    echo "📦 Installing Python dependencies..."
    pip install -r requirements.txt
    echo ""
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  Warning: .env file not found"
    echo "   Please copy .env.example to .env and configure your credentials:"
    echo "   cp .env.example .env"
    echo ""
    read -p "Do you want to create a basic .env file now? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        cp .env.example .env
        echo "✅ Created .env file from template. Please configure your Azure credentials."
        echo "   Edit .env and add your Azure endpoint and agent ID."
    else
        echo "❌ Cannot continue without .env file. Exiting."
        exit 1
    fi
    echo ""
fi

# Check Azure authentication
echo "🔐 Checking Azure authentication..."
if az account show &> /dev/null; then
    echo "✅ Azure CLI authenticated"
    ACCOUNT=$(az account show --query name -o tsv)
    echo "   Using account: $ACCOUNT"
else
    echo "⚠️  Azure CLI not authenticated. Run 'az login' or set environment variables."
    echo "   The server will start but Azure features may not work."
fi
echo ""

# Start Python backend in background
echo "🐍 Starting Python backend on port 5001..."
python3 azure_agent_server.py &
BACKEND_PID=$!
echo "   Backend PID: $BACKEND_PID"
echo ""

# Wait for backend to start
sleep 3

# Check if backend is running
if curl -s http://localhost:5001/health > /dev/null; then
    echo "✅ Backend is running"
else
    echo "⚠️  Backend may not be running properly"
fi
echo ""

# Start frontend
echo "⚛️  Starting frontend development server..."
echo ""
npm run dev

# Cleanup on exit
trap "echo ''; echo '🛑 Stopping servers...'; kill $BACKEND_PID 2>/dev/null; exit" INT TERM

wait
