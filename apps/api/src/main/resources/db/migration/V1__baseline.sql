-- V1: Foundation Baseline Schema
-- Enable UUID extension if available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Baseline system heartbeat / health status check table
CREATE TABLE IF NOT EXISTS system_health_check (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    check_name VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL,
    details TEXT,
    checked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO system_health_check (check_name, status, details)
VALUES ('SYSTEM_INIT', 'INITIALIZED', 'Phase 0 foundation migration applied successfully');
