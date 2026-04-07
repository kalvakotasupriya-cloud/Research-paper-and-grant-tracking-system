import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../../components/LoadingSpinner";
import ToastNotification from "../../components/ToastNotification";
import { getAllPapers } from "../../services/paperService";
import { submitReview } from "../../services/reviewService";

const ReviewPapers = () => {
  useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [papers, setPapers] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [form, setForm] = useState({ comments: "", status: "approved" });

  const load = async () => {
    try {
      setLoading(true);
      const res = await getAllPapers();
      setPapers((res.data || res).filter((p) => p.status === "under_review"));
    } catch {
      setError("Failed to load papers.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const submit = async (paperId) => {
    try {
      await submitReview({ paper_id: paperId, comments: form.comments, status: form.status });
      setToast("Review submitted.");
      setOpenId(null);
      setForm({ comments: "", status: "approved" });
      load();
    } catch {
      setToast("Failed to submit review.");
    }
  };

  if (loading) return <LoadingSpinner message="Loading review queue..." />;
  return (
    <div className="container py-4">
      <h3 className="mb-3">Review Papers</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="card"><div className="card-body table-responsive"><table className="table">
        <thead><tr><th>Title</th><th>Author</th><th>Journal</th><th>Submitted On</th><th>Actions</th></tr></thead>
        <tbody>{papers.map((p) => (
          <>
            <tr key={`row-${p.id}`}><td>{p.title}</td><td>{p.author_name || p.author_id}</td><td>{p.journal_name}</td><td>{new Date(p.submission_date).toLocaleDateString()}</td><td><button className="btn btn-sm btn-primary" onClick={() => setOpenId(openId === p.id ? null : p.id)}>Review</button></td></tr>
            {openId === p.id && <tr key={`form-${p.id}`}><td colSpan="5"><div className="row g-2"><div className="col-md-8"><textarea className="form-control" rows="3" placeholder="Comments" value={form.comments} onChange={(e) => setForm({ ...form, comments: e.target.value })} /></div><div className="col-md-2"><select className="form-select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option value="approved">approved</option><option value="rejected">rejected</option></select></div><div className="col-md-2"><button className="btn btn-success w-100" onClick={() => submit(p.id)}>Submit</button></div></div></td></tr>}
          </>
        ))}</tbody>
      </table></div></div>
      <ToastNotification message={toast} type={toast.includes("Failed") ? "error" : "success"} onClose={() => setToast("")} />
    </div>
  );
};

export default ReviewPapers;
