from groq import Groq
from django.conf import settings

class NetFlowChatbot:
    def __init__(self):
        self.client = Groq(api_key=settings.GROQ_API_KEY)
        self.model = settings.GROQ_MODEL
        self.system_prompt = """
        You are the NetFlow ISP customer support chatbot.
        Help customers with basic troubleshooting:
        1. Router restart instructions
        2. Billing inquiries
        3. General package info
        Be polite, concise, and helpful. Format responses with line breaks if necessary.
        """

    def get_response(self, user_message):
        try:
            completion = self.client.chat.completions.create(
                messages=[
                    {"role": "system", "content": self.system_prompt},
                    {"role": "user", "content": user_message}
                ],
                model=self.model,
                temperature=0.5,
            )
            return completion.choices[0].message.content
        except Exception as e:
            return "I am currently experiencing technical difficulties. Please try again later or contact our support number."
