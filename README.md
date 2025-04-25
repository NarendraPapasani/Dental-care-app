# DentaCare - Dental Clinic Management System

## Overview

DentaCare is a comprehensive dental clinic management system designed to streamline appointment scheduling, patient record management, and document handling for dental practices. The application features a user-friendly interface for both patients and clinic staff, enhancing the overall experience of dental care management.

## Features

- **User Authentication & Authorization**
  - Secure login/registration system
  - Role-based access control (Patients, Dentists, Admin)
  - JWT-based authentication with password encryption

- **Appointment Management**
  - Schedule, view, update, and cancel appointments
  - Real-time availability checking
  - Appointment history tracking

- **Patient Records**
  - Comprehensive patient profiles
  - Treatment plans and progress monitoring

- **Document Management**
  - Upload and store dental records, X-rays, and prescriptions
  - Secure document sharing between dentists and patients
  - Document categorization and management

- **Responsive Design**
  - Mobile-friendly interface
  - Accessible across various devices and screen sizes

## Technology Stack

### Frontend
- React.js
- Vite
- Axios for API communication
- CSS for styling

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication

### Deployment
- Backend: Render
- Frontend: Netlify
- Database: MongoDB Atlas

## Installation and Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or Atlas connection)

### Backend Setup
1. Clone the repository
   ```bash
   git clone https://github.com/NarendraPapasani/Dental-care-app.git
   cd Dental-care-app/backend
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=3000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRY=24h
   ```

4. Start the backend server
   ```bash
   npm run dev    # for development with nodemon
   npm start      # for production
   ```

### Frontend Setup
1. Navigate to the frontend directory
   ```bash
   cd ../frontend
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env` file in the frontend directory:
   ```
   VITE_API_URL=http://localhost:3000/api
   ```

4. Start the frontend development server
   ```bash
   npm run dev
   ```

5. For production build
   ```bash
   npm run build
   ```

## API Documentation

The API follows RESTful principles and includes the following main endpoints:

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate a user
- `GET /api/auth/profile` - Get current user profile

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get specific user
- `PUT /api/users/:id` - Update user information
- `DELETE /api/users/:id` - Delete a user

### Appointments
- `GET /api/appointments` - List appointments
- `POST /api/appointments` - Create new appointment
- `GET /api/appointments/:id` - Get appointment details
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Cancel appointment

### Documents
- `GET /api/documents` - List documents
- `POST /api/documents` - Upload new document
- `GET /api/documents/:id` - Download document
- `DELETE /api/documents/:id` - Delete document

## Deployment

### Backend Deployment (Render)
1. Create a new Web Service in Render
2. Connect your GitHub repository
3. Configure the following:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Add environment variables as specified in the `.env` section

### Frontend Deployment (Netlify)
1. Create a new site in Netlify
2. Connect your GitHub repository
3. Configure build settings:
   - Build Command: `npm run build`
   - Publish Directory: `dist`
   - Add environment variable: `VITE_API_URL=https://your-render-backend-url.onrender.com/api`

## CORS Configuration

The backend is configured to accept requests from the following origins:
- https://bright-brigadeiros-3d3e91.netlify.app (Frontend deployed on Netlify)
- https://dental-care-app.onrender.com (Backend deployed on Render)
- http://localhost:3000 (Local development backend)
- http://localhost:5173 (Local development frontend with Vite)

## Project Structure

```
├── backend/               # Node.js backend with Express
│   ├── app.js            # Main application entry point
│   ├── controllers/      # Route controllers
│   ├── database/         # Database connection and models
│   ├── middleware/       # Express middleware
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── uploads/          # Document storage
│   └── utils/            # Helper functions
│
├── frontend/             # React frontend with Vite
│   ├── public/           # Static assets
│   └── src/              # React source code
│       ├── components/   # Reusable components
│       ├── pages/        # Page components
│       └── App.jsx       # Main application component
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Project Link: [https://github.com/NarendraPapasani/Dental-care-app](https://github.com/NarendraPapasani/Dental-care-app)

Demo: [https://bright-brigadeiros-3d3e91.netlify.app](https://bright-brigadeiros-3d3e91.netlify.app)

## Acknowledgements

- [Express.js](https://expressjs.com/)
- [React.js](https://reactjs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Render](https://render.com/)
- [Netlify](https://www.netlify.com/)
