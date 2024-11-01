# OSC Backend Engineer Assessment

This project is a GraphQL API built for Open Study College, allowing internal users to manage a database of distance learning courses. The API supports querying and mutating data related to courses and collections, with secure access through JWT-based authentication. It is implemented using TypeScript, Node.js, and PostgreSQL.

## Project Setup

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

## NPM Packages

A brief list of the core NPM packages used in this project:

- apollo-server-express: For creating a GraphQL server
- bcrypt: To securely hash user passwords
- dotenv: For environment variable management
- jsonwebtoken: For handling JWT authentication
- pg: PostgreSQL client for Node.js

More packages are listed in `package.json`.

## Project Checklist

- GraphQL Queries

  - courses(limit, sortOrder)
  - course(id)
  - collections
  - collection(id)

- GraphQL Mutations

  - addCourse(input)
  - updateCourse(id, input)
  - deleteCourse(id)

- Authentication and Authorization

  - register(username, password)
  - login(username, password)
  - JWT-protected mutations

- Role-based Authorization (Bonus)

### GraphQL Mutation Example

Below is an example of a GraphQL mutation to add a new course.

#### Mutation Example

```
`mutation {
    createCourse( title: "Basics of Chemistry", description: "Learn the foundations of chemistry, including atomic structure and reactions.", collectionId: 2, instructor: "Dr. Robert Fields", duration: 12, outcome: "Students will understand and apply chemical reactions." ) {
        id
        title
        collection {
            name
        }
    }
}`
```

#### Expected Response

If successful, the mutation will return the following response:

```
{
    "data": {
        "createCourse": {
            "id": "101",
            "title": "Basics of Chemistry",
            "collection": {
                "name": "Science"
            }
        }
    }
}
```

---

More details and examples will be added as the project progresses.
