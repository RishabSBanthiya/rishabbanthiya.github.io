// Detect if we're in production or development
const isProduction = import.meta.env.PROD;
const OLLAMA_API_URL = isProduction 
  ? '/api/generate'  // Use relative URL in production (nginx proxy)
  : 'http://localhost:11434/api/generate';  // Direct connection in development
const MODEL_NAME = 'rishab-bot';

interface OllamaResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
}

// Simple streaming query - no need for system prompt, it's in the model!
export async function* queryOllamaStream(
  userQuery: string,
  model: string = MODEL_NAME
): AsyncGenerator<string> {
  try {
    const response = await fetch(OLLAMA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        prompt: userQuery, // Just the user query, model has the context!
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Ollama error response:', errorText);
      
      if (response.status === 404) {
        throw new Error('MODEL_NOT_FOUND');
      }
      throw new Error(`Ollama API error: ${response.status}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error('No response body');
    }

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter(line => line.trim());

      for (const line of lines) {
        try {
          const json: OllamaResponse = JSON.parse(line);
          if (json.response) {
            yield json.response;
          }
        } catch (e) {
          console.warn('Failed to parse JSON chunk:', line);
        }
      }
    }
  } catch (error) {
    console.error('Ollama Stream Error:', error);
    
    if (error instanceof Error) {
      if (error.message === 'MODEL_NOT_FOUND') {
        yield `⚠️ Custom model "rishab-bot" not found.\n\nPlease run: npm run build:ollama\n\nThis will create your personalized AI model.`;
        return;
      }
      
      if (error.message.includes('fetch') || error.message.includes('network')) {
        yield "⚠️ Ollama isn't running.\n\nStart it with: ollama serve\n\nThen reload this page.";
        return;
      }
    }
    
    yield "I'm having trouble connecting to the local AI. Please ensure Ollama is running.";
  }
}

// Check if Ollama is running
export async function checkOllamaStatus(): Promise<boolean> {
  try {
    const apiUrl = isProduction ? '/api/tags' : 'http://localhost:11434/api/tags';
    const response = await fetch(apiUrl, {
      method: 'GET',
    });
    return response.ok;
  } catch {
    return false;
  }
}

// Check if custom model exists
export async function checkCustomModel(): Promise<boolean> {
  try {
    const apiUrl = isProduction ? '/api/tags' : 'http://localhost:11434/api/tags';
    const response = await fetch(apiUrl);
    const data = await response.json();
    const models = data.models?.map((m: any) => m.name) || [];
    return models.some((name: string) => name.startsWith('rishab-bot'));
  } catch {
    return false;
  }
}

// Get available models
export async function getAvailableModels(): Promise<string[]> {
  try {
    const apiUrl = isProduction ? '/api/tags' : 'http://localhost:11434/api/tags';
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data.models?.map((m: any) => m.name) || [];
  } catch {
    return [];
  }
}


