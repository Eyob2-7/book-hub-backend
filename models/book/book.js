const { DataTypes } = require("sequelize");
const sequelize = require("../../database");

const Book = sequelize.define("books", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  title: DataTypes.STRING,
  author: DataTypes.STRING,
  imageUrl: DataTypes.STRING,
});

// Ensure the table is created if it doesn't exist already
(async () => {
  try {
    await Book.sync();
    console.log("Books table synchronized successfully.");
  } catch (error) {
    console.error("Error synchronizing Books table:", error);
  }
})();

module.exports = Book;