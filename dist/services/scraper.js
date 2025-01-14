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
exports.scrapePageContent = scrapePageContent;
const puppeteer_1 = __importDefault(require("puppeteer"));
function scrapePageContent(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const browser = yield puppeteer_1.default.launch({ headless: true }).catch(console.error);
        if (!browser) {
            throw new Error('Puppeteer failed to launch browser');
        }
        const page = yield browser.newPage();
        try {
            yield page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 }); // Increased timeout
            const content = yield page.evaluate(() => {
                const body = document.querySelector('body');
                return body ? body.innerText : '';
            });
            return content;
        }
        catch (error) {
            throw new Error('Failed to scrape content from the URL');
        }
        finally {
            yield browser.close();
        }
    });
}
