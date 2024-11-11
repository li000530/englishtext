from transformers import AutoTokenizer, AutoModelForCausalLM
import os
proxy_server = '127.0.0.1'

proxy_port='7890'

# Set environment variables for the proxy
os.environ['http_proxy'] = f'http://{proxy_server}:{proxy_port}'
os.environ['https_proxy'] = f'http://{proxy_server}:{proxy_port}'

huggingface_token = "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"

# Update to use the 'token' argument instead of 'use_auth_token'
tokenizer = AutoTokenizer.from_pretrained("google/gemma-2b", token=huggingface_token)
model = AutoModelForCausalLM.from_pretrained("google/gemma-2b", token=huggingface_token)

input_text = "Where is the capital of the United States?"
input_ids = tokenizer(input_text, return_tensors="pt").to("cpu")

outputs = model.generate(**input_ids)

print(tokenizer.decode(outputs[0]))