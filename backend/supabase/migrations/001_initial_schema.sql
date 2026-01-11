-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- NGOs table (create first since users references it)
CREATE TABLE IF NOT EXISTS ngos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    staff_count INTEGER DEFAULT 0,
    completed_pickups INTEGER DEFAULT 0,
    active_pickups INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('donor', 'staff', 'admin')),
    ngo_id UUID REFERENCES ngos(id) ON DELETE SET NULL,
    points INTEGER DEFAULT 0,
    total_donations INTEGER DEFAULT 0,
    active_donations INTEGER DEFAULT 0,
    avatar_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Donations table
CREATE TABLE IF NOT EXISTS donations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    donor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    donor_name VARCHAR(255) NOT NULL,
    image_url VARCHAR(500),
    address TEXT NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    volume VARCHAR(20) NOT NULL CHECK (volume IN ('small', 'medium', 'large')),
    volume_servings INTEGER NOT NULL,
    priority VARCHAR(20) NOT NULL CHECK (priority IN ('high', 'medium', 'low')),
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'declined')),
    points INTEGER NOT NULL DEFAULT 0,
    description TEXT,
    decline_reason TEXT,
    assigned_ngo_id UUID REFERENCES ngos(id) ON DELETE SET NULL,
    completed_by_staff_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Activity log table
CREATE TABLE IF NOT EXISTS activity_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action VARCHAR(50) NOT NULL,
    description TEXT,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    user_name VARCHAR(255),
    target_id UUID,
    target_type VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_donations_donor ON donations(donor_id);
CREATE INDEX IF NOT EXISTS idx_donations_status ON donations(status);
CREATE INDEX IF NOT EXISTS idx_donations_created ON donations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_donations_priority ON donations(priority);
CREATE INDEX IF NOT EXISTS idx_donations_location ON donations(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_points ON users(points DESC);
CREATE INDEX IF NOT EXISTS idx_users_ngo ON users(ngo_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_activity_created ON activity_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ngos_email ON ngos(email);

-- =====================================================
-- HELPER FUNCTIONS FOR ATOMIC UPDATES
-- =====================================================

-- Increment user active donations
CREATE OR REPLACE FUNCTION increment_user_active_donations(user_id_param UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE users 
    SET active_donations = active_donations + 1,
        updated_at = NOW()
    WHERE id = user_id_param;
END;
$$ LANGUAGE plpgsql;

-- Decrement user active donations
CREATE OR REPLACE FUNCTION decrement_user_active_donations(user_id_param UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE users 
    SET active_donations = GREATEST(active_donations - 1, 0),
        updated_at = NOW()
    WHERE id = user_id_param;
END;
$$ LANGUAGE plpgsql;

-- Increment user total donations
CREATE OR REPLACE FUNCTION increment_user_total_donations(user_id_param UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE users 
    SET total_donations = total_donations + 1,
        updated_at = NOW()
    WHERE id = user_id_param;
END;
$$ LANGUAGE plpgsql;

-- Award points to user
CREATE OR REPLACE FUNCTION award_points_to_user(user_id_param UUID, points_param INTEGER)
RETURNS VOID AS $$
BEGIN
    UPDATE users 
    SET points = points + points_param,
        updated_at = NOW()
    WHERE id = user_id_param;
END;
$$ LANGUAGE plpgsql;

-- Increment NGO staff count
CREATE OR REPLACE FUNCTION increment_ngo_staff_count(ngo_id_param UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE ngos 
    SET staff_count = staff_count + 1,
        updated_at = NOW()
    WHERE id = ngo_id_param;
END;
$$ LANGUAGE plpgsql;

-- Decrement NGO staff count
CREATE OR REPLACE FUNCTION decrement_ngo_staff_count(ngo_id_param UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE ngos 
    SET staff_count = GREATEST(staff_count - 1, 0),
        updated_at = NOW()
    WHERE id = ngo_id_param;
END;
$$ LANGUAGE plpgsql;

-- Increment NGO active pickups
CREATE OR REPLACE FUNCTION increment_ngo_active_pickups(ngo_id_param UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE ngos 
    SET active_pickups = active_pickups + 1,
        updated_at = NOW()
    WHERE id = ngo_id_param;
END;
$$ LANGUAGE plpgsql;

-- Decrement NGO active pickups
CREATE OR REPLACE FUNCTION decrement_ngo_active_pickups(ngo_id_param UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE ngos 
    SET active_pickups = GREATEST(active_pickups - 1, 0),
        updated_at = NOW()
    WHERE id = ngo_id_param;
END;
$$ LANGUAGE plpgsql;

-- Complete NGO pickup (decrement active, increment completed)
CREATE OR REPLACE FUNCTION complete_ngo_pickup(ngo_id_param UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE ngos 
    SET active_pickups = GREATEST(active_pickups - 1, 0),
        completed_pickups = completed_pickups + 1,
        updated_at = NOW()
    WHERE id = ngo_id_param;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE ngos ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- Policy:  Users can read their own data
CREATE POLICY users_read_own ON users
    FOR SELECT USING (true);  -- Allow read for authenticated users (API handles authorization)

-- Policy: Allow all operations through service role
CREATE POLICY users_service_all ON users
    FOR ALL USING (true);

CREATE POLICY ngos_service_all ON ngos
    FOR ALL USING (true);

CREATE POLICY donations_service_all ON donations
    FOR ALL USING (true);

CREATE POLICY activity_log_service_all ON activity_log
    FOR ALL USING (true);

-- =====================================================
-- SEED DATA (Optional - for testing)
-- =====================================================

-- Insert a default admin user (password: Admin123!)
-- Hash generated with bcrypt for "Admin123!"
INSERT INTO users (email, full_name, password_hash, role, points, total_donations, active_donations)
VALUES (
    'admin@fooddonation.org',
    'Admin User',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.G0S9K8XhXwK8Hy',
    'admin',
    0,
    0,
    0
) ON CONFLICT (email) DO NOTHING;

-- Insert sample NGOs
INSERT INTO ngos (name, address, email, phone, latitude, longitude, staff_count, completed_pickups, active_pickups)
VALUES 
    ('Green Hands Foundation', '123 Main St, Tirupati', 'contact@greenhands.org', '+91 98765 43210', 13.6288, 79.4192, 0, 0, 0),
    ('Hope Kitchen', '456 Oak Ave, Tirupati', 'info@hopekitchen.org', '+91 98765 43211', 13.6350, 79.4250, 0, 0, 0),
    ('Food For All Trust', '789 Temple Road, Tirupati', 'help@foodforall.org', '+91 98765 43212', 13.6200, 79.4100, 0, 0, 0)
ON CONFLICT (email) DO NOTHING;