const dbPool = require("../../src/config/db");

const createTables = async () => {
  const createCategoriesTableQuery = `
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE
      );`;
  await dbPool.query(createCategoriesTableQuery);
  console.log("Table 'categories' created or already exists.".green);

  // Step 4: Create courses table with updated_at field
  const createCoursesTableQuery = `
      CREATE TABLE IF NOT EXISTS courses (
        id SERIAL PRIMARY KEY,
        title VARCHAR(100) NOT NULL,
        description TEXT,
        instructor VARCHAR(100),
        duration INT,
        outcome TEXT,
        collection INT REFERENCES categories(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
  await dbPool.query(createCoursesTableQuery);
  console.log("Table 'courses' created or already exists.".green);

  // Step 5: Create users table with role and updated_at field
  const createUsersTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(100) NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        role VARCHAR(10) DEFAULT 'USER' CHECK (role IN ('ADMIN', 'USER')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
  await dbPool.query(createUsersTableQuery);
  console.log("Table 'users' created or already exists.".green);
  //await dbPool.end();
};

module.exports = createTables;
