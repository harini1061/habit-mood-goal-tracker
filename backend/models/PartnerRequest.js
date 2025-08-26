const mongoose = require('mongoose');

const partnerRequestSchema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'cancelled'], // added 'cancelled'
    default: 'pending'
  }
}, { timestamps: true });

// Optional: Prevent duplicate active requests between same users
partnerRequestSchema.index(
  { from: 1, to: 1, status: 1 },
  {
    unique: true,
    partialFilterExpression: { status: "pending" }
  }
);

module.exports = mongoose.model('PartnerRequest', partnerRequestSchema);
