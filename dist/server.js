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
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const jobRoutes_1 = __importDefault(require("./routes/jobRoutes"));
const app = (0, express_1.default)();
dotenv_1.default.config();
// Middleware
app.use(express_1.default.json());
app.use('/jobs', jobRoutes_1.default);
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    const { MONGO_URI, PORT } = process.env;
    if (!MONGO_URI)
        throw new Error('MONGO_URI is required');
    if (!PORT)
        throw new Error('Port is required');
    try {
        yield mongoose_1.default.connect(MONGO_URI || "");
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT || 3000}`);
        });
    }
    catch (error) {
        throw new Error(`MongoDB Connection Error: ${error.message}`);
    }
});
startServer();
