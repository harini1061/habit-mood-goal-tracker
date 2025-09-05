// routes/partnerRoutes.js - FIXED VERSION
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // 🔥 ADD AUTH MIDDLEWARE
const partnerController = require('../controllers/partnerController');

// Send request (requires auth)
router.post('/request', auth, partnerController.sendPartnerRequest);

// Accept request (update status → accepted) (requires auth)
router.put('/accept/:requestId', auth, partnerController.acceptPartnerRequest);

// Reject request (update status → rejected) (requires auth)
router.put('/reject/:requestId', auth, partnerController.rejectPartnerRequest);

// Cancel sent request (requires auth)
router.delete('/cancel/:requestId', auth, partnerController.cancelPartnerRequest);

// Remove partner (requires auth)
router.delete('/remove/:userId', auth, partnerController.removePartner);

// Get incoming requests (requires auth - should use req.user.userId instead of params)
router.get('/requests', auth, partnerController.getIncomingRequests);

// Get partner info (requires auth - should use req.user.userId instead of params)
router.get('/partner', auth, partnerController.getPartner);

module.exports = router;