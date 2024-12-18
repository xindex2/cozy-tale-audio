import { openaiClient } from "../apis/openai/openaiClient";

export async function generateChatResponse(prompt: string, storyContext?: string): Promise<string> {
  try {
    const fullPrompt = storyContext 
      ? `Based on this story: "${storyContext}"\n\n${prompt}`
      : prompt;
      
    const response = await openaiClient.generateContent(fullPrompt);
    return response;
  } catch (error) {
    console.error("Error generating chat response:", error);
    throw error;
  }
}