CREATE DATABASE IF NOT EXISTS research_tracker;
USE research_tracker;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('researcher', 'admin', 'reviewer', 'funding_authority') NOT NULL DEFAULT 'researcher',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS research_papers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    abstract TEXT NOT NULL,
    author_id INT NOT NULL,
    status ENUM('draft', 'submitted', 'under_review', 'approved', 'rejected', 'published') NOT NULL DEFAULT 'submitted',
    submission_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    publication_date DATETIME NULL,
    journal_name VARCHAR(255) NULL,
    file_path VARCHAR(255) NULL,
    CONSTRAINT fk_papers_author FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS grants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    amount_requested DECIMAL(12, 2) NOT NULL,
    amount_approved DECIMAL(12, 2) DEFAULT 0.00,
    applicant_id INT NOT NULL,
    status ENUM('applied', 'under_review', 'approved', 'rejected', 'completed') NOT NULL DEFAULT 'applied',
    deadline DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_grants_applicant FOREIGN KEY (applicant_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS grant_utilization (
    id INT AUTO_INCREMENT PRIMARY KEY,
    grant_id INT NOT NULL,
    amount_used DECIMAL(12, 2) NOT NULL,
    description TEXT NOT NULL,
    date_recorded DATETIME DEFAULT CURRENT_TIMESTAMP,
    recorded_by INT NOT NULL,
    CONSTRAINT fk_utilization_grant FOREIGN KEY (grant_id) REFERENCES grants(id) ON DELETE CASCADE,
    CONSTRAINT fk_utilization_user FOREIGN KEY (recorded_by) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    paper_id INT NOT NULL,
    reviewer_id INT NOT NULL,
    comments TEXT NOT NULL,
    status ENUM('approved', 'rejected', 'needs_revision') NOT NULL DEFAULT 'needs_revision',
    reviewed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_reviews_paper FOREIGN KEY (paper_id) REFERENCES research_papers(id) ON DELETE CASCADE,
    CONSTRAINT fk_reviews_reviewer FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS progress_reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    grant_id INT NOT NULL,
    researcher_id INT NOT NULL,
    report_text TEXT NOT NULL,
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    status ENUM('submitted', 'reviewed', 'needs_update') NOT NULL DEFAULT 'submitted',
    CONSTRAINT fk_reports_grant FOREIGN KEY (grant_id) REFERENCES grants(id) ON DELETE CASCADE,
    CONSTRAINT fk_reports_researcher FOREIGN KEY (researcher_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NOT NULL,
    CONSTRAINT fk_sessions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

INSERT INTO users (name, email, password_hash, role) VALUES
('Admin User', 'admin@research.local', '$2b$10$MpkYhdjVtIRfTawx7YXm9enxyaNllM6dpLPxH4wFV5YmQf6t8jLHG', 'admin'),
('Researcher One', 'researcher@research.local', '$2b$10$MpkYhdjVtIRfTawx7YXm9enxyaNllM6dpLPxH4wFV5YmQf6t8jLHG', 'researcher'),
('Reviewer One', 'reviewer@research.local', '$2b$10$MpkYhdjVtIRfTawx7YXm9enxyaNllM6dpLPxH4wFV5YmQf6t8jLHG', 'reviewer'),
('Funding Authority', 'funding@research.local', '$2b$10$MpkYhdjVtIRfTawx7YXm9enxyaNllM6dpLPxH4wFV5YmQf6t8jLHG', 'funding_authority');

INSERT INTO research_papers (title, abstract, author_id, status, journal_name, file_path)
VALUES ('AI in Healthcare', 'A study on AI applications in modern healthcare systems.', 2, 'submitted', 'Journal of AI Research', '/uploads/ai-healthcare.pdf');

INSERT INTO grants (title, description, amount_requested, amount_approved, applicant_id, status, deadline)
VALUES ('Cancer Research Grant', 'Funding request for early cancer detection research.', 500000.00, 0.00, 2, 'applied', '2026-12-31');
