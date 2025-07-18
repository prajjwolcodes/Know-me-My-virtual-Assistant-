import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises'; // Use fs.promises for async file operations

export async function pdfEmbedder(pdfPath) {

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

  const source = join(__dirname,"/backend", "..","../uploads/", pdfPath);
    try {
        // Initialize Supabase client
        const client = createClient(process.env.SUPABASE_PROJECT_URL, process.env.SUPABASE_API_KEY);

        // --- Step 1: Delete all existing embeddings from the 'pdf' table ---
        console.log("Deleting existing embeddings from Supabase table 'pdf'...");
        const { error: deleteError } = await client
            .from('pdf')
            .delete()
            .neq('id', '0'); 

        if (deleteError) {
            console.error("Error deleting existing documents:", deleteError);
            throw deleteError;
        }
        console.log("Successfully deleted existing embeddings.");

        // --- Step 2: Create and insert new embeddings ---
        console.log("Creating new vector store from the provided PDF text...");

        // Read and validate the source file (which should be the extracted text from the PDF)
        const text = await fs.readFile(source, "utf-8");
        console.log("Source file length:", text.length);

        if (!text || text.trim().length === 0) {
            throw new Error("Source file is empty or invalid. Cannot create embeddings.");
        }

        // Split the text into chunks
        const textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: 300,
            chunkOverlap: 30,
            separators: ["\n\n", "\n", " ", ""]
        });

        const output = await textSplitter.createDocuments([text]);
        console.log("Number of documents (chunks) created:", output.length);

        // Initialize embeddings with full dimensions
        const embeddings = new GoogleGenerativeAIEmbeddings({
            apiKey: process.env.GEMINI_API_KEY_PDF,
            model: "text-embedding-004",
            taskType: TaskType.RETRIEVAL_DOCUMENT,
            outputDimensionality: 768,
        });

        // Create and insert new vector store from documents
        const vectorStore = await SupabaseVectorStore.fromDocuments(
            output,
            embeddings,
            {
                client,
                tableName: 'pdf',
                queryName: "match_pdfs"
            }
        );

        console.log("Vector store created and updated successfully with", output.length, "documents.");

    } catch (error) {
        console.error("Error in pdfEmbedder:", error.message);
        throw error;
    }
}