require("dotenv").config({
  path: process.env.LEARNING_NODE_ENV.trim() === "test" ? ".env.test" : ".env",
});
const { Pool } = require("pg");
const createTables = require("./dbSetup/Create Tables/createTables");

beforeAll(async () => {
  try {
    // Setup: Create test database
    const databaseName = process.env.DB_NAME;

    // Attempt to connect to the default database (usually postgres) first to create a new database
    defaultPool = new Pool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      port: process.env.DB_PORT,
    });

    const createDatabaseQuery = `CREATE DATABASE "${databaseName}";`;

    // Execute the database creation
    await defaultPool.query(createDatabaseQuery);
    console.log(`Database '${databaseName}' created or already exists.`.green);

    // Close the connection to the default database
    await defaultPool.end();

    // Create the necessary tables
    await createTables();
  } catch (error) {
    console.error("Error setting up the test database:", error);
  }
});

afterAll(async () => {
  // Close the main connection pool
  //await pool.end();

  // Create a new connection pool for dropping the database
  const defaultPool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
  });

  const databaseName = process.env.DB_NAME;

  try {
    // Attempt to drop the database
    const dropDatabaseQuery = `DROP DATABASE IF EXISTS "${databaseName}";`;
    await defaultPool.query(dropDatabaseQuery);
    console.log(`Database '${databaseName}' dropped successfully.`);
  } catch (error) {
    console.error("Error dropping database:", error);
  } finally {
    // Ensure the default pool is closed
    await defaultPool.end();
  }
});
