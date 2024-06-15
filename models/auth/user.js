const { DataTypes } = require("sequelize");
const sequelize = require("../../database");

const User = sequelize.define("users", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  }
});

// Ensure the table is created if it doesn't exist already
(async () => {
  try {
    await User.sync();
    console.log("Users table synchronized successfully.");
  } catch (error) {
    console.error("Error synchronizing Users table:", error);
  }
})();

module.exports = User;
