
import { Order, OrderStatus, Carrier, DashboardStats } from './types';

export const MOCK_ORDERS: Order[] = [
  {
    id: '1',
    trackingCode: 'PX123456789BR',
    customerName: 'Ricardo Oliveira',
    customerWhatsApp: '11987654321',
    carrier: Carrier.CORREIOS,
    shippedDate: '2023-10-20',
    status: OrderStatus.DELAYED,
    priority: 'high',
    lastUpdate: '2023-10-25 14:30',
    events: [
      { date: '2023-10-20', location: 'São Paulo/SP', status: 'Postado', description: 'Objeto postado' },
      { date: '2023-10-22', location: 'Rio de Janeiro/RJ', status: 'Em trânsito', description: 'Em trânsito para CTE Rio de Janeiro' }
    ]
  },
  {
    id: '2',
    trackingCode: 'LOG998877665',
    customerName: 'Ana Beatriz Souza',
    customerWhatsApp: '21912345678',
    carrier: Carrier.LOGGI,
    shippedDate: '2023-10-24',
    status: OrderStatus.IN_TRANSIT,
    priority: 'low',
    lastUpdate: '2023-10-26 09:15',
    events: [
      { date: '2023-10-24', location: 'Barueri/SP', status: 'Coletado', description: 'Objeto coletado pela transportadora' }
    ]
  },
  {
    id: '3',
    trackingCode: 'JD777222111',
    customerName: 'Marcos Vinícius',
    customerWhatsApp: '31998877665',
    carrier: Carrier.JADLOG,
    shippedDate: '2023-10-15',
    status: OrderStatus.STUCK,
    priority: 'high',
    lastUpdate: '2023-10-18 10:00',
    events: [
      { date: '2023-10-15', location: 'Curitiba/PR', status: 'Postado', description: 'Objeto recebido na unidade' },
      { date: '2023-10-18', location: 'Curitiba/PR', status: 'Processamento', description: 'Objeto em processamento' }
    ]
  },
  {
    id: '4',
    trackingCode: 'TX000111222',
    customerName: 'Fernanda Lima',
    customerWhatsApp: '41977665544',
    carrier: Carrier.TOTAL_EXPRESS,
    shippedDate: '2023-10-22',
    status: OrderStatus.FAILED_ATTEMPT,
    priority: 'medium',
    lastUpdate: '2023-10-25 18:00',
    events: [
      { date: '2023-10-22', location: 'São Paulo/SP', status: 'Coletado', description: 'Objeto coletado' },
      { date: '2023-10-25', location: 'Belo Horizonte/MG', status: 'Insucesso', description: 'Destinatário ausente' }
    ]
  }
];

export const MOCK_STATS: DashboardStats = {
  totalOrders: 1250,
  problematicOrders: 42,
  resolvedThisMonth: 128,
  avgResolutionTime: '2.4 dias',
  carrierPerformance: [
    { name: 'Correios', issues: 18 },
    { name: 'Loggi', issues: 5 },
    { name: 'Jadlog', issues: 12 },
    { name: 'Total Express', issues: 7 }
  ],
  issueTypes: [
    { type: 'Atraso', count: 20 },
    { type: 'Parado', count: 12 },
    { type: 'Extravio', count: 3 },
    { type: 'Endereço Errado', count: 7 }
  ]
};
