# OSC Backend Engineer Assessment Documentation

## 1. Project Overview

This project is a GraphQL API developed as part of an assessment for Open Study College, enabling internal users to manage a database of distance learning courses. The API includes authentication and authorization, ensuring secure access to course data, with selective access to mutations based on user roles.

- [OSC Backend Engineer Assessment Documentation](#osc-backend-engineer-assessment-documentation)
  - [1. Project Overview](#1-project-overview)
  - [2. Key Technical Decisions and Implementation](#2-key-technical-decisions-and-implementation)
  - [3. Project Structure](#3-project-structure)
  - [4. Project Setup](#4-project-setup)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Database Setup](#database-setup)
    - [.env Configuration](#env-configuration)
  - [5. NPM Packages Used and Their Roles](#5-npm-packages-used-and-their-roles)
    - [Dependencies](#dependencies)
      - [DevDependencies](#devdependencies)
  - [6. Project Checklist](#6-project-checklist)
  - [7. Authentication and Authorization](#7-authentication-and-authorization)
  - [8. Token Expiration and Refresh Strategy](#8-token-expiration-and-refresh-strategy)
  - [9. Caching Strategy (Planned)](#9-caching-strategy-planned)
  - [10. API Examples:](#10-api-examples)
    - [User Queries](#user-queries)
      - [User Registration Migration](#user-registration-migration)
      - [Expected Response](#expected-response)
      - [User Login Migration](#user-login-migration)
      - [Expected Response](#expected-response-1)
    - [Course Examples](#course-examples)
      - [Add Course Mutation](#add-course-mutation)
      - [Expected Response](#expected-response-2)
      - [Update Course Migration](#update-course-migration)
      - [Expected Response](#expected-response-3)
    - [Delete Course Migration](#delete-course-migration)
      - [Expected Response](#expected-response-4)
      - [Get All Courses](#get-all-courses)
      - [Expected Response](#expected-response-5)
      - [Get Course by ID](#get-course-by-id)
      - [Expected Response](#expected-response-6)
    - [Collections Examples](#collections-examples)
      - [List all Collections](#list-all-collections)
      - [Expect Response](#expect-response)
      - [Courses in Collection](#courses-in-collection)
      - [Expected Response](#expected-response-7)
  - [11. Testing Strategy](#11-testing-strategy)
    - [Approach to Unit Testing](#approach-to-unit-testing)
    - [Example: Testing the Login Mutation](#example-testing-the-login-mutation)
  - [12. Mocking and Future Enhancements](#12-mocking-and-future-enhancements)
  - [13. The result is a test suite that provides a clear checklist of passing or failing cases for each API endpoint, building confidence in the API’s behavior under various input conditions.](#13-the-result-is-a-test-suite-that-provides-a-clear-checklist-of-passing-or-failing-cases-for-each-api-endpoint-building-confidence-in-the-apis-behavior-under-various-input-conditions)

## 2. Key Technical Decisions and Implementation

## 3. Project Structure

The project’s GraphQL functionality is organized in a folder structure to separate schema, queries, and mutations. Inside the main `graphql` folder:

- **Schema file**: Defines the GraphQL schema and types.
- **Queries and Mutations**: Each has separate files for organization, and each query or mutation calls the relevant repositories in the `dao` (Data Access Object) folder.
- **DAO Structure**: A `dao` folder in the root level contains repository logic, centralizing data access and keeping resolver logic lightweight.
- **Future Plans**: For greater modularity, additional business logic would be moved to dedicated service files, further decoupling resolvers from business operations.

## 4. Project Setup

### Prerequisites

- Node.js
- PostgreSQL

### Installation

1. Clone the repository:
   `git clone https://github.com/yourusername/osc-backend-assessment.git`

2. Navigate to the project directory:
   `cd osc-backend-assessment`

3. Install dependencies:
   `npm install`

### Database Setup

To set up PostgreSQL and populate the database with seed data, run the following command:

`npm run ./dbSetup/createDB.js` (to follow)

This script will:

- Create the required tables for courses, collections and users.
- Insert initial seed data to get started with sample courses, collections and users.

Ensure your PostgreSQL server is running, and update any required configuration (such as database credentials) in the `.env` file.

### .env Configuration

Create a `.env` file in the root of the project and configure the following variables:

```
NODE_ENV=development
DB_HOST=localhost
DB_USER=postgres
DB_PASS=password
DB_NAME=distance_learning
DB_PORT=5432
PORT=5003 (or any of your choosing)
JWT_SECRET=secret
JWT_EXPIRES_IN=5m
```

## 5. NPM Packages Used and Their Roles

### Dependencies

- **bcryptjs**: For password hashing and secure storage.
- **colors**: Used to colorize console outputs for readability during development.
- **cors**: Enables Cross-Origin Resource Sharing, allowing API usage from various domains.
- **express**: Main framework for server setup, handling incoming requests.
- **express-graphql**: Integrates GraphQL with Express, providing middleware to manage GraphQL queries and mutations.
- **graphql**: Core package for defining and executing GraphQL schemas.
- **jsonwebtoken**: Manages JWT creation, verification, and handling for authentication.
- **node-cache**: Implements in-memory caching for quick data retrieval.
- **pg**: PostgreSQL client for connecting and querying the database.
- **validator**: For data validation, ensuring inputs meet specified formats and rules.

#### DevDependencies

- **cross-env**: Allows setting environment variables across platforms.
- **dotenv**: Loads environment variables from `.env` files.
- **graphql-request**: Makes GraphQL requests in testing environments.
- **jest**: Testing framework for writing unit and integration tests.
- **nodemon**: Monitors changes during development and restarts the server automatically.

## 6. Project Checklist

- GraphQL Queries

  - [x] courses(limit, sortOrder)
  - [x] course(id)
  - [x] collections
  - [x] collection(id)

- GraphQL Mutations

  - [x] addCourse(input)
  - [x] updateCourse(id, input)
  - [x] deleteCourse(id)

- Authentication and Authorization

  - [x] register(username, password)
  - [x] login(username, password)
  - [x] JWT-protected mutations

- Role-based Authorization (Bonus)
  - [x] queries require user to be logged in
  - [x] mutations reuire user to have the ADMIN role

## 7. Authentication and Authorization

Implemented using middleware to handle user authentication and role-based authorization.

- **JWT Authentication**: `jsonwebtoken` is used to sign tokens containing the user ID and role, essential for role-based checks in protected queries and mutations.
- **Authorization Checks**: Middleware checks user role and authorization level for access to mutations (restricted to admin), while all queries require login.

## 8. Token Expiration and Refresh Strategy

The JWT expires every 5 minutes for testing purposes.

- **Current Limitation**: The current setup requires users to log in again once the token expires.
- **Future Improvements**: Plan to implement refresh tokens, which would:
  - Be stored in a database table to support blacklisting or rotation for added security.
  - Allow seamless access token renewal using HTTP-only cookies or headers to prevent them from going stale.
  - Add expiration policies for refresh tokens to manage session duration securely.

## 9. Caching Strategy (Planned)

**Planned Caching**: `node-cache` would cache frequently accessed records for efficiency.

- **Cache Usage**: Cached data would be set with a timeout to periodically refresh.
- **Invalidation Policy**: When data is added, modified, or deleted, the relevant cache entry is invalidated to keep data fresh.
- **Production Consideration**: While `node-cache` is suitable for this small application, Something like Redis would be the choice for a production environment to handle larger datasets.

## 10. API Examples:

### User Queries

#### User Registration Migration

```graphql
mutation {
  registerUser(
    username: "dsmith"
    email: "dave@example.com"
    password: "password"
    repeatPassword: "password"
  ) {
    user {
      username
      email
      role
    }
    token
  }
}
```

#### Expected Response

```json
{
  "data": {
    "registerUser": {
      "user": {
        "username": "dsmith",
        "email": "dave@example.com",
        "role": "USER"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Nywicm9sZSI6IlVTRVIiLCJpYXQiOjE3MzA1MDkzNzUsImV4cCI6MTczMDUwOTk3NX0.PXhryr1_Zv3BwRylBT_Uh67IQHd2_HOJSLvNh2fF4Dc"
    }
  }
}
```

---

#### User Login Migration

```graphql
mutation {
  loginUser(username: "dsmith", password: "password") {
    user {
      username
      email
      role
    }
    token
  }
}
```

#### Expected Response

```json
{
  "data": {
    "loginUser": {
      "user": {
        "username": "dsmith",
        "email": "dave@example.com",
        "role": "USER"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Nywicm9sZSI6IlVTRVIiLCJpYXQiOjE3MzA1MDk4OTUsImV4cCI6MTczMDUxMDQ5NX0.W4lkZqhhTddlGX3d1WMppvcwLTtXim__FCgMoo_UG1I"
    }
  }
}
```

---

### Course Examples

#### Add Course Mutation

```graphql
mutation {
  addCourse(
    title: "Introduction to Cybersecurity"
    description: "Fundamentals of cybersecurity practices and principles."
    collectionId: 4
    instructor: "Mr. Sam Adams"
    duration: 42
    outcome: "Students will understand key cybersecurity concepts and practices."
  ) {
    id
    title
    description
    duration
    outcome
    instructor
    collection {
      id
      name
    }
  }
}
```

#### Expected Response

```json
{
  "data": {
    "addCourse": {
      "id": "13",
      "title": "Introduction to Cybersecurity",
      "description": "Fundamentals of cybersecurity practices and principles.",
      "duration": 42,
      "outcome": "Students will understand key cybersecurity concepts and practices.",
      "instructor": "Mr. Sam Adams",
      "collection": {
        "id": 4,
        "name": "Technology"
      }
    }
  }
}
```

#### Update Course Migration

```graphql
mutation {
  updateCourse(
    id: 10
    description: "Exploration of ancient societies and their contributions to modern culture."
    instructor: "Dr. Linda White"
  ) {
    id
    title
    description
    duration
    instructor
    collection {
      name
    }
  }
}
```

#### Expected Response

```json
{
  "data": {
    "updateCourse": {
      "id": "10",
      "title": "Ancient Civilizations",
      "description": "Exploration of ancient societies and their contributions to modern culture.",
      "duration": 30,
      "instructor": "Dr. Linda White",
      "collection": {
        "name": "History"
      }
    }
  }
}
```

### Delete Course Migration

```graphql
mutation {
  deleteCourse(id: 12) {
    id
    title
  }
}
```

#### Expected Response

```json
{
  "data": {
    "deleteCourse": {
      "id": "12",
      "title": "Introduction to Cybersecurity"
    }
  }
}
```

#### Get All Courses

This accepts two optional arguments:

- limit: an integer to limit the number of records
- sortOrder: an enum of ASC | DESC that will sort the list by title

```graphql
query {
  courses(limit: 2) {
    title
    description
    collection {
      name
    }
  }
}
```

#### Expected Response

```json
{
  "data": {
    "courses": [
      {
        "title": "Introduction to Algebra",
        "description": "An introductory course on algebra covering variables, equations, and functions.",
        "collection": {
          "name": "Math"
        }
      },
      {
        "title": "Basics of Chemistry",
        "description": "Learn the foundations of chemistry, including atomic structure and reactions.",
        "collection": {
          "name": "Science"
        }
      }
    ]
  }
}
```

#### Get Course by ID

```graphql
{
  course(id: 13) {
    title
    description
    duration
    instructor
    outcome
    collection {
      id
      name
    }
  }
}
```

#### Expected Response

```json
{
  "data": {
    "course": {
      "title": "Introduction to Cybersecurity",
      "description": "Fundamentals of cybersecurity practices and principles.",
      "duration": 42,
      "instructor": "Mr. Sam Adams",
      "outcome": "Students will understand key cybersecurity concepts and practices.",
      "collection": {
        "id": 4,
        "name": "Technology"
      }
    }
  }
}
```

---

### Collections Examples

#### List all Collections

```graphql
query {
  collections {
    id
    name
  }
}
```

#### Expect Response

```json
{
  "data": {
    "collections": [
      {
        "id": 1,
        "name": "Math"
      },
      {
        "id": 2,
        "name": "Science"
      },
      {
        "id": 3,
        "name": "History"
      },
      {
        "id": 4,
        "name": "Technology"
      }
    ]
  }
}
```

#### Courses in Collection

```graphql
query {
  coursesInCollection(id: 2) {
    title
    description
    duration
    instructor
    outcome
    collection {
      name
    }
  }
}
```

#### Expected Response

```json
{
  "data": {
    "coursesInCollection": [
      {
        "title": "Basics of Chemistry",
        "description": "Learn the foundations of chemistry, including atomic structure and reactions.",
        "duration": 12,
        "instructor": "Dr. Robert Fields",
        "outcome": "Students will be able to understand and apply chemical reactions.",
        "collection": {
          "name": "Science"
        }
      },
      {
        "title": "Physics: Laws of Motion",
        "description": "Explore the laws of motion and their applications in everyday life.",
        "duration": 14,
        "instructor": "Prof. John Anderson",
        "outcome": "Students will understand the basics of Newtonian physics.",
        "collection": {
          "name": "Science"
        }
      }
    ]
  }
}
```

---

## 11. Testing Strategy

### Approach to Unit Testing

For this project, the testing strategy focuses on unit testing individual GraphQL queries and mutations using Jest and Supertest. Each test runs in isolation with an in-memory database seeded with test data specific to the test suite or individual test. This setup allows for efficient and reliable testing without persisting test data between runs.

### Example: Testing the Login Mutation

The login mutation tests aim to validate the authentication flow by checking responses for various input scenarios. Below is an outline of how these tests would be structured:

1. **Setup**:

   - Seed the in-memory database with a sample user, including hashed credentials.
   - For each test, define the expected valid and invalid inputs.

2. **Tests**:

   - **Valid Login**: Test the mutation with correct credentials, expecting a success response with a JWT and user details.
   - **Missing Credentials**: Test with missing username or password, expecting an error response specifying the missing fields.
   - **Invalid Username or Password**: Test with incorrect credentials (wrong username or password) to ensure the response indicates failed authentication.

3. **Assertions**:
   - Verify that the returned JWT is valid for successful logins and includes the correct payload (user ID and role).
   - Confirm that failed logins return error messages without sensitive details.
4. **Teardown**:
   - Reset the in-memory database after each test to prevent data persistence across tests.

Using this approach, each query or mutation is tested across multiple scenarios (positive and negative) to ensure predictable and secure behavior.

## 12. Mocking and Future Enhancements

In future iterations, mocking strategies will be added for:

- **Authentication Middleware**: Mocking token validation for non-authentication tests allows other queries and mutations to be tested independently of actual authentication logic.
- **Caching Layer**: If caching is implemented, responses will be mocked to maintain test reliability and control over expected data.

## 13. The result is a test suite that provides a clear checklist of passing or failing cases for each API endpoint, building confidence in the API’s behavior under various input conditions.

This documentation outlines the core structure and rationale behind each decision in this project, along with future enhancements that could improve its security, efficiency, and maintainability.
