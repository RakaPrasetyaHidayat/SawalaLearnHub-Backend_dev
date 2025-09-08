-- Create divisions table
CREATE TABLE IF NOT EXISTS divisions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(50) NOT NULL CHECK (name IN ('BACKEND', 'FRONTEND', 'UI_UX', 'DEVOPS')),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_divisions_updated_at
    BEFORE UPDATE ON divisions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default divisions
INSERT INTO divisions (name, description) VALUES
('BACKEND', 'Backend Development Division - Focuses on server-side development, APIs, and databases'),
('FRONTEND', 'Frontend Development Division - Focuses on client-side development and user interfaces'),
('UI_UX', 'UI/UX Division - Focuses on user interface design and user experience'),
('DEVOPS', 'DevOps Division - Focuses on deployment, infrastructure, and development operations')
ON CONFLICT (name) DO NOTHING;

-- Add foreign key to users table if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'division_id'
    ) THEN
        ALTER TABLE users
        ADD COLUMN division_id UUID REFERENCES divisions(id);
    END IF;
END $$;
