-- 세션 추적 테이블 생성
CREATE TABLE IF NOT EXISTS user_sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  started_at TIMESTAMP NOT NULL DEFAULT NOW(),
  ended_at TIMESTAMP,
  duration_seconds INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_started_at ON user_sessions(started_at);
CREATE INDEX IF NOT EXISTS idx_user_sessions_ended_at ON user_sessions(ended_at);

-- 일일 학습 통계 테이블 생성
CREATE TABLE IF NOT EXISTS daily_learning_stats (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  total_seconds INTEGER NOT NULL DEFAULT 0,
  session_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_daily_stats_user_date ON daily_learning_stats(user_id, date);
CREATE INDEX IF NOT EXISTS idx_daily_stats_date ON daily_learning_stats(date);

-- 코멘트 추가
COMMENT ON TABLE user_sessions IS '사용자 세션 추적 테이블';
COMMENT ON COLUMN user_sessions.user_id IS '사용자 ID';
COMMENT ON COLUMN user_sessions.started_at IS '세션 시작 시각';
COMMENT ON COLUMN user_sessions.ended_at IS '세션 종료 시각';
COMMENT ON COLUMN user_sessions.duration_seconds IS '세션 지속 시간 (초)';

COMMENT ON TABLE daily_learning_stats IS '일일 학습 통계 테이블';
COMMENT ON COLUMN daily_learning_stats.user_id IS '사용자 ID';
COMMENT ON COLUMN daily_learning_stats.date IS '날짜';
COMMENT ON COLUMN daily_learning_stats.total_seconds IS '총 학습 시간 (초)';
COMMENT ON COLUMN daily_learning_stats.session_count IS '세션 수';
