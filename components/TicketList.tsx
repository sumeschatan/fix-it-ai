import React from 'react';
import { Ticket, TicketStatus } from '../types';
import { Clock, CheckCircle, AlertCircle, FileText, Monitor } from 'lucide-react';

interface TicketListProps {
  tickets: Ticket[];
}

const TicketList: React.FC<TicketListProps> = ({ tickets }) => {
  const getStatusBadge = (status: TicketStatus) => {
    switch (status) {
      case TicketStatus.PENDING:
        return <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><Clock size={12} /> รอดำเนินการ</span>;
      case TicketStatus.IN_PROGRESS:
        return <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"><Monitor size={12} /> กำลังซ่อม</span>;
      case TicketStatus.COMPLETED:
        return <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle size={12} /> เสร็จสิ้น</span>;
      case TicketStatus.CANCELLED:
        return <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><AlertCircle size={12} /> ยกเลิก</span>;
      default:
        return null;
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'CRITICAL': return 'text-red-600 font-bold';
      case 'HIGH': return 'text-orange-500 font-semibold';
      case 'MEDIUM': return 'text-yellow-600';
      default: return 'text-slate-500';
    }
  };

  if (tickets.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-slate-100">
        <FileText className="mx-auto h-12 w-12 text-slate-300 mb-4" />
        <h3 className="text-lg font-medium text-slate-900">ไม่มีรายการแจ้งซ่อม</h3>
        <p className="mt-1 text-slate-500">เริ่มสร้างคำร้องใหม่ได้เลย</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden animate-fade-in">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-700 font-medium border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">Ticket ID</th>
              <th className="px-6 py-4">ผู้แจ้ง (Requester)</th>
              <th className="px-6 py-4">ปัญหา (Issue)</th>
              <th className="px-6 py-4">ประเภท (Device)</th>
              <th className="px-6 py-4">ความสำคัญ (Urgency)</th>
              <th className="px-6 py-4">สถานะ (Status)</th>
              <th className="px-6 py-4">วันที่ (Date)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tickets.map((ticket) => (
              <tr key={ticket.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">{ticket.id}</td>
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-800">{ticket.requesterName}</div>
                  <div className="text-xs text-slate-500">{ticket.department}</div>
                </td>
                <td className="px-6 py-4 max-w-xs truncate" title={ticket.description}>
                  <span className="text-slate-700">{ticket.description}</span>
                  {ticket.aiCategory && (
                     <span className="block text-xs text-indigo-500 mt-1">Tag: {ticket.aiCategory}</span>
                  )}
                </td>
                <td className="px-6 py-4 text-slate-600">{ticket.deviceType}</td>
                <td className={`px-6 py-4 ${getUrgencyColor(ticket.urgency)}`}>{ticket.urgency}</td>
                <td className="px-6 py-4">{getStatusBadge(ticket.status)}</td>
                <td className="px-6 py-4 text-slate-500">
                  {new Date(ticket.createdAt).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TicketList;