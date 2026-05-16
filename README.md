📩 Contact Form Backend

This is a simple Node.js + Express + MongoDB backend for handling contact form submissions.
It saves form data in MongoDB and sends a notification to Microsoft Teams via webhook.

🚀 Setup

Clone the repo
git clone git@github.com:Rajachellan/Contact-Form-Rankraze.git
cd Contact-Form-Rankraze

Install dependencies
npm install

Create .env file

PORT=4000  
MONGO_URI=your-mongodb-connection-string  
TEAMS_WEBHOOK_URL=your-teams-webhook-url

Start the server
npm start

Server will run at: 👉 http://localhost:4000

📌 API

Health Check
GET /health
Response: { "message": "App is running ✅" }

Submit Form
POST /api/form
Body:

{
"name": "John Doe",
"email": "john@example.com",
"mobileNo": "9876543210",
"message": "Hello!"
}

🛠 Tech Used

Node.js | Express.js | MongoDB (Mongoose) | Microsoft Teams Webhook
