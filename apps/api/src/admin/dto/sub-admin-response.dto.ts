export class SubAdminResponseDto {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  userManagement: boolean;
  contentManagement: boolean;
  systemSettings: boolean;
  instructorApproval: boolean;
  permissions: {
    userManagement: boolean;
    contentManagement: boolean;
    systemSettings: boolean;
    instructorApproval: boolean;
  };
  createdAt: string;
  lastLogin: string | null;
}

