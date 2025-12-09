import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const client = createClient(
  process.env.SUPABASE_PROJECT_URL,
  process.env.SUPABASE_API_KEY
);

console.log("Testing Supabase connection...");
console.log("URL:", process.env.SUPABASE_PROJECT_URL);

try {
  const { data, error } = await client.from("documents").select("id").limit(1);

  if (error) {
    console.error("Supabase error:", error);
  } else {
    console.log("✓ Supabase connection successful!");
    console.log("Sample data:", data);
  }
} catch (err) {
  console.error("Connection test failed:", err);
}
