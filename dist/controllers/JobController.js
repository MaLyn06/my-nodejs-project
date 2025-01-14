"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJobById = exports.addScrapedContents = void 0;
const scraper_1 = require("../services/scraper");
const llm_1 = require("../services/llm");
const Job_1 = __importDefault(require("../models/Job"));
const addScrapedContents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { url, content } = req.body;
    if (!url && !content) {
        return res.status(400).json({ error: 'URL and content is required' });
    }
    try {
        // Create a new job
        const job = new Job_1.default({ url, content });
        yield job.save();
        // Check if content is provided
        let jobContent = content;
        // If content is not provided, scrape the page content
        if (!jobContent) {
            try {
                jobContent = yield (0, scraper_1.scrapePageContent)(url);
                if (!jobContent || jobContent.trim() === "") {
                    return res.status(400).json({ error: 'Scraped content is empty or invalid' });
                }
            }
            catch (scrapeError) {
                job.status = 'failed';
                job.error_message = scrapeError.message;
                job.updated_at = new Date();
                yield job.save();
                return res.status(500).json({ error: 'Failed to scrape content' });
            }
        }
        try {
            const summary = yield (0, llm_1.generateSummary)(jobContent);
            console.log("summary", summary);
            job.status = 'completed';
            job.summary = summary;
        }
        catch (error) {
            job.status = 'failed';
            job.error_message = error.message;
        }
        finally {
            job.updated_at = new Date();
            yield job.save();
        }
        // Return job status and information
        const { _id, url: _url, status } = job;
        return res.status(201).json({ id: _id, url: _url, status });
    }
    catch (error) {
        return res.status(500).json({ error: 'Failed to create job' });
    }
});
exports.addScrapedContents = addScrapedContents;
const getJobById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const job = yield Job_1.default.findById(id);
        if (!job)
            return res.status(404).json({ error: 'Job not found' });
        const { _id, url, status, summary, error_message } = job;
        return res.json({
            id: _id,
            url,
            status,
            summary,
            error_message,
        });
    }
    catch (error) {
        return res.status(500).json({ error: 'Failed to fetch job' });
    }
});
exports.getJobById = getJobById;
