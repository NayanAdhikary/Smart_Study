import { useState, useEffect } from "react";
import AdminLayout from "../../components/AdminLayout";
import "./AdminSettings.css";

export default function AdminSettings() {
    const [settings, setSettings] = useState({
        siteName: "",
        supportEmail: "",
        maintenanceMode: false,
        allowRegistration: true,
        modules: {
            notes: true,
            pyqs: true,
            predictor: true,
            syllabus: true
        }
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        consttoken = localStorage.getItem('authToken');
        try {
            const res = await fetch("/api/admin/settings", {
                headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
            });
            if (res.ok) {
                const data = await res.json();
                setSettings(data);
            }
        } catch (err) {
            console.error("Failed to fetch settings", err);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === "checkbox") {
            setSettings(prev => ({ ...prev, [name]: checked }));
        } else {
            setSettings(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleModuleChange = (e) => {
        const { name, checked } = e.target;
        setSettings(prev => ({
            ...prev,
            modules: {
                ...prev.modules,
                [name]: checked
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        setError(null);

        try {
            const res = await fetch("/api/admin/settings", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify(settings)
            });

            if (res.ok) {
                const data = await res.json();
                setSettings(data);
                setMessage("Settings updated successfully!");
                // Clear message after 3 seconds
                setTimeout(() => setMessage(null), 3000);
            } else {
                setError("Failed to update settings");
            }
        } catch (err) {
            setError("An error occurred while saving.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout>
            <div className="settings-header">
                <h1 style={{ marginBottom: '24px' }}>System Settings</h1>
            </div>

            {message && <div className="success-message">{message}</div>}
            {error && <div className="error-message">{error}</div>}

            <form className="settings-container" onSubmit={handleSubmit}>

                {/* General Settings */}
                <div className="settings-section">
                    <h2>General Configuration</h2>
                    <div className="form-group">
                        <label>Site Name</label>
                        <input
                            type="text"
                            name="siteName"
                            value={settings.siteName}
                            onChange={handleChange}
                            placeholder="SmartStudy"
                        />
                    </div>
                    <div className="form-group">
                        <label>Support Email</label>
                        <input
                            type="email"
                            name="supportEmail"
                            value={settings.supportEmail}
                            onChange={handleChange}
                            placeholder="support@example.com"
                        />
                    </div>
                </div>

                {/* System Controls */}
                <div className="settings-section">
                    <h2>System Controls</h2>

                    <div className="toggle-group">
                        <label>Maintenance Mode (Lock Access)</label>
                        <label className="switch">
                            <input
                                type="checkbox"
                                name="maintenanceMode"
                                checked={settings.maintenanceMode}
                                onChange={handleChange}
                            />
                            <span className="slider"></span>
                        </label>
                    </div>

                    <div className="toggle-group">
                        <label>Allow User Registration</label>
                        <label className="switch">
                            <input
                                type="checkbox"
                                name="allowRegistration"
                                checked={settings.allowRegistration}
                                onChange={handleChange}
                            />
                            <span className="slider"></span>
                        </label>
                    </div>
                </div>

                {/* Module Settings */}
                <div className="settings-section">
                    <h2>Feature Modules</h2>
                    <div className="modules-grid">
                        <div className="module-item">
                            <input
                                type="checkbox"
                                id="mod-notes"
                                name="notes"
                                checked={settings.modules?.notes ?? true}
                                onChange={handleModuleChange}
                            />
                            <label htmlFor="mod-notes">Notes (PDFs)</label>
                        </div>

                        <div className="module-item">
                            <input
                                type="checkbox"
                                id="mod-pyqs"
                                name="pyqs"
                                checked={settings.modules?.pyqs ?? true}
                                onChange={handleModuleChange}
                            />
                            <label htmlFor="mod-pyqs">Previous Year Questions</label>
                        </div>

                        <div className="module-item">
                            <input
                                type="checkbox"
                                id="mod-syllabus"
                                name="syllabus"
                                checked={settings.modules?.syllabus ?? true}
                                onChange={handleModuleChange}
                            />
                            <label htmlFor="mod-syllabus">Syllabus</label>
                        </div>

                        <div className="module-item">
                            <input
                                type="checkbox"
                                id="mod-predictor"
                                name="predictor"
                                checked={settings.modules?.predictor ?? true}
                                onChange={handleModuleChange}
                            />
                            <label htmlFor="mod-predictor">Marks Predictor</label>
                        </div>
                    </div>
                </div>

                <button type="submit" className="save-btn" disabled={loading}>
                    {loading ? "Saving..." : "Save Changes"}
                </button>
            </form>
        </AdminLayout>
    );
}
