# Alumni_Portal_DAVJJP
MN Jha DAV Public School - Alumni Portal
A full-stack MERN (MongoDB, Express.js, React.js, Node.js) web application built to serve as a comprehensive, modern, and engaging portal for the alumni of MN Jha DAV Public School, Jhanjharpur.

✨ Features
Secure Authentication: Robust JWT-based user registration and login system with a mandatory admin approval flow for new alumni.

Dynamic Landing Page: A beautiful, multi-section landing page with scroll animations for guests.

Personalized Dashboard: A dedicated dashboard for logged-in users showing a community feed and special announcements.

Profile Management: Alumni can create and edit detailed profiles, including personal information, professional details, and profile picture uploads.

Community Feed: A central place for alumni to create and view posts about job openings, articles, events, and news.

Interactive Posts: Features for commenting on and sharing posts to boost engagement.

Interest Groups & Chat: Alumni can create and join interest-based groups with real-time chat functionality.

Alumni Directory: A private, searchable, and filterable directory of all approved alumni.

Birthday Section: A special section on the dashboard that automatically features alumni on their birthday.

Admin Dashboard: A protected area for administrators to approve new user registrations, manage posts, and view user feedback.

Email Notifications: Automated email notifications sent to alumni upon account approval.

Modern, Responsive UI: A mobile-first, "GenZ" inspired design using Tailwind CSS, featuring a clean layout and smooth animations.

🛠️ Tech Stack
Frontend: React.js, Tailwind CSS, Heroicons, Axios, react-intersection-observer

Backend: Node.js, Express.js, Mongoose ODM

Database: MongoDB

Authentication: JSON Web Tokens (JWT), bcrypt

File Uploads: Multer

Email: Nodemailer

🚀 Running the Project Locally
Prerequisites
Node.js and npm (Node Package Manager)

MongoDB (either running locally or a connection string from MongoDB Atlas)

Git

1. Clone the Repository
git clone [https://github.com/rahulkumar-123/Alumni_Portal_DAVJJP.git](https://github.com/rahulkumar-123/Alumni_Portal_DAVJJP.git)
cd Alumni_Portal_DAVJJP

2. Backend Setup
# Navigate to the backend folder
cd backend

# Install dependencies
npm install

# Create a .env file in the /backend directory and add your variables
# (You can copy from .env.example if one exists)
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_strong_jwt_secret
PORT=5000
EMAIL_HOST=your_email_smtp_host
EMAIL_PORT=your_email_port
EMAIL_USER=your_email_address
EMAIL_PASS=your_email_password

# Start the backend server
npm run dev

3. Frontend Setup
# From the root directory, navigate to the frontend folder
cd ../frontend

# Install dependencies
npm install

# Create a .env file in the /frontend directory and add your API URL
REACT_APP_API_URL=http://localhost:5000/api

# Start the frontend React app
npm start

The frontend will be available at http://localhost:3000 and the backend server will be listening on http://localhost:5000.

Developed by
Rahul Kumar

LinkedIn Profile: linkedin.com/in/rahul-kumar-jjp/
