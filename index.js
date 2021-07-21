import express from "express";
import cors from "cors";

import path from "path";
import * as uuid from "uuid";
import * as lowdb from "lowdb";
const file = "./db.json";
const adapter = new lowdb.JSONFile(file);
const db = new lowdb.Low(adapter);

const PORT = 4040;

const app = express();

app.use(express.json());

app.get("/", async (req, res) => {
  const limit = parseInt(req.query.count || 4);
  const page = parseInt(req.query.page || 0) * limit;

  await db.read();
  if (!db.data) {
    db.data = { quotes: [] };
    await db.write();
  }

  const quotes = db.data.quotes.slice(page, page + limit);
  console.log(quotes.length, page, limit);

  res.status(200).json({ quotes });
});

app.post("/", async (req, res) => {
  await db.read();
  if (!db.data) {
    db.data = { quotes: [] };
    await db.write();
  }

  db.data.quotes.push({
    id: uuid.v4(),
    quote: req.body.title,
    author: req.body.author,
    likes: 0,
  });
  await db.write();

  res.status(200).json({ message: "Quote was added" });
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
