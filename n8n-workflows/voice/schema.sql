-- Voice usage quota tracking
CREATE TABLE IF NOT EXISTS voice_usage (
  id SERIAL PRIMARY KEY,
  business_id UUID NOT NULL,
  month VARCHAR(7) NOT NULL,
  used_count INTEGER DEFAULT 0,
  monthly_limit INTEGER DEFAULT 2000,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(business_id, month)
);

-- Voice call records
CREATE TABLE IF NOT EXISTS voice_calls (
  id SERIAL PRIMARY KEY,
  business_id UUID NOT NULL,
  call_sid VARCHAR(100),
  caller_number VARCHAR(50),
  caller_speech TEXT,
  ai_response TEXT,
  duration_seconds INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_voice_usage_lookup
  ON voice_usage(business_id, month);

CREATE INDEX IF NOT EXISTS idx_voice_calls_business
  ON voice_calls(business_id, created_at DESC);
