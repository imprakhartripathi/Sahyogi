import { GoogleGenerativeAI } from "@google/generative-ai";
import { Request, Response } from "express";
const genAI = new GoogleGenerativeAI("YOUR_API_KEY");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


const genAIController = async (req: Request, res: Response): Promise<void> => {
    const prompt = "Explain how AI works";
    const result = await model.generateContent(prompt);
    console.log(result.response.text());
    res.send(result.response.text())
};

export default genAIController;