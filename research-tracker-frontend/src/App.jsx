import { Navigate, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import RoleRoute from "./components/RoleRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageGrants from "./pages/admin/ManageGrants";
import ManagePapers from "./pages/admin/ManagePapers";
import ManageReports from "./pages/admin/ManageReports";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import FundingGrants from "./pages/funding/FundingGrants";
import FundingReports from "./pages/funding/FundingReports";
import Unauthorized from "./pages/Unauthorized";
import About from "./pages/public/About";
import Contact from "./pages/public/Contact";
import Landing from "./pages/public/Landing";
import GrantDetail from "./pages/researcher/GrantDetail";
import Grants from "./pages/researcher/Grants";
import PaperDetail from "./pages/researcher/PaperDetail";
import Papers from "./pages/researcher/Papers";
import Reports from "./pages/researcher/Reports";
import ResearcherDashboard from "./pages/researcher/ResearcherDashboard";
import ReviewPapers from "./pages/reviewer/ReviewPapers";
import SubmitReview from "./pages/reviewer/SubmitReview";

const App = () => {
  return (
    <>
      <Navbar />
      <main className="min-vh-100">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route path="/dashboard" element={<RoleRoute allowedRoles={["researcher"]}><ResearcherDashboard /></RoleRoute>} />
        <Route path="/papers" element={<RoleRoute allowedRoles={["researcher"]}><Papers /></RoleRoute>} />
        <Route path="/papers/:id" element={<RoleRoute allowedRoles={["researcher"]}><PaperDetail /></RoleRoute>} />
        <Route path="/grants" element={<RoleRoute allowedRoles={["researcher"]}><Grants /></RoleRoute>} />
        <Route path="/grants/:id" element={<RoleRoute allowedRoles={["researcher"]}><GrantDetail /></RoleRoute>} />
        <Route path="/reports" element={<RoleRoute allowedRoles={["researcher"]}><Reports /></RoleRoute>} />

        <Route path="/admin/dashboard" element={<RoleRoute allowedRoles={["admin"]}><AdminDashboard /></RoleRoute>} />
        <Route path="/admin/papers" element={<RoleRoute allowedRoles={["admin"]}><ManagePapers /></RoleRoute>} />
        <Route path="/admin/grants" element={<RoleRoute allowedRoles={["admin"]}><ManageGrants /></RoleRoute>} />
        <Route path="/admin/reports" element={<RoleRoute allowedRoles={["admin"]}><ManageReports /></RoleRoute>} />

        <Route path="/reviewer/papers" element={<RoleRoute allowedRoles={["reviewer"]}><ReviewPapers /></RoleRoute>} />
        <Route path="/reviewer/submit" element={<RoleRoute allowedRoles={["reviewer"]}><SubmitReview /></RoleRoute>} />

        <Route path="/funding/grants" element={<RoleRoute allowedRoles={["funding_authority"]}><FundingGrants /></RoleRoute>} />
        <Route path="/funding/reports" element={<RoleRoute allowedRoles={["funding_authority"]}><FundingReports /></RoleRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </main>
      <Footer />
    </>
  );
};

export default App;
