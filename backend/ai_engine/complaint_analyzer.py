from groq import Groq
from django.conf import settings
import json

class ComplaintAnalyzer:
    def __init__(self):
        self.client = Groq(api_key=settings.GROQ_API_KEY)
        self.model = settings.GROQ_MODEL

    def analyze_complaint(self, text):
        prompt = f"""
        Analyze the following ISP customer complaint and extract key information.
        Return ONLY a JSON object with these keys:
        - category (speed_issue, router, outage, billing, installation)
        - priority (urgent, medium, low)
        - confidence (float 0-1)
        - suggested_action (string, brief next step)

        Complaint text: "{text}"
        """
        
        try:
            completion = self.client.chat.completions.create(
                messages=[{"role": "user", "content": prompt}],
                model=self.model,
                temperature=0.1,
                response_format={"type": "json_object"}
            )
            
            result = json.loads(completion.choices[0].message.content)
            return {
                'success': True,
                'data': result
            }
        except Exception as e:
            # Fallback logic if AI fails
            return {
                'success': False,
                'data': {
                    'category': 'outage',
                    'priority': 'medium',
                    'confidence': 0.0,
                    'suggested_action': 'Manual review required'
                },
                'error': str(e)
            }
