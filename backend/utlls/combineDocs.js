export function combineDocuments(docs) {
  // Ensure we only process documents that have pageContent
  return docs.map((doc) => doc.pageContent).join("\n\n---\n\n");
}
