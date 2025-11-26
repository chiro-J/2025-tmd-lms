-- 세션 추적 테이블 생성
CREATE TABLE IF NOT EXISTS user_sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  started_at TIMESTAMP NOT NULL DEFAULT NOW(),
  ended_at TIMESTAMP,
  duration_seconds INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_started_date ON user_sessions(user_id, DATE(started_at));
CREATE INDEX idx_user_sessions_ended_at ON user_sessions(ended_at) WHERE ended_at IS NULL;

-- 일일 학습 통계 테이블 생성
CREATE TABLE IF NOT EXISTS daily_learning_stats (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  total_seconds INTEGER NOT NULL DEFAULT 0,
  session_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- 인덱스 생성
CREATE INDEX idx_daily_stats_user_date ON daily_learning_stats(user_id, date);
CREATE INDEX idx_daily_stats_date ON daily_learning_stats(date);

-- 코멘트 추가
COMMENT ON TABLE user_sessions IS '사용자 세션 추적 테이블';
COMMENT ON TABLE daily_learning_stats IS '일일 학습 시간 집계 테이블';
