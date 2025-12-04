// Auto-logout functionality for admin sessions
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useAutoLogout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    let logoutTimer;
    let warningTimer;

    const resetTimer = () => {
      clearTimeout(logoutTimer);
      clearTimeout(warningTimer);

      // Show warning 5 minutes before logout
      warningTimer = setTimeout(() => {
        const shouldStay = window.confirm(
          'Your session will expire in 5 minutes. Click OK to stay logged in.'
        );
        if (shouldStay) {
          resetTimer(); // Reset if user wants to stay
        }
      }, 19 * 60 * 1000); // 19 minutes (24h - 5min warning)

      // Auto logout after 24 hours
      logoutTimer = setTimeout(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        alert('Your session has expired. Please login again.');
        navigate('/admin-login');
      }, 24 * 60 * 60 * 1000); // 24 hours
    };

    const handleActivity = () => {
      resetTimer();
    };

    // Reset timer on user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    // Start the timer
    resetTimer();

    return () => {
      clearTimeout(logoutTimer);
      clearTimeout(warningTimer);
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, [navigate]);
};

export default useAutoLogout;