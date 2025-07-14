import express from "express"
import cors from "cors"
import dotenv from "dotenv"

import vectorRoutes from "./routes/vectorRoute.js"
import retrievalRoutes from "./routes/retrievalRoute.js"



dotenv.config()

const app = express()

app.use(
  express.json({
    limit: '5mb',
  })
);
app.use(express.urlencoded({ extended: true }))
app.use(cors());
app.use("/",vectorRoutes)
app.use("/",retrievalRoutes)

const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log("Server running at port", PORT)
})