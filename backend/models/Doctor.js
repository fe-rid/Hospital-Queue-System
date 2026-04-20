const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    default: 'doctor123'
  },
  department: {
    type: String,
    required: true,
    enum: ["Emergency", "General Medicine", "Cardiology", "Pediatrics", "Orthopedics", "Dermatology"]
  },

  roomNumber: String,

  status: {
    type: String,
    enum: ["AVAILABLE", "BUSY", "OFF_DUTY"],
    default: "AVAILABLE"
  },

  activePatients: {
    type: Number,
    default: 0
  },

  completedToday: {
    type: Number,
    default: 0
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
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

module.exports = mongoose.model('Doctor', DoctorSchema);
