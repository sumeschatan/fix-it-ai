export enum TicketStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum Urgency {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export interface Ticket {
  id: string;
  requesterName: string;
  department: string;
  deviceType: string;
  description: string;
  status: TicketStatus;
  urgency: Urgency;
  createdAt: string;
  aiDiagnosis?: string; // AI generated suggestion
  aiCategory?: string;
  image?: string; // Base64 string of the uploaded image
}

export interface DashboardStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
}

export type ViewState = 'DASHBOARD' | 'CREATE_TICKET' | 'TICKET_LIST';