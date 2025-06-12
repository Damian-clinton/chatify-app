# **Chattify: Real-Time Messaging App** 🚀

Connect with friends and family in real-time with Chattify! A modern messaging app built with React, Node.js, and MongoDB, designed for seamless communication. 💬

## ✨ Features

- 💬 **Real-Time Messaging**: Send and receive messages instantly.
- 👤 **User Authentication**: Secure login and registration.
- 📸 **Profile Customization**: Upload and update profile pictures.
- 🗂️ **Conversation Management**: Create and manage conversations.
- 📱 **Responsive Design**: ⚠️ Heads up!
This project is not mobile-friendly at the moment. It’s built mainly for desktop users, so the layout might break on phones or tablets.

## 🛠️ Installation

Follow these steps to get Chattify up and running on your local machine:

1.  **Clone the Repository**:

    ```bash
    git clone <repository-url>
    cd chattify
    ```

2.  **Install Dependencies (Frontend)**:

    ```bash
    cd chatify/chatify
    npm install
    ```

3.  **Install Dependencies (Backend)**:

    ```bash
    cd ../../server
    npm install
    ```
4.  **Install Dependencies (Socket)**:

    ```bash
    cd ../socket
    npm install
    ```

5.  **Environment Variables**:
    Create a `.env` file in the `server` folder and add the following:

    ```
    PORT=5000
    MONGO_URL=your_mongodb_connection_string
    JWT_ACCESS_KEY=your_jwt_access_key
    ```

6.  **Run the Application**:

    ```bash
    # Start the backend server
    cd server
    npm run server

    # Start the frontend development server
    cd ../chatify/chatify
    npm start

    #start the socket
    cd ../../socket
    npm run socket
    ```

## 💻 Usage

### Setting Up the Frontend

1.  Navigate to the `chatify/chatify` directory.

    ```bash
    cd chatify/chatify
    ```

2.  Start the development server.

    ```bash
    npm start
    ```

3.  Open your browser and go to `http://localhost:5001` to view the application.

### Backend Setup

1.  Navigate to the `server` directory.

    ```bash
    cd server
    ```

2.  Start the server.

    ```bash
    npm run server
    ```

3.  The server will run on the port specified in your `.env` file (e.g., `http://localhost:5000`).

### Socket Setup

1.  Navigate to the `socket` directory.

    ```bash
    cd socket
    ```

2.  Start the socket.

    ```bash
    npm run socket
    ```

## ⚙️ Technologies Used

| Technology   | Purpose                                 |
| :----------- | :-------------------------------------- |
| React        | Frontend framework                      |
| Node.js      | Backend runtime environment             |
| Express.js   | Backend framework                       |
| MongoDB      | Database                                |
| Socket.IO    | Real-time communication               |
| Tailwind CSS | CSS framework                           |
| Axios        | HTTP client for making API requests    |
| JWT          | JSON Web Tokens for authentication     |
| bcrypt       | Password hashing                        |
| Multer       | Middleware for handling `multipart/form-data` |

## 🎉 Contributing

We welcome contributions to Chattify! Here’s how you can help:

- 🐞 **Report Bugs**: Submit detailed bug reports.
- 🛠️ **Suggest Features**: Propose new features and enhancements.
- 💡 **Submit Pull Requests**: Contribute code improvements.

### Contribution Guidelines

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and test thoroughly.
4.  Submit a pull request with a clear description of your changes.

## 📜 License

This project is licensed under the [MIT License](link-to-license).

## ✍️ Author Info

- Author: [F-Grimmey](kyleclinton54@gmail.com)
   - GitHub: []()
   - LinkedIn: []()
   - Twitter: [Grimmey](@grimmey54)

