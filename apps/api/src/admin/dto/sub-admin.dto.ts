export class SubAdminDto {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  permissions: {
    userManagement: boolean;
    contentManagement: boolean;
    systemSettings: boolean;
    instructorApproval: boolean;
  };
  createdAt: Date;
  lastLogin: Date;
}

