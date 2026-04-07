import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ToastNotification from "../../components/ToastNotification";
import { submitReview } from "../../services/reviewService";

const SubmitReview = () => {
  useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [toast, setToast] = useState("");
  const [form, setForm] = useState({
    paper_id: params.get("paperId") || "",
    comments: "",
    status: "approved"
  });

  const submit = async (e) => {
    e.preventDefault();
    try {
      await submitReview({ paper_id: Number(form.paper_id), comments: form.comments, status: form.status });
      navigate("/reviewer/papers");
    } catch {
      setToast("Failed to submit review.");
    }
  };

  return (
    <div className="container py-4">
      <h3 className="mb-3">Submit Review</h3>
      <form className="card card-body" onSubmit={submit}>
        <div className="mb-3"><label className="form-label">Paper ID</label><input className="form-control" value={form.paper_id} onChange={(e) => setForm({ ...form, paper_id: e.target.value })} /></div>
        <div className="mb-3"><label className="form-label">Comments</label><textarea rows="4" className="form-control" value={form.comments} onChange={(e) => setForm({ ...form, comments: e.target.value })} /></div>
        <div className="mb-3"><label className="form-label">Status</label><select className="form-select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option value="approved">approved</option><option value="rejected">rejected</option></select></div>
        <button className="btn btn-primary">Submit</button>
      </form>
      <ToastNotification message={toast} type="error" onClose={() => setToast("")} />
    </div>
  );
};

export default SubmitReview;
