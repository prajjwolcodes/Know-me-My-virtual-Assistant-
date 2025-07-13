export const combineDocuments = async (docs) => {
  return docs.map((doc) => {
    return doc.pageContent;
  }).join("\n\n");
};
