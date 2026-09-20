const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Job = require('./src/models/Job');
const Candidate = require('./src/models/Candidate');

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/cv_screening');
    console.log('MongoDB Connected');

    await Job.deleteMany();
    await Candidate.deleteMany();

    const job1 = await Job.create({ title: 'Sr. Frontend Engineer (Req #FE-802)' });
    const job2 = await Job.create({ title: 'Cloud Architect (Req #CA-201)' });

    const mockCandidates = [
      {
        name: 'Dishan Perera', email: 'dishan.p@example.com', phone: '+94 77 123 4567',
        education: 'B.Sc. SE (First Class)', experience: '6.2 Yrs',
        technicalSkills: ['React 18', 'Next.js 14', 'TypeScript'],
        cvUrl: 'dummy.pdf',
        status: 'Complete',
        jobId: job1._id,
        aiEvaluation: { matchPercentage: 96, recommendationStatus: 'Highly Recommended', matchingSkills: ['React 18', 'TypeScript'], missingSkills: ['GraphQL'], justification: 'Excellent match' }
      },
      {
        name: 'Maya Lin', email: 'maya.lin@example.com', phone: '+1 415 555 2671',
        education: 'M.Sc. CS (Stanford)', experience: '8.0 Yrs',
        technicalSkills: ['AWS', 'Python', 'FastAPI'],
        cvUrl: 'dummy2.pdf',
        status: 'Complete',
        jobId: job2._id,
        aiEvaluation: { matchPercentage: 94, recommendationStatus: 'Highly Recommended', matchingSkills: ['AWS', 'Python'], missingSkills: ['Terraform'], justification: 'Very strong cloud skills' }
      }
    ];

    await Candidate.insertMany(mockCandidates);
    console.log('Database seeded successfully');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seed();

