// src/features/books/book-util.js

function resolveCoverUrl(book) {
  const img = book.coverImage || "";
  if (img && img.startsWith("cover-")) {
    // Future: uploaded book covers
    return `/uploads/books/${img}`;
  }
  if (img) {
    // Static file managed by developer under src/public/images/books/
    return `/images/books/${img}`;
  }
  // Flexible convention: use book id mapping, developer places images/books/<id>.png
  return `/images/books/${book.id}.png`;
}

module.exports = { resolveCoverUrl };

