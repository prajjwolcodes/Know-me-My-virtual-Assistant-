import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { PromptTemplate } from "@langchain/core/prompts";
import {
  ChatGoogleGenerativeAI,
  GoogleGenerativeAIEmbeddings,
} from "@langchain/google-genai";
import { createClient } from "@supabase/supabase-js";
import { configDotenv } from "dotenv";
import { TaskType } from "@google/generative-ai";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { combineDocuments } from "../utlls/combineDocs.js";
import {
  RunnablePassthrough,
  RunnableSequence,
} from "@langchain/core/runnables";
import { formatConvHistory } from "../utlls/fomatConvHistory.js";

configDotenv();

// Move convHistory outside the function so it persists
const convHistory = [];

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

  const answerTemplate = `The user will be providing the question which might me multiple lines but also with the user question you will be provided with the context which is the answer to the question. You have to answer the question based on the context provided. The question will be provided in the 'question' variable and the context will be provided in the 'context' variable. You have to answer the question based on the context provided. Do not make up your answers. Apologize if you do not have the answer and ask the user to mail at shresthaprajjwol4@gmail.com .Be friendly and answer like you are a human.
  Do not let the user feels like you are automated.\n\nQuestion: {question}\n\nContext: {context}`;

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

  const res = await chain.invoke({ question });

  // Push the new question and answer to the history
  convHistory.push({ question, res });

  return res;
}

// Now you can ask multiple questions and they'll all be stored
async function main() {
  // await getAnswer("What are the technical requirements for running scrimba? I only have a very old laptop that is not very powerful");
  // await getAnswer("Hi I am prajjwol. Who is Tom Chant?");
  // await getAnswer("Who is prajjwol?");

  const messages = await formatConvHistory(convHistory);
  console.log(messages);
}

main();
