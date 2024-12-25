import express from "express";
import dotenv from "dotenv";
import { dbConnect } from "./db/connect.js";
import appRoutes from "./app.js"

dotenv.config()

const app = express();

// app.use("/", appRoutes);

app.get("/", (req, res) => res.send("Express on Vercel"));



dbConnect()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(`mongodb database working on port ${process.env.PORT}`)
        })
    })
    .catch((error) => {
        console.log(`mongodb connection error, ${error}`)
    })


export default app
