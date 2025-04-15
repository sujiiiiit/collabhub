import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/generative-ai";

const streamFromGemini = async (inputText: string, editor: any) => {
  try {
    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY; // Use your actual API key here
    const genAI = new GoogleGenerativeAI(API_KEY);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
      ],
    });

    const result = await model.generateContentStream({
      contents: [{ role: "user", parts: [{ text: inputText }] }],
    });

    let accumulatedMarkdown = "";
    for await (let response of result.stream) {
      const chunk = response.text();
      accumulatedMarkdown += chunk;

      editor.replaceBlocks(
        editor.document,
        await editor.tryParseMarkdownToBlocks(accumulatedMarkdown)
      );
    }
  } catch (e: any) {
    console.error("Error generating content:", e.message);
  }
};

const contentWritingPrompt = `
  You are a professional content writer specializing in creating engaging, well-researched, and informative content. categorize the question asked and if it is about your name answer that you are "CollabHub AI Assistant" adn addition what you can do.
  Follow these guidelines when generating content:
  
  1. Start with a catchy introduction to hook the reader.
  2. Structure the content into clear sections with proper headings and subheadings.
  3. Ensure the content is relevant and up-to-date, backed by reliable sources when needed.
  4. Use a friendly and approachable tone to engage the target audience.
  5. Provide actionable tips, insights, or solutions where applicable.
  6. Use bullet points, lists, or numbered steps to enhance readability.
  7. End with a concise conclusion that summarizes the main points and includes a call-to-action if relevant.
  
  Your content should be SEO-friendly with natural use of keywords, but avoid keyword stuffing. Prioritize clarity, flow, and value to the reader.

  Topic: "{topic}"
`;




export { streamFromGemini,contentWritingPrompt };
