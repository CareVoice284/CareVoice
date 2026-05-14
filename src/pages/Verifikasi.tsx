import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../lib/store';
import { CheckSquare, UserPlus } from 'lucide-react';

export const Verifikasi = () => {
  const { user } = useAuthStore();
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch('/.netlify/functions/reports');
        const data = await res.json();
        // Filter only 'menunggu' for verifikasi, or mock for UI if empty
        if (data.length === 0) {
           setReports([
             { id: '1', title: 'AC Ruang Rapat Bocor', location: 'Lantai 2', status: 'menunggu', priority: 'sedang', createdAt: new Date().toISOString() }
           ]);
        } else {
           setReports(data.filter((r: any) => r.status === 'menunggu'));
        }
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const handleAssign = async (id: string) => {
    setActionLoading(id);
    try {
      const res = await fetch('/.netlify/functions/reports', {
        method: 'PUT',
        body: JSON.stringify({
          id,
          status: 'diproses',
          assignedTo: 'teknisi-1' // In a real app, this would come from a dropdown of teknisi
        })
      });

      if (res.ok) {
        setReports(reports.filter(r => r.id !== id));
      }
    } catch (error) {
      console.error('Error assigning report:', error);
    } finally {
      setActionLoading(null);
    }
  };

  if (user?.role !== 'admin') return <div className="p-8 text-center">Akses Ditolak</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900">Verifikasi Laporan</h1>
        <p className="text-gray-500 mt-1">Tugaskan tiket yang menunggu kepada teknisi yang tersedia.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-8 text-gray-500">Memuat data...</div>
        ) : reports.length === 0 ? (
          <div className="col-span-full bg-white p-12 text-center rounded-2xl border border-dashed border-gray-300">
            <CheckSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">Tidak ada tiket yang menunggu verifikasi.</p>
          </div>
        ) : reports.map(report => (
          <div key={report.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
              <span className={`px-2.5 py-1 text-xs font-semibold rounded-full capitalize
                ${report.priority === 'tinggi' ? 'bg-red-50 text-red-600' : report.priority === 'sedang' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'}
              `}>
                Prioritas {report.priority}
              </span>
              <span className="text-xs text-gray-400">{new Date(report.createdAt).toLocaleDateString('id-ID')}</span>
            </div>
            
            <h3 className="font-bold text-lg text-gray-900 mb-1">{report.title}</h3>
            <p className="text-sm text-gray-500 flex items-center gap-1 mb-6 flex-1">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full inline-block"></span>
              {report.location}
            </p>

            <button
              onClick={() => handleAssign(report.id)}
              disabled={actionLoading === report.id}
              className="w-full flex justify-center items-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 transition-colors disabled:opacity-50"
            >
              {actionLoading === report.id ? 'Memproses...' : <><UserPlus className="w-4 h-4" /> Tugaskan ke Teknisi 1</>}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
