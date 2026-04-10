import os
from azure.identity import DefaultAzureCredential
from azure.ai.projects import AIProjectClient

PROJECT_ENDPOINT = os.environ["AZURE_AI_PROJECT_ENDPOINT"]
WORKFLOW_NAME = "campaign-orchestration-flow"
WORKFLOW_VERSION = "2"

with (
    DefaultAzureCredential() as credential,
    AIProjectClient(
        endpoint=PROJECT_ENDPOINT,
        credential=credential,
        allow_preview=True,
    ) as project_client,
):
    openai_client = project_client.get_openai_client()

    conversation = openai_client.conversations.create()
    print(f"Created conversation: {conversation.id}")

    stream = openai_client.responses.create(
        conversation=conversation.id,
        input="Genera una campaña para un smartwatch fitness para público de 25 a 40 años. Canales: Instagram y TikTok. Tono: moderno, cercano y enérgico.",
        stream=True,
        extra_body={
            "agent_reference": {
                "name": WORKFLOW_NAME,
                "type": "agent_reference",
                "version": WORKFLOW_VERSION,
            }
        },
        metadata={"x-ms-debug-mode-enabled": "1"},
    )

    for event in stream:
        if event.type == "response.output_text.delta":
            print(event.delta, end="", flush=True)

        elif event.type == "response.output_text.done":
            print("\n\n--- texto final completado ---")

        elif (
            event.type == "response.output_item.added"
            and getattr(event.item, "type", None) == "workflow_action"
        ):
            print(f"\n[START] {event.item.action_id} status={event.item.status}")

        elif (
            event.type == "response.output_item.done"
            and getattr(event.item, "type", None) == "workflow_action"
        ):
            print(f"\n[END] {event.item.action_id} status={event.item.status}")

        elif event.type == "response.failed":
            print(f"\n[ERROR] {event}")

    openai_client.conversations.delete(conversation_id=conversation.id)
    print("\nConversation deleted")