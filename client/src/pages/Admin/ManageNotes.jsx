import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import "./ManageUsers.css";
import "./ManageCourses.css";

export default function ManageNotes() {
    const [notes, setNotes] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [departments, setDepartments] = useState([]);

    // Form State
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [selectedDepartment, setSelectedDepartment] = useState(""); // Filter
    const [selectedSubject, setSelectedSubject] = useState("");
    const [file, setFile] = useState(null);
    const [editId, setEditId] = useState(null);

    const [filterDept, setFilterDept] = useState(""); // Table Filter

    const fetchNotes = async () => {
        try {
            const res = await fetch("/api/notes");
            if (res.ok) {
                const data = await res.json();
                setNotes(data);
            }
        } catch (err) {
            console.error("Failed to fetch notes");
        }
    };

    const fetchMetadata = async () => {
        const token = localStorage.getItem('authToken');
        try {
            const [subRes, deptRes] = await Promise.all([
                fetch("/api/subjects", { headers: { Authorization: `Bearer ${token}` } }),
                fetch("/api/departments", { headers: { Authorization: `Bearer ${token}` } })
            ]);

            if (subRes.ok) setSubjects(await subRes.json());
            if (deptRes.ok) setDepartments(await deptRes.json());

        } catch (err) {
            console.error("Failed to fetch metadata");
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleAddOrUpdate = async (e) => {
        e.preventDefault();
        if (!selectedSubject || !title) {
            alert("Please fill all fields");
            return;
        }

        if (!editId && !file) {
            alert("Please select a file");
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('subject', selectedSubject);
        if (file) {
            formData.append('file', file);
        }

        const token = localStorage.getItem('authToken');

        const url = editId ? `/api/notes/${editId}` : "/api/notes";
        const method = editId ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method: method,
                headers: { Authorization: `Bearer ${token}` },
                body: formData
            });

            if (res.ok) {
                alert(editId ? "Note Updated Successfully!" : "Note Uploaded Successfully!");
                resetForm();
                fetchNotes();
            } else {
                const errData = await res.json();
                alert(`Operation failed: ${errData.msg || errData.message}`);
            }
        } catch (err) {
            console.error("Error saving note", err);
            alert("Error saving note");
        }
    };

    const handleEdit = (note) => {
        setEditId(note._id);
        setTitle(note.title);
        setDescription(note.description || "");

        // Setup cascading
        const subject = subjects.find(s => s._id === (note.subject?._id || note.subject));
        if (subject) {
            setSelectedDepartment(subject.department?._id || subject.department || "");
            setSelectedSubject(subject._id);
        } else {
            // Fallback if subject not found in list
            setSelectedSubject(note.subject?._id || note.subject || "");
        }

        setFile(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => {
        setEditId(null);
        setTitle("");
        setDescription("");
        setSelectedSubject("");
        setSelectedDepartment("");
        setFile(null);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this note?")) return;
        const token = localStorage.getItem('authToken');
        try {
            const res = await fetch(`/api/notes/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                setNotes(notes.filter(n => n._id !== id));
                if (editId === id) resetForm();
            } else {
                alert("Failed to delete note");
            }
        } catch (err) {
            console.error("Error deleting note");
        }
    };

    useEffect(() => {
        fetchNotes();
        fetchMetadata();
    }, []);

    // Filter subjects based on selected department in Form
    const filteredSubjects = selectedDepartment
        ? subjects.filter(s => (s.department?._id || s.department) === selectedDepartment)
        : [];

    // Filter notes based on selected department in Table
    const filteredNotes = filterDept
        ? notes.filter(n => (n.subject?.department?._id || n.subject?.department) === filterDept)
        : notes;

    return (
        <AdminLayout>
            <h2>Notes Manager (PDFs)</h2>

            <div className="manage-courses-container">
                <form className="add-course-form" onSubmit={handleAddOrUpdate} style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                    <h3>{editId ? "Edit Note" : "Upload New Note"}</h3>

                    <div style={{ display: 'flex', gap: '10px', width: '100%', flexWrap: 'wrap' }}>
                        <input
                            type="text"
                            placeholder="Title"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            required
                            style={{ flex: 1 }}
                        />

                        {/* Department Filter (Form) */}
                        <select
                            value={selectedDepartment}
                            onChange={e => {
                                setSelectedDepartment(e.target.value);
                                setSelectedSubject(""); // Reset subject when dept changes
                            }}
                            style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                        >
                            <option value="">Filter by Department...</option>
                            {departments.map(d => (
                                <option key={d._id} value={d._id}>{d.name}</option>
                            ))}
                        </select>

                        {/* Subject Select */}
                        <select
                            value={selectedSubject}
                            onChange={e => setSelectedSubject(e.target.value)}
                            required
                            disabled={!selectedDepartment}
                            style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', opacity: !selectedDepartment ? 0.6 : 1 }}
                        >
                            <option value="">
                                {!selectedDepartment ? "Select Department First" : "Select Subject"}
                            </option>
                            {filteredSubjects.map(sub => (
                                <option key={sub._id} value={sub._id}>{sub.name}</option>
                            ))}
                        </select>
                    </div>

                    <input
                        type="text"
                        placeholder="Description (Optional)"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        style={{ width: '100%', marginTop: '10px', marginBottom: '10px' }}
                    />

                    <div style={{ marginTop: '5px' }}>
                        <label className="file-label">
                            {editId ? "Update PDF (Optional):" : "Upload PDF:"}
                        </label>
                        <input
                            type="file"
                            accept="application/pdf"
                            onChange={handleFileChange}
                            required={!editId}
                            style={{ marginLeft: '10px' }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                        <button type="submit" className="add-btn">{editId ? "Update Note" : "Upload Note"}</button>
                        {editId && (
                            <button type="button" onClick={resetForm} className="cancel-btn">
                                Cancel
                            </button>
                        )}
                    </div>
                </form>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '20px 0' }}>
                    <h3>Notes List</h3>
                    <select
                        value={filterDept}
                        onChange={e => setFilterDept(e.target.value)}
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    >
                        <option value="">All Departments</option>
                        {departments.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
                    </select>
                </div>

                <table className="users-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Department</th>
                            <th>Subject</th>
                            <th>File</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredNotes.map(note => {
                            // Resolve full objects for display if needed
                            const subjectName = note.subject?.name || "Unknown";
                            const deptName = note.subject?.department?.name || "Unknown";

                            return (
                                <tr key={note._id}>
                                    <td>{note.title}</td>
                                    <td>{deptName}</td>
                                    <td>{subjectName}</td>
                                    <td>
                                        <a href={`http://localhost:5000/${note.filePath}`} target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6' }}>
                                            View PDF
                                        </a>
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => handleEdit(note)}
                                            style={{ marginRight: '10px', padding: '5px 10px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="delete-btn"
                                            onClick={() => handleDelete(note._id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
