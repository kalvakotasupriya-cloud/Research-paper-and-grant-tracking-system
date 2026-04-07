import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import ConfirmModal from "../../components/ConfirmModal";
import LoadingSpinner from "../../components/LoadingSpinner";
import StatusBadge from "../../components/StatusBadge";
import ToastNotification from "../../components/ToastNotification";
import { getAllGrants, updateStatus } from "../../services/grantService";

const ManageGrants = () => {
  useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [grants, setGrants] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [amountApproved, setAmountApproved] = useState("");
  const [confirm, setConfirm] = useState({ show: false, id: null, action: "" });

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
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => grants.filter((g) => !statusFilter || g.status === statusFilter), [grants, statusFilter]);
  const commit = async () => {
    try {
      const payload = confirm.action === "approved" ? { status: "approved", amount_approved: Number(amountApproved || 0) } : { status: "rejected" };
      await updateStatus(confirm.id, payload);
      setToast(`Grant ${confirm.action}.`);
      setConfirm({ show: false, id: null, action: "" });
      setAmountApproved("");
      load();
    } catch {
      setToast("Failed to update grant.");
    }
  };

  if (loading) return <LoadingSpinner message="Loading grants..." />;
  return (
    <div className="container py-4">
      <h3 className="mb-3">Manage Grants</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="mb-3"><select className="form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}><option value="">All status</option>{["applied","under_review","approved","rejected","completed"].map((s) => <option key={s}>{s}</option>)}</select></div>
      <div className="card"><div className="card-body table-responsive"><table className="table">
        <thead><tr><th>Title</th><th>Applicant</th><th>Requested</th><th>Approved</th><th>Status</th><th>Deadline</th><th>Actions</th></tr></thead>
        <tbody>{filtered.map((g) => <tr key={g.id}><td>{g.title}</td><td>{g.applicant_name || g.applicant_id}</td><td>{g.amount_requested}</td><td>{g.amount_approved}</td><td><StatusBadge status={g.status} /></td><td>{new Date(g.deadline).toLocaleDateString()}</td><td className="d-flex gap-2">
          <button className="btn btn-sm btn-success" onClick={() => setConfirm({ show: true, id: g.id, action: "approved" })}>Approve</button>
          <button className="btn btn-sm btn-danger" onClick={() => setConfirm({ show: true, id: g.id, action: "rejected" })}>Reject</button>
        </td></tr>)}</tbody>
      </table></div></div>
      {confirm.show && confirm.action === "approved" && <div className="mt-3"><label className="form-label">Amount Approved</label><input type="number" className="form-control" value={amountApproved} onChange={(e) => setAmountApproved(e.target.value)} /></div>}
      <ConfirmModal show={confirm.show} title="Confirm Grant Action" message={`Are you sure you want to ${confirm.action} this grant?`} onConfirm={commit} onCancel={() => setConfirm({ show: false, id: null, action: "" })} />
      <ToastNotification message={toast} type={toast.includes("Failed") ? "error" : "success"} onClose={() => setToast("")} />
    </div>
  );
};

export default ManageGrants;
