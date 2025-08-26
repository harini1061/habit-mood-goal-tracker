const express = require('express');
const router = express.Router();
const partnerController = require('../controllers/partnerController');

// Send request
router.post('/request', partnerController.sendPartnerRequest);

// Accept request (update status → accepted)
router.put('/accept/:requestId', partnerController.acceptPartnerRequest);

// Reject request (update status → rejected)
router.put('/reject/:requestId', partnerController.rejectPartnerRequest);

// Cancel sent request
router.delete('/cancel/:requestId', partnerController.cancelPartnerRequest);

// Remove partner
router.delete('/remove/:userId', partnerController.removePartner);

// Get incoming requests
router.get('/requests/:userId', partnerController.getIncomingRequests);

// Get partner info
router.get('/partner/:userId', partnerController.getPartner);

module.exports = router;
