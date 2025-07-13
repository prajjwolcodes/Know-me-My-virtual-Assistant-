import { StringOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnablePassthrough, RunnableSequence } from "@langchain/core/runnables";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { configDotenv } from "dotenv";

configDotenv()

const model = new ChatGoogleGenerativeAI({
    apiKey:process.env.GEMINI_API_KEY,
    model: "gemini-1.5-flash",
    temperature: 0.2,
    maxOutputTokens: 1024,
})

const punctuationTemplate = "You will be provided with a sentence and you have to correct the punctuation of the sentence. The sentence will be provided in the 'sentence' variable. You have to correct the punctuation of the sentence and return it as a string. Do not add any extra text or explanation. Just return the corrected sentence.\n\n Sentence: {sentence}";

const grammerTemplate = "You will be provided with a punctuated sentence and you have to correct the grammar of the sentence. The sentence will be provided in the 'sentence' variable. You have to correct the grammar of the sentence and return it as a string. Do not add any extra text or explanation. Just return the corrected sentence.\n\n Punctuated Sentence: {punctuatedSentence}";

const translationTemplate = "You will be provided with a gramatically correct sentence in English and you have to translate it into a given language. The sentence will be provided in the 'sentence' variable. You have to translate the sentence into the language which will be provided in the 'language' variable and return it as a string. Do not add any extra text or explanation. Just return the translated sentence.\n\n Grammatically Correct Sentence: {grammaticallyCorrectSentence} \n\n Language: {language}";



const punctuationPrompt = PromptTemplate.fromTemplate(punctuationTemplate);
const grammerPrompt = PromptTemplate.fromTemplate(grammerTemplate);
const translationPrompt = PromptTemplate.fromTemplate(translationTemplate);

const punctuationChain = RunnableSequence.from([punctuationPrompt, model, new StringOutputParser()]);
const grammerChain = RunnableSequence.from([grammerPrompt, model, new StringOutputParser()]);
const translationChain = RunnableSequence.from([translationPrompt, model, new StringOutputParser()]);

const chain = RunnableSequence.from([
    {punctuatedSentence: punctuationChain,orginalInput: new RunnablePassthrough()},
    {grammaticallyCorrectSentence: grammerChain, language:({orginalInput})=> orginalInput.language},
    translationChain
]);
const res = await chain.invoke({ sentence: "i dont liked mondays" , language: "nepali"});
console.log(res);