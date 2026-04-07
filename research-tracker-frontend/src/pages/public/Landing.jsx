import { Link } from "react-router-dom";
import Footer from "../../components/Footer";

const Landing = () => (
  <div className="d-flex flex-column min-vh-100">
    <main className="container py-5">
      <section className="text-center py-5">
        <h1 className="display-5 fw-bold">Research Paper and Grant Tracking System</h1>
        <p className="lead text-muted">Streamline submissions, reviews, grants, and progress reporting.</p>
        <div className="d-flex justify-content-center gap-3 mt-4">
          <Link to="/login" className="btn btn-primary">Login</Link>
          <Link to="/register" className="btn btn-outline-primary">Register</Link>
        </div>
      </section>
      <section className="row g-3 mb-5">
        {["Paper Management", "Grant Lifecycle", "Role-Based Workflows"].map((f) => (
          <div className="col-md-4" key={f}>
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{f}</h5>
                <p className="card-text text-muted">Built for institutions to coordinate research productivity.</p>
              </div>
            </div>
          </div>
        ))}
      </section>
      <section className="row text-center g-3">
        <div className="col-md-4"><div className="p-3 border rounded"><h4>120+</h4><p className="mb-0 text-muted">Papers</p></div></div>
        <div className="col-md-4"><div className="p-3 border rounded"><h4>45+</h4><p className="mb-0 text-muted">Grants</p></div></div>
        <div className="col-md-4"><div className="p-3 border rounded"><h4>300+</h4><p className="mb-0 text-muted">Reviews</p></div></div>
      </section>
    </main>
    <Footer />
  </div>
);

export default Landing;
