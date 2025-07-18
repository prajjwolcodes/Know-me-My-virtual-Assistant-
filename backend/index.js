import express from "express"
import cors from "cors"
import dotenv from "dotenv"

import vectorRoutes from "./routes/vectorRoute.js"
import retrievalRoutes from "./routes/retrievalRoute.js"
import pdfParserRoute from "./routes/pdfParserRoute.js"



dotenv.config()

const app = express()

app.use(
  express.json({
    limit: '5mb',
  })
);


app.use(express.urlencoded({ extended: true }))
app.use(cors());
app.use('/uploads', express.static('uploads'));
app.use('/uploads_temp', express.static('uploads_temp'));
app.use("/",vectorRoutes)
app.use("/",retrievalRoutes)
app.use("/",pdfParserRoute)

app.get("/", (req, res) => {
  res.send("Welcome to KnowMe API");
});


const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log("Server running at port", PORT)
})