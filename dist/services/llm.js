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
exports.generateSummary = generateSummary;
const axios_1 = __importDefault(require("axios"));
function generateSummary(text) {
    return __awaiter(this, void 0, void 0, function* () {
        const { OPENAI_API_KEY, OPEN_AI_URL } = process.env;
        if (!OPENAI_API_KEY)
            throw new Error('OPENAI_API_KEY is required');
        if (!OPEN_AI_URL)
            throw new Error('OPEN_AI_URL');
        try {
            const response = yield axios_1.default.post(OPEN_AI_URL, {
                model: "gpt-4o-mini",
                messages: [
                    { role: "user", content: `This is a short summary of the content from the URL.\n${text}` }
                ],
                temperature: 0.7
            }, {
                headers: { Authorization: `Bearer ${OPENAI_API_KEY}` },
            });
            return response.data.choices[0].message.content.trim();
        }
        catch (error) {
            throw new Error('Failed to generate summary');
        }
    });
}
