const express = require('express');
const router = express.Router();
const { auth, adminAuth, optionalAuth } = require('../middleware/auth');
const {
  getSimilar,
  getBoughtTogether,
  getForYou,
  getForCart,
  getTrending,
  getRecentlyViewed,
  trackView,
  getAdminStats
} = require('../controllers/recommendationController');

router.get('/for-you', optionalAuth, getForYou);
router.get('/trending', getTrending);
router.get('/recently-viewed', optionalAuth, getRecentlyViewed);
router.get('/cart', auth, getForCart);
router.get('/admin/stats', adminAuth, getAdminStats);
router.get('/similar/:productId', getSimilar);
router.get('/bought-together/:productId', getBoughtTogether);
router.post('/track-view', optionalAuth, trackView);

module.exports = router;
