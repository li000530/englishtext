import json
import os
import requests
from typing import Optional
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler
from langchain.schema import BaseMessage, HumanMessage
from rebyte_langchain.rebyte_langchain import RebyteEndpoint
from realtime_ai_character.llm.base import (
    AsyncCallbackAudioHandler,
    AsyncCallbackTextHandler,
    LLM,
)
from realtime_ai_character.logger import get_logger
from realtime_ai_character.utils import Character, timed

logger = get_logger(__name__)

class ldnllm(LLM):
    def __init__(self):
        self.config = {}

    def get_config(self):
        return self.config

    def send_message_to_ollama(self, message, port=11434):
        url = f"http://localhost:{port}/api/generate"
        payload = {
            "model": "llama3",
            "prompt": message
        }
        response = requests.post(url, json=payload, stream=True)
        if response.status_code == 200:
            response_content = ""
            for line in response.iter_lines():
                if line:
                    decoded_line = line.decode('utf-8')  # 解码字节数据为字符串
                    response_content += json.loads(decoded_line)["response"]
            return response_content
        else:
            return f"Error: {response.status_code} - {response.text}"

    def _set_character_config(self, character: Character):
        # self.chat_rebyte.project_id = character.rebyte_api_project_id
        # self.chat_rebyte.agent_id = character.rebyte_api_agent_id
        # if character.rebyte_api_version is not None:
        #     self.chat_rebyte.version = character.rebyte_api_version
        pass

    def _set_user_config(self, user_id: str):
        # self.chat_rebyte.session_id = user_id
        pass

    @timed
    async def achat(
        self,
        history: list[BaseMessage],
        user_input: str,
        user_id: str,
        character: Character,
        callback: AsyncCallbackTextHandler,
        audioCallback: Optional[AsyncCallbackAudioHandler] = None,
        metadata: Optional[dict] = None,
        *args,
        **kwargs,
    ) -> str:
        # 1. Add user input to history
        # delete the first system message in history. just use the system prompt in rebyte platform
        history.pop(0)

        history.append(HumanMessage(content=user_input))
        # 2. Generate response
        # set project_id and agent_id for character
        self._set_character_config(character=character)
        # set session_id for user
        self._set_user_config(user_id)

        callbacks = [callback, StreamingStdOutCallbackHandler()]

        if audioCallback is not None:
            callbacks.append(audioCallback)

        response = self.send_message_to_ollama(user_input)
        await callback.on_new_token(response)
        logger.info(f"Response: {response}")
        return response
