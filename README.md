# Shopzy-EcommerceApp
Shopzy is a Fully Functional E-commerce Platform

# Full Stack Project with React, Node.js, MongoDB, and More

This project is a full-stack application built using React, Redux, Node.js, Express.js, MongoDB, Cloudinary, PayPal, and BrevoMail (Sendinblue). Follow the instructions below to set up both the client and server, configure the environment variables, and run the application locally.
while using the app the dummy payment was donw by paypal if you have paypal developer account or paypal sandbox account then use that other wise use ( Email :  shopzy@personal.shopzy.com  Passwors :  Shopzy@098 ) login using this and pay the amount

## Tech Stack

- **Frontend:** React, Redux, Vite, Tailwind CSS
- **Backend:** Node.js, Express.js, MongoDB, Cloudinary, PayPal, Nodemailer (BrevoMail)
- **Database:** MongoDB
- **Cloud Storage:** Cloudinary
- **Payment Integration:** PayPal
- **Email Service:** BrevoMail (formerly Sendinblue)

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git
- MongoDB (locally or MongoDB Atlas)
- Cloudinary account
- PayPal Developer Account (for sandbox credentials) ( Email : shopzy@personal.shopzy.com  Passwors : Shopzy@098 )
- BrevoMail account (for email service)

## Getting Started

### 1. Clone the Repository
Clone the repository to your local machine:

git clone https://github.com/Sibunnayak/Shopzy-EcommerceApp.git
cd your-repo-name

2. Set Up the Client (Frontend)
Install Dependencies
Navigate to the client directory and install the required dependencies:
cd client
npm install

Create .env File for Frontend
In the client directory, create a .env file with the following environment variables:
VITE_REACT_APP_BASE_URL=http://localhost:5000   # Backend URL for API calls

3. Set Up the Server (Backend)
Install Dependencies
Navigate to the server directory and install the required dependencies:
cd ../server
npm install
Create .env File for Backend
In the server directory, create a .env file with the following environment variables:
DB_URL=mongodb://localhost:27017/your-database-name   # MongoDB connection string

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# PayPal
PAYPAL_MODE=sandbox
PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_CLIENT_SECRET=your-paypal-client-secret

# Email (BrevoMail / Sendinblue)
SMPT_HOST=smtp-relay.sendinblue.com
SMPT_PORT=587
SMPT_MAIL=your-brevo-email
SMPT_PASSWORD=your-brevo-password
SEND_EMAIL_FROM=your-email-address

CLIENT_SERVER=http://localhost:5173   # Frontend URL
4. Running the Application
Run the Server
In the server directory, run the following command to start the backend:
npm run dev
This will start the server on http://localhost:5000.

Run the Client
In the client directory, run the following command to start the frontend:
npm run dev

This will start the frontend on http://localhost:5173.

5. Access the Application
Once both the client and server are running, you can access:

The frontend at http://localhost:5173
The backend at http://localhost:5000
6. Build for Production (Optional)
To build the application for production:

In the client directory, run:
npm run build
In the server directory, you can deploy your server to your preferred platform

You can now use this `README.md` file to guide users on how to set up and run your full-stack application.
