import express from "express"
import { retrievalController } from "../controllers/retrievalController.js"

const router = express.Router()

router.route("/knowme").post(retrievalController)

export default router 