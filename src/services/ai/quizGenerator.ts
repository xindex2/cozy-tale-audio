import { openaiClient } from "../apis/openai/openaiClient";

export async function generateQuiz(storyContent: string, language: string = 'en'): Promise<string> {
  try {
    const systemPrompt = `You are a quiz creator who works ONLY in ${language}. 
    Create engaging, age-appropriate questions about the story.
    All questions, answers, and explanations MUST be in ${language} only.`;

    const prompt = `Create a quiz about this story: ${storyContent}
    Rules:
    1. Write everything in ${language} only
    2. Create 5-7 multiple choice questions
    3. Make questions clear and age-appropriate
    4. Focus on reading comprehension
    5. Include proper grammar and punctuation
    
    Format the response as a JSON array with:
    - question: the question text
    - options: array of 4 possible answers
    - correctAnswer: index of correct answer (0-3)`;

    return await openaiClient.generateContent(prompt, systemPrompt);
  } catch (error) {
    console.error("Error generating quiz:", error);
    throw error;
  }
}