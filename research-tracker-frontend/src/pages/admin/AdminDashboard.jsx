import { useEffect, useMemo, useState } from "react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import {
  ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LineElement, LinearScale, PointElement, Tooltip
} from "chart.js";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../../components/LoadingSpinner";
import { getAllPapers } from "../../services/paperService";
import { getAllGrants } from "../../services/grantService";
import { getAllReports } from "../../services/reportService";

ChartJS.register(ArcElement, BarElement, LineElement, CategoryScale, LinearScale, PointElement, Legend, Tooltip);

const AdminDashboard = () => {
  useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [papers, setPapers] = useState([]);
  const [grants, setGrants] = useState([]);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [p, g, r] = await Promise.all([getAllPapers(), getAllGrants(), getAllReports()]);
        setPapers(p.data || p);
        setGrants(g.data || g);
        setReports(r.data || r);
      } catch {
        setError("Failed to load admin dashboard.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const summary = useMemo(() => ({
    totalPapers: papers.length,
    pendingReview: papers.filter((p) => p.status === "under_review").length,
    totalGrants: grants.length,
    approvedGrants: grants.filter((g) => g.status === "approved").length,
    totalReports: reports.length,
    pendingReports: reports.filter((r) => r.status !== "reviewed").length
  }), [papers, grants, reports]);

  const months = [...Array(6)].map((_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    return d.toLocaleString("default", { month: "short" });
  });
  const byMonth = (items, field) =>
    months.map((m) => items.filter((x) => new Date(x[field]).toLocaleString("default", { month: "short" }) === m).length);

  if (loading) return <LoadingSpinner message="Loading admin dashboard..." />;

  return (
    <div className="container py-4">
      <h3 className="mb-3">Admin Dashboard</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row g-3 mb-4">
        {[
          ["Total Papers", summary.totalPapers], ["Pending Review", summary.pendingReview], ["Total Grants", summary.totalGrants],
          ["Approved Grants", summary.approvedGrants], ["Total Reports", summary.totalReports], ["Pending Reports", summary.pendingReports]
        ].map(([k, v]) => <div className="col-sm-6 col-md-4" key={k}><div className="card"><div className="card-body"><h6>{k}</h6><h3>{v}</h3></div></div></div>)}
      </div>
      <div className="row g-3">
        <div className="col-lg-4"><div className="card"><div className="card-body"><h6>Paper Status Distribution</h6>
          <Doughnut data={{ labels: ["draft","submitted","under_review","approved","rejected","published"], datasets: [{ data: ["draft","submitted","under_review","approved","rejected","published"].map((s) => papers.filter((p) => p.status === s).length), backgroundColor: ["#6c757d","#0d6efd","#ffc107","#198754","#dc3545","#0dcaf0"] }] }} />
        </div></div></div>
        <div className="col-lg-4"><div className="card"><div className="card-body"><h6>Grant Funding Overview</h6>
          <Bar data={{ labels: grants.map((g) => g.title.slice(0, 15)), datasets: [{ label: "Requested", data: grants.map((g) => Number(g.amount_requested)), backgroundColor: "#0d6efd" }, { label: "Approved", data: grants.map((g) => Number(g.amount_approved || 0)), backgroundColor: "#198754" }] }} />
        </div></div></div>
        <div className="col-lg-4"><div className="card"><div className="card-body"><h6>Monthly Submission Trend</h6>
          <Line data={{ labels: months, datasets: [{ label: "Papers", data: byMonth(papers, "submission_date"), borderColor: "#0d6efd" }, { label: "Grants", data: byMonth(grants, "created_at"), borderColor: "#198754" }] }} />
        </div></div></div>
      </div>
    </div>
  );
};

export default AdminDashboard;
