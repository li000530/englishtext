from typing import Optional

from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler
from langchain.chat_models import ChatOpenAI
from langchain.schema import BaseMessage, HumanMessage
from transformers import AutoTokenizer, AutoModelForCausalLM

from realtime_ai_character.database.chroma import get_chroma
from realtime_ai_character.llm.base import (
    AsyncCallbackAudioHandler,
    AsyncCallbackTextHandler,
    LLM,
)
from realtime_ai_character.logger import get_logger
from realtime_ai_character.utils import Character, timed


logger = get_logger(__name__)


class LocalLlm(LLM):
    def __init__(self, url):
        self.chat_open_ai = ChatOpenAI(
            model="Local LLM",
            temperature=0.5,
            streaming=True,
            openai_api_base=url,
        )
        # self.tokenizer = AutoTokenizer.from_pretrained(url)
        # self.model = AutoModelForCausalLM.from_pretrained(url)
        self.config = {"model": "Local LLM", "temperature": 0.5, "streaming": True}
        self.db = get_chroma()

    # def __init__(self, model_name: str, huggingface_token: str):
    #     self.tokenizer = AutoTokenizer.from_pretrained(model_name, token=huggingface_token)
    #     self.model = AutoModelForCausalLM.from_pretrained(model_name, token=huggingface_token)
    #     self.config = {"model": model_name, "temperature": 0.5, "streaming": True}
    #     self.db = get_chroma()

    def get_config(self):
        return self.config

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
        # 1. Generate context
        context = self._generate_context(user_input, character)

        # 2. Add user input to history
        history.append(
            HumanMessage(
                content=character.llm_user_prompt.format(context=context, query=user_input)
            )
        )

        # 3. Generate response
        callbacks = [callback, StreamingStdOutCallbackHandler()]
        if audioCallback is not None:
            callbacks.append(audioCallback)
        response = await self.chat_open_ai.agenerate(
            [history],
            callbacks=callbacks,
            metadata=metadata,
        )
        logger.info(f"Response: {response}")
        return response.generations[0][0].text

        # input_ids = self.tokenizer(user_input, return_tensors="pt").to("cpu")
        # outputs = self.model.generate(**input_ids)
        # response_text = self.tokenizer.decode(outputs[0])
        #
        # logger.info(f"Response: {response_text}")
        # return response_text


    def _generate_context(self, query, character: Character) -> str:
        docs = self.db.similarity_search(query)
        docs = [d for d in docs if d.metadata["character_name"] == character.name]
        logger.info(f"Found {len(docs)} documents")

        context = "\n".join([d.page_content for d in docs])
        return context
