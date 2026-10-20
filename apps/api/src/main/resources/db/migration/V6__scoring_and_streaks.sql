-- V6: Scoring, Streaks & Daily Activity Heatmap Schema

-- 1. Add Scoring & Streak Columns to Student Profiles
ALTER TABLE student_profiles
    ADD COLUMN IF NOT EXISTS total_score INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS problems_solved INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS current_streak INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS longest_streak INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS last_active_date DATE;

CREATE INDEX IF NOT EXISTS idx_student_profiles_total_score ON student_profiles(total_score DESC);
CREATE INDEX IF NOT EXISTS idx_student_profiles_problems_solved ON student_profiles(problems_solved DESC);

-- 2. Daily Activities Table (Asia/Kolkata IST calendar tracking)
CREATE TABLE IF NOT EXISTS daily_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    activity_date DATE NOT NULL,
    problems_solved_count INTEGER NOT NULL DEFAULT 0,
    submissions_count INTEGER NOT NULL DEFAULT 0,
    points_earned INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_user_activity_date UNIQUE (user_id, activity_date)
);

CREATE INDEX IF NOT EXISTS idx_daily_activities_user_date ON daily_activities(user_id, activity_date);
CREATE INDEX IF NOT EXISTS idx_daily_activities_date ON daily_activities(activity_date);
