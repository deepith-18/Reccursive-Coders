-- V5: Submissions, Code Execution & Test Case Verdicts Schema

-- 1. Submissions Table
CREATE TABLE IF NOT EXISTS submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    assignment_id UUID REFERENCES assignments(id) ON DELETE SET NULL,
    source_code TEXT NOT NULL,
    language VARCHAR(30) NOT NULL,
    judge0_language_id INTEGER NOT NULL,
    type VARCHAR(20) NOT NULL DEFAULT 'SUBMIT',
    verdict VARCHAR(40) NOT NULL DEFAULT 'PENDING',
    passed_test_cases INTEGER NOT NULL DEFAULT 0,
    total_test_cases INTEGER NOT NULL DEFAULT 0,
    execution_time_ms INTEGER,
    memory_kb INTEGER,
    stdout TEXT,
    stderr TEXT,
    compile_output TEXT,
    score INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_question_id ON submissions(question_id);
CREATE INDEX IF NOT EXISTS idx_submissions_assignment_id ON submissions(assignment_id);
CREATE INDEX IF NOT EXISTS idx_submissions_verdict ON submissions(verdict);
CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON submissions(created_at);

-- 2. Submission Test Case Results Table
CREATE TABLE IF NOT EXISTS submission_test_case_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    submission_id UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
    test_case_id UUID REFERENCES test_cases(id) ON DELETE SET NULL,
    order_index INTEGER NOT NULL DEFAULT 0,
    is_sample BOOLEAN NOT NULL DEFAULT false,
    status VARCHAR(40) NOT NULL,
    execution_time_ms INTEGER,
    memory_kb INTEGER,
    stdout TEXT,
    stderr TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_sub_tc_submission_id ON submission_test_case_results(submission_id);
CREATE INDEX IF NOT EXISTS idx_sub_tc_test_case_id ON submission_test_case_results(test_case_id);
