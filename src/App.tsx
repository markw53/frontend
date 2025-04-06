import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './contexts/AuthContext';

// Import components
import Navigation from './components/Navigation';
import Home from './pages/Home';
//import EventList from './pages/EventList'; // You'll need to create this
//import EventDetail from './pages/EventDetail'; // You'll need to create this
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import PrivateRoute from './components/PrivateRoute';

// Placeholder for EventList and EventDetail until we create them
const EventListPlaceholder = () => <div>Event List Page (Coming Soon)</div>;
const EventDetailPlaceholder = () => <div>Event Detail Page (Coming Soon)</div>;

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navigation />
          
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/events" element={<EventListPlaceholder />} />
              <Route path="/events/:id" element={<EventDetailPlaceholder />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/profile" 
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                } 
              />
            </Routes>
          </main>
          
          <footer className="footer">
            <p>© {new Date().getFullYear()} Community Events Platform</p>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;