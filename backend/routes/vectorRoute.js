import express from "express"
import { vectorDbController } from "../controllers/vectorDbContoller.js"

const router = express.Router()

router.route("/").post(vectorDbController)

export default router 