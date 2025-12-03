import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Activities from './pages/Activities';
import Gallery from './pages/Gallery';
import Membership from './pages/Membership';
import Donate from './pages/Donate';
import Contact from './pages/Contact';
import ThankYou from './pages/ThankYou';
import ThankYouDonation from './pages/ThankYouDonation';
import ThankYouMember from './pages/ThankYouMember';
import AdminLogin from './pages/AdminLogin';
import ComprehensiveAdminDashboard from './pages/ComprehensiveAdminDashboard';
import TeamUploadPage from './pages/TeamUploadPage';
import EmailTest from './pages/EmailTest';

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="App">
      {!isAdminRoute && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/activities" element={<Activities />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/membership" element={<Membership />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/thank-you-donation" element={<ThankYouDonation />} />
        <Route path="/thank-you-member" element={<ThankYouMember />} />
        <Route path="/admin" element={<ComprehensiveAdminDashboard />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<ComprehensiveAdminDashboard />} />
        <Route path="/team-upload" element={<TeamUploadPage />} />
        <Route path="/email-test" element={<EmailTest />} />
      </Routes>
      {!isAdminRoute && <Footer />}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover
      />
    </div>
  );
}

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AppContent />
    </Router>
  );
}

export default App;