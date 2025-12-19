import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import "./ManageCourses.css";
// Reuse table styles from ManageUsers.css by importing it or copying (simplest to rely on global table styles if they were global, but they are scoped. I'll use inline or same classes if I make them global, but for now I'll just use the same class names and rely on the fact that I can duplicate the CSS or make a shared one. Actually, I'll just add the table styles to ManageCourses.css implicitly or just use the same layout)
import "./ManageUsers.css"; // Reuse table styles

export default function ManageCourses() {
    const [departments, setDepartments] = useState([]);
    const [newDeptName, setNewDeptName] = useState("");
    const [newDeptDesc, setNewDeptDesc] = useState("");
    const [editId, setEditId] = useState(null);

    const fetchDepartments = async () => {
        try {
            const res = await fetch("/api/departments");
            if (res.ok) {
                const data = await res.json();
                setDepartments(data);
            }
        } catch (err) {
            console.error("Failed to fetch departments");
        }
    };

    const handleAddOrUpdate = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('authToken');

        if (editId) {
            // Update Logic
            try {
                const res = await fetch(`/api/departments/${editId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({ name: newDeptName, description: newDeptDesc })
                });

                if (res.ok) {
                    alert("Department Updated Successfully!");
                    setNewDeptName("");
                    setNewDeptDesc("");
                    setEditId(null);
                    fetchDepartments();
                } else {
                    alert("Failed to update department");
                }
            } catch (err) {
                console.error("Error updating department");
            }
        } else {
            // Add Logic
            try {
                const res = await fetch("/api/departments", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({ name: newDeptName, description: newDeptDesc })
                });

                if (res.ok) {
                    setNewDeptName("");
                    setNewDeptDesc("");
                    fetchDepartments();
                } else {
                    alert("Failed to add department");
                }
            } catch (err) {
                console.error("Error adding department");
            }
        }
    };

    const handleEdit = (dept) => {
        setEditId(dept._id);
        setNewDeptName(dept.name);
        setNewDeptDesc(dept.description);
    };

    const handleCancelEdit = () => {
        setEditId(null);
        setNewDeptName("");
        setNewDeptDesc("");
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this department?")) return;
        const token = localStorage.getItem('authToken');

        try {
            const res = await fetch(`/api/departments/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
                setDepartments(departments.filter(d => d._id !== id));
                if (editId === id) handleCancelEdit();
            } else {
                alert("Failed to delete");
            }
        } catch (err) {
            console.error("Error deleting");
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, []);

    return (
        <AdminLayout>
            <h2>Manage Courses (Departments)</h2>

            <div className="manage-courses-container">
                <form className="add-course-form" onSubmit={handleAddOrUpdate}>
                    <h3>{editId ? "Edit Department" : "Add New Department"}</h3>
                    <input
                        type="text"
                        placeholder="Department Name (e.g. Computer Science)"
                        value={newDeptName}
                        onChange={e => setNewDeptName(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Description"
                        value={newDeptDesc}
                        onChange={e => setNewDeptDesc(e.target.value)}
                        required
                    />
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button type="submit" className="add-btn">
                            {editId ? "Update Department" : "Add Department"}
                        </button>
                        {editId && (
                            <button type="button" onClick={handleCancelEdit} style={{ padding: '10px 20px', backgroundColor: '#64748b', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                                Cancel
                            </button>
                        )}
                    </div>
                </form>

                <table className="users-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {departments.map(dept => (
                            <tr key={dept._id}>
                                <td>{dept.name}</td>
                                <td>{dept.description}</td>
                                <td>
                                    <button
                                        onClick={() => handleEdit(dept)}
                                        style={{ marginRight: '10px', padding: '5px 10px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDelete(dept._id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
