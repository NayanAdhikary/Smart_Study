import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    notes: 0,
    departments: 0,
    subjects: 0,
    pyqs: 0,
    syllabus: 0
  });

  useEffect(() => {
    // Fetch stats from backend
    const fetchStats = async () => {
      const token = localStorage.getItem('authToken');
      try {
        const res = await fetch("/api/admin/stats", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error("Failed to fetch stats");
      }
    };
    fetchStats();
  }, []);

  return (
    <AdminLayout>
      {/* Stats Cards */}
      <div className="cards">
        <div className="card">
          <h3>Total Users</h3>
          <p>{stats.users}</p>
        </div>

        <div className="card">
          <h3>Departments</h3>
          <p>{stats.departments}</p>
        </div>

        <div className="card">
          <h3>Subjects</h3>
          <p>{stats.subjects}</p>
        </div>

        <div className="card">
          <h3>Notes (PDFs)</h3>
          <p>{stats.notes}</p>
        </div>

        <div className="card">
          <h3>PYQs</h3>
          <p>{stats.pyqs}</p>
        </div>

        <div className="card">
          <h3>Syllabus</h3>
          <p>{stats.syllabus}</p>
        </div>
      </div>

      {/* Bottom section */}
      <div className="bottom-section">
        <div className="activity">
          <h2>Recent Admin Activity</h2>
          <ul>
            <li>✔ System Check Completed</li>
            <li>✔ Admin Dashboard Updated</li>
          </ul>
        </div>

        <div className="system-info">
          <h2>System Summary</h2>
          <p>Server Status: 🟢 Active</p>
          <p>Database: 🟢 Connected</p>
        </div>
      </div>
    </AdminLayout>
  );
}
