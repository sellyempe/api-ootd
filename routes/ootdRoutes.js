const express = require('express');
const router = express.Router();
const { getAllOotds, getOotdById, createOotd, updateOotd, deleteOotd, getMyOotds } = require('../controllers/ootdController');
const { ensureAuth } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getAllOotds);
router.get('/mine', ensureAuth, getMyOotds);
router.get('/:id', getOotdById);
router.post('/', ensureAuth, upload.single('image'), createOotd);
router.put('/:id', ensureAuth, updateOotd);
router.delete('/:id', ensureAuth, deleteOotd);

module.exports = router;