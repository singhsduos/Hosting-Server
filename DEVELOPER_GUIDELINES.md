# Developer Guidelines

## Project Overview
This project is a web application that utilizes Express for the backend and MongoDB/POSTGRESQL for data storage. It follows a modular architecture with a clear separation of concerns.

## Folder Structure
- **models/**: Contains data models and schemas.
- **services/**: Contains business logic and service classes.
- **controllers/**: Handles incoming requests and responses.
- **db/**: Contains database-related implementations and factories.
- **middlewares/**: Contains middleware functions for request processing.

## Coding Standards
- Follow consistent naming conventions for files, classes, and functions.
- Use JSDoc comments for all public methods and classes.
- Maintain a clean and organized code structure.

## Model Design
- Models should extend a base model interface.
- Use Mongoose for defining schemas and interacting with MongoDB.

## Service Layer
- The service layer should encapsulate all business logic.
- Services should interact with models to perform CRUD operations.

## Controller Layer
- Controllers should handle incoming requests and delegate to the service layer.
- Use proper HTTP status codes in responses.

## Error Handling
- Implement a centralized error handling mechanism.
- Use custom error classes for better error management.

## Using Mongoose
- Use Mongoose methods for all database operations.
- Define schemas in separate files and import them into models.

## LLD Concepts
- Implement interfaces and abstract classes where applicable.
- Use design patterns to promote code reusability and maintainability.

## API Endpoints Documentation

### 1. GET /users
- **Description**: Retrieves all users with optional filtering and pagination.
- **Request Parameters**:
  - **Query Parameters**:
    - `isActive`: (optional) Filter users by active status.
    - `email`: (optional) Filter users by email (supports regex).
    - `page`: (optional) Page number for pagination (default: 1).
    - `limit`: (optional) Number of users per page (default: 10).
    - `sortBy`: (optional) Field to sort by (default: `createdAt`).
    - `sortOrder`: (optional) Order of sorting (default: `desc`).
- **Response**:
  - **Success**: Returns a list of users and pagination info.
  - **Example**:
    ```json
    {
      "success": true,
      "data": [
        {"id": 1, "email": "user@example.com"},
        {"id": 2, "email": "user2@example.com"}
      ],
      "pagination": {
        "total": 2,
        "page": 1,
        "pages": 1
      }
    }
    ```

### 2. GET /users/:id
- **Description**: Retrieves a user by their ID.
- **Request Parameters**:
  - **Path Parameter**:
    - `id`: User ID.
- **Response**:
  - **Success**: Returns the user data.
  - **Example**:
    ```json
    {
      "success": true,
      "data": {"id": 1, "email": "user@example.com"}
    }
    ```

### 3. POST /users
- **Description**: Creates a new user.
- **Request Body**:
  - User data (e.g., email, password, name).
- **Response**:
  - **Success**: Returns the created user data.
  - **Example**:
    ```json
    {
      "success": true,
      "data": {"id": 3, "email": "newuser@example.com"}
    }
    ```

### 4. POST /users/login
- **Description**: Authenticates a user.
- **Request Body**:
  - Credentials (e.g., email, password).
- **Response**:
  - **Success**: Returns authentication result.
  - **Example**:
    ```json
    {
      "success": true,
      "token": "jwt.token.here"
    }
    ```

### 5. PUT /users/:id
- **Description**: Updates user information by ID.
- **Request Parameters**:
  - **Path Parameter**:
    - `id`: User ID.
- **Request Body**:
  - Updated user data.
- **Response**:
  - **Success**: Returns updated user data.
  - **Example**:
    ```json
    {
      "success": true,
      "data": {"id": 1, "email": "updateduser@example.com"}
    }
    ```

### 6. DELETE /users/:id
- **Description**: Deletes a user by ID.
- **Request Parameters**:
  - **Path Parameter**:
    - `id`: User ID.
- **Response**:
  - **Success**: Returns a success message.
  - **Example**:
    ```json
    {
      "success": true,
      "message": "User deleted successfully"
    }
    ```

## Additional Notes
- Ensure that all new features are covered by unit tests.
- Document any new functionality added to the project.

---
