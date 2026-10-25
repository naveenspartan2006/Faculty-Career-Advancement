const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('./models/User');
const Faculty = require('./models/Faculty');
const Publication = require('./models/Publication');
const Achievement = require('./models/Achievement');
const Certification = require('./models/Certification');
const Conference = require('./models/Conference');
const Project = require('./models/Project');

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/faculty_career_db';
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected to database');

    // Clean existing records
    await Promise.all([
      User.deleteMany({}),
      Faculty.deleteMany({}),
      Publication.deleteMany({}),
      Achievement.deleteMany({}),
      Certification.deleteMany({}),
      Conference.deleteMany({}),
      Project.deleteMany({})
    ]);
    console.log('[Seed] Cleared existing records');

    // 1. Admin User
    await User.create({
      name: 'System Academic Dean (Admin)',
      email: 'admin@college.edu',
      password: 'Admin@123',
      role: 'admin',
      employeeId: 'ADM-001',
      department: 'Academic Administration',
      designation: 'Dean of Academic Affairs'
    });
    console.log('[Seed] Admin user created: admin@college.edu / Admin@123');

    // 2. Faculty 1: Dr. Rajesh Kumar (CSD)
    const facultyPassword = 'Faculty@123';
    const userRajesh = await User.create({
      name: 'Dr. Rajesh Kumar',
      email: 'dr.rajesh@college.edu',
      password: facultyPassword,
      role: 'faculty',
      employeeId: 'FAC-CSD-101',
      department: 'Computer Science and Design',
      designation: 'Professor'
    });

    const facultyRajesh = await Faculty.create({
      userId: userRajesh._id,
      fullName: 'Dr. Rajesh Kumar',
      employeeId: 'FAC-CSD-101',
      email: 'dr.rajesh@college.edu',
      phone: '+91 98765 43210',
      dateOfBirth: new Date('1980-05-14'),
      gender: 'Male',
      department: 'Computer Science and Design',
      designation: 'Professor',
      dateOfJoining: new Date('2015-07-15'),
      highestQualification: 'Ph.D. in Computer Science',
      specialization: 'Artificial Intelligence & Distributed Systems',
      researchInterests: ['Machine Learning', 'Cloud Computing', 'Computer Vision', 'Deep Learning'],
      university: 'Indian Institute of Technology, Madras',
      graduationYear: 2012,
      orcid: '0000-0002-1825-0097',
      googleScholar: 'https://scholar.google.com/citations?user=demo_rajesh',
      linkedin: 'https://linkedin.com/in/demo-rajesh-kumar',
      biography: 'Dr. Rajesh Kumar is a Professor in CSE with over 16 years of teaching and research experience in AI, Distributed Systems, and Edge Computing. He has authored over 20 peer-reviewed articles and secured competitive grants from DST and AICTE.'
    });

    // Publications for Rajesh
    await Publication.insertMany([
      {
        facultyId: facultyRajesh._id,
        title: 'Deep Transfer Learning Architecture for Automated Brain Tumor Segmentation in MRI Scans',
        authors: ['Rajesh Kumar', 'Anita Nair', 'Sunil Deshmukh'],
        publicationType: 'Journal',
        journalName: 'IEEE Transactions on Medical Imaging',
        publisher: 'IEEE',
        publicationDate: new Date('2025-03-10'),
        volume: '44',
        issue: '3',
        pages: '1024-1036',
        doi: '10.1109/TMI.2025.3214890',
        issn: '0278-0062',
        indexing: 'Scopus',
        status: 'Published',
        abstract: 'This paper proposes a lightweight residual attention network for multi-modal MRI brain tumor segmentation, achieving 94.6% Dice coefficient.'
      },
      {
        facultyId: facultyRajesh._id,
        title: 'Federated Edge Learning with Differential Privacy in Smart Healthcare IoT Networks',
        authors: ['Rajesh Kumar', 'Vikram Seth'],
        publicationType: 'Journal',
        journalName: 'Elsevier Future Generation Computer Systems',
        publisher: 'Elsevier',
        publicationDate: new Date('2024-11-20'),
        volume: '158',
        pages: '210-225',
        doi: '10.1016/j.future.2024.08.012',
        issn: '0167-739X',
        indexing: 'Web of Science',
        status: 'Published',
        abstract: 'We introduce a decentralized privacy-preserving federated algorithm optimized for bandwidth-constrained IoT edge devices.'
      },
      {
        facultyId: facultyRajesh._id,
        title: 'Scalable Microservices Orchestration in Multi-Cloud Kubernetes Clusters',
        authors: ['Rajesh Kumar', 'Rohan Gupta'],
        publicationType: 'Conference',
        conferenceName: 'IEEE International Conference on Cloud Computing (CLOUD 2024)',
        publisher: 'IEEE Computer Society',
        publicationDate: new Date('2024-07-08'),
        pages: '45-53',
        doi: '10.1109/CLOUD60021.2024.00015',
        indexing: 'Scopus',
        status: 'Published',
        abstract: 'Presents an intelligent autoscaling scheduler that reduces SLA violations by 31% across hybrid cloud environments.'
      },
      {
        facultyId: facultyRajesh._id,
        title: 'Deep Learning Approaches for Plant Leaf Disease Detection: A Comparative Benchmark',
        authors: ['Rajesh Kumar', 'K. Meenakshi'],
        publicationType: 'Journal',
        journalName: 'Journal of Agricultural Informatics and Engineering',
        publisher: 'Springer Nature',
        publicationDate: new Date('2023-09-15'),
        volume: '12',
        issue: '4',
        pages: '88-99',
        doi: '10.1007/s41870-023-01456-x',
        indexing: 'UGC',
        status: 'Published',
        abstract: 'Benchmarked 8 CNN variants on 54,000 plant leaves, detailing real-world inference latency and accuracy tradeoffs.'
      },
      {
        facultyId: facultyRajesh._id,
        title: 'System and Method for Adaptive Edge Traffic Routing Using Graph Neural Networks',
        authors: ['Rajesh Kumar', 'S. Narayanan'],
        publicationType: 'Patent',
        publisher: 'Indian Patent Office',
        publicationDate: new Date('2023-04-12'),
        isbn: 'IN Patent App 202341029182',
        indexing: 'Other',
        status: 'Published',
        abstract: 'A granted patent describing intelligent hardware routing for latency-critical sensor telemetry.'
      },
      {
        facultyId: facultyRajesh._id,
        title: 'Foundations of Modern Distributed Computing: Architectures & Protocols',
        authors: ['Rajesh Kumar'],
        publicationType: 'Book Chapter',
        publisher: 'CRC Press / Taylor & Francis',
        publicationDate: new Date('2022-10-01'),
        volume: 'Handbook of Cloud Engineering',
        pages: '115-142',
        isbn: '978-0-367-54892-1',
        indexing: 'Scopus',
        status: 'Published',
        abstract: 'Comprehensive chapter reviewing consensus protocols from Paxos and Raft to Byzantine fault tolerance.'
      }
    ]);

    // Achievements for Rajesh
    await Achievement.insertMany([
      {
        facultyId: facultyRajesh._id,
        title: 'Distinguished Faculty Researcher Award 2024',
        category: 'Research',
        organization: 'International Association of Computer Science & IT',
        date: new Date('2024-12-18'),
        level: 'International',
        certificateNumber: 'IACSIT-RES-2024-8821',
        description: 'Awarded for outstanding contributions in medical imaging and edge computing publications.'
      },
      {
        facultyId: facultyRajesh._id,
        title: 'Excellence in Academic Mentorship & Teaching',
        category: 'Teaching',
        organization: 'State Higher Education Council',
        date: new Date('2023-09-05'),
        level: 'State',
        certificateNumber: 'SHEC-TEACH-2023-410',
        description: 'Recognized for guiding 4 successful doctoral scholars and initiating curriculum revisions.'
      }
    ]);

    // Certifications for Rajesh
    await Certification.insertMany([
      {
        facultyId: facultyRajesh._id,
        name: 'AWS Certified Solutions Architect – Professional',
        issuingOrganization: 'Amazon Web Services',
        issueDate: new Date('2023-05-10'),
        expiryDate: new Date('2026-05-10'),
        credentialId: 'AWS-PSA-994821',
        credentialUrl: 'https://aws.amazon.com/verification',
        description: 'Advanced proficiency in architecting distributed fault-tolerant systems on cloud platforms.'
      },
      {
        facultyId: facultyRajesh._id,
        name: 'Deep Learning Specialization',
        issuingOrganization: 'DeepLearning.AI / Coursera',
        issueDate: new Date('2022-08-20'),
        credentialId: 'DL-SPEC-77312',
        credentialUrl: 'https://coursera.org/verify/specialization/DL-SPEC-77312',
        description: 'Five-course series covering Neural Networks, CNNs, Sequence Models, and Optimization.'
      }
    ]);

    // Conferences for Rajesh
    await Conference.insertMany([
      {
        facultyId: facultyRajesh._id,
        eventName: 'International Conference on Advanced Computing and Communication Systems (ICACCS 2024)',
        eventType: 'Conference',
        organizer: 'IEEE Computer Society',
        location: 'Bengaluru, India',
        startDate: new Date('2024-03-22'),
        endDate: new Date('2024-03-24'),
        role: 'Speaker',
        description: 'Delivered an invited keynote on Privacy-Preserving Collaborative AI in Healthcare.'
      },
      {
        facultyId: facultyRajesh._id,
        eventName: 'National Workshop on Kubernetes in Production Environments',
        eventType: 'Workshop',
        organizer: 'Department of CSE, Regional Engineering College',
        location: 'Hyderabad, India',
        startDate: new Date('2023-11-10'),
        endDate: new Date('2023-11-12'),
        role: 'Organizer',
        description: 'Organized a 3-day hands-on workshop for 120 faculty and research scholars.'
      }
    ]);

    // Projects for Rajesh
    await Project.insertMany([
      {
        facultyId: facultyRajesh._id,
        title: 'Design of Privacy-Preserving Federated Healthcare Intelligence Network',
        projectType: 'Research',
        fundingOrganization: 'Department of Science and Technology (DST-SERB)',
        principalInvestigator: 'Dr. Rajesh Kumar',
        coInvestigators: ['Dr. Anita Nair'],
        startDate: new Date('2023-06-01'),
        endDate: new Date('2026-05-31'),
        fundingAmount: 2850000,
        status: 'Ongoing',
        description: 'Developing high-throughput federated training paradigms for cancer pathology classification across multi-hospital consortia.'
      },
      {
        facultyId: facultyRajesh._id,
        title: 'AI-Powered Smart Grid Fault Diagnosis and Automated Recovery',
        projectType: 'Consultancy',
        fundingOrganization: 'Apex Power Grid Corporation',
        principalInvestigator: 'Dr. Rajesh Kumar',
        coInvestigators: [],
        startDate: new Date('2022-01-15'),
        endDate: new Date('2023-06-30'),
        fundingAmount: 500000,
        status: 'Completed',
        description: 'Delivered real-time telemetry processing microservice for high voltage substation monitoring.'
      }
    ]);

    // 3. Faculty 2: Dr. Priya Sharma (ECE)
    const userPriya = await User.create({
      name: 'Dr. Priya Sharma',
      email: 'dr.priya@college.edu',
      password: facultyPassword,
      role: 'faculty',
      employeeId: 'FAC-ECE-204',
      department: 'Electronics and Communication Engineering',
      designation: 'Associate Professor'
    });

    const facultyPriya = await Faculty.create({
      userId: userPriya._id,
      fullName: 'Dr. Priya Sharma',
      employeeId: 'FAC-ECE-204',
      email: 'dr.priya@college.edu',
      phone: '+91 98111 22334',
      dateOfBirth: new Date('1985-08-22'),
      gender: 'Female',
      department: 'Electronics and Communication Engineering',
      designation: 'Associate Professor',
      dateOfJoining: new Date('2018-09-01'),
      highestQualification: 'Ph.D. in VLSI Design & Microelectronics',
      specialization: 'Low-Power VLSI & IoT Hardware Architectures',
      researchInterests: ['VLSI Architectures', 'Edge Accelerators', 'Embedded Systems', 'Signal Processing'],
      university: 'National Institute of Technology, Trichy',
      graduationYear: 2016,
      orcid: '0000-0003-4412-9011',
      googleScholar: 'https://scholar.google.com/citations?user=demo_priya',
      linkedin: 'https://linkedin.com/in/demo-priya-sharma',
      biography: 'Dr. Priya Sharma specializes in low-power CMOS circuit design and hardware acceleration for edge computing nodes. She has published multiple papers in IEEE Transactions on Circuits and Systems.'
    });

    await Publication.insertMany([
      {
        facultyId: facultyPriya._id,
        title: 'Energy-Efficient Approximate Arithmetic Logic Unit for Ultra-Low Power IoT Processors',
        authors: ['Priya Sharma', 'M. Sundaram'],
        publicationType: 'Journal',
        journalName: 'IEEE Transactions on Circuits and Systems I: Regular Papers',
        publisher: 'IEEE',
        publicationDate: new Date('2024-10-15'),
        volume: '71',
        issue: '10',
        pages: '4450-4462',
        doi: '10.1109/TCSI.2024.3411098',
        indexing: 'Scopus',
        status: 'Published',
        abstract: 'Presents an approximate multiplier that achieves 42% energy reduction with less than 1.2% mean error.'
      },
      {
        facultyId: facultyPriya._id,
        title: 'Hardware Accelerator for 1D-CNN Inference in Wearable Cardiac Monitoring Patches',
        authors: ['Priya Sharma', 'A. K. Bose'],
        publicationType: 'Conference',
        conferenceName: 'International Conference on VLSI Design (VLSID 2024)',
        publisher: 'IEEE',
        publicationDate: new Date('2024-01-08'),
        pages: '112-117',
        doi: '10.1109/VLSID60002.2024.00034',
        indexing: 'Web of Science',
        status: 'Published',
        abstract: 'Demonstrates real-time arrhythmia classification in a 28nm ASIC test chip drawing under 35 microwatts.'
      },
      {
        facultyId: facultyPriya._id,
        title: 'Review on Memristor-Based Neuromorphic Computing Architectures',
        authors: ['Priya Sharma'],
        publicationType: 'Journal',
        journalName: 'Journal of Semiconductor Science and Technology',
        publisher: 'IOP Publishing',
        publicationDate: new Date('2023-04-18'),
        volume: '38',
        issue: '5',
        doi: '10.1088/1361-6641/acc891',
        indexing: 'Scopus',
        status: 'Published',
        abstract: 'Systematic analysis of crossbar arrays and in-memory computing tradeoffs for deep neural inference.'
      }
    ]);

    await Achievement.insertMany([
      {
        facultyId: facultyPriya._id,
        title: 'Young Scientist Fellowship in Engineering Sciences',
        category: 'Research',
        organization: 'Council of Scientific and Industrial Research (CSIR)',
        date: new Date('2024-08-15'),
        level: 'National',
        certificateNumber: 'CSIR-YS-2024-918',
        description: 'Prestigious fellowship for young researchers under 40 making breakthrough contributions in microelectronics.'
      }
    ]);

    await Certification.insertMany([
      {
        facultyId: facultyPriya._id,
        name: 'Cadence Certified System-on-Chip Design Specialist',
        issuingOrganization: 'Cadence Design Systems',
        issueDate: new Date('2023-03-15'),
        expiryDate: new Date('2027-03-15'),
        credentialId: 'CAD-SOC-2023-11',
        credentialUrl: 'https://cadence.com/verify/demo',
        description: 'Comprehensive certification covering Genus synthesis and Innovus place-and-route flows.'
      }
    ]);

    await Conference.insertMany([
      {
        facultyId: facultyPriya._id,
        eventName: 'AICTE Sponsored Faculty Development Program on Next-Gen Semiconductor Fabrication',
        eventType: 'FDP',
        organizer: 'AICTE-ATAL Academy',
        location: 'Chennai, India',
        startDate: new Date('2024-02-12'),
        endDate: new Date('2024-02-17'),
        role: 'Participant',
        description: 'Attended a 1-week intensive training on sub-7nm lithography and FinFET scaling.'
      }
    ]);

    await Project.insertMany([
      {
        facultyId: facultyPriya._id,
        title: 'Development of Ultra-Low Power Wearable ECG Sensor Chip with Embedded TinyML',
        projectType: 'Research',
        fundingOrganization: 'AICTE Research Promotion Scheme (RPS)',
        principalInvestigator: 'Dr. Priya Sharma',
        coInvestigators: [],
        startDate: new Date('2024-04-01'),
        endDate: new Date('2027-03-31'),
        fundingAmount: 1200000,
        status: 'Ongoing',
        description: 'Fabricating a low-noise analog frontend with integrated 1D-CNN classifier for continuous arrhythmia monitoring.'
      }
    ]);

    // 4. Faculty 3: Dr. Anand Verma (Mechanical)
    const userAnand = await User.create({
      name: 'Dr. Anand Verma',
      email: 'dr.anand@college.edu',
      password: facultyPassword,
      role: 'faculty',
      employeeId: 'FAC-MECH-305',
      department: 'Mechanical Engineering',
      designation: 'Assistant Professor'
    });

    const facultyAnand = await Faculty.create({
      userId: userAnand._id,
      fullName: 'Dr. Anand Verma',
      employeeId: 'FAC-MECH-305',
      email: 'dr.anand@college.edu',
      phone: '+91 94555 66778',
      dateOfBirth: new Date('1990-11-03'),
      gender: 'Male',
      department: 'Mechanical Engineering',
      designation: 'Assistant Professor',
      dateOfJoining: new Date('2021-08-10'),
      highestQualification: 'Ph.D. in Thermal & Renewable Energy Systems',
      specialization: 'Solar Thermal Systems & Phase Change Materials',
      researchInterests: ['Solar Energy', 'Heat Transfer', 'CFD Modeling', 'Thermal Energy Storage'],
      university: 'BITS Pilani',
      graduationYear: 2021,
      orcid: '0000-0001-9234-8800',
      googleScholar: 'https://scholar.google.com/citations?user=demo_anand',
      linkedin: 'https://linkedin.com/in/demo-anand-verma',
      biography: 'Dr. Anand Verma researches high-density thermal storage materials for solar parabolic collectors and building cooling solutions.'
    });

    await Publication.insertMany([
      {
        facultyId: facultyAnand._id,
        title: 'Experimental Investigation of Nano-Enhanced Phase Change Materials for Solar Water Heaters',
        authors: ['Anand Verma', 'V. K. Rao'],
        publicationType: 'Journal',
        journalName: 'Solar Energy (Elsevier)',
        publisher: 'Elsevier',
        publicationDate: new Date('2024-05-12'),
        volume: '272',
        pages: '112-124',
        doi: '10.1016/j.solener.2024.112450',
        indexing: 'Scopus',
        status: 'Published',
        abstract: 'Dispersed Al2O3 nanoparticles inside paraffin wax, improving thermal conductivity by 38% and discharge rate by 24%.'
      },
      {
        facultyId: facultyAnand._id,
        title: 'CFD Analysis of Turbulent Heat Transfer in Corrugated Tubes with Helical Inserts',
        authors: ['Anand Verma', 'S. Chawla'],
        publicationType: 'Conference',
        conferenceName: 'International Conference on Advances in Mechanical Engineering (ICAME 2023)',
        publisher: 'AIP Publishing',
        publicationDate: new Date('2023-11-25'),
        pages: '020045',
        doi: '10.1063/5.0182910',
        indexing: 'Google Scholar',
        status: 'Published',
        abstract: '3D ANSYS Fluent simulations evaluating Nusselt number enhancements and friction factor penalties.'
      }
    ]);

    await Achievement.insertMany([
      {
        facultyId: facultyAnand._id,
        title: 'Best Technical Paper Award in Renewable Energy',
        category: 'Academic',
        organization: 'World Renewable Energy Congress',
        date: new Date('2023-12-05'),
        level: 'National',
        certificateNumber: 'WREC-BPA-2023-019',
        description: 'Awarded for paper on nano-phase thermal composites at the annual national summit.'
      }
    ]);

    await Certification.insertMany([
      {
        facultyId: facultyAnand._id,
        name: 'ANSYS Fluent Certified Thermal Simulation Professional',
        issuingOrganization: 'ANSYS Inc.',
        issueDate: new Date('2022-09-10'),
        credentialId: 'ANS-FLU-2022-401',
        description: 'Demonstrated mastery in multiphase flow, conjugate heat transfer, and solar radiation modeling.'
      }
    ]);

    await Conference.insertMany([
      {
        facultyId: facultyAnand._id,
        eventName: 'Global Summit on Clean Energy Technologies',
        eventType: 'Conference',
        organizer: 'Clean Energy Foundation',
        location: 'New Delhi, India',
        startDate: new Date('2024-06-18'),
        endDate: new Date('2024-06-20'),
        role: 'Presenter',
        description: 'Presented findings on decentralized thermal storage for rural agriculture drying.'
      }
    ]);

    await Project.insertMany([
      {
        facultyId: facultyAnand._id,
        title: 'Development of Low-Cost Solar Thermal Dryer for Agricultural Crops',
        projectType: 'Institutional',
        fundingOrganization: 'College Internal Research Seed Fund',
        principalInvestigator: 'Dr. Anand Verma',
        coInvestigators: [],
        startDate: new Date('2023-08-01'),
        endDate: new Date('2024-07-31'),
        fundingAmount: 350000,
        status: 'Completed',
        description: 'Constructed working prototype reducing fruit moisture content by 60% within 14 hours.'
      }
    ]);

    console.log('[Seed] Database seeded successfully!');
    console.log('[Seed] Credentials summary:');
    console.log('   Admin: admin@college.edu / Admin@123');
    console.log('   Faculty 1 (CSE): dr.rajesh@college.edu / Faculty@123');
    console.log('   Faculty 2 (ECE): dr.priya@college.edu / Faculty@123');
    console.log('   Faculty 3 (MECH): dr.anand@college.edu / Faculty@123');

    process.exit(0);
  } catch (err) {
    console.error('[Seed Error] Failed to seed database:', err);
    process.exit(1);
  }
};

seedData();
