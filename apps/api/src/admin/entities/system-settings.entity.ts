import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('system_settings')
export class SystemSettings {
  @PrimaryColumn({ default: 1 })
  id: number;

  // 알림 설정
  @Column({ name: 'email_notifications', default: true })
  emailNotifications: boolean;

  @Column({ name: 'system_maintenance_alert', default: true })
  systemMaintenanceAlert: boolean;

  // 보안 설정
  @Column({ name: 'password_min_length', default: 8 })
  passwordMinLength: number;

  @Column({ name: 'session_timeout', default: 30 })
  sessionTimeout: number;

  @Column({ name: 'two_factor_auth', default: false })
  twoFactorAuth: boolean;

  // 플랫폼 설정
  @Column({ name: 'platform_name', default: 'LMS' })
  platformName: string;

  @Column({ name: 'default_language', default: 'ko' })
  defaultLanguage: string;

  @Column({ name: 'maintenance_mode', default: false })
  maintenanceMode: boolean;

  // 데이터베이스 설정
  @Column({ name: 'auto_backup', default: true })
  autoBackup: boolean;

  @Column({ name: 'backup_frequency', default: 'daily' })
  backupFrequency: 'daily' | 'weekly' | 'monthly';

  // 이메일 설정
  @Column({ name: 'smtp_host', nullable: true })
  smtpHost: string;

  @Column({ name: 'smtp_port', default: 587 })
  smtpPort: number;

  @Column({ name: 'smtp_user', nullable: true })
  smtpUser: string;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;
}

