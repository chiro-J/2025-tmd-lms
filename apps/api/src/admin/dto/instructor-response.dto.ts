export class InstructorResponseDto {
  id: number;
  userId?: number;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  experience: string;
  education: string;
  appliedDate: string;
  status: 'pending' | 'approved' | 'rejected';
  documents: string[];
  portfolio: string;
  motivation: string;
  previousExperience: string;
}

