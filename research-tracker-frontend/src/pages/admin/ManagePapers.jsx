import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import ConfirmModal from "../../components/ConfirmModal";
import LoadingSpinner from "../../components/LoadingSpinner";
import StatusBadge from "../../components/StatusBadge";
import ToastNotification from "../../components/ToastNotification";
import { getAllPapers, updateStatus } from "../../services/paperService";

const ManagePapers = () => {
  useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [papers, setPapers] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [confirm, setConfirm] = useState({ show: false, id: null, status: "" });

  const load = async () => {
    try {
      setLoading(true);
      const res = await getAllPapers();
      setPapers(res.data || res);
    } catch {
      setError("Failed to load papers.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => papers.filter((p) => (!statusFilter || p.status === statusFilter) && p.title.toLowerCase().includes(search.toLowerCase())), [papers, statusFilter, search]);
  const commitChange = async () => {
    try {
      await updateStatus(confirm.id, confirm.status);
      setToast("Paper status updated.");
      setConfirm({ show: false, id: null, status: "" });
      load();
    } catch {
      setToast("Failed to update paper status.");
    }
  };
  if (loading) return <LoadingSpinner message="Loading papers..." />;
  return (
    <div className="container py-4">
      <h3 className="mb-3">Manage Papers</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row g-2 mb-3">
        <div className="col-md-4"><select className="form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}><option value="">All status</option>{["draft","submitted","under_review","approved","rejected","published"].map((s) => <option key={s}>{s}</option>)}</select></div>
        <div className="col-md-8"><input className="form-control" placeholder="Search title" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
      </div>
      <div className="card"><div className="card-body table-responsive"><table className="table">
        <thead><tr><th>Title</th><th>Author</th><th>Journal</th><th>Status</th><th>Submitted On</th><th>Actions</th></tr></thead>
        <tbody>{filtered.map((p) => <tr key={p.id}><td>{p.title}</td><td>{p.author_name || p.author_id}</td><td>{p.journal_name}</td><td><StatusBadge status={p.status} /></td><td>{new Date(p.submission_date).toLocaleDateString()}</td><td>
          <select className="form-select form-select-sm" defaultValue="" onChange={(e) => e.target.value && setConfirm({ show: true, id: p.id, status: e.target.value })}>
            <option value="">Change status</option>{["under_review","approved","rejected","published"].map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </td></tr>)}</tbody>
      </table></div></div>
      <ConfirmModal show={confirm.show} title="Confirm Status Change" message={`Change paper status to "${confirm.status}"?`} onConfirm={commitChange} onCancel={() => setConfirm({ show: false, id: null, status: "" })} />
      <ToastNotification message={toast} type={toast.includes("Failed") ? "error" : "success"} onClose={() => setToast("")} />
    </div>
  );
};

export default ManagePapers;
