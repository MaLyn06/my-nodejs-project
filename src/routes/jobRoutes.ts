import express from 'express';
import { addScrapedContents, getJobById } from '../controllers/jobController';

const router = express.Router();

router.post('/', addScrapedContents);

router.get('/:id', getJobById);

export default router; 
