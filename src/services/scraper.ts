import puppeteer from 'puppeteer';

export async function scrapePageContent(url: string): Promise<string> {
  const browser = await puppeteer.launch({ headless: true }).catch(console.error);
  if (!browser) {
    throw new Error('Puppeteer failed to launch browser');
  }

  const page = await browser.newPage();
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });  // Increased timeout
    const content = await page.evaluate(() => {
    const body = document.querySelector('body');
      return body ? body.innerText : '';
    });
    return content;
  } catch (error) {
    throw new Error('Failed to scrape content from the URL');
  } finally {
    await browser.close();
  }
}
