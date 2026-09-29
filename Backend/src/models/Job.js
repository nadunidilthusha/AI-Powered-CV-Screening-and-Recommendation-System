const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    // ─── Core ────────────────────────────────────────────────────
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },

    department: {
      type: String,
      enum: [
        'Engineering',
        'Design',
        'Product',
        'Marketing',
        'Operations',
      ],
      default: 'Engineering',
      trim: true,
    },

    location: {
      type: String,
      default: 'Remote',
      trim: true,
    },

    description: {
      type: String,
      default: '',
      trim: true,
    },

    status: {
      type: String,
      enum: ['Draft', 'Active', 'Closed'],
      default: 'Active',
      index: true,
    },

    // ─── Employment type (aliased) ──────────────────────────────
    // `type` is what the frontend form sends.
    // `employmentType` is what the AI pipeline reads.
    type: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
      default: 'Full-time',
    },
    employmentType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
      default: 'Full-time',
    },

    // ─── Experience level (aliased) ─────────────────────────────
    // `level` is the frontend enum. `experienceLevel` is a free-form
    // string the AI pipeline can read without enum restrictions.
    level: {
      type: String,
      enum: ['Entry level', 'Mid level', 'Senior level', 'Lead / Principal'],
      default: 'Entry level',
    },
    experienceLevel: {
      type: String,
      trim: true,
    },

    // ─── Skills (aliased) ───────────────────────────────────────
    // `skills` is what the frontend form sends.
    // `requiredSkills` is what the AI evaluator reads.
    skills: [{ type: String, trim: true }],
    requiredSkills: [{ type: String, trim: true }],

    // ─── Salary ─────────────────────────────────────────────────
    salaryMin: {
      type: Number,
      default: null,
      min: [0, 'Minimum salary cannot be negative'],
    },
    salaryMax: {
      type: Number,
      default: null,
      min: [0, 'Maximum salary cannot be negative'],
    },

    // ─── Ownership ──────────────────────────────────────────────
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// ─── Keep aliased fields in sync ────────────────────────────────
// Whichever of the two field names is set, mirror it to the other
// so both the frontend and the AI pipeline always see a value.
jobSchema.pre('save', function (next) {
  if (this.skills?.length && !this.requiredSkills?.length) {
    this.requiredSkills = this.skills;
  }
  if (this.requiredSkills?.length && !this.skills?.length) {
    this.skills = this.requiredSkills;
  }

  if (this.type && !this.employmentType) this.employmentType = this.type;
  if (this.employmentType && !this.type) this.type = this.employmentType;

  if (this.level && !this.experienceLevel) this.experienceLevel = this.level;
  if (this.experienceLevel && !this.level) this.level = this.experienceLevel;

  next();
});

// ─── Full-text search index ─────────────────────────────────────
jobSchema.index({
  title: 'text',
  department: 'text',
});

module.exports = mongoose.model('Job', jobSchema);