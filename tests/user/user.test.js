const request = require("supertest");
const bcrypt = require("bcryptjs");
const app = require("../../app"); // Your express app
const jwt = require("jsonwebtoken");
const pool = require("../../config/db");
const e = require("cors");

const token = jwt.sign({ id: 1, role: "USER" }, process.env.JWT_SECRET); // Mock token

describe("User GraphQL API", () => {
  beforeAll(async () => {
    // Insert a user into the database before running the tests
    await pool.query(
      `INSERT INTO users (username, email, password_hash, role) 
       VALUES ($1, $2, $3, $4)`,
      [
        "testuser1",
        "test1@example.com",
        await bcrypt.hash("testpass", 10),
        "USER",
      ]
    );
  });

  //   beforeEach(async () => {
  //     const username = "testuser";
  //     const email = "testuser@example.com";
  //     const password_hash = await bcrypt.hash("testpass", 10);
  //     const role = "USER";

  //     // Clear the users table before each test
  //     await pool.query("DELETE FROM users");
  //     await pool.query(
  //       `INSERT INTO users (username, email, password_hash, role)
  //        VALUES ($1, $2, $3, $4)`,
  //       [username, email, password_hash, role]
  //     );
  //   });

  afterEach(async () => {
    await pool.query("DELETE FROM users WHERE username = $1", ["testuser"]);
  });

  afterAll(async () => {
    await pool.query("DELETE FROM users");
    await pool.end();
  });

  // Test the registerUser mutation with a valid user
  it("1. should register a user", async () => {
    const response = await request(app)
      .post("/graphql")
      //   .set("Authorization", `Bearer ${token}`) // Set JWT token in headers if needed
      .send({
        query: `
          mutation {
            registerUser(username: "testuser", email: "test@example.com", password: "testpass",repeatPassword:"testpass") {
              user{
              id
              username
              email
      }
              token
            }
          }
        `,
      });

    expect(response.status).toBe(200);
    expect(response.body.data.registerUser).toBeDefined();
    expect(response.body.data.registerUser.user.username).toBe("testuser");
    expect(response.body.data.registerUser.user.email).toBe("test@example.com");
    expect(response.body.data.registerUser.token).toBeDefined();
  });
  // Test the registerUser mutation with a user that already exists
  it("2. should not register a user that already exists", async () => {
    const response = await request(app)
      .post("/graphql")
      .send({
        query: `
            mutation {
                registerUser(username: "testuser1", email: "test1@example.com", password: "testpass",repeatPassword:"testpass") {
                    user{
                    id
                    username
                    email
                }
                }
            }
            `,
      });

    expect(response.status).toBe(200);
    expect(response.body.errors).toBeDefined();
    expect(response.body.errors[0].message).toBe(
      "Error checking user and email: Email is already taken."
    );
  });

  // Test the registration mutation with an existing email address but not existing username
  it("3. should not register a user with an existing email address", async () => {
    const response = await request(app)
      .post("/graphql")
      .send({
        query: `
              mutation {
                  registerUser(username: "testuser2", email: "test1@example.com", password: "testpass",repeatPassword:"testpass") {
                        user{
                        id
                        username
                        email
                    }
                    }
                }
                `,
      });
    expect(response.status).toBe(200);
    expect(response.body.errors).toBeDefined();
    expect(response.body.errors[0].message).toBe(
      "Email or username already exists."
    );
  });
  // Test the registration mutation with an invalid email address
  it("4. should not register a user with an invalid email address", async () => {
    const response = await request(app)
      .post("/graphql")
      .send({
        query: `
                mutation {
                    registerUser(username: "testuser3", email: "test1example.com", password: "testpass",repeatPassword:"testpass") {
                            user{
                            id
                            username
                            email
                        }
                        }
                    }
                    `,
      });
    expect(response.status).toBe(200);
    expect(response.body.errors).toBeDefined();
    expect(response.body.errors[0].message).toBe("Email is not valid.");
  });
  // Test the registration mutation with a password that is too short
  it("5. should not register a user with a password that is too short", async () => {
    const response = await request(app)
      .post("/graphql")
      .send({
        query: `mutation {
                    registerUser(username: "testuser4", email: "test4@example.com", password: "test",repeatPassword:"test") {
                        user{
                        id
                        username
                        email
                    }
                    }
                }`,
      });
    expect(response.status).toBe(200);
    expect(response.body.errors).toBeDefined();
    expect(response.body.errors[0].message).toBe(
      "Password must be at least 8 characters."
    );
  });
  // test the registration mutation with a password and repeatPassword that do not match
  it("6. should not register a user with passwords that do not match", async () => {
    const response = await request(app)
      .post("/graphql")
      .send({
        query: `mutation {
                    registerUser(username: "testuser5", email: "test5@example.com", password: "testpass",repeatPassword:"testpass1") {
                        user{
                        id
                        username
                        email
                    }
                    }
                }`,
      });
    expect(response.status).toBe(200);
    expect(response.body.errors).toBeDefined();
    expect(response.body.errors[0].message).toBe("Passwords do not match.");
  });
  // test the registration mutation where the password is missing
  it("7. should not register a user with a missing password", async () => {
    const response = await request(app)
      .post("/graphql")
      .send({
        query: `mutation {
                        registerUser(username: "testuser6", email: "test6@example.com", password: "",repeatPassword:"testpass") {
                            user{
                            id
                            username
                            email
                        }
                        }
                    }`,
      });
    expect(response.status).toBe(200);
    expect(response.body.errors).toBeDefined();
    expect(response.body.errors[0].message).toBe("Password is required.");
  });
  // test the registration mutation where the repeatPassword is missing
  it("8. should not register a user with a missing password confirmation", async () => {
    const response = await request(app)
      .post("/graphql")
      .send({
        query: `mutation {
                    registerUser(username: "testuser6", email: "test6@example.com", password: "testpass",repeatPassword:"") {
                        user{
                        id
                        username
                        email
                    }
                    }
                }`,
      });
    expect(response.status).toBe(200);
    expect(response.body.errors).toBeDefined();
    expect(response.body.errors[0].message).toBe(
      "Repeat password is required."
    );
  });
  // test the registration mutation with a username that is too short
  it("9. should not register a user with a username that is too short", async () => {
    const response = await request(app)
      .post("/graphql")
      .send({
        query: `mutation {
                        registerUser(username: "te", email: "test9@example.com", password: "testpass",repeatPassword:"testpass") {
                            user{
                            id
                            username
                            email
                        }
                        }
                    }`,
      });
    expect(response.status).toBe(200);
    expect(response.body.errors).toBeDefined();
    expect(response.body.errors[0].message).toBe(
      "Username must be between 3 and 20 characters."
    );
  });
});
