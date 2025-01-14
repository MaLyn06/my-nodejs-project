import { Request, Response } from "express";
import { scrapePageContent } from "../services/scraper";
import { generateSummary } from "../services/llm";
import Job from "../models/Job";

export const addScrapedContents = async (req: Request, res: Response): Promise<any> => {
    const { url, content } = req.body;
  
    if (!url && !content) {
      return res.status(400).json({ error: 'URL and content is required' });
    }
  
    try {
      // Create a new job
      const job = new Job({ url, content });

      await job.save();
      // Check if content is provided
      let jobContent = content;
  
      // If content is not provided, scrape the page content
      if (!jobContent) {
        try {
          jobContent = await scrapePageContent(url);
          if (!jobContent || jobContent.trim() === "") {
            return res.status(400).json({ error: 'Scraped content is empty or invalid' });
          }
        } catch (scrapeError) {
          job.status = 'failed';
          job.error_message = (scrapeError as Error).message; 
          job.updated_at = new Date();
          await job.save();
          return res.status(500).json({ error: 'Failed to scrape content' });
        }
      }
  
      try {
        const summary = await generateSummary(jobContent);
        console.log("summary", summary)
        job.status = 'completed';
        job.summary = summary;
      } catch (error) {
        job.status = 'failed';
        job.error_message = (error as Error).message;
      } finally {
        job.updated_at = new Date();
        await job.save();
      }
  
      // Return job status and information
      const { _id, url: _url, status } = job;
      return res.status(201).json({ id: _id, url: _url, status });
  
    } catch (error) {
      return res.status(500).json({ error: 'Failed to create job' });
    }
  };

export const getJobById = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    try {
      const job = await Job.findById(id);
      if (!job) return res.status(404).json({ error: 'Job not found' });
  
      const { _id, url, status, summary, error_message } = job;
      return res.json({
        id: _id,
        url,
        status,
        summary,
        error_message,
      });
      
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch job' });
    }
  }

  