const About = () => (
  <div className="container py-5">
    <h2>About This System</h2>
    <p className="text-muted">
      This platform helps researchers, reviewers, administrators, and funding authorities coordinate
      paper submissions, grant approvals, reviews, and utilization reports.
    </p>
    <h4 className="mt-4">Tech Stack</h4>
    <ul>
      <li>Frontend: React + Vite + Bootstrap</li>
      <li>Backend: Node.js + Express + JWT + Sessions</li>
      <li>Database: MySQL</li>
    </ul>
    <h4 className="mt-4">Milestones</h4>
    <ul className="list-group">
      <li className="list-group-item">Phase 1: Authentication and role middleware</li>
      <li className="list-group-item">Phase 2: Paper and grant workflows</li>
      <li className="list-group-item">Phase 3: Reports and dashboards</li>
    </ul>
  </div>
);

export default About;
