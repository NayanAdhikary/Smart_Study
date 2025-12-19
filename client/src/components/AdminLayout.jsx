import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import AdminSidebar from "./AdminSidebar";
import "./AdminLayout.css";

export default function AdminLayout({ children }) {
    const navigate = useNavigate();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('authToken');

        if (!token) {
            // Not logged in at all, redirect to login
            navigate("/login");
            return;
        }

        try {
            const decoded = jwtDecode(token);
            console.log("Decoded Token:", decoded); // DEBUGGING

            if (decoded.role === 'admin') {
                setIsAuthorized(true);
            } else {
                // Logged in but not admin
                console.log("Role mismatch. Expected 'admin', got:", decoded.role); // DEBUGGING
                alert("Access Denied: Admins Only");
                navigate("/");
            }
        } catch (error) {
            console.error("Invalid token", error);
            localStorage.removeItem('authToken');
            navigate("/login");
        }
    }, [navigate]);

    if (!isAuthorized) {
        return null; // or a loading spinner
    }

    return (
        <div className="admin-container">
            <AdminSidebar />
            <main className="content">
                <div className="topbar">
                    <h1>Admin Panel</h1>
                    <button
                        className="logout-btn"
                        style={{ marginLeft: 'auto' }}
                        onClick={() => {
                            localStorage.removeItem("authToken");
                            navigate("/login");
                        }}
                    >
                        Logout
                    </button>
                </div>
                {children}
            </main>
        </div>
    );
}
