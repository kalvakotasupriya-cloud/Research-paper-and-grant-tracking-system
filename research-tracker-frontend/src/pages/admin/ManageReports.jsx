import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../../components/LoadingSpinner";
import StatusBadge from "../../components/StatusBadge";
import { getAllReports } from "../../services/reportService";

const ManageReports = () => {
  useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reports, setReports] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await getAllReports();
        setReports(res.data || res);
      } catch {
        setError("Failed to fetch reports.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = useMemo(() => reports.filter((r) => !statusFilter || r.status === statusFilter), [reports, statusFilter]);
  if (loading) return <LoadingSpinner message="Loading reports..." />;
  return (
    <div className="container py-4">
      <h3 className="mb-3">Manage Reports</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="mb-3"><select className="form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}><option value="">All status</option>{["submitted","reviewed","needs_update"].map((s) => <option key={s}>{s}</option>)}</select></div>
      <div className="card"><div className="card-body table-responsive"><table className="table">
        <thead><tr><th>Grant Title</th><th>Researcher</th><th>Submitted At</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>{filtered.map((r) => <tr key={r.id}><td>{r.grant_title || r.grant_id}</td><td>{r.researcher_name || r.researcher_id}</td><td>{new Date(r.submitted_at).toLocaleString()}</td><td><StatusBadge status={r.status} /></td><td><button className="btn btn-sm btn-outline-primary" onClick={() => setSelected(r)}>View</button></td></tr>)}</tbody>
      </table></div></div>
      {selected && <div className="modal d-block"><div className="modal-dialog"><div className="modal-content"><div className="modal-header"><h5>Report Detail</h5><button className="btn-close" onClick={() => setSelected(null)} /></div><div className="modal-body"><p>{selected.report_text}</p></div></div></div></div>}
    </div>
  );
};

export default ManageReports;
