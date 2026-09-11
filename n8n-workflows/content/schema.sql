-- Content usage tracking
CREATE TABLE IF NOT EXISTS content_usage (
  id SERIAL PRIMARY KEY,
  business_id UUID NOT NULL,
  month VARCHAR(7) NOT NULL,
  used_count INTEGER DEFAULT 0,
  monthly_limit INTEGER DEFAULT 50,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(business_id, month)
);

-- Content generations archive
CREATE TABLE IF NOT EXISTS content_generations (
  id SERIAL PRIMARY KEY,
  business_id UUID NOT NULL,
  content_type VARCHAR(50) NOT NULL,
  topic TEXT,
  content TEXT NOT NULL,
  voiceover_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_content_usage_lookup
  ON content_usage(business_id, month);

CREATE INDEX IF NOT EXISTS idx_content_generations_business
  ON content_generations(business_id, created_at DESC);
