export class InquiryResponseDto {
  id: number;
  title: string;
  content: string;
  user: string;
  userName: string;
  email: string;
  role?: string;
  createdDate: string;
  status: 'pending' | 'completed';
  response: string | null;
  attachments?: Array<{ url: string; filename: string; originalname: string; mimetype: string; size: number }> | null;
}

