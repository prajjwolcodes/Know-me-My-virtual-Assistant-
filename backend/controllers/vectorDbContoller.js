    import { dirname, join } from "path";
    import { fileURLToPath } from "url";
    import fs from "fs/promises";
    import { createClient } from '@supabase/supabase-js'
    import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
    import { SupabaseVectorStore } from '@langchain/community/vectorstores/supabase';
    import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
    import { TaskType } from "@google/generative-ai";


export async function vectorDbController(req,res){

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const source = join(__dirname, "..","about-me2.txt");
        
    try {
      // Initialize Supabase client
      const client = createClient(process.env.SUPABASE_PROJECT_URL, process.env.SUPABASE_API_KEY);
    
      // Check if the table already has documents
      const { data: existingData, error: checkError } = await client
        .from('documents')
        .select('id')
        .limit(1);
        
      if (checkError) {
        console.error("Error checking existing documents:", checkError);
        throw checkError;
      }
    
      if (existingData && existingData.length > 0) {
        console.log("Documents already exist in the table. Skipping vector store creation.");
        
        // Initialize embeddings for potential querying
        const embeddings = new GoogleGenerativeAIEmbeddings({
          apiKey: process.env.GEMINI_API_KEY,
          model: "text-embedding-004",
          taskType: TaskType.RETRIEVAL_DOCUMENT,
          outputDimensionality: 768,
        });
    
        // Create vector store instance for existing data
        const vectorStore = new SupabaseVectorStore(embeddings, {
          client,
          tableName: 'documents',
        });
        
        console.log("Vector store instance created for existing data");
        throw new Error("Vector store already exists. No new documents created.");
      }
    
      console.log("No existing documents found. Creating new vector store...");
    
      // Read and validate the source file
      const text = await fs.readFile(source, "utf-8");
      console.log("Source file length:", text.length);
      
      if (!text || text.trim().length === 0) {
        throw new Error("Source file is empty or invalid");
      }
    
      // Split the text into chunks
      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 500,
        chunkOverlap: 50,
        separators: ["\n\n", "\n", " ", ""]
      });
      
      const output = await textSplitter.createDocuments([text]);
      console.log("Number of documents created:", output.length);
    
      // Initialize embeddings with full dimensions
      const embeddings = new GoogleGenerativeAIEmbeddings({
        apiKey: process.env.GEMINI_API_KEY,
        model: "text-embedding-004",
        taskType: TaskType.RETRIEVAL_DOCUMENT,
        outputDimensionality: 768,
      });
    
      const vectorStore = await SupabaseVectorStore.fromDocuments(
        output,
        embeddings,
        {
          client,
          tableName: 'documents',
        }
      );
      
      console.log("Vector store created successfully with", output.length, "documents");
      res.status(200).json({
        message: "Vector store created successfully",
    })
      
    } catch (error) {
      console.error(error.message);
      res.status(500).json({
        message: "Error in vector store setup",
        error: error.message,
      });
    }
}