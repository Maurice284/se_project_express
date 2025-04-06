# WTWR (What to Wear?): Back End

Project Description:

The WTWR project is a web application designed to provide a platform for users to interact, register, and access personalized content. The front-end has already been developed, and the focus of the back-end phase is to create a robust server that supports the application's functionality. The server will be built using Express.js, and it will include user authentication and an API to interact with the database. The objective is to establish secure communication between the client and the server, manage user data, and handle errors effectively.

Functionality:

The server will facilitate user registration, login, and authentication.

API routes will allow users to interact with data stored in the database.

A secure database connection will store user information and other necessary data.

Error handling mechanisms will be implemented to ensure smooth communication between the client and server.

## Project features

Techniques Used:

1. Express.js: The project will utilize the Express framework to set up the server. Express simplifies route creation, middleware handling, and server-side logic implementation.

2. Database Integration: A database (e.g., MongoDB or SQL-based) will be set up and connected to the server. This will store essential user data and application-related information.

3. User Authorization: Authentication will be implemented using techniques such as JWT (JSON Web Tokens) or session-based authentication, ensuring that only authorized users can access certain parts of the application.

4. API Creation: RESTful API routes will be created to handle CRUD (Create, Read, Update, Delete) operations on the data. These routes will communicate with the database to store and retrieve data as required.

5. Error Handling: Proper error handling will be incorporated to manage server crashes, invalid requests, and database-related issues. This ensures the application is resilient and user-friendly.

6. Deployment: Once the server and API are set up, the application will be deployed on a remote machine, ensuring it’s accessible and scalable for production use.

In the upcoming sprints, focus will shift to securing the application, performing thorough testing, and refining the deployment process for stability and performance.

## Running the Project

`npm run start` — to launch the server

`npm run dev` — to launch the server with the hot reload feature

### Testing

Before committing your code, make sure you edit the file `sprint.txt` in the root folder. The file `sprint.txt` should contain the number of the sprint you're currently working on. For ex. 12
