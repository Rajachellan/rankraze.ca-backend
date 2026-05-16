/**
 * Single source of truth for admin RBAC (Rankraze backend only).
 */
const ADMIN_PERMISSIONS = [
  { id: "blogs", label: "Blogs" },
  { id: "jobs", label: "Jobs (postings)" },
  { id: "job_applications", label: "Job applications" },
  { id: "leads", label: "Leads / contact & analytics" },
  { id: "case_studies", label: "Case studies" },
  { id: "csr_activities", label: "CSR activities" },
  { id: "careers", label: "Careers" },
  { id: "internship", label: "Internship" },
  { id: "portfolio", label: "Portfolio" },
];

const PERMISSION_IDS = ADMIN_PERMISSIONS.map((p) => p.id);

module.exports = {
  ADMIN_PERMISSIONS,
  PERMISSION_IDS,
};
