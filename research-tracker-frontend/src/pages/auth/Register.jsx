import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register as registerUser } from "../../services/authService";

const roles = ["researcher", "admin", "reviewer", "funding_authority"];
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: ""
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const validate = () => {
    const next = {};
    if (form.name.trim().length < 3) next.name = "Name must be at least 3 characters.";
    if (!emailRegex.test(form.email)) next.email = "Enter a valid email.";
    if (form.password.length < 6) next.password = "Password must be at least 6 characters.";
    if (form.confirmPassword !== form.password) next.confirmPassword = "Passwords must match.";
    if (!roles.includes(form.role)) next.role = "Select a valid role.";
    return next;
  };

  const submit = async (e) => {
    e.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    try {
      await registerUser(form.name, form.email, form.password, form.role);
      navigate("/login", { state: { success: "Registration successful. Please login." } });
    } catch (error) {
      setMessage(error.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div className="container py-5 col-md-8 col-lg-6">
      <h3 className="mb-4">Register</h3>
      {message && <div className="alert alert-danger">{message}</div>}
      <form className="card card-body shadow-sm" onSubmit={submit}>
        <div className="mb-3">
          <label className="form-label">Full Name</label>
          <input className={`form-control ${errors.name ? "is-invalid" : ""}`} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          {errors.name && <div className="invalid-feedback">{errors.name}</div>}
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input className={`form-control ${errors.email ? "is-invalid" : ""}`} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input type="password" className={`form-control ${errors.password ? "is-invalid" : ""}`} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          {errors.password && <div className="invalid-feedback">{errors.password}</div>}
        </div>
        <div className="mb-3">
          <label className="form-label">Confirm Password</label>
          <input type="password" className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`} value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} />
          {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
        </div>
        <div className="mb-3">
          <label className="form-label">Role</label>
          <select className={`form-select ${errors.role ? "is-invalid" : ""}`} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option value="">Select role</option>
            {roles.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          {errors.role && <div className="invalid-feedback">{errors.role}</div>}
        </div>
        <button className="btn btn-success">Create Account</button>
        <small className="mt-3">
          Already have an account? <Link to="/login">Login</Link>
        </small>
      </form>
    </div>
  );
};

export default Register;
