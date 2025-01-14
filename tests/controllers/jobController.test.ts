import { Request, Response } from 'express';
import { addScrapedContents, getJobById } from '../../src/controllers/jobController';
import { scrapePageContent } from '../../src/services/scraper';
import { generateSummary } from '../../src/services/llm';
import Job from '../../src/models/Job';

jest.mock('../../src/services/scraper');
jest.mock('../../src/services/llm');
jest.mock('../../src/models/Job');

describe('Job Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJob: any;

  beforeEach(() => {
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockJob = {
      _id: 'test-id',
      url: 'http://test.com',
      status: 'pending',
      save: jest.fn(),
    };
    (Job as unknown as jest.Mock).mockImplementation(() => mockJob);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addScrapedContents', () => {
    it('should return 400 if no URL and content provided', async () => {
      mockRequest = {
        body: {},
      };

      await addScrapedContents(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'URL and content is required' });
    });

    it('should create job with provided content', async () => {
      mockRequest = {
        body: {
          url: 'http://test.com',
          content: 'test content',
        },
      };
      
      (generateSummary as jest.Mock).mockResolvedValue('test summary');

      await addScrapedContents(mockRequest as Request, mockResponse as Response);

      expect(mockJob.save).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        id: 'test-id',
        url: 'http://test.com',
        status: 'completed',
      });
    });

    it('should scrape content if not provided', async () => {
      mockRequest = {
        body: {
          url: 'http://test.com',
        },
      };
      
      (scrapePageContent as jest.Mock).mockResolvedValue('scraped content');
      (generateSummary as jest.Mock).mockResolvedValue('test summary');

      await addScrapedContents(mockRequest as Request, mockResponse as Response);

      expect(scrapePageContent).toHaveBeenCalledWith('http://test.com');
      expect(generateSummary).toHaveBeenCalledWith('scraped content');
      expect(mockJob.save).toHaveBeenCalled();
    });

    it('should handle scraping errors', async () => {
      mockRequest = {
        body: {
          url: 'http://test.com',
        },
      };
      
      (scrapePageContent as jest.Mock).mockRejectedValue(new Error('Scrape failed'));

      await addScrapedContents(mockRequest as Request, mockResponse as Response);

      expect(mockJob.status).toBe('failed');
      expect(mockJob.error_message).toBe('Scrape failed');
      expect(mockResponse.status).toHaveBeenCalledWith(500);
    });

    it('should handle summary generation errors', async () => {
      mockRequest = {
        body: {
          url: 'http://test.com',
          content: 'test content',
        },
      };
      
      (generateSummary as jest.Mock).mockRejectedValue(new Error('Summary failed'));

      await addScrapedContents(mockRequest as Request, mockResponse as Response);

      expect(mockJob.status).toBe('failed');
      expect(mockJob.error_message).toBe('Summary failed');
    });
  });

  describe('getJobById', () => {
    it('should return job if found', async () => {
      mockRequest = {
        params: { id: 'test-id' },
      };
      
      const mockFoundJob = {
        _id: 'test-id',
        url: 'http://test.com',
        status: 'completed',
        summary: 'test summary',
        error_message: null,
      };
      
      (Job.findById as jest.Mock).mockResolvedValue(mockFoundJob);

      await getJobById(mockRequest as Request, mockResponse as Response);

      expect(Job.findById).toHaveBeenCalledWith('test-id');
      expect(mockResponse.json).toHaveBeenCalledWith({
        id: 'test-id',
        url: 'http://test.com',
        status: 'completed',
        summary: 'test summary',
        error_message: null,
      });
    });

    it('should return 404 if job not found', async () => {
      mockRequest = {
        params: { id: 'non-existent' },
      };
      
      (Job.findById as jest.Mock).mockResolvedValue(null);

      await getJobById(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Job not found' });
    });
  });
});

