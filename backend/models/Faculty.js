const mongoose = require('mongoose');

const FacultySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  servingPeriod: {
    from: {
      type: Date,
      required: [true, 'Please provide serving start date']
    },
    to: {
      type: Date,
      default: null
    }
  },
  primarySubject: {
    type: String,
    required: [true, 'Please provide primary subject']
  },
  secondarySubject: {
    type: String
  },
  otherSubjects: [String],
  achievements: [String],
  departments: [String]
}, { timestamps: true });

module.exports = mongoose.model('Faculty', FacultySchema);
