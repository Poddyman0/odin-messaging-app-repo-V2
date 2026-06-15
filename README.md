# Messaging App

## Overview

For this project, I built a full-stack messaging application that allows users to communicate with one another through direct messages. The goal of the project was to simulate the core functionality of modern messaging platforms such as Discord, WhatsApp, and Facebook Messenger while focusing on backend architecture, authentication, and structured data modeling.

This project challenged me to design a system that supports user accounts, message exchange between users, and profile customization. I also had to carefully plan the application structure since messaging systems involve continuous interaction between multiple users and complex relational data.

---

## Project Goals

The main objectives of this project were to:

* Build a secure authentication system.
* Allow users to send and receive messages.
* Enable users to customize their profiles.
* Design a relational database to manage users and conversations.
* Develop a responsive and functional full-stack web application.
* Deploy the application for public access.

---

## Core Features

The application includes the following core functionality:

* User registration and login system.
* Secure authentication and session handling.
* Direct messaging between users.
* User profile customization.
* Viewing user profiles and message history.

---

## Technologies Used

### Backend

* Node.js
* Express.js
* PostgreSQL
* Prisma ORM
* Passport.js
* Express Session
* bcrypt

### Frontend

* HTML5
* CSS3
* JavaScript
* EJS (templating engine)

### Development Tools

* Git
* GitHub

---

## Authentication System

Authentication is a core part of the application and ensures that only registered users can access messaging features.

### Registration

Users can create an account by providing credentials. During registration:

* Input data is validated.
* Passwords are hashed using bcrypt before storage.
* User records are saved in the database.

---

### Login

Users log in using their credentials.

Once authenticated:

* A session is created using Express Session.
* The session is persisted in the database.
* Users gain access to messaging features and profiles.

---

### Route Protection

All messaging routes are protected, meaning only authenticated users can:

* View messages
* Send messages
* Access other user profiles

---

## Database Design

I used Prisma ORM to design and manage the database structure. The database is centered around users and messages.

---

### User Model

Each user contains:

* Username
* Email
* Password hash
* Profile information (such as bio or display name)
* Account metadata

Users can:

* Send messages
* Receive messages
* Update their profile

---

### Message Model

Each message contains:

* Sender user ID
* Receiver user ID
* Message content
* Timestamp

Messages are stored in a relational structure that allows efficient querying between two users.

---

## Messaging System

The core feature of the application is direct messaging between users.

### Sending Messages

Users can send messages to another user by selecting their profile or entering their username. When a message is sent:

1. The sender submits message content.
2. The backend validates and stores the message.
3. The message is saved with sender and receiver references.

---

### Receiving Messages

Messages are retrieved from the database based on the authenticated user. Each user can view:

* Messages they have sent
* Messages they have received

This creates a complete conversation history between users.

---

### Message History

The application displays message history in chronological order, allowing users to follow conversations naturally.

---

## User Profiles

Each user has a customizable profile page.

### Profile Features

Users can:

* View their profile information
* Edit profile details
* View messages associated with their account

Profiles act as the central identity hub for each user within the application.

---

## User Interface

The user interface was designed to be simple and functional, focusing on usability rather than unnecessary complexity.

### Key Pages

* Login page
* Registration page
* User dashboard
* Messaging interface
* Profile page
* User directory

### Messaging Interface

The messaging UI allows users to:

* Select a conversation partner
* View message history
* Send new messages instantly
* Scroll through conversations

---

## Application Flow

1. A user registers or logs in.
2. The user is redirected to the main dashboard.
3. The user selects another user to message.
4. Messages are sent and stored in the database.
5. The conversation updates when the page is refreshed.
6. Users can continue conversations at any time.

---

## Data Handling

All messaging data is handled through RESTful API routes.

The system follows a request-response model:

* Users send requests when they perform actions (like sending a message).
* The server processes the request and returns updated data.
* The frontend updates based on the response.

Because this project uses a traditional REST architecture, real-time updates are not implemented. Messages appear after refresh or re-fetching data.

---

## Security Considerations

To ensure the safety of user data, I implemented several security measures:

* Password hashing with bcrypt
* Session-based authentication
* Protected routes for messaging and profiles
* User validation on all message submissions
* Ownership checks for user data access

These measures ensure users can only access their own data and authorized content.

---

## Deployment

After development, I deployed the application to a hosting platform.

The deployment process included:

* Configuring environment variables
* Setting up a production database
* Deploying the Express server
* Testing authentication and messaging in production

The final application is accessible online and fully functional.

---

## Challenges

One of the main challenges in this project was designing the messaging system in a way that efficiently handled relationships between users. Since each message involves both a sender and receiver, I had to carefully structure the database to support fast querying and clear data relationships.

Another challenge was managing message retrieval and display in a clean and organized way, especially when handling multiple conversations between users.

Additionally, working within a REST API architecture meant that real-time messaging was not possible, so I had to design a system that still provided a smooth user experience without live updates.

---

## Key Skills Demonstrated

* Full-Stack Web Development
* Node.js
* Express.js
* PostgreSQL
* Prisma ORM
* Passport.js Authentication
* Session Management
* RESTful API Design
* Database Modeling
* User-to-User Communication Systems
* Secure Authentication Practices
* MVC Architecture
* Deployment
* Git & GitHub

---

## Outcome

This project allowed me to build a fully functional messaging application from scratch while gaining hands-on experience with authentication systems, relational database design, and user-to-user communication logic. By implementing secure login functionality and a structured messaging system, I developed a deeper understanding of how modern messaging platforms manage and store user interactions.

The final result is a working full-stack messaging app that demonstrates my ability to design and build scalable web applications with real-world functionality.
