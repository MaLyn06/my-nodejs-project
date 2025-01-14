import { scrapePageContent } from '../../src/services/scraper';
import puppeteer from 'puppeteer';

jest.mock('puppeteer');

describe('Scraper Service', () => {
  const mockBrowser = {
    newPage: jest.fn(),
    close: jest.fn(),
  };

  const mockPage = {
    goto: jest.fn(),
    evaluate: jest.fn(),
  };

  beforeEach(() => {
    (puppeteer.launch as jest.Mock).mockResolvedValue(mockBrowser);
    mockBrowser.newPage.mockResolvedValue(mockPage);
    mockPage.goto.mockResolvedValue(null);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully scrape page content', async () => {
    const mockContent = 'Scraped content';
    mockPage.evaluate.mockResolvedValue(mockContent);

    const result = await scrapePageContent('http://test.com');

    expect(puppeteer.launch).toHaveBeenCalledWith({ headless: true });
    expect(mockPage.goto).toHaveBeenCalledWith(
      'http://test.com',
      { waitUntil: 'domcontentloaded', timeout: 60000 }
    );
    expect(result).toBe(mockContent);
    expect(mockBrowser.close).toHaveBeenCalled();
  });

  it('should handle browser launch failure', async () => {
    (puppeteer.launch as jest.Mock).mockRejectedValue(new Error('Browser launch failed'));

    await expect(scrapePageContent('http://test.com')).rejects.toThrow('Puppeteer failed to launch browser');
  });

  it('should handle page navigation failure', async () => {
    mockPage.goto.mockRejectedValue(new Error('Navigation failed'));

    await expect(scrapePageContent('http://test.com')).rejects.toThrow('Failed to scrape content from the URL');
    expect(mockBrowser.close).toHaveBeenCalled();
  });
});