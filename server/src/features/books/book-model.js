const { DataTypes } = require("sequelize")
const { sequelize } = require("../../config/database")

const Book = sequelize.define(
  "Book",
  {
    title: { type: DataTypes.STRING, allowNull: false },
    author: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    coverImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    publishedYear: { type: DataTypes.INTEGER },
  },
  { tableName: "books" }
)

// ADDED: Define association
Book.associate = function (models) {
  // A book can have many reviews. If a book is deleted, all its reviews should also be deleted.
  Book.hasMany(models.Review, { foreignKey: "bookId", onDelete: "CASCADE" })
}

module.exports = Book
