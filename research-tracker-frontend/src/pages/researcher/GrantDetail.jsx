import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../../components/LoadingSpinner";
import StatusBadge from "../../components/StatusBadge";
import ToastNotification from "../../components/ToastNotification";
import { getGrant, recordUtilization } from "../../services/grantService";
import api from "../../services/api";

const GrantDetail = () => {
  useAuth();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [grant, setGrant] = useState(null);
  const [history, setHistory] = useState([]);
  const [form, setForm] = useState({ amount_used: "", description: "", date_recorded: "" });

  const load = async () => {
    try {
      setLoading(true);
      const [grantRes, utilRes] = await Promise.all([
        getGrant(id),
        api.get(`/api/reports/grant/${id}`).catch(() => ({ data: [] }))
      ]);
      setGrant(grantRes.data || grantRes);
      setHistory(utilRes.data?.data || utilRes.data || []);
    } catch {
      setError("Failed to load grant details.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, [id]);

  const used = useMemo(() => history.reduce((sum, h) => sum + Number(h.amount_used || 0), 0), [history]);
  const progress = grant?.amount_approved ? Math.min((used / Number(grant.amount_approved)) * 100, 100) : 0;

  const submitUtilization = async (e) => {
    e.preventDefault();
    try {
      await recordUtilization(id, form);
      setToast("Utilization recorded.");
      setForm({ amount_used: "", description: "", date_recorded: "" });
      load();
    } catch {
      setToast("Failed to record utilization.");
    }
  };

  if (loading) return <LoadingSpinner message="Loading grant..." />;
  if (error) return <div className="container py-4"><div className="alert alert-danger">{error}</div></div>;

  return (
    <div className="container py-4">
      <Link className="btn btn-outline-secondary mb-3" to="/grants">Back</Link>
      <div className="card mb-4"><div className="card-body">
        <h4>{grant.title}</h4>
        <p>{grant.description}</p>
        <p><strong>Status:</strong> <StatusBadge status={grant.status} /></p>
      </div></div>
      {grant.status === "approved" && (
        <div className="card">
          <div className="card-body">
            <h5>Fund Utilization</h5>
            <form className="row g-3 mb-3" onSubmit={submitUtilization}>
              <div className="col-md-3"><input type="number" className="form-control" placeholder="Amount Used" value={form.amount_used} onChange={(e) => setForm({ ...form, amount_used: e.target.value })} /></div>
              <div className="col-md-5"><input className="form-control" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
              <div className="col-md-2"><input type="date" className="form-control" value={form.date_recorded} onChange={(e) => setForm({ ...form, date_recorded: e.target.value })} /></div>
              <div className="col-md-2"><button className="btn btn-primary w-100">Save</button></div>
            </form>
            <div className="alert alert-info">Utilization progress: {progress.toFixed(1)}%</div>
            <div className="table-responsive"><table className="table"><thead><tr><th>Amount Used</th><th>Description</th><th>Date</th></tr></thead><tbody>
              {history.map((h) => <tr key={h.id}><td>{h.amount_used}</td><td>{h.description}</td><td>{h.date_recorded ? new Date(h.date_recorded).toLocaleDateString() : "-"}</td></tr>)}
            </tbody></table></div>
          </div>
        </div>
      )}
      <ToastNotification message={toast} type={toast.includes("Failed") ? "error" : "success"} onClose={() => setToast("")} />
    </div>
  );
};

export default GrantDetail;
