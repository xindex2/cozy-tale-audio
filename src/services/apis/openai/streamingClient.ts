export const streamContent = async (
  messages: { role: string; content: string }[],
  onChunk: (chunk: string) => void
) => {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages,
      stream: true,
    }),
  });

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();

  while (reader) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split('\n');
    
    for (const line of lines) {
      if (line.trim() === '') continue;
      if (line.trim() === 'data: [DONE]') continue;
      
      try {
        const jsonStr = line.replace(/^data: /, '');
        const json = JSON.parse(jsonStr);
        const content = json.choices[0]?.delta?.content || '';
        if (content) {
          onChunk(content);
        }
      } catch (e) {
        console.error('Error parsing streaming response:', e);
      }
    }
  }
};