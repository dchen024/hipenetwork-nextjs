### **Week 1: Project Setup and Basic Authentication (using Supabase)**

**Objective**: Set up the foundational structure for the project, including frontend and backend, and implement authentication using **Supabase**.

- **Frontend**:

  - Initialize the Next.js project with TypeScript.
  - Install and configure Tailwind CSS for UI styling.
  - Set up basic routes for navigation (e.g., Home, Login, Signup).
  - Integrate **Supabase Auth** for OAuth login (supporting Google, GitHub, etc.).

- **Backend**:

  - Use **Supabase PostgreSQL** as the managed database (no need to set up a separate DB).
  - Set up authentication with Supabase’s built-in Auth features.

- **Testing**: Test authentication flows (login, logout, signup) and ensure users can authenticate via OAuth.

**Demo**: A basic signup/login system using Supabase’s OAuth, with authentication working across the frontend and backend.

---

### **Week 2: Landing Page and User Profile Creation**

**Objective**: Develop the **landing page** and user profile creation features in one sprint.

- **Frontend**:

  - Build a public-facing **landing page** using **Next.js** and **Tailwind CSS**. Include a hero section, features, and a call to action (sign-up/login).
  - Create a **user profile page UI** for profile creation and editing.
  - Add the profile form for name, bio, avatar, etc.
  - Integrate **SWR** for state management and data fetching for profiles.

- **Backend**:

  - Store profile-related data (e.g., name, bio, avatar URL) in **Supabase PostgreSQL**.
  - Implement image upload functionality using **Google Cloud Storage** for avatar storage.

- **Testing**: Ensure the landing page is responsive and that users can create/edit profiles, including avatar uploads.

**Demo**: A responsive landing page and working profile creation system, with avatars stored in **Google Cloud Storage**.

---

### **Week 3: Feed, Post Creation, Likes, Comments, and Post Interactions**

**Objective**: Allow users to create posts and interact with posts through likes and comments.

- **Frontend**:

  - Build the UI for creating posts (text and media).
  - Develop the feed to display posts from users in chronological order.
  - Add like and comment functionalities to each post.

- **Backend**:

  - Use **Supabase** to store posts, likes, and comments in **PostgreSQL**.
  - Automatically generate RESTful APIs via Supabase for managing posts and interactions.
  - Store media (e.g., images in posts) in **Google Cloud Storage** and save the URLs in Supabase.

- **Testing**: Test post creation, liking, and commenting functionality.

**Demo**: Users can create posts, like and comment on posts, and see these interactions reflected in the personalized feed.

---

### **Week 4: Search and User Discovery**

**Objective**: Implement a search feature to allow users to find other users and posts.

- **Frontend**:

  - Build the UI for a search bar and display search results dynamically as users input search terms.
  - Allow navigation from search results to user profiles or posts.

- **Backend**:

  - Use Supabase's API for querying the database, or write custom SQL queries to search for users and posts.

- **Testing**: Test search functionality for users and posts.

**Demo**: Users can search for other users or posts and navigate to profiles or individual posts from the search results.

---

### **Week 5: Follow/Unfollow System and Feed Personalization**

**Objective**: Enable users to follow and unfollow each other and personalize their feed based on the people they follow.

- **Frontend**:

  - Add follow/unfollow buttons on user profiles.
  - Update the feed to display posts only from followed users.
  - Add a "follow suggestions" section based on user activity (optional).

- **Backend**:

  - Use **Supabase** to store follow/unfollow relationships in **PostgreSQL**.
  - Adjust the feed API to return personalized content based on the users the logged-in user follows.

- **Testing**: Test following/unfollowing users and the personalized feed based on the user’s connections.

**Demo**: Users can follow and unfollow others, with their feed showing posts from people they follow.

---

### **Week 6: Chatbot Integration**

**Objective**: Integrate a **chatbot** into the platform to answer school-related or general questions.

- **Frontend**:

  - Build a chatbot UI interface (e.g., as a pop-up or dedicated page).
  - Enable users to ask questions and display chatbot responses in real-time.

- **Backend**:

  - Integrate an existing chatbot API into the application, linking it with the frontend.

- **Testing**: Test chatbot functionality, ensuring it can respond correctly to user questions.

**Demo**: Users can ask questions to the chatbot, and responses are returned and displayed in real-time.

---

### **Week 7: Go-Based Messaging Microservice Setup, WebSockets, and Real-Time Messaging**

**Objective**: Set up the messaging microservice using **Go**, with real-time message exchange using WebSockets.

- **Frontend**:

  - Develop the messaging UI for real-time chats between users.
  - Set up WebSocket connections for sending and receiving messages in real time.

- **Backend (Go Microservice)**:

  - Deploy the Go microservice on **DigitalOcean** using WebSocket connections.
  - Use **Supabase PostgreSQL** to store message history.
  - Implement WebSocket handling in the Go microservice to handle real-time message exchanges.

- **Testing**: Test the WebSocket connections and real-time chat features.

**Demo**: Users can send and receive messages in real-time via WebSocket, with message history being stored.

---

### **Week 8: Message History, Notifications, and Scaling Messaging**

**Objective**: Implement message history retrieval, offline notifications, and scale the messaging service.

- **Frontend**:

  - Enable users to view message history when they open a chat window.
  - Implement notifications for new messages (e.g., in-app notifications or popups).

- **Backend (Go Microservice)**:

  - Retrieve and display message history from **Supabase PostgreSQL**.
  - Set up offline email notifications using **GCP SendGrid API** or **GCP Gmail API** for sending emails to users who are offline.

- **Testing**: Test message history retrieval, real-time notifications, and email notifications for offline users.

**Demo**: Users can view chat history and receive notifications for new messages, including email notifications for offline users.

---

### **Week 9: Performance Optimizations and Caching for Top Posts**

**Objective**: Optimize the application’s performance and implement caching for the most popular posts.

- **Frontend**:

  - Implement lazy-loading for content, especially posts and images.
  - Optimize API calls to reduce latency and improve user experience.

- **Backend**:

  - Implement caching for **top posts** (most liked/commented posts) using **Redis**, hosted either on **DigitalOcean** or **Google Cloud Memorystore**.
  - Optimize database queries to ensure fast response times for fetching posts, likes, and comments.

- **Testing**: Test the performance improvements and caching strategy to ensure responsiveness.

**Demo**: A faster application with improved UI performance and caching for top posts to reduce server load.

---

### **Week 10: Deployment, NGINX Setup, and Monitoring**

**Objective**: Deploy the application to **DigitalOcean**, configure **NGINX** for reverse proxying, and set up monitoring for production readiness.

- **DevOps**:

  - Dockerize the frontend (Next.js), backend (Flask), and Go microservice.
  - Set up **NGINX** as a reverse proxy to handle routing between services (frontend, backend, messaging).
  - Use **Jenkins** or **GitHub Actions** for continuous integration and automated deployments.
  - Set up monitoring using **DigitalOcean Monitoring**, **Prometheus**, and **Grafana** for tracking performance and uptime.

- **Testing**: Test end-to-end deployment, perform load testing, and ensure monitoring and alerts are working properly.

**Demo**: A fully deployed, production-ready platform on **DigitalOcean**, with **NGINX** managing traffic and monitoring set up for real-time insights.

---
