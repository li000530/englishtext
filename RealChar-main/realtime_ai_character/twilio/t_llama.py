import requests
import json

def send_message_to_ollama_chat(message, port=11434):
    url = f"http://localhost:{port}/api/chat"
    payload = {
        "model": "llama3",
        "messages": [{"role": "user", "content": message}]
    }
    response = requests.post(url, json=payload)
    if response.status_code == 200:
        response_content = ""
        for line in response.iter_lines():
            if line:
                response_content += json.loads(line)["message"]["content"]
        return response_content
    else:
        return f"Error: {response.status_code} - {response.text}"

def send_message_to_ollama(message, port=11434):
    url = f"http://localhost:{port}/api/generate"
    payload = {
        "model": "llama3",
        "prompt": message
    }
    response = requests.post(url, json=payload)
    if response.status_code == 200:
        response_content = ""
        for line in response.iter_lines():
            if line:
                response_content += json.loads(line)["response"]
        return response_content
    else:
        return f"Error: {response.status_code} - {response.text}"

if __name__ == "__main__":
    user_input = "why is the sky blue?"
    response = send_message_to_ollama(user_input)
    print("Ollama's response:")
    print(response)
