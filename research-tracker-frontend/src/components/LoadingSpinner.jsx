const LoadingSpinner = ({ message = "Loading..." }) => (
  <div className="d-flex flex-column align-items-center justify-content-center py-5">
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">{message}</span>
    </div>
    <p className="mt-3 text-muted">{message}</p>
  </div>
);

export default LoadingSpinner;
