const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.verifyToken = async (req, res) => {
    const { token } = req.body;
    if (!token) {
        return res.status(400).json({ message: 'ID Token tidak ditemukan.' });
    }

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const googleId = payload['sub'];

        let user = await User.findOne({ where: { googleId: googleId } });
        if (!user) {
            user = await User.create({
                googleId: googleId,
                displayName: payload['name'],
                email: payload['email'],
                image: payload['picture'],
            });
        }
        
        req.login(user, (err) => {
            if (err) return res.status(500).json({ message: 'Gagal membuat sesi.' });
            return res.status(200).json(user);
        });
    } catch (error) {
        return res.status(401).json({ message: 'Login gagal: Token tidak valid.' });
    }
};

exports.logout = (req, res, next) => {
    req.logout(err => {
        if (err) return res.status(500).json({ message: 'Gagal logout.' });
        req.session.destroy(err => {
            if (err) return res.status(500).json({ message: 'Gagal menghapus sesi.' });
            res.clearCookie('connect.sid');
            return res.status(200).json({ message: 'Logout berhasil' });
        });
    });
};

exports.getCurrentUser = (req, res) => {
    if (req.user) {
        res.status(200).json(req.user);
    } else {
        res.status(401).json({ message: 'Tidak terautentikasi' });
    }
};