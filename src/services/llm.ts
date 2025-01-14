import axios from 'axios';


export async function generateSummary(text: string): Promise<string> {

  const { OPENAI_API_KEY, OPEN_AI_URL } = process.env

  if(!OPENAI_API_KEY) throw new Error('OPENAI_API_KEY is required')
  if(!OPEN_AI_URL) throw new Error('OPEN_AI_URL')
 
  try {
    const response = await axios.post(
      OPEN_AI_URL, 
      {
        model: "gpt-4o-mini",  
        messages: [
          { role: "user", content: `This is a short summary of the content from the URL.\n${text}` }
        ],
        temperature: 0.7
      },
      {
        headers: { Authorization: `Bearer ${OPENAI_API_KEY}` },
      }
    );
    
    return response.data.choices[0].message.content.trim();  
  } catch (error) {
    throw new Error('Failed to generate summary');
  }
}
