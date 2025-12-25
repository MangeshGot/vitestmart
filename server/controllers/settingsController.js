const Settings = require('../models/Settings');

// @desc    Get all settings (create default if not exists)
// @route   GET /api/settings
// @access  Public
const getSettings = async (req, res) => {
    let settings = await Settings.findOne();

    if (!settings) {
        settings = await Settings.create({
            classes: ['Nursery', 'LKG', 'UKG', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th'],
            divisions: ['A', 'B', 'C', 'D']
        });
    }

    res.json(settings);
};

// @desc    Update settings
// @route   PUT /api/settings
// @access  Private/Admin
const updateSettings = async (req, res) => {
    const settings = await Settings.findOne();

    if (settings) {
        settings.classes = req.body.classes || settings.classes;
        settings.divisions = req.body.divisions || settings.divisions;

        const updatedSettings = await settings.save();
        res.json(updatedSettings);
    } else {
        res.status(404).json({ error: 'Settings not found' });
    }
};

module.exports = {
    getSettings,
    updateSettings
};
