// src/dbSetup.js
const { Pool } = require("pg");
const colors = require("colors");
const bcrypt = require("bcryptjs");
const { userSampleData } = require("./userSampleData");
const { courseSampleData } = require("./courseSampleData");
require("dotenv").config();

const databaseName = process.env.DB_NAME;
const saltRounds = 10;

(async () => {
  // Initial pool without specifying a database

  //check that sample data is populated by checking the length of the arrays
  console.log("Checking sample data...".cyan);
  console.log("courseSampleData length: ", courseSampleData.length);
  console.log("userSampleData length: ", userSampleData.length);

  if (!courseSampleData || !userSampleData) {
    console.error(
      "Please populate courseSampleData and userSampleData in dbSetup"
    );
    process.exit();
  }

  console.log("Creating database and tables...".cyan);

  const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
    idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
  });
  let dbPool;
  let categoryMap;
  try {
    // Step 1: Create the database if it doesn't exist
    const createDatabaseQuery = `CREATE DATABASE ${databaseName};`;
    await pool.query(createDatabaseQuery);
    console.log(`Database '${databaseName}' created or already exists.`.green);

    // Step 2: Close the initial pool and connect to the new database
    await pool.end();

    // Reinitialize the pool with the new database
    const dbPool = new Pool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: databaseName,
      port: process.env.DB_PORT,
      idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
    });

    // Step 3: Create categories table
    const createCategoriesTableQuery = `
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE
      );
    `;
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

    // Step 6: Create function for updating 'updated_at' field
    console.log(
      "Creating function 'update_timestamp' on record change...".cyan
    );
    const createUpdateTimestampFunction = `
      CREATE OR REPLACE FUNCTION update_timestamp()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `;
    await dbPool.query(createUpdateTimestampFunction);
    console.log("Function 'update_timestamp' created or replaced.".green);

    // Step 7: Create triggers on 'courses' and 'users' tables
    console.log("Creating triggers for course update_at...".cyan);
    const createCoursesTriggerQuery = `
      CREATE TRIGGER set_timestamp_courses
      BEFORE UPDATE ON courses
      FOR EACH ROW
      EXECUTE FUNCTION update_timestamp();
    `;
    await dbPool.query(createCoursesTriggerQuery);
    console.log(
      "Trigger 'set_timestamp_courses' created on 'courses' table.".green
    );
    console.log("Creating triggers for user update_at...".cyan);
    const createUsersTriggerQuery = `
      CREATE TRIGGER set_timestamp_users
      BEFORE UPDATE ON users
      FOR EACH ROW
      EXECUTE FUNCTION update_timestamp();
    `;
    await dbPool.query(createUsersTriggerQuery);
    console.log(
      "Trigger 'set_timestamp_users' created on 'users' table.".green
    );

    // Step 8: Seed categories and courses tables

    const seedData = async () => {
      console.log("Seeding categories tables...".cyan);
      // Seed categories
      const collections = [
        ...new Set(courseSampleData.map((course) => course.collection)),
      ];
      const categoryMap = {};

      for (const collection of collections) {
        const result = await dbPool.query(
          `INSERT INTO categories (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id;`,
          [collection]
        );
        categoryMap[collection] = result.rows[0].id;
      }
      console.log("Sample categories populated.".green);
      console.log(categoryMap);
      // Seed courses
      console.log("Seeding courses tables...".cyan);
      for (const course of courseSampleData) {
        await dbPool.query(
          `INSERT INTO courses (title, description, instructor, duration, outcome, collection)
           VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT DO NOTHING;`,
          [
            course.title,
            course.description,
            course.instructor,
            course.duration,
            course.outcome,
            categoryMap[course.collection],
          ]
        );
      }
      console.log("Sample course data populated.".green);
    };

    await seedData();

    // Step 9: Seed users table
    console.log("Seeding users table...".cyan);
    const seedUsers = async () => {
      for (const user of userSampleData) {
        const passwordHash = await bcrypt.hash(user.password, saltRounds);
        await dbPool.query(
          `INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING;`,
          [user.username, user.email, passwordHash, user.role.toUpperCase()]
        );
      }
      console.log("Sample user data populated.".green);
    };
    await seedUsers();
    console.log("Database setup completed.".rainbow.underline);
  } catch (error) {
    console.error("Error creating database or tables:", error);
  } finally {
    // Ensure both pools are closed, in case of error
    if (dbPool) await dbPool.end();
    process.exit(); // Explicitly exit the process
  }
})();
