import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './contexts/AuthContext';
import { seedEvents } from './utils/seedDatabase';

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
import TestRecommendations from './components/TestRecommendations';

if (process.env.NODE_ENV === 'development') {
  // Seed the database with sample events
  seedEvents()
    .then((): void => console.log('Database seeded with sample events'))
      .catch((error: Error): void => console.error('Error seeding database:', error));
}

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
              <Route path="/test-recommendations" element={<TestRecommendations />} />
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
