import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState("");

  const validate = () => {
    const next = {};
    if (!emailRegex.test(form.email)) next.email = "Enter a valid email address.";
    if (form.password.length < 6) next.password = "Password must be at least 6 characters.";
    return next;
  };

  const onBlur = () => setErrors(validate());

  const onSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    try {
      const user = await login(form.email, form.password);
      if (user.role === "admin") navigate("/admin/dashboard");
      else if (user.role === "researcher") navigate("/dashboard");
      else if (user.role === "reviewer") navigate("/reviewer/papers");
      else if (user.role === "funding_authority") navigate("/funding/grants");
      else navigate("/");
    } catch (error) {
      setToast(error.response?.data?.message || "Login failed.");
    }
  };

  return (
    <div className="container py-5 col-md-6 col-lg-5">
      <h3 className="mb-4">Login</h3>
      {toast && <div className="alert alert-danger">{toast}</div>}
      <form className="card card-body shadow-sm" onSubmit={onSubmit}>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            onBlur={onBlur}
          />
          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            className={`form-control ${errors.password ? "is-invalid" : ""}`}
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            onBlur={onBlur}
          />
          {errors.password && <div className="invalid-feedback">{errors.password}</div>}
        </div>
        <button className="btn btn-primary" type="submit">Sign In</button>
      </form>
    </div>
  );
};

export default Login;
