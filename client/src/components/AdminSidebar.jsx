import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./AdminSidebar.css";

export default function AdminSidebar() {
    const navigate = useNavigate();
    const [modules, setModules] = useState({
        notes: true,
        pyqs: true,
        syllabus: true,
        predictor: true
    });

    useEffect(() => {
        // Fetch settings to determine which modules are enabled
        const fetchSettings = async () => {
            const token = localStorage.getItem('authToken');
            try {
                const res = await fetch("/api/admin/settings", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    if (data.modules) {
                        setModules(data.modules);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch settings for sidebar");
            }
        };
        fetchSettings();
    }, []);

    return (
        <aside className="sidebar">
            <h2 className="logo">SmartStudy Admin</h2>

            <nav className="sidebar-menu">
                <Link to="/admin/dashboard">📊 Dashboard</Link>
                <Link to="/admin/users">👤 Manage Users</Link>
                <Link to="/admin/courses">📚 Manage Courses (Departments)</Link>
                <Link to="/admin/subjects">📖 Manage Subjects</Link>

                {modules.notes && (
                    <Link to="/admin/notes">📝 Notes (PDFs)</Link>
                )}

                {modules.pyqs && (
                    <Link to="/admin/pyqs">❓ PYQs</Link>
                )}

                {modules.syllabus && (
                    <Link to="/admin/syllabus">📖 Syllabus</Link>
                )}

                {/* Predictor doesn't have a manage page currently, but if it did: */}
                {/* {modules.predictor && <Link to="/admin/predictor">🔮 Predictor</Link>} */}

                <Link to="/admin/settings">⚙️ Settings</Link>
            </nav>

            <button
                className="logout-btn-sidebar"
                onClick={() => {
                    localStorage.removeItem("authToken");
                    navigate("/login");
                }}
            >
                Logout
            </button>
        </aside>
    );
}
