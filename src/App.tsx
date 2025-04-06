import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './contexts/AuthContext';

// Placeholder components (we'll create these later)
const Home = () => <div>Home Page</div>;
const EventList = () => <div>Event List Page</div>;
const EventDetail = () => <div>Event Detail Page</div>;
const Login = () => <div>Login Page</div>;
const Register = () => <div>Register Page</div>;

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <header className="App-header">
            <h1>Community Events Platform</h1>
          </header>
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/events" element={<EventList />} />
              <Route path="/events/:id" element={<EventDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </main>
          <footer>
            <p>© {new Date().getFullYear()} Community Events Platform</p>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;