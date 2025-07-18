import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { PromptTemplate } from "@langchain/core/prompts";
import {
  ChatGoogleGenerativeAI,
  GoogleGenerativeAIEmbeddings,
} from "@langchain/google-genai";
import { createClient } from "@supabase/supabase-js";
import { TaskType } from "@google/generative-ai";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { combineDocuments } from "../utlls/combineDocs.js";
import {
  RunnablePassthrough,
  RunnableSequence,
} from "@langchain/core/runnables";

async function getPdfAnswer(question) {
  const client = createClient(
    process.env.SUPABASE_PROJECT_URL,
    process.env.SUPABASE_API_KEY
  );

  const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GEMINI_API_KEY_PDF,
    model: "text-embedding-004",
    taskType: TaskType.RETRIEVAL_DOCUMENT,
    outputDimensionality: 768,
  });

  const vectorStore = new SupabaseVectorStore(embeddings, {
    client,
    tableName: "pdf",
    queryName: "match_pdfs",
  });

  const retriever = vectorStore.asRetriever();

  const model = new ChatGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY_PDF,
    model: "gemini-1.5-flash",
    temperature: 0.5,
    maxOutputTokens: 1024,
  });

  const template = "The user will be providing the question which might me multiple lines and can be random but you have to convert it into a standalone question. The question will be provided in the 'question' variable. You have to convert it into a single line question and return it as a string. Do not add any extra text or explanation. Just return the question.\n\nQuestion: {question}";

const answerTemplate = `You are a helpful and friendly AI assistant who answers questions based only on the provided PDF content. You love being clear, fun to talk to, and super helpful — but you *never* make up stuff. You only answer what’s actually in the PDF.

Here’s how you should think and respond:

1. **Be Friendly and Casual:** Talk like a helpful human, not a robot. Use a warm, relaxed tone — but keep answers sharp and informative.
2. **Use ONLY the Context:** Your entire answer must be based strictly on the 'Context' below. Do not use outside knowledge or make up details.
3. **Understand the Full Picture:** Read the full 'Context', not just keywords. Connect information from multiple parts if needed.
4. **Stay Clear and On Point:** Make sure your answer is short, clear, and easy to understand — avoid complicated words unless needed.
5. **Handle Casual Greetings or Irrelevant Input:** If the user says something like “hi”, “hello”, or asks something that can’t be answered from the PDF, respond in a friendly way like:
   > "I couldn't find anything related to that in the PDF, but hey! If you have a question about the document, hit me up! Or contact the owner at shresthaprajjwol4@gmail.com."

---

**Question from the User:**  
{question}

---

**What You Know (PDF Context):**  
{context}
`;

  const templatePrompt = PromptTemplate.fromTemplate(template);
  const answerTemplatePrompt = PromptTemplate.fromTemplate(answerTemplate);

  const contextChain = RunnableSequence.from([
    templatePrompt,
    model,
    new StringOutputParser(),
    retriever,
    combineDocuments,
  ]);

  const answerChain = RunnableSequence.from([
    answerTemplatePrompt,
    model,
    new StringOutputParser(),
  ]);

  const chain = RunnableSequence.from([
    { context: contextChain, question: new RunnablePassthrough() },
    answerChain,
  ]);


  const res = await chain.stream({ question });

  return res;
}

export async function pdfAnswerController(req, res) {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ message: "Question is required" });
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const answer = await getPdfAnswer(question);

    for await (const chunk of answer) {
      res.write(`data: ${chunk}\n\n`);
    }

    res.write("event: end\ndata: done\n\n");
    res.end();

  } catch (error) {
    console.error("Error in retrieval:", error);
    return res.status(500).json({
      message: "Error in retrieval",
      error: error.message,
    });
  }
}
