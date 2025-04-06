import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './contexts/AuthContext';

// Import components
import Navigation from './components/Navigation';
import Home from './pages/Home';
import EventList from './pages/EventList';
import EventDetail from './pages/EventDetail';
import EventForm from './pages/EventForm';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import GoogleAuthCallback from './pages/GoogleAuthCallback';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navigation />
          
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/events" element={<EventList />} />
              <Route path="/events/:id" element={<EventDetail />} />
              <Route 
                path="/events/create" 
                element={
                  <PrivateRoute>
                    <EventForm />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/events/edit/:id" 
                element={
                  <PrivateRoute>
                    <EventForm />
                  </PrivateRoute>
                } 
              />
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
              <Route path="/auth/google/callback" element={<GoogleAuthCallback />} />
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