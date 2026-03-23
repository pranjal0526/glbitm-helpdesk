# 🚀 GLBITM Helpdesk

A full-stack complaint management system designed for college campuses where students can raise issues and track their resolution, while administrators can efficiently manage and resolve them.

---

## 📌 Overview

GLBITM Helpdesk streamlines the process of reporting and resolving campus-related issues such as hostel problems, classroom maintenance, and infrastructure complaints.

The platform ensures **secure access using Google OAuth restricted to institutional email domains (@glbitm.ac.in)**.

---

## ✨ Features

### 👨‍🎓 Student Panel

* 🔐 Login with Google (college email only)
* 📝 Raise complaints with title & description
* 📊 Track complaint status (Open / In Progress / Resolved)

### 👨‍💼 Admin Panel

* 📋 View all complaints
* 🔄 Update complaint status
* ⚡ Real-time monitoring of issues

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Tailwind CSS (or custom styling)

### Backend

* Node.js
* Express.js

### Database

* MongoDB Atlas

### Authentication

* Google OAuth (via @react-oauth/google + backend verification)

---

## 🔐 Authentication Flow

1. User clicks **“Continue with Google”**
2. Google returns an ID token
3. Frontend sends token to backend
4. Backend verifies token using Google Auth Library
5. Only emails ending with **@glbitm.ac.in** are allowed

---

## 📂 Project Structure

```
glb-helpdesk/
│
├── frontend/
│   ├── src/
│   └── ...
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── models/
│   │   └── app.js
│   ├── server.js
│   └── .env
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 🔹 1. Clone the Repository

```
git clone https://github.com/your-username/glbitm-helpdesk.git
cd glbitm-helpdesk
```

---

### 🔹 2. Backend Setup

```
cd backend
npm install
```

Create `.env` file:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
GOOGLE_CLIENT_ID=your_google_client_id
```

Run backend:

```
npm run dev
```

---

### 🔹 3. Frontend Setup

```
cd frontend
npm install
npm start
```

---

## 🌐 Environment Variables

### Backend `.env`

```
PORT=5000
MONGO_URI=your_mongodb_uri
GOOGLE_CLIENT_ID=your_client_id
```

---

## 🧪 API Endpoints

### 🔐 Auth

* `POST /api/auth/google` → Google login

### 🧾 Complaints

* `POST /api/complaints` → Create complaint
* `GET /api/complaints` → Get all complaints
* `PUT /api/complaints/:id` → Update status

---

## 🔮 Future Enhancements

* 📩 Email notifications for admins
* 🔔 Real-time updates (Socket.io)
* 📱 Mobile responsive UI improvements
* 📊 Analytics dashboard
* 🧑‍🤝‍🧑 Role-based access control (RBAC)

---

## 🤝 Contributing

Contributions are welcome! Feel free to fork this repository and submit a pull request.

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Pranjal Pandey**
B.Tech CSE (AI/ML) | Developer

---

## ⭐ Show Your Support

If you like this project, give it a ⭐ on GitHub!
