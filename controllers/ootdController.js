const Ootd = require('../models/Ootd');
const fs = require('fs');
const path = require('path');

const fullUrl = (ootd) => ({
    ...ootd.toJSON(),
    imageId: `${process.env.APP_URL}${ootd.imageId}`
});

exports.getAllOotds = async (req, res) => {
    try {
        const ootds = await Ootd.findAll({ order: [['createdAt', 'DESC']] });
        res.status(200).json(ootds.map(fullUrl));
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

exports.getMyOotds = async (req, res) => {
    try {
        const ootds = await Ootd.findAll({ 
            where: { userId: req.user.googleId },
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json(ootds.map(fullUrl));
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

exports.getOotdById = async (req, res) => {
    try {
        const ootd = await Ootd.findByPk(req.params.id);
        if (!ootd) return res.status(404).json({ message: 'OOTD not found' });
        res.status(200).json(fullUrl(ootd));
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

exports.createOotd = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'Gambar wajib diisi' });
        
        const imagePath = `/uploads/${req.file.filename}`;
        const newOotd = await Ootd.create({
            ...req.body,
            imageId: imagePath,
            userId: req.user.googleId
        });
        res.status(201).json(fullUrl(newOotd));
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

exports.updateOotd = async (req, res) => {
    try {
        const ootd = await Ootd.findByPk(req.params.id);
        if (!ootd) return res.status(404).json({ message: 'OOTD not found' });
        if (ootd.userId !== req.user.googleId) return res.status(403).json({ message: 'Forbidden' });

        await ootd.update(req.body);
        res.status(200).json(fullUrl(ootd));
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

exports.deleteOotd = async (req, res) => {
    try {
        const ootd = await Ootd.findByPk(req.params.id);
        if (!ootd) return res.status(404).json({ message: 'OOTD not found' });
        if (ootd.userId !== req.user.googleId) return res.status(403).json({ message: 'Forbidden' });

        const localPath = path.join(__dirname, '..', ootd.imageId);
        fs.unlink(localPath, (err) => {
            if (err) console.error(`Gagal menghapus file: ${localPath}`, err);
        });
        
        await ootd.destroy();
        res.status(200).json({ message: 'OOTD berhasil dihapus' });
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};