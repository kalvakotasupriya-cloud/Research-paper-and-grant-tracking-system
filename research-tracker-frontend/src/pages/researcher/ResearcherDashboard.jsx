import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Bar, Doughnut } from "react-chartjs-2";
import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Tooltip } from "chart.js";
import { useAuth } from "../../context/AuthContext";
import { getMyPapers } from "../../services/paperService";
import { getMyGrants } from "../../services/grantService";
import { getAllReports } from "../../services/reportService";
import LoadingSpinner from "../../components/LoadingSpinner";
import StatusBadge from "../../components/StatusBadge";

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Legend, Tooltip);

const ResearcherDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [papers, setPapers] = useState([]);
  const [grants, setGrants] = useState([]);
  const [pendingReports, setPendingReports] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [paperRes, grantRes, reportRes] = await Promise.all([getMyPapers(), getMyGrants(), getAllReports()]);
        const myPapers = paperRes.data || paperRes;
        const myGrants = grantRes.data || grantRes;
        const reports = reportRes.data || reportRes;
        setPapers(myPapers);
        setGrants(myGrants);
        setPendingReports(reports.filter((r) => r.researcher_id === user?.id && r.status !== "reviewed").length);
      } catch (e) {
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user?.id]);

  const paperStatus = ["draft", "submitted", "under_review", "approved", "rejected", "published"];
  const paperCounts = paperStatus.map((status) => papers.filter((p) => p.status === status).length);

  const summary = useMemo(
    () => ({
      totalPapers: papers.length,
      papersApproved: papers.filter((p) => p.status === "approved").length,
      grantsApplied: grants.length,
      grantsApproved: grants.filter((g) => g.status === "approved").length
    }),
    [papers, grants]
  );

  if (loading) return <LoadingSpinner message="Loading dashboard..." />;

  return (
    <div className="container py-4">
      <h3 className="mb-3">Researcher Dashboard</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row g-3 mb-4">
        {[
          ["Total Papers Submitted", summary.totalPapers],
          ["Papers Approved", summary.papersApproved],
          ["Grants Applied", summary.grantsApplied],
          ["Grants Approved", summary.grantsApproved]
        ].map(([label, value]) => (
          <div className="col-sm-6 col-md-3" key={label}>
            <div className="card shadow-sm h-100"><div className="card-body"><h6>{label}</h6><h3>{value}</h3></div></div>
          </div>
        ))}
      </div>
      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <div className="card shadow-sm"><div className="card-body"><h6>My Paper Status Breakdown</h6>
            <Doughnut data={{ labels: paperStatus, datasets: [{ data: paperCounts, backgroundColor: ["#6c757d","#0d6efd","#ffc107","#198754","#dc3545","#0dcaf0"] }] }} />
          </div></div>
        </div>
        <div className="col-md-6">
          <div className="card shadow-sm"><div className="card-body"><h6>My Grant Amounts</h6>
            <Bar data={{
              labels: grants.map((g) => g.title),
              datasets: [
                { label: "Requested", data: grants.map((g) => Number(g.amount_requested)), backgroundColor: "#0d6efd" },
                { label: "Approved", data: grants.map((g) => Number(g.amount_approved || 0)), backgroundColor: "#198754" }
              ]
            }} />
          </div></div>
        </div>
      </div>
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-between"><h6>Recent Activity (Last 5 Papers)</h6><span className="text-muted">Pending reports: {pendingReports}</span></div>
          <div className="table-responsive">
            <table className="table mt-3">
              <thead><tr><th>Title</th><th>Status</th><th>Submitted On</th><th>Action</th></tr></thead>
              <tbody>
                {papers.slice(0, 5).map((p) => (
                  <tr key={p.id}>
                    <td>{p.title}</td>
                    <td><StatusBadge status={p.status} /></td>
                    <td>{new Date(p.submission_date).toLocaleDateString()}</td>
                    <td><Link className="btn btn-sm btn-outline-primary" to={`/papers/${p.id}`}>View</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResearcherDashboard;
