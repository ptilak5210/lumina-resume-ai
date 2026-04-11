-- Run this script FIRST
-- This will cleanly drop all the mismatched tables from your database

DROP TABLE IF EXISTS ats_scores CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS resumes CASCADE;
DROP TABLE IF EXISTS users CASCADE; -- Dropping the legacy public.users table as well since it's unused
