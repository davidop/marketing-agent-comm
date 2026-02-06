#!/usr/bin/env python3
"""
Test script for Azure AI Agent integration
This script verifies the basic functionality without actually connecting to Azure
"""
import sys
import json

def test_imports():
    """Test that all required modules can be imported"""
    print("Testing Python module imports...")
    try:
        from flask import Flask
        print("✅ Flask imported successfully")
    except ImportError as e:
        print(f"❌ Failed to import Flask: {e}")
        return False
    
    try:
        from flask_cors import CORS
        print("✅ Flask-CORS imported successfully")
    except ImportError as e:
        print(f"❌ Failed to import Flask-CORS: {e}")
        return False
    
    try:
        from dotenv import load_dotenv
        print("✅ python-dotenv imported successfully")
    except ImportError as e:
        print(f"❌ Failed to import python-dotenv: {e}")
        return False
    
    # Azure modules are optional for basic testing
    try:
        from azure.ai.projects import AIProjectClient
        from azure.identity import DefaultAzureCredential
        from azure.ai.agents.models import ListSortOrder
        print("✅ Azure AI modules imported successfully")
        return True
    except ImportError as e:
        print(f"⚠️  Azure AI modules not available: {e}")
        print("   This is expected if not authenticated to Azure")
        print("   The server will start but won't connect to Azure")
        return True

def test_server_structure():
    """Test that the server file has correct structure"""
    print("\nTesting server structure...")
    try:
        with open('azure_agent_server.py', 'r') as f:
            content = f.read()
            
        # Check for key endpoints
        required_endpoints = [
            '/health',
            '/api/azure-agent/thread/create',
            '/api/azure-agent/message/send',
            '/api/azure-agent/messages/list'
        ]
        
        for endpoint in required_endpoints:
            if endpoint in content:
                print(f"✅ Endpoint {endpoint} defined")
            else:
                print(f"❌ Endpoint {endpoint} missing")
                return False
        
        # Check for key functions
        if 'AIProjectClient' in content:
            print("✅ AIProjectClient usage found")
        else:
            print("❌ AIProjectClient not used")
            return False
            
        return True
    except Exception as e:
        print(f"❌ Failed to read server file: {e}")
        return False

def test_typescript_client():
    """Test TypeScript client structure"""
    print("\nTesting TypeScript client...")
    try:
        with open('src/lib/azureAgentClient.ts', 'r') as f:
            content = f.read()
        
        # Check for key methods
        required_methods = [
            'createThread',
            'sendMessage',
            'listMessages',
            'healthCheck'
        ]
        
        for method in required_methods:
            if method in content:
                print(f"✅ Method {method} defined")
            else:
                print(f"❌ Method {method} missing")
                return False
        
        return True
    except Exception as e:
        print(f"❌ Failed to read TypeScript client: {e}")
        return False

def test_foundry_integration():
    """Test that foundryClient.ts has Azure Agent integration"""
    print("\nTesting Foundry Client integration...")
    try:
        with open('src/lib/foundryClient.ts', 'r') as f:
            content = f.read()
        
        checks = [
            ('useAzureAgent', 'Azure Agent config option'),
            ('runViaAzureAgent', 'Azure Agent run function'),
            ('VITE_USE_AZURE_AGENT', 'Environment variable check')
        ]
        
        for check, description in checks:
            if check in content:
                print(f"✅ {description} found")
            else:
                print(f"❌ {description} missing")
                return False
        
        return True
    except Exception as e:
        print(f"❌ Failed to read foundryClient: {e}")
        return False

def main():
    """Run all tests"""
    print("=" * 60)
    print("Azure AI Agent Integration Test Suite")
    print("=" * 60)
    print()
    
    results = []
    
    results.append(("Module Imports", test_imports()))
    results.append(("Server Structure", test_server_structure()))
    results.append(("TypeScript Client", test_typescript_client()))
    results.append(("Foundry Integration", test_foundry_integration()))
    
    print("\n" + "=" * 60)
    print("Test Results Summary")
    print("=" * 60)
    
    for test_name, passed in results:
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{status}: {test_name}")
    
    all_passed = all(result[1] for result in results)
    
    print("\n" + "=" * 60)
    if all_passed:
        print("✅ All tests passed!")
        print("\nNext steps:")
        print("1. Configure Azure credentials (az login or set env vars)")
        print("2. Start the backend: python3 azure_agent_server.py")
        print("3. Start the frontend: npm run dev")
        print("4. Set VITE_USE_AZURE_AGENT=true in your .env")
        return 0
    else:
        print("❌ Some tests failed")
        return 1

if __name__ == '__main__':
    sys.exit(main())
