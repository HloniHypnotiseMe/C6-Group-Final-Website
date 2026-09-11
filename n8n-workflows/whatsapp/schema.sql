-- WhatsApp usage tracking table
CREATE TABLE IF NOT EXISTS whatsapp_usage (
  id SERIAL PRIMARY KEY,
  business_id UUID NOT NULL,
  month VARCHAR(7) NOT NULL,
  used_count INTEGER DEFAULT 0,
  monthly_limit INTEGER DEFAULT 500,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(business_id, month)
);

-- Index for fast quota lookups
CREATE INDEX IF NOT EXISTS idx_whatsapp_usage_lookup
  ON whatsapp_usage(business_id, month);
