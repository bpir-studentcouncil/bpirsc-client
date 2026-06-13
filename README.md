# 🇧🇩 BPIR Student Council (BPIRSC) Web Portal

🔗 **Live Website:** [https://bpirsc-web.netlify.app](https://bpirsc-web.netlify.app)  

Welcome to the official web portal of the **Bangladesh Polytechnic Institute Rajshahi Student Council (BPIRSC)**. This is a modern, responsive web application built to connect students, alumni, and administrators while providing features such as course management, event archives, directories, and notices.

---

## 🚀 Key Features

### 👤 Authentication & Role Management
* **Dual Auth Modes:** Seamless Firebase Authentication fallback to Mock Auth mode for development.
* **Role-based Access Control:** Secure routes for three different user roles:
  * **Students:** Access directories, courses, activities, and submit feedback.
  * **Alumni:** Register in the Alumni Directory, track registration status, and contribute updates.
  * **Admin:** Complete dashboard control to manage users, news, projects, team members, and view messages.

### 📰 Gossip & News Portal
* Categorized newsfeed (Notice Board, Scholarship Info, Success Stories, Academic Notices).
* Featured banners, keywords search, and real-time category filtering.

### 📂 Project & Event Archive
* Comprehensive catalog of workshops, AutoCAD courses, volunteer events, and donation campaigns.
* Real-time dashboard showing status counters (Completed, Ongoing, Upcoming).
* Detail view showing core team members, outcomes, challenges, and picture galleries.

### 🎓 Alumni Directory
* Searchable and filterable directory by department, session, and name.
* Registration approval system with payment verification logs (Admin panel).

### 💬 Contact and Feedback
* Dynamic feedback form sending messages to the database.
* Admin panel to read, review, and mark messages as read.

---

## 🛠️ Technology Stack

| Frontend Component | Technology | Backend Component | Technology |
| :--- | :--- | :--- | :--- |
| **Framework** | React.js (Vite) | **Runtime** | Node.js / Express.js |
| **Styling** | Vanilla CSS + daisyUI | **Database** | MongoDB Atlas / Mongoose |
| **Authentication** | Firebase Auth | **Deployment** | Vercel Serverless |
| **Image Hosting** | Cloudinary | **Logger** | Morgan |

---

## ⚙️ Environment Configuration

To run this project locally, configure the following `.env` files.

### 💻 Client Env Config (`bpirsc-client/.env`)
Create a `.env` file in the root of the client directory:
```env
VITE_BACKEND_URL=http://localhost:5000

VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

### 🗄️ Server Env Config (`bpirsc-server/.env`)
Create a `.env` file in the root of the server directory:
```env
DOMAIN_URL=http://localhost:5173
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/bpirsc_db
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## 🏃‍♂️ Running Locally

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/bpir-studentcouncil/bpirsc-client.git
   ```

2. **Run Backend Server:**
   ```bash
   cd bpirsc-server
   npm install
   node server.js
   ```

3. **Run Frontend Client:**
   ```bash
   cd bpirsc-client
   npm install
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## ☁️ Deployment

### 🌐 Frontend (Netlify)
1. Link your GitHub repository to Netlify.
2. In Netlify Site Settings, configure Environment Variables:
   * `VITE_BACKEND_URL` = `https://your-backend.vercel.app`
3. Trigger deploy.

### 🔌 Backend (Vercel)
1. Install Vercel CLI and deploy:
   ```bash
   cd bpirsc-server
   vercel --prod
   ```
2. Configure environment variables in the Vercel dashboard:
   * `MONGO_URI`, `DOMAIN_URL`, and Cloudinary variables.
3. Redeploy to apply variables.

---

> **Note:** Database connects automatically to MongoDB Atlas and will automatically seed sample projects, news articles, and team members if the collections are empty.
