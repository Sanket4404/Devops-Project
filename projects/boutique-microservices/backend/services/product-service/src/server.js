const express = require("express");
const cors = require("cors");
require("dotenv").config();

const productModel = require("./models/productModel");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ service: "product-service", status: "ok" });
});

app.get("/products", async (req, res) => {
  const data = await productModel.getAll();
  res.json(data);
});

app.post("/products", async (req, res) => {
  const product = await productModel.create(req.body);
  res.status(201).json(product);
});

app.delete("/products/:id", async (req, res) => {
  await productModel.remove(req.params.id);
  res.json({ message: "Deleted" });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, async () => {
  console.log(`Product Service running on ${PORT}`);
  await productModel.init();
});

