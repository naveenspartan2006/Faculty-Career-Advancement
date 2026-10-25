/**
 * Utility to structure and aggregate raw database documents into
 * a formalized Career Advancement & Publication Summary
 */

const formatCareerSummary = ({
  faculty,
  publications = [],
  achievements = [],
  certifications = [],
  conferences = [],
  projects = []
}) => {
  // Publication calculations
  const totalPublications = publications.length;
  const journalCount = publications.filter((p) => p.publicationType === 'Journal').length;
  const conferenceCount = publications.filter((p) => p.publicationType === 'Conference').length;
  const bookChapterCount = publications.filter((p) => p.publicationType === 'Book Chapter').length;
  const bookCount = publications.filter((p) => p.publicationType === 'Book').length;
  const patentCount = publications.filter((p) => p.publicationType === 'Patent').length;

  const scopusCount = publications.filter((p) => p.indexing === 'Scopus').length;
  const wosCount = publications.filter((p) => p.indexing === 'Web of Science').length;
  const ugcCount = publications.filter((p) => p.indexing === 'UGC').length;
  const totalIndexed = scopusCount + wosCount + ugcCount;

  // Project calculations
  const totalFunding = projects.reduce((acc, curr) => acc + (curr.fundingAmount || 0), 0);
  const ongoingProjects = projects.filter((p) => p.status === 'Ongoing').length;
  const completedProjects = projects.filter((p) => p.status === 'Completed').length;

  // Achievements breakdown
  const internationalAchievements = achievements.filter((a) => a.level === 'International').length;
  const nationalAchievements = achievements.filter((a) => a.level === 'National').length;

  return {
    generatedAt: new Date().toISOString(),
    facultyDetails: {
      fullName: faculty.fullName,
      employeeId: faculty.employeeId,
      email: faculty.email,
      phone: faculty.phone,
      department: faculty.department,
      designation: faculty.designation,
      highestQualification: faculty.highestQualification,
      specialization: faculty.specialization,
      researchInterests: faculty.researchInterests,
      university: faculty.university,
      graduationYear: faculty.graduationYear,
      dateOfJoining: faculty.dateOfJoining,
      orcid: faculty.orcid,
      googleScholar: faculty.googleScholar,
      linkedin: faculty.linkedin,
      biography: faculty.biography
    },
    metrics: {
      totalPublications,
      journalCount,
      conferenceCount,
      bookChapterCount,
      bookCount,
      patentCount,
      scopusCount,
      wosCount,
      ugcCount,
      totalIndexed,
      totalAchievements: achievements.length,
      internationalAchievements,
      nationalAchievements,
      totalCertifications: certifications.length,
      totalConferences: conferences.length,
      totalProjects: projects.length,
      totalFunding,
      ongoingProjects,
      completedProjects
    },
    publications,
    achievements,
    certifications,
    conferences,
    projects
  };
};

module.exports = { formatCareerSummary };
