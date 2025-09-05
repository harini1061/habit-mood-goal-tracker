const PartnerRequest = require('../models/PartnerRequest');
const User = require('../models/User');

// 📩 Send partner request
exports.sendPartnerRequest = async (req, res) => {
  try {
    const { from, to } = req.body;

    const request = new PartnerRequest({ from, to, status: "pending" });
    await request.save();

    res.status(201).json({ message: "Partner request sent!", request });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Accept partner request
exports.acceptPartnerRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    const request = await PartnerRequest.findByIdAndUpdate(
      requestId,
      { status: "accepted" },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    res.json({ message: "Partner request accepted!", request });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ❌ Reject partner request
exports.rejectPartnerRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    const request = await PartnerRequest.findByIdAndUpdate(
      requestId,
      { status: "rejected" },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    res.json({ message: "Partner request rejected!", request });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🚫 Cancel sent request
exports.cancelPartnerRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    const request = await PartnerRequest.findByIdAndDelete(requestId);

    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    res.json({ message: "Partner request cancelled!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ❌ Remove partner (break connection)
exports.removePartner = async (req, res) => {
  try {
    const { userId } = req.params;

    const request = await PartnerRequest.findOneAndDelete({
      $or: [{ from: userId }, { to: userId }],
      status: "accepted"
    });

    if (!request) {
      return res.status(404).json({ error: "Partner not found" });
    }

    res.json({ message: "Partner removed!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📥 Get incoming requests
exports.getIncomingRequests = async (req, res) => {
  try {
    const { userId } = req.params;
    const requests = await PartnerRequest.find({ to: userId, status: "pending" })
      .populate("from", "username email");

    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 👤 Get partner info
exports.getPartner = async (req, res) => {
  try {
    const { userId } = req.params;

    const request = await PartnerRequest.findOne({
      $or: [{ from: userId }, { to: userId }],
      status: "accepted"
    }).populate("from to", "username email");

    if (!request) {
      return res.status(404).json({ error: "No partner found" });
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
