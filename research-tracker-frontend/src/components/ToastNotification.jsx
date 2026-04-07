import { useEffect } from "react";

const ToastNotification = ({ message, type = "success", onClose }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose?.();
    }, 3000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  const typeClass =
    type === "error" ? "bg-danger" : type === "warning" ? "bg-warning text-dark" : "bg-success";

  return (
    <div className="position-fixed bottom-0 end-0 p-3 z-3">
      <div className={`toast show text-white ${typeClass}`}>
        <div className="toast-body d-flex justify-content-between">
          <span>{message}</span>
          <button type="button" className="btn-close btn-close-white ms-3" onClick={onClose} />
        </div>
      </div>
    </div>
  );
};

export default ToastNotification;
