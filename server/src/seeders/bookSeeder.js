// src/seeders/bookSeeder.js
require("dotenv").config();
const path = require("path");
const fs = require("fs");
const debug = require("debug")("fictionbook:seed");
const Book = require("../features/books/book-model");

async function upsertBook(data) {
  const { title, author, description, coverImage, publishedYear } = data;
  if (!title || !author) return { action: "skipped", reason: "missing title/author" };
  const existing = await Book.findOne({ where: { title, author } });
  if (!existing) {
    await Book.create({ title, author, description, coverImage, publishedYear });
    return { action: "created", title };
  }
  const updates = {};
  if (description !== undefined && description !== existing.description) updates.description = description;
  if (coverImage !== undefined && coverImage !== existing.coverImage) updates.coverImage = coverImage;
  if (publishedYear !== undefined && publishedYear !== existing.publishedYear) updates.publishedYear = publishedYear;
  if (Object.keys(updates).length) {
    await existing.update(updates);
    return { action: "updated", title };
  }
  return { action: "unchanged", title };
}

async function seedBooks() {
  const dataPath = path.join(__dirname, "data/books.json");
  const raw = fs.readFileSync(dataPath, "utf-8");
  const list = JSON.parse(raw);
  const results = { created: 0, updated: 0, unchanged: 0, skipped: 0 };
  for (const item of list) {
    // Keep coverImage as the final filename (e.g., "1.png"); images can be placed later under src/public/images/books/
    const r = await upsertBook(item);
    results[r.action]++;
  }
  debug("Seed books done", results);
  console.log("Seed result:", results);
  process.exit(0);
}

seedBooks();
