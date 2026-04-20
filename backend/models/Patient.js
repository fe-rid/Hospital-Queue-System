const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  age: Number,
  gender: String,
  phone: String,
  symptoms: {
    type: String,
    required: true
  },

  triage: {
    level: {
      type: String,
      enum: ['EMERGENCY', 'URGENT', 'NORMAL'],
      default: 'NORMAL'
    },
    department: String,
    explanation: String,
    priority: Number // 1 for Emergency, 2 for Urgent, 3 for Normal
  },

  status: {
    type: String,
    enum: ['PENDING_ASSIGNMENT', 'WAITING', 'CALLED', 'IN_CONSULTATION', 'SERVED'],
    default: "PENDING_ASSIGNMENT"
  },

  // Assigned Staff Info
  assignedDoctorId: String,
  assignedDoctor:   String,
  assignedRoom:     String,

  queuePosition: Number,
  estimatedWait: String,

  // Clinical records (added for consultation flow)
  notes: String,
  prescription: String,

  createdAt: {
    type: Date,
    default: Date.now
  },
  servedAt: Date
}, {
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
      ret.id = ret._id.toString();
      return ret;
    }
  }
});

module.exports = mongoose.model('Patient', PatientSchema);
