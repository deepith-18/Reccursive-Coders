-- V3: Batches, Cohort Enrollment & Student Profiles Schema

-- 1. Batches Table
CREATE TABLE IF NOT EXISTS batches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    trainer_id UUID REFERENCES users(id) ON DELETE SET NULL,
    start_date DATE,
    end_date DATE,
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_batches_code ON batches(code);
CREATE INDEX IF NOT EXISTS idx_batches_trainer_id ON batches(trainer_id);
CREATE INDEX IF NOT EXISTS idx_batches_status ON batches(status);

-- 2. Batch Students Mapping (Many-to-Many Enrollment)
CREATE TABLE IF NOT EXISTS batch_students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_id UUID NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_batch_student UNIQUE (batch_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_batch_students_batch_id ON batch_students(batch_id);
CREATE INDEX IF NOT EXISTS idx_batch_students_student_id ON batch_students(student_id);

-- 3. Student Profiles Table
CREATE TABLE IF NOT EXISTS student_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    degree VARCHAR(100),
    branch VARCHAR(100),
    college VARCHAR(200),
    graduation_year INTEGER,
    cgpa NUMERIC(4,2),
    skills TEXT,
    github_url VARCHAR(255),
    linkedin_url VARCHAR(255),
    portfolio_url VARCHAR(255),
    resume_file_name VARCHAR(255),
    resume_file_path VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_student_profiles_user_id ON student_profiles(user_id);
