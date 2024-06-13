require("dotenv").config()
import OpenAI,{toFile} from "openai";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
})
// export
