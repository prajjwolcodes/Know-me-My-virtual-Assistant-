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

async function getAnswer(question) {
  const client = createClient(
    process.env.SUPABASE_PROJECT_URL,
    process.env.SUPABASE_API_KEY
  );

  const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GEMINI_API_KEY,
    model: "text-embedding-004",
    taskType: TaskType.RETRIEVAL_DOCUMENT,
    outputDimensionality: 768,
  });

  const vectorStore = new SupabaseVectorStore(embeddings, {
    client,
    tableName: "documents",
    queryName: "match_documents",
  });

  const retriever = vectorStore.asRetriever();

  const model = new ChatGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY,
    model: "gemini-2.0-flash",
    temperature: 0.2,
    maxOutputTokens: 1024,
  });

  const template =
    "The user will be providing the question which might me multiple lines and can be random but you have to convert it into a standalone question. The question will be provided in the 'question' variable. You have to convert it into a single line question and return it as a string. Do not add any extra text or explanation. Just return the question.\n\nQuestion: {question}";

  const answerTemplate = `You're about to answer a question on my behalf — like you're actually me, Prajjwol. The question might be a bit long or have extra context, but don't worry — I'll give you both the 'question' and the 'context' separately. You must answer the question strictly based on the given context. 

Talk like me — casual, friendly, straight to the point, maybe a bit technical if needed, but never robotic. Be helpful and genuine. If you don’t know the answer from the context, just say something like “I’m not sure about this one right now, but feel free to mail me at shresthaprajjwol4@gmail.com and I’ll get back to you.”

Never make things up, and don't act like a bot. Sound like a real person — me.

\n\nQuestion: {question}\n\nContext: {context}`;

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

export async function retrievalController(req, res) {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ message: "Question is required" });
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const answer = await getAnswer(question);

    for await (const chunk of answer) {
      res.write(`data: ${chunk}\n\n`);
    }

    res.write("event: end\ndata: done\n\n");
    res.end();
  } catch (error) {
    console.error("Error in retrieval:", error);
    res.status(500).json({
      message: "Error in retrieval",
      error: error.message,
    });
  }
}
