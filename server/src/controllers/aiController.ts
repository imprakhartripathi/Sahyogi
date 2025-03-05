import OpenAI from "openai";
import { Request, Response } from "express";

const openai = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: "sk-17f45ddeb7f1489c9ab3b2833a897db2", // Replace with your actual DeepSeek API key
});

const deepseekController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: "You are a helpful assistant." }],
      model: "deepseek-chat",
    });

    const responseText = completion.choices[0].message.content;
    console.log(responseText);
    res.send(responseText);
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).send("An error occurred while processing your request.");
  }
};

export default deepseekController;
