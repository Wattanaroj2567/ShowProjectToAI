// src/model-registry/index.js
const User = require("../features/users/user-model");
const Book = require("../features/books/book-model");
const Review = require("../features/reviews/review-model");

// Associations
User.hasMany(Review, { foreignKey: "userId", onDelete: "CASCADE" });
Review.belongsTo(User, { foreignKey: "userId" });

Book.hasMany(Review, { foreignKey: "bookId", onDelete: "CASCADE" });
Review.belongsTo(Book, { foreignKey: "bookId" });

module.exports = { User, Book, Review };
