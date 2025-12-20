// API Configuration
// This file centralizes all API URL configuration

// Get the API base URL from environment variable or use default
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Export the base URL
export const BASE_URL = API_BASE_URL;

// Helper function to build API URLs
export const getApiUrl = (path) => {
    // Remove leading slash if present to avoid double slashes
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `${API_BASE_URL}/${cleanPath}`;
};

// Export commonly used API endpoints
export const API_ENDPOINTS = {
    // User endpoints
    LOGIN: `${API_BASE_URL}/api/users/login`,
    REGISTER: `${API_BASE_URL}/api/users/register`,
    PROFILE: `${API_BASE_URL}/api/users/profile`,
    USERS: `${API_BASE_URL}/api/users`,

    // Department endpoints
    DEPARTMENTS: `${API_BASE_URL}/api/departments`,

    // Subject endpoints
    SUBJECTS: `${API_BASE_URL}/api/subjects`,

    // Syllabus endpoints
    SYLLABUS: `${API_BASE_URL}/api/syllabus`,

    // Notes endpoints
    NOTES: `${API_BASE_URL}/api/notes`,

    // PYQ endpoints
    PYQS: `${API_BASE_URL}/api/pyqs`,

    // Admin endpoints
    ADMIN_LOGIN: `${API_BASE_URL}/api/users/login`,
    ADMIN_STATS: `${API_BASE_URL}/api/admin/stats`,
    ADMIN_SETTINGS: `${API_BASE_URL}/api/admin/settings`,

    // Subscribe endpoint
    SUBSCRIBE: `${API_BASE_URL}/api/subscribe`,

    // Predict endpoint
    PREDICT: `${API_BASE_URL}/api/predict`,
};

export default API_BASE_URL;
