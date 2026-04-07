import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../../components/LoadingSpinner";
import StatusBadge from "../../components/StatusBadge";
import ToastNotification from "../../components/ToastNotification";
import { getMyPapers, submitPaper } from "../../services/paperService";

const Papers = () => {
  useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [papers, setPapers] = useState([]);
  const [open, setOpen] = useState(true);
  const [form, setForm] = useState({ title: "", abstract: "", journal_name: "", file: null });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const next = {};
    if (form.title.trim().length < 5) next.title = "Title must be at least 5 characters.";
    if (form.abstract.trim().length < 20) next.abstract = "Abstract must be at least 20 characters.";
    if (!form.journal_name.trim()) next.journal_name = "Journal name is required.";
    if (form.file && form.file.type !== "application/pdf") next.file = "Only PDF file allowed.";
    return next;
  };

  const load = async () => {
    try {
      setLoading(true);
      const res = await getMyPapers();
      setPapers(res.data || res);
    } catch {
      setError("Failed to fetch papers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    const data = new FormData();
    data.append("title", form.title);
    data.append("abstract", form.abstract);
    data.append("journal_name", form.journal_name);
    if (form.file) data.append("file", form.file);
    try {
      await submitPaper(data);
      setToast("Paper submitted successfully.");
      setForm({ title: "", abstract: "", journal_name: "", file: null });
      load();
    } catch {
      setToast("Paper submission failed.");
    }
  };

  if (loading) return <LoadingSpinner message="Loading papers..." />;
  return (
    <div className="container py-4">
      <h3 className="mb-3">My Papers</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="card mb-4">
        <div className="card-header d-flex justify-content-between">
          <strong>Submit New Paper</strong>
          <button className="btn btn-sm btn-outline-secondary" onClick={() => setOpen((p) => !p)}>{open ? "Hide" : "Show"}</button>
        </div>
        {open && (
          <div className="card-body">
            <form className="row g-3" onSubmit={handleSubmit}>
              <div className="col-md-6"><label className="form-label">Title</label><input className={`form-control ${errors.title ? "is-invalid" : ""}`} value={form.title} onBlur={() => setErrors(validate())} onChange={(e) => setForm({ ...form, title: e.target.value })} />{errors.title && <div className="invalid-feedback">{errors.title}</div>}</div>
              <div className="col-md-6"><label className="form-label">Journal Name</label><input className={`form-control ${errors.journal_name ? "is-invalid" : ""}`} value={form.journal_name} onBlur={() => setErrors(validate())} onChange={(e) => setForm({ ...form, journal_name: e.target.value })} />{errors.journal_name && <div className="invalid-feedback">{errors.journal_name}</div>}</div>
              <div className="col-12"><label className="form-label">Abstract</label><textarea rows="4" className={`form-control ${errors.abstract ? "is-invalid" : ""}`} value={form.abstract} onBlur={() => setErrors(validate())} onChange={(e) => setForm({ ...form, abstract: e.target.value })} />{errors.abstract && <div className="invalid-feedback">{errors.abstract}</div>}</div>
              <div className="col-md-6"><label className="form-label">Upload File (PDF)</label><input type="file" accept=".pdf" className={`form-control ${errors.file ? "is-invalid" : ""}`} onChange={(e) => setForm({ ...form, file: e.target.files[0] })} />{errors.file && <div className="invalid-feedback">{errors.file}</div>}</div>
              <div className="col-12"><button className="btn btn-primary">Submit Paper</button></div>
            </form>
          </div>
        )}
      </div>
      <div className="card">
        <div className="card-body table-responsive">
          <table className="table">
            <thead><tr><th>Title</th><th>Journal</th><th>Status</th><th>Submitted On</th><th>Actions</th></tr></thead>
            <tbody>
              {papers.map((p) => (
                <tr key={p.id}>
                  <td>{p.title}</td><td>{p.journal_name}</td><td><StatusBadge status={p.status} /></td>
                  <td>{new Date(p.submission_date).toLocaleDateString()}</td>
                  <td><Link className="btn btn-sm btn-outline-primary" to={`/papers/${p.id}`}>View</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ToastNotification message={toast} type={toast.includes("failed") ? "error" : "success"} onClose={() => setToast("")} />
    </div>
  );
};

export default Papers;
