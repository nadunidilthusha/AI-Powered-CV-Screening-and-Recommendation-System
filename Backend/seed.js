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
        technicalSkills: ['React 18', 'Next.js 14', 'TypeScript', 'Tailwind CSS'],
        cvUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        status: 'Complete',
        jobId: job1._id,
        aiEvaluation: { matchPercentage: 98, recommendationStatus: 'Highly Recommended', matchingSkills: ['React 18', 'TypeScript', 'Next.js 14'], missingSkills: ['GraphQL'], justification: 'Exceeds Next.js 14 App Router requirements by +2.4 years. Proven technical leadership in enterprise migrations.' }
      },
      {
        name: 'Amaya Fernando', email: 'amaya.f@example.com', phone: '+94 71 889 2210',
        education: 'B.Sc. MIS (UCSC)', experience: '5.0 Yrs',
        technicalSkills: ['React 18', 'Design Systems', 'Storybook', 'WCAG AAA', 'Tailwind'],
        cvUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        status: 'Complete',
        jobId: job1._id,
        aiEvaluation: { matchPercentage: 94, recommendationStatus: 'Highly Recommended', matchingSkills: ['React 18', 'Design Systems', 'WCAG AAA'], missingSkills: ['Micro-frontends'], justification: 'Extensive enterprise UI component libraries experience. Authored design token workflows for 40+ engineering teams.' }
      },
      {
        name: 'Nuwan Senanayake', email: 'nuwan.s@example.com', phone: '+94 70 334 1122',
        education: 'B.Sc. CS (Peradeniya)', experience: '4.0 Yrs',
        technicalSkills: ['Node.js', 'NestJS', 'React', 'Docker', 'PostgreSQL'],
        cvUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        status: 'Complete',
        jobId: job1._id,
        aiEvaluation: { matchPercentage: 89, recommendationStatus: 'Recommended', matchingSkills: ['Node.js', 'React', 'PostgreSQL'], missingSkills: ['Kubernetes'], justification: 'Strong full-stack capability with 96th percentile benchmark. High versatility for end-to-end prototyping.' }
      },
      {
        name: 'Maya Lin', email: 'maya.lin@example.com', phone: '+1 415 555 2671',
        education: 'M.Sc. CS (Stanford)', experience: '8.0 Yrs',
        technicalSkills: ['AWS', 'Python', 'FastAPI', 'Kubernetes', 'Terraform'],
        cvUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
        status: 'Complete',
        jobId: job2._id,
        aiEvaluation: { matchPercentage: 95, recommendationStatus: 'Highly Recommended', matchingSkills: ['AWS', 'Python', 'Kubernetes'], missingSkills: ['Azure'], justification: 'Very strong cloud infrastructure and distributed microservices architecture experience.' }
      },
      {
        name: 'Kavindi Silva', email: 'kavindi.s@example.com', phone: '+94 76 990 4433',
        education: 'B.Sc. IT (Moratuwa)', experience: '3.5 Yrs',
        technicalSkills: ['React Native', 'Mobile UI', 'Redux Toolkit', 'TypeScript'],
        cvUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        status: 'Complete',
        jobId: job1._id,
        aiEvaluation: { matchPercentage: 82, recommendationStatus: 'Recommended', matchingSkills: ['TypeScript', 'Redux Toolkit'], missingSkills: ['Next.js 14'], justification: 'Solid frontend fundamentals with mobile cross-platform specialization.' }
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

