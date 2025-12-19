import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import "./ManageUsers.css";

export default function ManageUsers() {
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [editFormData, setEditFormData] = useState({ username: "", email: "", role: "student" });

    const fetchUsers = async () => {
        const token = localStorage.getItem('authToken');
        try {
            console.log("Fetching users..."); // Debug
            const res = await fetch("/api/users", {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                console.log("Users fetched:", data.length); // Debug
                setUsers(data);
            } else {
                const errData = await res.json();
                console.error("Failed to fetch users:", res.status, errData);
                alert(`Error fetching users: ${errData.message || res.statusText}`);
            }
        } catch (err) {
            console.error("Failed to fetch users", err);
        }
    };

    const handleEditClick = (user) => {
        setEditingUser(user);
        setEditFormData({
            username: user.username,
            email: user.email,
            role: user.role
        });
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('authToken');

        try {
            const res = await fetch(`/api/users/${editingUser._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(editFormData)
            });

            if (res.ok) {
                alert("User updated successfully");
                setEditingUser(null);
                fetchUsers();
            } else {
                const err = await res.json();
                alert("Failed to update user: " + (err.message || err.msg));
            }
        } catch (error) {
            console.error("Error updating user:", error);
            alert("Error updating user");
        }
    };

    const deleteUser = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;

        const token = localStorage.getItem('authToken');
        try {
            const res = await fetch(`/api/users/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                setUsers(users.filter(u => u._id !== id));
            } else {
                alert("Failed to delete user");
            }
        } catch (err) {
            console.error("Error deleting user");
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <AdminLayout>
            <h2>User Management</h2>
            <div className="manage-users-container">
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id}>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>
                                    <button
                                        onClick={() => handleEditClick(user)}
                                        style={{ marginRight: '10px', padding: '5px 10px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => deleteUser(user._id)}
                                        className="delete-btn"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Edit Modal */}
            {editingUser && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center'
                }}>
                    <div style={{
                        backgroundColor: 'white', padding: '20px', borderRadius: '8px', width: '400px',
                        display: 'flex', flexDirection: 'column', gap: '15px'
                    }}>
                        <h3>Edit User</h3>
                        <form onSubmit={handleUpdateUser} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <label>
                                Name:
                                <input
                                    type="text"
                                    value={editFormData.username}
                                    onChange={(e) => setEditFormData({ ...editFormData, username: e.target.value })}
                                    style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                                />
                            </label>
                            <label>
                                Email:
                                <input
                                    type="email"
                                    value={editFormData.email}
                                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                                    style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                                />
                            </label>
                            <label>
                                Role:
                                <select
                                    value={editFormData.role}
                                    onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                                    style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                                >
                                    <option value="student">Student</option>
                                    <option value="admin">Admin</option>
                                    {/* Add other roles if needed */}
                                </select>
                            </label>
                            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                <button type="submit" style={{ padding: '10px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', flex: 1 }}>Save</button>
                                <button type="button" onClick={() => setEditingUser(null)} style={{ padding: '10px', backgroundColor: '#64748b', color: 'white', border: 'none', borderRadius: '4px', flex: 1 }}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
