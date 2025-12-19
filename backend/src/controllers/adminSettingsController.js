const SystemSettings = require('../models/SystemSettings');

// @desc    Get system settings
// @route   GET /api/admin/settings
// @access  Private/Admin
const getSettings = async (req, res) => {
    try {
        const settings = await SystemSettings.getSettings();
        res.status(200).json(settings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update system settings
// @route   PUT /api/admin/settings
// @access  Private/Admin
const updateSettings = async (req, res) => {
    try {
        const { siteName, supportEmail, maintenanceMode, allowRegistration, modules } = req.body;

        let settings = await SystemSettings.findOne();
        if (!settings) {
            settings = await SystemSettings.create({});
        }

        settings.siteName = siteName || settings.siteName;
        settings.supportEmail = supportEmail || settings.supportEmail;
        settings.maintenanceMode = maintenanceMode !== undefined ? maintenanceMode : settings.maintenanceMode;
        settings.allowRegistration = allowRegistration !== undefined ? allowRegistration : settings.allowRegistration;
        settings.modules = modules || settings.modules;

        const updatedSettings = await settings.save();
        res.status(200).json(updatedSettings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getSettings,
    updateSettings
};
