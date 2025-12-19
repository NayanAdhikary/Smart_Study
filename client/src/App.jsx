import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import AuthPage from './pages/AuthPage.jsx';
import PredictorPage from './pages/PredictorPage.jsx';
import CoursePage from './pages/CoursePage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
// Admin Pages
import AdminDashboard from "./pages/Admin/AdminDashboard";
import ManageUsers from "./pages/Admin/ManageUsers";
import ManageCourses from "./pages/Admin/ManageCourses";
import ManageSubjects from "./pages/Admin/ManageSubjects";
import ManageNotes from "./pages/Admin/ManageNotes";
import ManagePYQs from "./pages/Admin/ManagePYQs";
import ManageSyllabus from "./pages/Admin/ManageSyllabus";
import AdminSettings from "./pages/Admin/AdminSettings";

import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

function App() {
  return (
    <Routes>

      {/* User Pages */}
      <Route path="/" element={
        <ProtectedRoute>
          <HomePage />
        </ProtectedRoute>
      } />

      <Route path="/login" element={
        <PublicRoute>
          <AuthPage />
        </PublicRoute>
      } />

      <Route path="/predictor" element={
        <ProtectedRoute>
          <PredictorPage />
        </ProtectedRoute>
      } />

      <Route path="/course/:streamId" element={
        <ProtectedRoute>
          <CoursePage />
        </ProtectedRoute>
      } />

      <Route path="/profile" element={
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      } />


      {/* Admin Pages */}
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/users" element={<ManageUsers />} />
      <Route path="/admin/courses" element={<ManageCourses />} />
      <Route path="/admin/subjects" element={<ManageSubjects />} />
      <Route path="/admin/notes" element={<ManageNotes />} />
      <Route path="/admin/pyqs" element={<ManagePYQs />} />
      <Route path="/admin/syllabus" element={<ManageSyllabus />} />
      <Route path="/admin/settings" element={<AdminSettings />} />


    </Routes>
  );
}

export default App;
