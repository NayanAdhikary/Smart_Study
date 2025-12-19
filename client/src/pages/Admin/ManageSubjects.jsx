import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import "./ManageUsers.css";
import "./ManageCourses.css";

export default function ManageSubjects() {
    const [subjects, setSubjects] = useState([]);
    const [departments, setDepartments] = useState([]);

    // Form State
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [selectedDepartment, setSelectedDepartment] = useState("");

    const [editId, setEditId] = useState(null);

    const fetchSubjects = async () => {
        const token = localStorage.getItem('authToken');
        try {
            console.log("Fetching subjects..."); // Debug
            const res = await fetch("/api/subjects", {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                console.log("Subjects fetched:", data.length); // Debug
                setSubjects(data);
            } else {
                console.error("Failed to fetch subjects:", res.status);
                // Optional: alert user if fetch fails
            }
        } catch (err) {
            console.error("Failed to fetch subjects", err);
        }
    };

    const fetchDepartments = async () => {
        try {
            console.log("Fetching departments..."); // Debug
            const res = await fetch("/api/departments");
            if (res.ok) {
                const data = await res.json();
                console.log("Departments fetched:", data); // Debug
                setDepartments(data);
            } else {
                console.error("Failed to fetch departments:", res.status);
            }
        } catch (err) {
            console.error("Failed to fetch departments", err);
        }
    };

    const handleAddOrUpdate = async (e) => {
        e.preventDefault();
        if (!name || !selectedDepartment) {
            alert("Please provide name and department");
            return;
        }

        const token = localStorage.getItem('authToken');

        if (editId) {
            // Update
            try {
                const res = await fetch(`/api/subjects/${editId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        name,
                        description,
                        department: selectedDepartment
                    })
                });

                if (res.ok) {
                    alert("Subject Updated Successfully!");
                    setName("");
                    setDescription("");
                    setSelectedDepartment("");
                    setEditId(null);
                    fetchSubjects();
                } else {
                    const errData = await res.json();
                    alert(`Failed: ${errData.message || errData.msg}`);
                }
            } catch (err) {
                console.error("Error updating subject", err);
            }
        } else {
            // Add
            try {
                const res = await fetch("/api/subjects", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        name,
                        description,
                        department: selectedDepartment
                    })
                });

                if (res.ok) {
                    alert("Subject Added Successfully!");
                    setName("");
                    setDescription("");
                    setSelectedDepartment("");
                    fetchSubjects();
                } else {
                    const errData = await res.json();
                    alert(`Failed: ${errData.message || errData.msg}`);
                }
            } catch (err) {
                console.error("Error adding subject", err);
            }
        }
    };

    const handleEdit = (sub) => {
        setEditId(sub._id);
        setName(sub.name);
        setDescription(sub.description || "");
        setSelectedDepartment(sub.department?._id || "");
        // Scroll to top to see form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditId(null);
        setName("");
        setDescription("");
        setSelectedDepartment("");
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this subject?")) return;
        const token = localStorage.getItem('authToken');

        try {
            const res = await fetch(`/api/subjects/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
                setSubjects(subjects.filter(s => s._id !== id));
                if (editId === id) handleCancelEdit();
            } else {
                alert("Failed to delete subject");
            }
        } catch (err) {
            console.error("Error deleting subject");
        }
    };

    useEffect(() => {
        fetchSubjects();
        fetchDepartments();
    }, []);

    return (
        <AdminLayout>
            <h2>Manage Subjects</h2>

            <div className="manage-courses-container">
                {/* Add Form */}
                <form className="add-course-form" onSubmit={handleAddOrUpdate} style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                    <h3>{editId ? "Edit Subject" : "Add New Subject"}</h3>

                    {/* Error Feedback */}
                    {departments.length === 0 && (
                        <div style={{ marginBottom: '10px', color: '#eab308', backgroundColor: '#fef9c3', padding: '10px', borderRadius: '6px', width: '100%' }}>
                            ⚠️ No departments found. Please <a href="/admin/courses" style={{ textDecoration: 'underline' }}>create a Department</a> first.
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '10px', width: '100%', flexWrap: 'wrap' }}>
                        <input
                            type="text"
                            placeholder="Subject Name (e.g. Data Structures)"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                            style={{ flex: 1 }}
                        />
                        <select
                            value={selectedDepartment}
                            onChange={e => setSelectedDepartment(e.target.value)}
                            required
                            style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                        >
                            <option value="">Select Department</option>
                            {departments.map(dept => (
                                <option key={dept._id} value={dept._id}>{dept.name}</option>
                            ))}
                        </select>
                        <input
                            type="text"
                            placeholder="Description (Optional)"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            style={{ flex: 1 }}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                        <button type="submit" className="add-btn" disabled={departments.length === 0}>
                            {editId ? "Update Subject" : "Add Subject"}
                        </button>
                        {editId && (
                            <button type="button" onClick={handleCancelEdit} style={{ padding: '10px 20px', backgroundColor: '#64748b', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                                Cancel
                            </button>
                        )}
                    </div>
                </form>

                {/* List */}
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Department</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subjects.map(sub => (
                            <tr key={sub._id}>
                                <td>{sub.name}</td>
                                <td>{sub.department?.name || 'Unknown'}</td>
                                <td>{sub.description}</td>
                                <td>
                                    <button
                                        onClick={() => handleEdit(sub)}
                                        style={{ marginRight: '10px', padding: '5px 10px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDelete(sub._id)}
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
