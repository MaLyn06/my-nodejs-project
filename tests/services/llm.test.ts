import { generateSummary } from '../../src/services/llm';
import axios from 'axios';

jest.mock('axios');

describe('LLM Service', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env.OPENAI_API_KEY = 'test-key';
    process.env.OPEN_AI_URL = 'http://test-openai-url';
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.clearAllMocks();
  });

  it('should successfully generate summary', async () => {
    const mockResponse = {
      data: {
        choices: [
          {
            message: {
              content: 'Generated summary',
            },
          },
        ],
      },
    };

    (axios.post as jest.Mock).mockResolvedValue(mockResponse);

    const result = await generateSummary('Test content');

    expect(axios.post).toHaveBeenCalledWith(
      'http://test-openai-url',
      {
        model: 'gpt-4o-mini',
        messages: [
          { role: 'user', content: 'This is a short summary of the content from the URL.\nTest content' },
        ],
        temperature: 0.7,
      },
      {
        headers: { Authorization: 'Bearer test-key' },
      }
    );
    expect(result).toBe('Generated summary');
  });

  it('should throw error if OPENAI_API_KEY is missing', async () => {
    delete process.env.OPENAI_API_KEY;

    await expect(generateSummary('Test content')).rejects.toThrow('OPENAI_API_KEY is required');
  });

  it('should throw error if OPEN_AI_URL is missing', async () => {
    delete process.env.OPEN_AI_URL;

    await expect(generateSummary('Test content')).rejects.toThrow('OPEN_AI_URL');
  });

  it('should handle API errors', async () => {
    (axios.post as jest.Mock).mockRejectedValue(new Error('API error'));

    await expect(generateSummary('Test content')).rejects.toThrow('Failed to generate summary');
  });
});