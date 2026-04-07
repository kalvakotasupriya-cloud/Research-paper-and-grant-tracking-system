import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../../components/LoadingSpinner";
import StatusBadge from "../../components/StatusBadge";
import ToastNotification from "../../components/ToastNotification";
import { generateReport, getAllReports, submitReport } from "../../services/reportService";
import { getMyGrants } from "../../services/grantService";

const Reports = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [grants, setGrants] = useState([]);
  const [reports, setReports] = useState([]);
  const [form, setForm] = useState({ grant_id: "", report_text: "" });
  const [errors, setErrors] = useState({});
  const [generated, setGenerated] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      const [grantRes, reportRes] = await Promise.all([getMyGrants(), getAllReports()]);
      setGrants((grantRes.data || grantRes).filter((g) => g.status === "approved"));
      setReports((reportRes.data || reportRes).filter((r) => r.researcher_id === user?.id));
    } catch {
      setError("Failed to load reports data.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, [user?.id]);

  const validate = () => {
    const next = {};
    if (!form.grant_id) next.grant_id = "Select a grant.";
    if (form.report_text.trim().length < 50) next.report_text = "Report text must be at least 50 chars.";
    return next;
  };

  const submit = async (e) => {
    e.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    try {
      await submitReport(form);
      setToast("Report submitted.");
      setForm({ grant_id: "", report_text: "" });
      load();
    } catch {
      setToast("Failed to submit report.");
    }
  };

  const onGenerate = async (grantId) => {
    try {
      const res = await generateReport(grantId);
      setGenerated(res.data || res);
    } catch {
      setToast("Failed to generate summary report.");
    }
  };

  if (loading) return <LoadingSpinner message="Loading reports..." />;
  return (
    <div className="container py-4">
      <h3 className="mb-3">Progress Reports</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="card mb-4"><div className="card-body">
        <h5>Submit Progress Report</h5>
        <form className="row g-3" onSubmit={submit}>
          <div className="col-md-4">
            <select className={`form-select ${errors.grant_id ? "is-invalid" : ""}`} value={form.grant_id} onBlur={() => setErrors(validate())} onChange={(e) => setForm({ ...form, grant_id: e.target.value })}>
              <option value="">Select Grant</option>
              {grants.map((g) => <option key={g.id} value={g.id}>{g.title}</option>)}
            </select>{errors.grant_id && <div className="invalid-feedback">{errors.grant_id}</div>}
          </div>
          <div className="col-md-8"><textarea rows="4" className={`form-control ${errors.report_text ? "is-invalid" : ""}`} value={form.report_text} onBlur={() => setErrors(validate())} onChange={(e) => setForm({ ...form, report_text: e.target.value })} />{errors.report_text && <div className="invalid-feedback">{errors.report_text}</div>}</div>
          <div className="col-12"><button className="btn btn-primary">Submit Report</button></div>
        </form>
      </div></div>

      <div className="card"><div className="card-body table-responsive">
        <table className="table">
          <thead><tr><th>Grant Title</th><th>Submitted At</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {reports.map((r) => (
              <tr key={r.id}>
                <td>{r.grant_title || r.grant_id}</td><td>{new Date(r.submitted_at).toLocaleString()}</td><td><StatusBadge status={r.status} /></td>
                <td><button className="btn btn-sm btn-outline-primary" onClick={() => onGenerate(r.grant_id)}>View Generated Report</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div></div>

      {generated && (
        <div className="modal d-block">
          <div className="modal-dialog modal-lg"><div className="modal-content">
            <div className="modal-header"><h5 className="modal-title">Generated Report</h5><button className="btn-close" onClick={() => setGenerated(null)} /></div>
            <div className="modal-body">
              <p><strong>Summary:</strong> {generated.summary || generated.combined_highlights}</p>
              <p><strong>Total utilized amount:</strong> {generated.total_utilized || "-"}</p>
              <h6>Reports</h6>
              <ul>{(generated.reports || []).map((r, idx) => <li key={idx}>{r.report_text || JSON.stringify(r)}</li>)}</ul>
            </div>
          </div></div>
        </div>
      )}
      <ToastNotification message={toast} type={toast.includes("Failed") ? "error" : "success"} onClose={() => setToast("")} />
    </div>
  );
};

export default Reports;
