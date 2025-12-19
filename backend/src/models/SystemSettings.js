const mongoose = require('mongoose');

const systemSettingsSchema = new mongoose.Schema({
    siteName: {
        type: String,
        default: 'SmartStudy'
    },
    supportEmail: {
        type: String,
        default: 'support@smartstudy.com'
    },
    maintenanceMode: {
        type: Boolean,
        default: false
    },
    allowRegistration: {
        type: Boolean,
        default: true
    },
    modules: {
        notes: { type: Boolean, default: true },
        pyqs: { type: Boolean, default: true },
        predictor: { type: Boolean, default: true },
        syllabus: { type: Boolean, default: true }
    }
}, { timestamps: true });

// Ensure only one settings document exists
systemSettingsSchema.statics.getSettings = async function () {
    const settings = await this.findOne();
    if (settings) return settings;
    return await this.create({});
};

module.exports = mongoose.model('SystemSettings', systemSettingsSchema);
