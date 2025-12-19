import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import "./ManageUsers.css";
import "./ManageCourses.css";

export default function ManageSyllabus() {
    const [syllabusList, setSyllabusList] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [departments, setDepartments] = useState([]);

    // Form State
    const [title, setTitle] = useState("");
    const [year, setYear] = useState("");
    const [selectedDepartment, setSelectedDepartment] = useState(""); // Form Filter
    const [selectedSubject, setSelectedSubject] = useState("");

    const [file, setFile] = useState(null);
    const [filterDept, setFilterDept] = useState(""); // Table Filter

    const [editId, setEditId] = useState(null);

    const fetchSyllabus = async () => {
        try {
            const res = await fetch("/api/syllabus");
            if (res.ok) setSyllabusList(await res.json());
        } catch (err) {
            console.error("Failed to fetch syllabus");
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
        if (!selectedSubject || !title || !year) {
            alert("Please fill all fields");
            return;
        }
        if (!file && !editId) {
            alert("Please select a file");
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('year', year);
        formData.append('subject', selectedSubject);
        if (file) {
            formData.append('file', file);
        }

        const token = localStorage.getItem('authToken');
        const url = editId ? `/api/syllabus/${editId}` : "/api/syllabus";
        const method = editId ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method: method,
                headers: { Authorization: `Bearer ${token}` },
                body: formData
            });

            if (res.ok) {
                alert(editId ? "Syllabus Updated Successfully!" : "Syllabus Uploaded Successfully!");
                resetForm();
                fetchSyllabus();
            } else {
                const errData = await res.json();
                alert(`Operation failed: ${errData.msg || errData.message}`);
            }
        } catch (err) {
            console.error("Error saving syllabus", err);
        }
    };

    const handleEdit = (s) => {
        setEditId(s._id);
        setTitle(s.title);
        setYear(s.year);

        const sub = subjects.find(sub => sub._id === (s.subject?._id || s.subject));
        if (sub) {
            setSelectedDepartment(sub.department?._id || sub.department || "");
            setSelectedSubject(sub._id);
        } else {
            setSelectedSubject(s.subject?._id || s.subject || "");
        }

        setFile(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => {
        setEditId(null);
        setTitle("");
        setYear("");
        setSelectedDepartment("");
        setSelectedSubject("");
        setFile(null);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this Syllabus?")) return;
        const token = localStorage.getItem('authToken');
        try {
            const res = await fetch(`/api/syllabus/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                setSyllabusList(syllabusList.filter(s => s._id !== id));
                if (editId === id) resetForm();
            } else {
                alert("Failed to delete syllabus");
            }
        } catch (err) {
            console.error("Error deleting syllabus");
        }
    };

    useEffect(() => {
        fetchSyllabus();
        fetchMetadata();
    }, []);

    const filteredSubjects = selectedDepartment
        ? subjects.filter(s => (s.department?._id || s.department) === selectedDepartment)
        : [];

    const filteredSyllabusList = filterDept
        ? syllabusList.filter(s => (s.subject?.department?._id || s.subject?.department) === filterDept)
        : syllabusList;

    return (
        <AdminLayout>
            <h2>Syllabus Manager</h2>
            <div className="manage-courses-container">
                <form className="add-course-form" onSubmit={handleAddOrUpdate} style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                    <h3>{editId ? "Edit Syllabus" : "Upload New Syllabus"}</h3>
                    <div style={{ display: 'flex', gap: '10px', width: '100%', flexWrap: 'wrap' }}>
                        <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required style={{ flex: 1 }} />
                        <input type="number" placeholder="Year" value={year} onChange={e => setYear(e.target.value)} required style={{ width: '120px' }} />

                        {/* Department Filter */}
                        <select
                            value={selectedDepartment}
                            onChange={e => {
                                setSelectedDepartment(e.target.value);
                                setSelectedSubject("");
                            }}
                            style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                        >
                            <option value="">Filter by Department...</option>
                            {departments.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
                        </select>

                        {/* Subject Select */}
                        <select
                            value={selectedSubject}
                            onChange={e => setSelectedSubject(e.target.value)}
                            required
                            disabled={!selectedDepartment}
                            style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', opacity: !selectedDepartment ? 0.6 : 1 }}
                        >
                            <option value="">{!selectedDepartment ? "Select Dept First" : "Select Subject"}</option>
                            {filteredSubjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                        </select>
                    </div>

                    <div style={{ marginTop: '10px' }}>
                        <label className="file-label">
                            {editId ? "Update File (Optional):" : "File:"}
                        </label>
                        <input type="file" accept="application/pdf" onChange={handleFileChange} required={!editId} style={{ marginLeft: '10px' }} />
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                        <button type="submit" className="add-btn">{editId ? "Update Syllabus" : "Upload Syllabus"}</button>
                        {editId && (
                            <button type="button" onClick={resetForm} className="cancel-btn">Cancel</button>
                        )}
                    </div>
                </form>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '20px 0' }}>
                    <h3>Syllabus List</h3>
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
                            <th>Year</th>

                            <th>File</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSyllabusList.map(s => (
                            <tr key={s._id}>
                                <td>{s.title}</td>
                                <td>{s.year}</td>
                                <td>
                                    <a href={`http://localhost:5000/${s.filePath}`} target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6' }}>View</a>
                                </td>
                                <td>
                                    <button
                                        onClick={() => handleEdit(s)}
                                        style={{ marginRight: '10px', padding: '5px 10px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                    >
                                        Edit
                                    </button>
                                    <button className="delete-btn" onClick={() => handleDelete(s._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout >
    );
}
