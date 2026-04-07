const badgeMap = {
  draft: "secondary",
  submitted: "primary",
  under_review: "warning",
  approved: "success",
  rejected: "danger",
  published: "info",
  applied: "primary",
  completed: "info",
  needs_revision: "warning",
  needs_update: "warning",
  reviewed: "success"
};

const StatusBadge = ({ status }) => {
  const normalized = (status || "").toLowerCase();
  const color = badgeMap[normalized] || "secondary";
  return <span className={`badge bg-${color}`}>{normalized || "unknown"}</span>;
};

export default StatusBadge;
