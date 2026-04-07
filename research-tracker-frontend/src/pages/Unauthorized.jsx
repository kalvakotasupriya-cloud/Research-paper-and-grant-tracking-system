import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();
  return (
    <div className="container py-5 text-center">
      <h1 className="display-6 text-danger">403 - Unauthorized</h1>
      <p className="text-muted">You do not have access to this page.</p>
      <button className="btn btn-outline-primary" onClick={() => navigate(-1)}>
        Go Back
      </button>
    </div>
  );
};

export default Unauthorized;
