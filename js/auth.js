/* auth.js */
(function () {
    const AUTH_KEY = 'london_octave_auth';
    const PASSWORD = 'password123';

    // Check if we are on the login page
    const isLoginPage = window.location.pathname.endsWith('login.html');

    function checkAuth() {
        const isAuthenticated = sessionStorage.getItem(AUTH_KEY);

        if (!isAuthenticated && !isLoginPage) {
            // User is not authenticated and not on the login page, redirect to login
            window.location.href = 'login.html';
        }
    }

    // Function to verify password
    window.verifyPassword = function (input) {
        if (input === PASSWORD) {
            sessionStorage.setItem(AUTH_KEY, 'true');
            window.location.href = 'index.html';
            return true;
        }
        return false;
    };

    // Run immediately
    checkAuth();
})();
