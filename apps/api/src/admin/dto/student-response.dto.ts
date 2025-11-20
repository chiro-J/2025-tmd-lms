export class StudentResponseDto {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  enrolledDate: string;
  lastLogin: string | null;
}

