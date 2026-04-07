import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../../components/LoadingSpinner";
import StatusBadge from "../../components/StatusBadge";
import ToastNotification from "../../components/ToastNotification";
import { applyGrant, getMyGrants } from "../../services/grantService";

const Grants = () => {
  useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [open, setOpen] = useState(true);
  const [grants, setGrants] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", amount_requested: "", deadline: "" });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const next = {};
    if (!form.title.trim()) next.title = "Title is required.";
    if (form.description.trim().length < 30) next.description = "Description must be at least 30 chars.";
    if (Number(form.amount_requested) < 1000) next.amount_requested = "Minimum amount is 1000.";
    if (!form.deadline || new Date(form.deadline) <= new Date()) next.deadline = "Deadline must be future date.";
    return next;
  };

  const load = async () => {
    try {
      setLoading(true);
      const res = await getMyGrants();
      setGrants(res.data || res);
    } catch {
      setError("Failed to fetch grants.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    try {
      await applyGrant(form);
      setToast("Grant application submitted.");
      setForm({ title: "", description: "", amount_requested: "", deadline: "" });
      load();
    } catch {
      setToast("Failed to submit grant.");
    }
  };

  if (loading) return <LoadingSpinner message="Loading grants..." />;
  return (
    <div className="container py-4">
      <h3 className="mb-3">My Grants</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="card mb-4">
        <div className="card-header d-flex justify-content-between"><strong>Apply for Grant</strong><button className="btn btn-sm btn-outline-secondary" onClick={() => setOpen((o) => !o)}>{open ? "Hide" : "Show"}</button></div>
        {open && <div className="card-body"><form className="row g-3" onSubmit={submit}>
          <div className="col-md-6"><label className="form-label">Title</label><input className={`form-control ${errors.title ? "is-invalid" : ""}`} value={form.title} onBlur={() => setErrors(validate())} onChange={(e) => setForm({ ...form, title: e.target.value })} />{errors.title && <div className="invalid-feedback">{errors.title}</div>}</div>
          <div className="col-md-6"><label className="form-label">Amount Requested</label><input type="number" className={`form-control ${errors.amount_requested ? "is-invalid" : ""}`} value={form.amount_requested} onBlur={() => setErrors(validate())} onChange={(e) => setForm({ ...form, amount_requested: e.target.value })} />{errors.amount_requested && <div className="invalid-feedback">{errors.amount_requested}</div>}</div>
          <div className="col-12"><label className="form-label">Description</label><textarea rows="3" className={`form-control ${errors.description ? "is-invalid" : ""}`} value={form.description} onBlur={() => setErrors(validate())} onChange={(e) => setForm({ ...form, description: e.target.value })} />{errors.description && <div className="invalid-feedback">{errors.description}</div>}</div>
          <div className="col-md-6"><label className="form-label">Deadline</label><input type="date" className={`form-control ${errors.deadline ? "is-invalid" : ""}`} value={form.deadline} onBlur={() => setErrors(validate())} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />{errors.deadline && <div className="invalid-feedback">{errors.deadline}</div>}</div>
          <div className="col-12"><button className="btn btn-primary">Apply</button></div>
        </form></div>}
      </div>
      <div className="card"><div className="card-body table-responsive"><table className="table">
        <thead><tr><th>Title</th><th>Amount Requested</th><th>Amount Approved</th><th>Status</th><th>Deadline</th><th>Actions</th></tr></thead>
        <tbody>{grants.map((g) => <tr key={g.id}><td>{g.title}</td><td>{g.amount_requested}</td><td>{g.amount_approved}</td><td><StatusBadge status={g.status} /></td><td>{new Date(g.deadline).toLocaleDateString()}</td><td><Link className="btn btn-sm btn-outline-primary" to={`/grants/${g.id}`}>View</Link></td></tr>)}</tbody>
      </table></div></div>
      <ToastNotification message={toast} type={toast.includes("Failed") ? "error" : "success"} onClose={() => setToast("")} />
    </div>
  );
};

export default Grants;
