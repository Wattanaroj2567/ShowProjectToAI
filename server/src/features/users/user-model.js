// src/features/users/user-model.js
const bcrypt = require("bcryptjs");
const { DataTypes } = require("sequelize");
const { sequelize } = require("../../db/sequelize");
const { cleanupUserProfileImages } = require("../../core/services/file-service");

const User = sequelize.define(
  "User",
  {
    username: { type: DataTypes.STRING, allowNull: true, unique: true },
    displayName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true, notEmpty: true },
    },
    password: { type: DataTypes.STRING, allowNull: true },
    profileImage: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    resetToken: { type: DataTypes.STRING, allowNull: true },
    resetTokenExpiry: { type: DataTypes.DATE, allowNull: true },
    googleId: { type: DataTypes.STRING, allowNull: true, unique: true },
    googleAccessToken: { type: DataTypes.TEXT, allowNull: true },
    googleRefreshToken: { type: DataTypes.TEXT, allowNull: true },
  },
  {
    tableName: "users",
    hooks: {
      beforeDestroy: async (user) => {
        // Delete any uploaded profile images for this user
        // including the current one and any stray older files.
        try {
          await cleanupUserProfileImages(user.id);
        } catch {
          // best-effort cleanup; ignore errors
        }
      },
    },
  }
);

User.prototype.verifyPassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

User.associate = function (models) {
  User.hasMany(models.Review, { foreignKey: "userId", onDelete: "CASCADE" });
};

module.exports = User;
