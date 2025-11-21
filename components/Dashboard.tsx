import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Ticket, TicketStatus } from '../types';
import { CheckCircle, Clock, AlertCircle, Activity } from 'lucide-react';

interface DashboardProps {
  tickets: Ticket[];
}

const COLORS = ['#FBBF24', '#3B82F6', '#10B981', '#EF4444']; // Pending (Yellow), Progress (Blue), Completed (Green), Cancelled (Red)

const Dashboard: React.FC<DashboardProps> = ({ tickets }) => {
  // Calculate stats
  const stats = {
    total: tickets.length,
    pending: tickets.filter(t => t.status === TicketStatus.PENDING).length,
    inProgress: tickets.filter(t => t.status === TicketStatus.IN_PROGRESS).length,
    completed: tickets.filter(t => t.status === TicketStatus.COMPLETED).length,
    highPriority: tickets.filter(t => t.urgency === 'HIGH' || t.urgency === 'CRITICAL').length
  };

  const statusData = [
    { name: 'รอดำเนินการ', value: stats.pending, color: '#FBBF24' }, // Amber-400
    { name: 'กำลังซ่อม', value: stats.inProgress, color: '#3B82F6' }, // Blue-500
    { name: 'เสร็จสิ้น', value: stats.completed, color: '#10B981' }, // Emerald-500
  ];

  // Group by Category (Mock or Real if AI provided)
  const categoryCount: Record<string, number> = {};
  tickets.forEach(t => {
    const cat = t.aiCategory || 'General';
    categoryCount[cat] = (categoryCount[cat] || 0) + 1;
  });

  const categoryData = Object.keys(categoryCount).map(key => ({
    name: key,
    count: categoryCount[key]
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-blue-50 rounded-full text-blue-600">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500">งานทั้งหมด</p>
            <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-amber-50 rounded-full text-amber-600">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500">รอดำเนินการ</p>
            <p className="text-2xl font-bold text-slate-800">{stats.pending}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 rounded-full text-emerald-600">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500">เสร็จสิ้นแล้ว</p>
            <p className="text-2xl font-bold text-slate-800">{stats.completed}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-red-50 rounded-full text-red-600">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500">ความสำคัญสูง</p>
            <p className="text-2xl font-bold text-slate-800">{stats.highPriority}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">สถานะงานซ่อม (Status)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">ประเภทปัญหา (Categories)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip cursor={{fill: '#f1f5f9'}} />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} name="จำนวนเคส" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;