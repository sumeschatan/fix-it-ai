import React, { useState, useRef } from 'react';
import { Ticket, TicketStatus, Urgency } from '../types';
import { DEPARTMENTS, DEVICE_TYPES } from '../constants';
import { analyzeTicketIssue, AIAnalysisResult } from '../services/geminiService';
import { Loader2, Sparkles, Upload, X } from 'lucide-react';

interface RequestFormProps {
  onSubmit: (ticket: Ticket) => void;
  onCancel: () => void;
}

const RequestForm: React.FC<RequestFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    requesterName: '',
    department: DEPARTMENTS[0],
    deviceType: DEVICE_TYPES[0],
    description: '',
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<AIAnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAIAnalyze = async () => {
    if (!formData.description) return;
    
    setIsAnalyzing(true);
    const result = await analyzeTicketIssue(formData.description, imagePreview || undefined);
    setAiResult(result);
    setIsAnalyzing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newTicket: Ticket = {
      id: `T-${Math.floor(1000 + Math.random() * 9000)}`,
      ...formData,
      status: TicketStatus.PENDING,
      urgency: aiResult?.urgency ? Urgency[aiResult.urgency as keyof typeof Urgency] : Urgency.MEDIUM,
      createdAt: new Date().toISOString(),
      aiDiagnosis: aiResult?.diagnosis,
      aiCategory: aiResult?.category,
      image: imagePreview || undefined
    };

    onSubmit(newTicket);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg animate-fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">แจ้งซ่อมคอมพิวเตอร์ / อุปกรณ์ไอที</h2>
        <p className="text-slate-500">กรอกข้อมูลเพื่อให้เจ้าหน้าที่ตรวจสอบ (Submit a Repair Request)</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">ชื่อผู้แจ้ง (Requester Name)</label>
            <input
              type="text"
              name="requesterName"
              required
              value={formData.requesterName}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="Ex. สมชาย ใจดี"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">แผนก (Department)</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              {DEPARTMENTS.map(dept => <option key={dept} value={dept}>{dept}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">ประเภทอุปกรณ์ (Device Type)</label>
          <select
            name="deviceType"
            value={formData.deviceType}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
          >
            {DEVICE_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
          </select>
        </div>

        <div>
          <div className="flex justify-between items-end mb-1">
            <label className="block text-sm font-medium text-slate-700">รายละเอียดปัญหา (Problem Description)</label>
            <button
              type="button"
              onClick={handleAIAnalyze}
              disabled={isAnalyzing || !formData.description}
              className={`text-xs flex items-center gap-1 px-3 py-1 rounded-full transition-all ${
                isAnalyzing || !formData.description 
                  ? 'bg-slate-100 text-slate-400' 
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:shadow-lg hover:scale-105'
              }`}
            >
              {isAnalyzing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
              {isAnalyzing ? 'กำลังวิเคราะห์...' : 'วิเคราะห์อาการด้วย AI'}
            </button>
          </div>
          <textarea
            name="description"
            required
            rows={4}
            value={formData.description}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
            placeholder="อธิบายอาการเสีย เช่น เปิดไม่ติด, หน้าจอฟ้า, เครื่องช้ามาก..."
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">รูปภาพประกอบ (Screenshot/Photo)</label>
          <div className="flex items-center gap-4">
             <div className="relative">
               <input
                 type="file"
                 ref={fileInputRef}
                 accept="image/*"
                 onChange={handleImageChange}
                 className="hidden"
               />
               <button
                 type="button"
                 onClick={() => fileInputRef.current?.click()}
                 className="flex items-center gap-2 px-4 py-2 border border-dashed border-slate-400 rounded-lg text-slate-600 hover:bg-slate-50 transition"
               >
                 <Upload size={16} />
                 เลือกรูปภาพ
               </button>
             </div>
             {imagePreview && (
               <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-200 shadow-sm group">
                 <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                 <button 
                   type="button"
                   onClick={clearImage}
                   className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition"
                 >
                   <X size={12} />
                 </button>
               </div>
             )}
          </div>
        </div>

        {/* AI Analysis Result Area */}
        {aiResult && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 animate-fade-in-up">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="text-blue-600 w-5 h-5" />
              <h3 className="font-semibold text-blue-800">ผลวิเคราะห์จาก AI (AI Diagnosis)</h3>
            </div>
            <div className="space-y-3 text-sm text-slate-700">
              <p><span className="font-medium text-slate-900">อาการที่คาดว่าจะเป็น:</span> {aiResult.diagnosis}</p>
              <p>
                <span className="font-medium text-slate-900">ความเร่งด่วน:</span> 
                <span className={`ml-2 px-2 py-0.5 rounded text-xs font-bold ${
                  aiResult.urgency === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                  aiResult.urgency === 'HIGH' ? 'bg-orange-100 text-orange-700' :
                  aiResult.urgency === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {aiResult.urgency}
                </span>
              </p>
              
              <div>
                <p className="font-medium text-slate-900 mb-1">วิธีแก้ไขเบื้องต้น (Troubleshooting):</p>
                <ul className="list-disc pl-5 space-y-1 text-slate-600">
                  {aiResult.troubleshootingSteps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition"
          >
            ยกเลิก (Cancel)
          </button>
          <button
            type="submit"
            className="px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium shadow-md hover:shadow-lg transition flex items-center gap-2"
          >
            ยืนยันส่งคำร้อง (Submit Ticket)
          </button>
        </div>
      </form>
    </div>
  );
};

export default RequestForm;