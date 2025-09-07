const { DataTypes } = require("sequelize")
const { sequelize } = require("../../config/database")

const Review = sequelize.define(
  "Review",
  {
    rating: { type: DataTypes.INTEGER, allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false },
    // ADDED: Foreign key for User
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users", // table name
        key: "id",
      },
    },
    // ADDED: Foreign key for Book
    bookId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "books", // table name
        key: "id",
      },
    },
  },
  {
    tableName: "reviews",
    // ADDED: Unique constraint to prevent a user from reviewing the same book twice
    indexes: [
      {
        unique: true,
        fields: ["userId", "bookId"],
      },
    ],
  }
)

// ADDED: Define associations
Review.associate = function (models) {
  Review.belongsTo(models.User, { foreignKey: "userId" })
  Review.belongsTo(models.Book, { foreignKey: "bookId" })
}

module.exports = Review
