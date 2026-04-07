import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../../components/LoadingSpinner";
import StatusBadge from "../../components/StatusBadge";
import { getPaper } from "../../services/paperService";
import { getReviewsByPaper } from "../../services/reviewService";

const PaperDetail = () => {
  useAuth();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paper, setPaper] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [paperRes, reviewRes] = await Promise.all([getPaper(id), getReviewsByPaper(id)]);
        setPaper(paperRes.data || paperRes);
        setReviews(reviewRes.data || reviewRes);
      } catch {
        setError("Failed to load paper details.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <LoadingSpinner message="Loading paper..." />;
  if (error) return <div className="container py-4"><div className="alert alert-danger">{error}</div></div>;

  const statusOrder = ["draft", "submitted", "under_review", "approved", "published"];
  const currentIndex = statusOrder.indexOf(paper.status);

  return (
    <div className="container py-4">
      <Link className="btn btn-outline-secondary mb-3" to="/papers">Back</Link>
      <div className="card mb-4"><div className="card-body">
        <h4>{paper.title}</h4>
        <p className="text-muted">{paper.abstract}</p>
        <p><strong>Journal:</strong> {paper.journal_name}</p>
        <p><strong>Status:</strong> <StatusBadge status={paper.status} /></p>
      </div></div>
      <div className="card mb-4"><div className="card-body">
        <h5>Status Timeline</h5>
        <ul className="list-group">
          {statusOrder.map((s, idx) => (
            <li key={s} className={`list-group-item ${idx <= currentIndex ? "list-group-item-success" : ""}`}>{s}</li>
          ))}
        </ul>
      </div></div>
      <div className="card"><div className="card-body">
        <h5>Reviews</h5>
        {reviews.map((r) => (
          <div className="border rounded p-3 mb-2" key={r.id}>
            <div className="d-flex justify-content-between"><strong>{r.reviewer_name || `Reviewer #${r.reviewer_id}`}</strong><StatusBadge status={r.status} /></div>
            <p className="mb-1">{r.comments}</p>
            <small className="text-muted">{new Date(r.reviewed_at).toLocaleString()}</small>
          </div>
        ))}
      </div></div>
    </div>
  );
};

export default PaperDetail;
