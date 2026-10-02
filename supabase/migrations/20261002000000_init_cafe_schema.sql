-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'user', 'guest');

-- Profiles Table (Extends auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  role user_role DEFAULT 'user'::user_role NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Cafes Table
CREATE TABLE cafes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  rating_avg NUMERIC(3, 2) DEFAULT 0 NOT NULL,
  rating_count INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Reviews Table
CREATE TABLE reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cafe_id UUID REFERENCES cafes(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(cafe_id, user_id) -- One review per user per cafe
);

-- Cafe Images Table
CREATE TABLE cafe_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cafe_id UUID REFERENCES cafes(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  storage_path TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Trigger to update rating_avg and rating_count on cafes
CREATE OR REPLACE FUNCTION update_cafe_rating()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    UPDATE cafes
    SET
      rating_avg = (SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE cafe_id = NEW.cafe_id),
      rating_count = (SELECT COUNT(*) FROM reviews WHERE cafe_id = NEW.cafe_id)
    WHERE id = NEW.cafe_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE cafes
    SET
      rating_avg = (SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE cafe_id = OLD.cafe_id),
      rating_count = (SELECT COUNT(*) FROM reviews WHERE cafe_id = OLD.cafe_id)
    WHERE id = OLD.cafe_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_cafe_rating_trigger
AFTER INSERT OR UPDATE OR DELETE ON reviews
FOR EACH ROW EXECUTE FUNCTION update_cafe_rating();


-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cafes ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE cafe_images ENABLE ROW LEVEL SECURITY;

-- Profiles RLS
CREATE POLICY "Profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Cafes RLS
CREATE POLICY "Cafes are viewable by everyone" ON cafes
  FOR SELECT USING (true);

CREATE POLICY "Only admins can insert cafes" ON cafes
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Only admins can update cafes" ON cafes
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Only admins can delete cafes" ON cafes
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Reviews RLS
CREATE POLICY "Reviews are viewable by everyone" ON reviews
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert reviews" ON reviews
  FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

CREATE POLICY "Users can update own reviews or admins can update any" ON reviews
  FOR UPDATE USING (
    auth.uid() = user_id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Users can delete own reviews or admins can delete any" ON reviews
  FOR DELETE USING (
    auth.uid() = user_id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Cafe Images RLS
CREATE POLICY "Cafe images are viewable by everyone" ON cafe_images
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert cafe images" ON cafe_images
  FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

CREATE POLICY "Users can delete own cafe images or admins can delete any" ON cafe_images
  FOR DELETE USING (
    auth.uid() = user_id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
