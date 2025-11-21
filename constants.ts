import { Ticket, TicketStatus, Urgency } from './types';

export const MOCK_TICKETS: Ticket[] = [
  {
    id: 'T-1001',
    requesterName: 'สมชาย ใจดี',
    department: 'บัญชี',
    deviceType: 'Laptop Dell XPS',
    description: 'เปิดเครื่องไม่ติด ไฟสถานะกระพริบสีส้ม',
    status: TicketStatus.PENDING,
    urgency: Urgency.HIGH,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    aiDiagnosis: 'อาจเกิดจากปัญหา Power Supply หรือ Mainboard',
    aiCategory: 'Hardware'
  },
  {
    id: 'T-1002',
    requesterName: 'วิภาดา รักงาน',
    department: 'HR',
    deviceType: 'PC Desktop',
    description: 'เข้าอินเทอร์เน็ตไม่ได้ แต่โปรแกรมอื่นใช้งานได้ปกติ',
    status: TicketStatus.IN_PROGRESS,
    urgency: Urgency.MEDIUM,
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    aiDiagnosis: 'น่าจะเกิดจาก DNS หรือการตั้งค่า Proxy',
    aiCategory: 'Network'
  },
  {
    id: 'T-1003',
    requesterName: 'ก้องภพ จอมเทคนิค',
    department: 'การตลาด',
    deviceType: 'Printer Canon',
    description: 'กระดาษติดบ่อยมาก พิมพ์ไม่ออก',
    status: TicketStatus.COMPLETED,
    urgency: Urgency.LOW,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    aiCategory: 'Peripheral'
  }
];

export const DEPARTMENTS = [
  'บัญชี (Accounting)',
  'ทรัพยากรบุคคล (HR)',
  'การตลาด (Marketing)',
  'ฝ่ายขาย (Sales)',
  'ไอที (IT)',
  'บริหาร (Management)'
];

export const DEVICE_TYPES = [
  'Desktop PC',
  'Laptop / Notebook',
  'Printer / Scanner',
  'Network / Wi-Fi',
  'Software / Program',
  'Other'
];