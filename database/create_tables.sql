-- Run this script SECOND
-- This will perfectly construct your database tables to match your Python Backend

-- 1. Create Resumes Table
CREATE TABLE resumes (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    title VARCHAR(200) DEFAULT 'My Resume',
    full_name VARCHAR(100) DEFAULT '',
    email VARCHAR(120) DEFAULT '',
    phone VARCHAR(30) DEFAULT '',
    location VARCHAR(100) DEFAULT '',
    linkedin VARCHAR(200) DEFAULT '',
    website VARCHAR(200) DEFAULT '',
    summary TEXT DEFAULT '',
    theme VARCHAR(50) DEFAULT 'minimalist',
    score INTEGER NULL,
    
    -- We use TEXT to stringify JSON as per your SQLAlchemy models
    experience TEXT DEFAULT '[]',
    education TEXT DEFAULT '[]',
    skills TEXT DEFAULT '[]',
    projects TEXT DEFAULT '[]',
    certifications TEXT DEFAULT '[]',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for efficient user_id lookups
CREATE INDEX idx_resumes_user_id ON resumes(user_id);

-- Trigger to auto-update updated_at for resumes
CREATE OR REPLACE FUNCTION update_modified_column() 
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW; 
END;
$$ language 'plpgsql';

CREATE TRIGGER update_resumes_modtime
    BEFORE UPDATE ON resumes
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();


-- 2. Create ATS Scores Table
CREATE TABLE ats_scores (
    id SERIAL PRIMARY KEY,
    resume_id INTEGER NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ats_scores_resume_id ON ats_scores(resume_id);


-- 3. Create Subscriptions Table
CREATE TABLE subscriptions (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE,
    plan VARCHAR(50) DEFAULT 'free',
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_subscriptions_modtime
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();
