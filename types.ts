
export enum OrderStatus {
  IN_TRANSIT = 'Em trânsito',
  DELAYED = 'Atrasado',
  STUCK = 'Parado sem atualização',
  LOST = 'Extraviado',
  WRONG_ADDRESS = 'Endereço incorreto',
  FAILED_ATTEMPT = 'Tentativa sem sucesso',
  DELIVERED = 'Entregue',
  RESOLVED = 'Resolvido'
}

export enum ComplaintStatus {
  NONE = 'Nenhuma',
  OPENED = 'Aberta',
  IN_ANALYSIS = 'Em análise',
  RESOLVED = 'Resolvida',
  REIMBURSED = 'Reembolsada'
}

export enum Carrier {
  CORREIOS = 'Correios',
  LOGGI = 'Loggi',
  JADLOG = 'Jadlog',
  TOTAL_EXPRESS = 'Total Express',
  MERCADO_ENVIOS = 'Mercado Envios',
  OUTRA = 'Outra'
}

export interface TrackingEvent {
  date: string;
  location: string;
  status: string;
  description: string;
}

export interface Order {
  id: string;
  trackingCode: string;
  customerName: string;
  customerWhatsApp?: string;
  carrier: Carrier;
  shippedDate: string;
  status: OrderStatus;
  complaintStatus?: ComplaintStatus;
  priority: 'low' | 'medium' | 'high';
  lastUpdate: string;
  events: TrackingEvent[];
  notes?: string;
}

export interface AIAnalysis {
  riskLevel: 'low' | 'medium' | 'high';
  classification: string;
  suggestedAction: string;
  reasoning: string;
}

export interface DashboardStats {
  totalOrders: number;
  problematicOrders: number;
  resolvedThisMonth: number;
  avgResolutionTime: string;
  carrierPerformance: { name: string; issues: number }[];
  issueTypes: { type: string; count: number }[];
}
