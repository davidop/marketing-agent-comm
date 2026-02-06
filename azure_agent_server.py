"""
Azure AI Agent Server
Connects the Foundry Workflow to Azure AI Agent using azure.ai.projects SDK
"""
from flask import Flask, request, jsonify
from flask_cors import CORS
from azure.ai.projects import AIProjectClient
from azure.identity import DefaultAzureCredential
from azure.ai.agents.models import ListSortOrder
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# Azure AI Agent configuration
AZURE_ENDPOINT = os.getenv(
    'AZURE_AIPROJECT_ENDPOINT',
    'https://tenerife-winter-resource.services.ai.azure.com/api/projects/tenerife-winter'
)
AGENT_ID = os.getenv('AZURE_AGENT_ID', 'asst_nJy3ICZrtfnUcpcldqpiEBTQ')

# Initialize Azure AI Project Client
try:
    project = AIProjectClient(
        credential=DefaultAzureCredential(),
        endpoint=AZURE_ENDPOINT
    )
    print(f"✅ Connected to Azure AI Project: {AZURE_ENDPOINT}")
except Exception as e:
    print(f"⚠️  Warning: Could not initialize Azure AI client: {e}")
    print("   The server will start but Azure AI features won't work.")
    project = None


@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'azure_connected': project is not None,
        'endpoint': AZURE_ENDPOINT,
        'agent_id': AGENT_ID
    })


@app.route('/api/azure-agent/thread/create', methods=['POST'])
def create_thread():
    """Create a new conversation thread with the Azure AI Agent"""
    if not project:
        return jsonify({'error': 'Azure AI client not initialized'}), 500
    
    try:
        thread = project.agents.threads.create()
        print(f"Created thread, ID: {thread.id}")
        
        return jsonify({
            'thread_id': thread.id,
            'created_at': str(thread.created_at) if hasattr(thread, 'created_at') else None
        })
    except Exception as e:
        print(f"Error creating thread: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/azure-agent/message/send', methods=['POST'])
def send_message():
    """Send a message to the Azure AI Agent and get a response"""
    if not project:
        return jsonify({'error': 'Azure AI client not initialized'}), 500
    
    data = request.json
    thread_id = data.get('thread_id')
    content = data.get('content', '')
    
    if not thread_id:
        return jsonify({'error': 'thread_id is required'}), 400
    
    if not content:
        return jsonify({'error': 'content is required'}), 400
    
    try:
        # Get or create agent
        agent = project.agents.get_agent(AGENT_ID)
        
        # Create user message
        message = project.agents.messages.create(
            thread_id=thread_id,
            role="user",
            content=content
        )
        
        # Create and process run
        run = project.agents.runs.create_and_process(
            thread_id=thread_id,
            agent_id=agent.id
        )
        
        # Check run status
        if run.status == "failed":
            error_message = run.last_error if hasattr(run, 'last_error') else "Run failed"
            print(f"Run failed: {error_message}")
            return jsonify({
                'error': f'Run failed: {error_message}',
                'run_status': run.status
            }), 500
        
        # Get messages
        messages = project.agents.messages.list(
            thread_id=thread_id,
            order=ListSortOrder.ASCENDING
        )
        
        # Extract assistant messages
        response_messages = []
        for msg in messages:
            if msg.text_messages:
                response_messages.append({
                    'role': msg.role,
                    'content': msg.text_messages[-1].text.value
                })
        
        return jsonify({
            'thread_id': thread_id,
            'run_id': run.id,
            'run_status': run.status,
            'messages': response_messages
        })
        
    except Exception as e:
        print(f"Error sending message: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/azure-agent/messages/list', methods=['POST'])
def list_messages():
    """List all messages in a thread"""
    if not project:
        return jsonify({'error': 'Azure AI client not initialized'}), 500
    
    data = request.json
    thread_id = data.get('thread_id')
    
    if not thread_id:
        return jsonify({'error': 'thread_id is required'}), 400
    
    try:
        messages = project.agents.messages.list(
            thread_id=thread_id,
            order=ListSortOrder.ASCENDING
        )
        
        message_list = []
        for msg in messages:
            if msg.text_messages:
                message_list.append({
                    'id': msg.id,
                    'role': msg.role,
                    'content': msg.text_messages[-1].text.value,
                    'created_at': str(msg.created_at) if hasattr(msg, 'created_at') else None
                })
        
        return jsonify({
            'thread_id': thread_id,
            'messages': message_list
        })
        
    except Exception as e:
        print(f"Error listing messages: {e}")
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    port = int(os.getenv('AZURE_AGENT_PORT', 5001))
    # Parse debug mode - accepts: 'true', 'True', '1', 'yes', 'Yes'
    debug_env = os.getenv('FLASK_DEBUG', 'false').lower()
    debug_mode = debug_env in ('true', '1', 'yes')
    print(f"🚀 Starting Azure AI Agent Server on port {port}")
    print(f"   Endpoint: {AZURE_ENDPOINT}")
    print(f"   Agent ID: {AGENT_ID}")
    print(f"   Debug mode: {debug_mode}")
    if debug_mode:
        print("   ⚠️  WARNING: Debug mode is enabled. Do not use in production!")
    app.run(host='0.0.0.0', port=port, debug=debug_mode)
