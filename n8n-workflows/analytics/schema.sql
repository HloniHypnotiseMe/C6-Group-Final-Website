-- Analytics snapshots (historical metrics)
CREATE TABLE IF NOT EXISTS analytics_snapshots (
  id SERIAL PRIMARY KEY,
  report_date TIMESTAMP DEFAULT NOW(),
  total_businesses INTEGER DEFAULT 0,
  total_whatsapp_messages INTEGER DEFAULT 0,
  total_content_generations INTEGER DEFAULT 0,
  total_voice_calls INTEGER DEFAULT 0,
  total_audits INTEGER DEFAULT 0,
  snapshot_data JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analytics_snapshots_date
  ON analytics_snapshots(report_date DESC);
