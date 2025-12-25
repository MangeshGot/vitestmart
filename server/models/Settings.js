const mongoose = require('mongoose');

const settingsSchema = mongoose.Schema({
    classes: [{ type: String }],
    divisions: [{ type: String }]
}, {
    timestamps: true
});

const Settings = mongoose.model('Settings', settingsSchema);

module.exports = Settings;
