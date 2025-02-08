import express from "express"
import cookieParser from "cookie-parser";
import cors from "cors"

const app = express()

app.use(cors())
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json({ limit: "50mb" }));
app.use(express.static("temp"));

import userRoutes from "./routes/User-routes.js"
import shopRoutes from "./routes/Shop-routes.js"
import orderRoutes from "./routes/Order-routes.js"
import productRoutes from "./routes/Product-routes.js"

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/shop", shopRoutes);
app.use("/api/v1/order", orderRoutes);
app.use("/api/v1/product", productRoutes)

export default app;