# 📝 Collaborative Cloud Editor (Google Docs Clone)

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-Live-success)
![Stack](https://img.shields.io/badge/stack-MERN-blueviolet)

A full-stack, real-time collaborative text editor that allows multiple users to edit documents simultaneously with zero latency issues. Built to demonstrate proficiency in **WebSocket architecture**, **CRDTs (Conflict-free Replicated Data Types)**, and **scalable MERN stack deployment**.

🔗 **[View Live Demo](https://collaborative-editor-pearl-ten.vercel.app/)**


## ✨ Key Features

- **Real-Time Collaboration:** Syncs keystrokes instantly across multiple clients using **Yjs** and **WebSockets**.
- **Conflict Resolution:** Implements CRDTs to handle concurrent edits without data loss.
- **Rich Text Editing:** Features a custom toolbar for bold, italic, highlights, image uploads, and text alignment (powered by **Tiptap**).
- **Live Presence:** Shows active user cursors and names in real-time.
- **Document Management:** Create, search, delete, and organize documents persistently.
- **Authentication:** Secure JWT-based sign-up and login system.
- **Export Options:** One-click export to PDF or plain text.

## 🛠️ Tech Stack

### Frontend
- **Framework:** React.js (Vite)
- **State/Collab:** Yjs, Tiptap Editor
- **Styling:** Tailwind CSS
- **Routing:** React Router DOM
- **Deployment:** Vercel

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB Atlas (Mongoose)
- **Real-Time:** `y-websocket`, `ws`
- **Deployment:** Render

## ⚙️ Architecture

The application uses a **Client-Server** architecture decoupled for scalability:

1.  **Client:** Establishes a WebSocket connection to the server upon entering a document room.
2.  **Server:** Acts as a signaling server for Yjs, broadcasting incremental state updates to all connected clients.
3.  **Persistence:** Document metadata (titles, owners) is stored in MongoDB, while document content is synced via WebSocket binary updates.

## 🚀 Getting Started Locally

Follow these steps to run the project on your local machine.

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas URI

### 1. Clone the Repository
```bash
git clone https://github.com/armaan-p22/collaborative-editor.git
cd collaborative-editor
```

### 2. Setup Backend
```bash
cd server
npm install
```

#### Create a .env file in the server directory:
```bash
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=1234
```

#### Start the server:
```bash
npm run dev
```

### 3. Setup Frontend
#### Open a new terminal:
```bash
cd client
npm install
npm run dev
```

## 🔒 Environment Variables

**Frontend (Vercel)**

- `VITE_API_BASE_URL`: URL of the deployed Render backend.
- `VITE_WS_URL`: WebSocket URL (`wss://...`) of the deployed backend.

**Backend (Render)**

- `MONGO_URI`: MongoDB connection string.
- `JWT_SECRET`: Secret key for signing tokens.
- `PORT`: 10000 (Required for Render).

## 📄 License
This project is open source and available under the [MIT License](LICENSE).