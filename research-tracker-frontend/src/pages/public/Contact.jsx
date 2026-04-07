import { useState } from "react";
import ToastNotification from "../../components/ToastNotification";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState("");

  const validate = () => {
    const next = {};
    if (form.name.trim().length < 2) next.name = "Name is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Valid email is required.";
    if (form.message.trim().length < 10) next.message = "Message must be at least 10 characters.";
    return next;
  };

  const submit = (e) => {
    e.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setToast("Message sent successfully.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="container py-5">
      <h2>Contact</h2>
      <form className="card card-body mt-3" onSubmit={submit}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input className={`form-control ${errors.name ? "is-invalid" : ""}`} value={form.name} onBlur={() => setErrors(validate())} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          {errors.name && <div className="invalid-feedback">{errors.name}</div>}
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input className={`form-control ${errors.email ? "is-invalid" : ""}`} value={form.email} onBlur={() => setErrors(validate())} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
        </div>
        <div className="mb-3">
          <label className="form-label">Message</label>
          <textarea className={`form-control ${errors.message ? "is-invalid" : ""}`} rows="4" value={form.message} onBlur={() => setErrors(validate())} onChange={(e) => setForm({ ...form, message: e.target.value })} />
          {errors.message && <div className="invalid-feedback">{errors.message}</div>}
        </div>
        <button className="btn btn-primary">Send Message</button>
      </form>
      <ToastNotification message={toast} type="success" onClose={() => setToast("")} />
    </div>
  );
};

export default Contact;
