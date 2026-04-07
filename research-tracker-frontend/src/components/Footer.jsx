const Footer = () => (
  <footer className="bg-dark text-light py-3 mt-auto">
    <div className="container d-flex justify-content-between">
      <span>Research Tracker System</span>
      <span>{new Date().getFullYear()}</span>
    </div>
  </footer>
);

export default Footer;
