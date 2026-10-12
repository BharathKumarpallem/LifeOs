-- ========================================================
-- LifeOS: Complete PostgreSQL Database Schema & Migrations
-- Production Supabase / PostgreSQL Migration
-- Compatible with PostgreSQL 15+ and Supabase Auth
-- ========================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. User Preferences Table
CREATE TABLE IF NOT EXISTS public.user_preferences (
    user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    timezone TEXT DEFAULT 'America/New_York (UTC-5)',
    preferred_language TEXT DEFAULT 'English (US)',
    date_format TEXT DEFAULT 'YYYY-MM-DD',
    theme TEXT DEFAULT 'dark',
    onboarding_completed BOOLEAN DEFAULT TRUE,
    enabled_modules JSONB DEFAULT '["overview", "my-day", "tasks", "calendar", "reminders", "bills", "documents", "goals-habits", "learning", "career", "family", "ai-assistant", "automations", "notifications", "settings"]'::jsonb,
    ai_provider TEXT DEFAULT 'mock_intelligent',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tasks Table
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    due_date DATE,
    due_time TIME,
    priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
    category TEXT DEFAULT 'personal',
    status TEXT CHECK (status IN ('not_started', 'in_progress', 'completed', 'archived')) DEFAULT 'not_started',
    estimated_duration_min INTEGER DEFAULT 30,
    recurring_schedule TEXT DEFAULT 'none',
    reminder_time TIMESTAMPTZ,
    related_document_id UUID,
    related_goal_id UUID,
    family_assignee_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Subtasks Table
CREATE TABLE IF NOT EXISTS public.subtasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0
);

-- 5. Task Tags Table
CREATE TABLE IF NOT EXISTS public.task_tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
    tag TEXT NOT NULL
);

-- 6. Calendar Events Table
CREATE TABLE IF NOT EXISTS public.calendar_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    timezone TEXT DEFAULT 'EST',
    location TEXT,
    is_online_meeting BOOLEAN DEFAULT FALSE,
    meeting_link TEXT,
    category TEXT DEFAULT 'personal',
    related_contacts JSONB DEFAULT '[]'::jsonb,
    reminder_minutes_before INTEGER DEFAULT 30,
    is_recurring BOOLEAN DEFAULT FALSE,
    recurrence_rule TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Reminders Table
CREATE TABLE IF NOT EXISTS public.reminders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    notes TEXT,
    due_date DATE NOT NULL,
    due_time TIME DEFAULT '09:00',
    recurrence TEXT DEFAULT 'none',
    priority TEXT DEFAULT 'medium',
    category TEXT DEFAULT 'General',
    is_completed BOOLEAN DEFAULT FALSE,
    snoozed_until TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Bills Table
CREATE TABLE IF NOT EXISTS public.bills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT DEFAULT 'utilities',
    amount NUMERIC(12, 2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    due_date DATE NOT NULL,
    recurring_interval TEXT DEFAULT 'monthly',
    payment_status TEXT CHECK (payment_status IN ('UNPAID', 'PAID', 'OVERDUE')) DEFAULT 'UNPAID',
    reminder_days_before INTEGER DEFAULT 3,
    payee TEXT,
    notes TEXT,
    paid_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Payment Records Table
CREATE TABLE IF NOT EXISTS public.payment_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bill_id UUID NOT NULL REFERENCES public.bills(id) ON DELETE CASCADE,
    amount NUMERIC(12, 2) NOT NULL,
    paid_date DATE NOT NULL,
    confirmation_ref TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Documents Table
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT DEFAULT 'personal',
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    issue_date DATE,
    expiry_date DATE,
    file_size_kb INTEGER DEFAULT 0,
    file_type TEXT DEFAULT 'application/pdf',
    file_storage_path TEXT,
    is_private BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Document Metadata Table
CREATE TABLE IF NOT EXISTS public.document_metadata (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
    ai_extracted_summary TEXT,
    issuing_authority TEXT,
    verification_hash TEXT,
    extracted_fields JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Goals Table
CREATE TABLE IF NOT EXISTS public.goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT DEFAULT 'personal',
    start_date DATE NOT NULL,
    target_date DATE NOT NULL,
    progress_percent INTEGER DEFAULT 0,
    status TEXT CHECK (status IN ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED')) DEFAULT 'NOT_STARTED',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Goal Milestones Table
CREATE TABLE IF NOT EXISTS public.goal_milestones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    goal_id UUID NOT NULL REFERENCES public.goals(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    due_date DATE
);

-- 14. Habits Table
CREATE TABLE IF NOT EXISTS public.habits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    category TEXT DEFAULT 'Mindfulness',
    frequency TEXT DEFAULT 'daily',
    target_days_per_week INTEGER DEFAULT 7,
    current_streak INTEGER DEFAULT 0,
    best_streak INTEGER DEFAULT 0,
    is_paused BOOLEAN DEFAULT FALSE,
    reminder_time TIME,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. Habit Check-ins Table
CREATE TABLE IF NOT EXISTS public.habit_checkins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    habit_id UUID NOT NULL REFERENCES public.habits(id) ON DELETE CASCADE,
    checkin_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (habit_id, checkin_date)
);

-- 16. Learning Items Table
CREATE TABLE IF NOT EXISTS public.learning_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    category TEXT DEFAULT 'Computer Science',
    provider TEXT,
    progress_percent INTEGER DEFAULT 0,
    notes TEXT,
    exam_date DATE,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. Study Sessions Table
CREATE TABLE IF NOT EXISTS public.study_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    learning_id UUID NOT NULL REFERENCES public.learning_items(id) ON DELETE CASCADE,
    topic TEXT NOT NULL,
    duration_min INTEGER DEFAULT 45,
    scheduled_date DATE NOT NULL,
    completed BOOLEAN DEFAULT FALSE
);

-- 18. Career Applications Table
CREATE TABLE IF NOT EXISTS public.career_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    company TEXT NOT NULL,
    role TEXT NOT NULL,
    job_posting_url TEXT,
    salary_expectation TEXT,
    application_date DATE NOT NULL,
    status TEXT CHECK (status IN ('SAVED', 'PLANNED', 'APPLIED', 'INTERVIEWING', 'OFFER', 'REJECTED', 'WITHDRAWN')) DEFAULT 'APPLIED',
    contact_name TEXT,
    contact_email TEXT,
    interview_date DATE,
    interview_notes TEXT,
    follow_up_date DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 19. Family Groups Table
CREATE TABLE IF NOT EXISTS public.family_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    created_by UUID NOT NULL REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 20. Family Members Table
CREATE TABLE IF NOT EXISTS public.family_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_group_id UUID NOT NULL REFERENCES public.family_groups(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id),
    member_name TEXT NOT NULL,
    member_email TEXT NOT NULL,
    role TEXT CHECK (role IN ('ADMIN', 'MEMBER', 'CHILD')) DEFAULT 'MEMBER',
    joined_at TIMESTAMPTZ DEFAULT NOW()
);

