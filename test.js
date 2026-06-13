const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

(async () => {
  try {
    const response =
      await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: "hello",
      });

    console.log("SUCCESS:");
    console.log(response.text);

  } catch (error) {

    console.log("ERROR:");
    console.log(error);

  }
})();