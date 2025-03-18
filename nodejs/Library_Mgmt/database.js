const { Client } = require("pg");

const client = new Client({
  user: "postgres",       // Change this if you set a different user
  host: "localhost",
  database: "library_management",
  password: "sitaram", // Replace with your actual PostgreSQL password
  port: 5432,
});

client.connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch(err => console.error("Connection error", err));

module.exports = client;
