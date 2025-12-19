import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { FaFilePdf, FaBook, FaStickyNote, FaHistory } from "react-icons/fa";
import "./CoursePage.css";

const BACKEND_URL = "http://localhost:5000";

// Helper to get correct file URL
function getFileUrl(url) {
  if (!url) return "";
  if (url.startsWith("http")) {
    if (url.includes("/raw/upload/")) {
      return url.replace("/raw/upload/", "/raw/upload/fl_attachment:false/");
    }
    return url;
  }
  const cleanPath = url.replace(/\\/g, "/");
  return `${BACKEND_URL}/${cleanPath}`;
}

function CoursePage() {
  const { streamId } = useParams();
  const [activeTab, setActiveTab] = useState("syllabus");

  // Data States
  const [syllabus, setSyllabus] = useState([]);
  const [notes, setNotes] = useState([]);
  const [subjects, setSubjects] = useState([]); // Subjects for PYQ navigation
  const [selectedSubjectForPyq, setSelectedSubjectForPyq] = useState(null); // Selected subject to view PYQs
  const [pyqs, setPyqs] = useState({}); // Stores PYQs grouped by year for the selected subject

  const [departmentName, setDepartmentName] = useState("Loading...");

  // Loading States
  const [isLoading, setIsLoading] = useState({
    syllabus: true,
    notes: true,
    subjects: false,
    pyqs: false,
    department: true,
  });

  // Error States
  const [error, setError] = useState({
    syllabus: null,
    notes: null,
    subjects: null,
    pyqs: null,
    department: null,
  });

  // Initial Fetch: Dept Info, Syllabus, Notes
  useEffect(() => {
    const fetchList = async (apiPath, dataType, setState) => {
      setIsLoading((prev) => ({ ...prev, [dataType]: true }));
      setError((prev) => ({ ...prev, [dataType]: null }));
      // For Syllabus and Notes, we still fetch by department (streamId) if the backend supports it, 
      // OR we might need to change this later if we want Subject-based Notes too. 
      // For now, let's keep Syllabus/Notes as is, but fix the query if needed. 
      // Start with standard fetching (assuming controllers might filter by department if they support it).
      // Note: notesController supports departmentId. 
      // syllabusController supports departmentId? Let's check... 
      // Actually standardizing to filter by 'departmentId' query param is safer. Suffix: ?departmentId=${streamId}
      try {
        const apiUrl = `${BACKEND_URL + apiPath}?departmentId=${streamId}`;
        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setState(Array.isArray(data) ? data : []);
      } catch {
        setError((prev) => ({ ...prev, [dataType]: `Could not load ${dataType}.` }));
        setState([]);
      } finally {
        setIsLoading((prev) => ({ ...prev, [dataType]: false }));
      }
    };

    const fetchDepartmentName = async () => {
      setIsLoading((prev) => ({ ...prev, department: true }));
      try {
        const res = await fetch(`${BACKEND_URL}/api/departments/${streamId}`);
        if (!res.ok) throw new Error("HTTP " + res.status);
        const dept = await res.json();
        setDepartmentName(dept.name || "Department");
      } catch {
        setDepartmentName("Department");
        setError((prev) => ({ ...prev, department: "Could not load department name." }));
      } finally {
        setIsLoading((prev) => ({ ...prev, department: false }));
      }
    };

    if (streamId && streamId.match(/^[0-9a-fA-F]{24}$/)) {
      fetchDepartmentName();
      // Fetch Syllabus and Notes associated with this Department
      // Note: The previous code used '?subject=', which was wrong.
      // We use '?departmentId=' now based on our controller knowledge (except for syllabus? let's hope it supports it or fetches all).
      // If syllabusController doesn't support filter, we get all. 
      fetchList("/api/syllabus", "syllabus", setSyllabus);
      fetchList("/api/notes", "notes", setNotes);
    } else {
      setDepartmentName("Invalid Department");
    }
  }, [streamId]);

  // Fetch Subjects when PYQ tab is active
  useEffect(() => {
    const fetchSubjects = async () => {
      if (activeTab === 'pyqs' && subjects.length === 0) {
        setIsLoading(prev => ({ ...prev, subjects: true }));
        try {
          // Fetch subjects for this department
          const res = await fetch(`${BACKEND_URL}/api/subjects?department=${streamId}`);
          if (!res.ok) throw new Error("Failed to fetch subjects");
          const data = await res.json();
          setSubjects(data);
        } catch (err) {
          console.error(err);
          setError(prev => ({ ...prev, subjects: "Failed to load subjects." }));
        } finally {
          setIsLoading(prev => ({ ...prev, subjects: false }));
        }
      }
    };
    fetchSubjects();
  }, [activeTab, subjects.length, streamId]);

  // Fetch PYQs when a subject is selected
  useEffect(() => {
    const fetchPYQs = async () => {
      if (selectedSubjectForPyq) {
        setIsLoading(prev => ({ ...prev, pyqs: true }));
        try {
          // Fetch PYQs for specific subject
          const res = await fetch(`${BACKEND_URL}/api/pyqs?subject=${selectedSubjectForPyq._id}`);
          if (!res.ok) throw new Error("Failed to fetch PYQs");
          const data = await res.json();

          // Group by Year
          const grouped = data.reduce((acc, item) => {
            const y = item.year || 'Unknown Year';
            if (!acc[y]) acc[y] = [];
            acc[y].push(item);
            return acc;
          }, {});

          setPyqs(grouped);
        } catch (err) {
          console.error(err);
          setError(prev => ({ ...prev, pyqs: "Failed to load PYQs." }));
        } finally {
          setIsLoading(prev => ({ ...prev, pyqs: false }));
        }
      }
    };
    fetchPYQs();
  }, [selectedSubjectForPyq]);


  const renderSyllabusOrNotes = (data, dataType) => {
    if (isLoading[dataType]) return <p className="loading-text">Loading {dataType}...</p>;
    if (error[dataType]) return <p className="error-message">{error[dataType]}</p>;
    if (!data.length) return <p className="empty-text">No {dataType} available.</p>;

    return (
      <ul className="content-list">
        {data.map((item) => (
          <li
            key={item._id}
            className="content-item"
            onClick={() => window.open(getFileUrl(item.filePath), "_blank")}
          >
            <div className="icon-box"><FaFilePdf /></div>
            <div className="item-details">
              <span className="item-title">{item.title}</span>
              {item.year && <span className="item-year">{item.year}</span>}
              {item.subject && typeof item.subject === 'object' && <span className="item-subject">{item.subject.name}</span>}
            </div>
          </li>
        ))}
      </ul>
    );
  };

  const renderPYQSection = () => {
    // 1. If no subject selected, show Subject List
    if (!selectedSubjectForPyq) {
      if (isLoading.subjects) return <p className="loading-text">Loading Subjects...</p>;
      if (error.subjects) return <p className="error-message">{error.subjects}</p>;
      if (subjects.length === 0) return <p className="empty-text">No subjects found for this stream.</p>;

      return (
        <div className="subject-grid">
          {subjects.map(sub => (
            <div key={sub._id} className="subject-card" onClick={() => setSelectedSubjectForPyq(sub)}>
              <h3>{sub.name}</h3>
              <p>{sub.description}</p>
              <span className="view-btn">View Papers &rarr;</span>
            </div>
          ))}
        </div>
      );
    }

    // 2. If subject selected, show PYQs grouped by Year
    return (
      <div className="pyq-view">
        <button className="back-btn" onClick={() => setSelectedSubjectForPyq(null)}>&larr; Back to Subjects</button>
        <h2>{selectedSubjectForPyq.name} - Past Papers</h2>

        {isLoading.pyqs && <p className="loading-text">Loading Papers...</p>}
        {!isLoading.pyqs && Object.keys(pyqs).length === 0 && <p className="empty-text">No past papers uploaded for this subject.</p>}

        {!isLoading.pyqs && Object.keys(pyqs).sort().reverse().map(year => (
          <div key={year} className="year-group">
            <h3 className="year-header">{year}</h3>
            <div className="papers-grid">
              {pyqs[year].map(paper => (
                <div key={paper._id} className="paper-card" onClick={() => window.open(getFileUrl(paper.filePath), "_blank")}>
                  <FaFilePdf className="pdf-icon-large" />
                  <p>{paper.title}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="page-container course-page-wrapper">
      <Navbar />
      <main className="course-page-content">
        <div className="course-container">
          <header className="course-header">
            {isLoading.department ? <h1>Loading...</h1> : <h1>{departmentName} Resources</h1>}
            <p>Access curated study materials and previous year questions</p>
          </header>

          <nav className="tab-nav">
            <button
              onClick={() => setActiveTab("syllabus")}
              className={activeTab === "syllabus" ? "active" : ""}
            >
              <FaBook className="tab-icon" /> Syllabus
            </button>
            <button
              onClick={() => setActiveTab("notes")}
              className={activeTab === "notes" ? "active" : ""}
            >
              <FaStickyNote className="tab-icon" /> Notes
            </button>
            <button
              onClick={() => {
                setActiveTab("pyqs");
                setSelectedSubjectForPyq(null); // Reset selection when switching tabs
              }}
              className={activeTab === "pyqs" ? "active" : ""}
            >
              <FaHistory className="tab-icon" /> Past Papers
            </button>
          </nav>

          <section className="tab-content">
            {activeTab === "syllabus" && renderSyllabusOrNotes(syllabus, "syllabus")}
            {activeTab === "notes" && renderSyllabusOrNotes(notes, "notes")}
            {activeTab === "pyqs" && renderPYQSection()}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default CoursePage;
