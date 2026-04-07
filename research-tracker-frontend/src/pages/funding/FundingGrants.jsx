import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../../components/LoadingSpinner";
import StatusBadge from "../../components/StatusBadge";
import { getAllGrants } from "../../services/grantService";

const FundingGrants = () => {
  useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [grants, setGrants] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await getAllGrants();
        setGrants(res.data || res);
      } catch {
        setError("Failed to load grants.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <LoadingSpinner message="Loading funding grants..." />;
  return (
    <div className="container py-4">
      <h3 className="mb-3">Funding Grants</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="card"><div className="card-body table-responsive"><table className="table">
        <thead><tr><th>Title</th><th>Researcher</th><th>Requested</th><th>Approved</th><th>Used</th><th>Remaining</th><th>Status</th></tr></thead>
        <tbody>{grants.map((g) => {
          const used = Number(g.amount_used || 0);
          const approved = Number(g.amount_approved || 0);
          const remaining = approved - used;
          const percent = approved > 0 ? Math.round((used / approved) * 100) : 0;
          return <tr key={g.id}><td>{g.title}</td><td>{g.applicant_name || g.applicant_id}</td><td>{approved ? g.amount_requested : g.amount_requested}</td><td>{approved}</td><td>{used} ({Math.min(percent, 100)}%)</td><td>{remaining}</td><td><StatusBadge status={g.status} /></td></tr>;
        })}</tbody>
      </table></div></div>
    </div>
  );
};

export default FundingGrants;