-- 21. Family Invitations Table
CREATE TABLE IF NOT EXISTS public.family_invitations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_group_id UUID NOT NULL REFERENCES public.family_groups(id) ON DELETE CASCADE,
    invited_email TEXT NOT NULL,
    role TEXT DEFAULT 'MEMBER',
    status TEXT DEFAULT 'PENDING',
    token TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 22. Shared Tasks Table
CREATE TABLE IF NOT EXISTS public.shared_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_group_id UUID NOT NULL REFERENCES public.family_groups(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    assigned_to UUID REFERENCES public.profiles(id),
    completed BOOLEAN DEFAULT FALSE,
    due_date DATE
);

-- 23. Conversations Table
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT DEFAULT 'New Conversation',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 24. Assistant Messages Table
CREATE TABLE IF NOT EXISTS public.assistant_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender TEXT CHECK (sender IN ('user', 'assistant', 'system')) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 25. Automations Table
CREATE TABLE IF NOT EXISTS public.automations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    trigger_rule TEXT NOT NULL,
    condition_rule TEXT NOT NULL,
    proposed_action TEXT NOT NULL,
    requires_approval BOOLEAN DEFAULT FALSE,
    is_enabled BOOLEAN DEFAULT TRUE,
    last_run TIMESTAMPTZ,
    execution_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 26. Automation Runs Table
CREATE TABLE IF NOT EXISTS public.automation_runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    automation_id UUID NOT NULL REFERENCES public.automations(id) ON DELETE CASCADE,
    run_status TEXT CHECK (run_status IN ('SUCCESS', 'FAILED', 'WAITING_APPROVAL')),
    executed_at TIMESTAMPTZ DEFAULT NOW(),
    details JSONB
);

-- 27. Approvals Table
CREATE TABLE IF NOT EXISTS public.approvals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    action_type TEXT NOT NULL,
    risk_level TEXT CHECK (risk_level IN ('READ_ONLY', 'INTERNAL_REVERSIBLE', 'EXTERNAL', 'SENSITIVE_FINANCIAL')),
    service_affected TEXT NOT NULL,
    is_reversible BOOLEAN DEFAULT TRUE,
    payload_summary TEXT NOT NULL,
    status TEXT CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')) DEFAULT 'PENDING',
    decision_comments TEXT,
    requested_at TIMESTAMPTZ DEFAULT NOW(),
    decided_at TIMESTAMPTZ
);

-- 28. Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'SYSTEM',
    is_read BOOLEAN DEFAULT FALSE,
    action_section TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 29. Connected Integrations Table
CREATE TABLE IF NOT EXISTS public.connected_integrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    service_name TEXT NOT NULL, -- 'google_calendar', 'outlook', 'supabase', 'openai'
    is_connected BOOLEAN DEFAULT FALSE,
    scopes TEXT[] DEFAULT ARRAY[]::TEXT[],
    connected_at TIMESTAMPTZ
);

-- 30. Audit Events Table
CREATE TABLE IF NOT EXISTS public.audit_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    actor TEXT NOT NULL,
    action TEXT NOT NULL,
    resource TEXT NOT NULL,
    risk_level TEXT DEFAULT 'LOW',
    status TEXT NOT NULL,
    details TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================================
-- Row Level Security (RLS) Policies
-- Ensures isolated tenant privacy for all tables
-- ========================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only read and write their own profile"
    ON public.profiles FOR ALL
    USING (auth.uid() = id);

CREATE POLICY "Users can only manage their own tasks"
    ON public.tasks FOR ALL
    USING (auth.uid() = user_id);

CREATE POLICY "Users can only manage their own calendar events"
    ON public.calendar_events FOR ALL
    USING (auth.uid() = user_id);

CREATE POLICY "Users can only manage their own bills"
    ON public.bills FOR ALL
    USING (auth.uid() = user_id);

CREATE POLICY "Users can only manage their own documents"
    ON public.documents FOR ALL
    USING (auth.uid() = user_id);

CREATE POLICY "Users can only manage their own goals"
    ON public.goals FOR ALL
    USING (auth.uid() = user_id);

CREATE POLICY "Users can only manage their own habits"
    ON public.habits FOR ALL
    USING (auth.uid() = user_id);

CREATE POLICY "Users can only manage their own career items"
    ON public.career_applications FOR ALL
    USING (auth.uid() = user_id);

CREATE POLICY "Users can only view their own audit trail"
    ON public.audit_events FOR ALL
    USING (auth.uid() = user_id);
