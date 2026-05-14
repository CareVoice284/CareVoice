import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../lib/store';
import { CheckCircle, ClipboardList } from 'lucide-react';

export const Tugas = () => {
  const { user } = useAuthStore();
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch('/.netlify/functions/reports');
        const data = await res.json();
        // Filter only 'diproses' for teknisi UI mock
        if (data.length === 0) {
           setReports([
             { id: '2', title: 'Lampu Koridor Mati', location: 'Lantai 1', status: 'diproses', priority: 'rendah', createdAt: new Date().toISOString() }
           ]);
        } else {
           setReports(data.filter((r: any) => r.status === 'diproses'));
        }
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const handleComplete = async (id: string) => {
    setActionLoading(id);
    try {
      const res = await fetch('/.netlify/functions/reports', {
        method: 'PUT',
        body: JSON.stringify({
          id,
          status: 'selesai'
        })
      });

      if (res.ok) {
        setReports(reports.filter(r => r.id !== id));
      }
    } catch (error) {
      console.error('Error completing report:', error);
    } finally {
      setActionLoading(null);
    }
  };

  if (user?.role !== 'teknisi') return <div className="p-8 text-center">Akses Ditolak</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900">Tugas Pekerjaan</h1>
        <p className="text-gray-500 mt-1">Daftar tiket yang ditugaskan kepada Anda. Selesaikan tiket ini jika pekerjaan sudah tuntas.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-8 text-gray-500">Memuat data...</div>
        ) : reports.length === 0 ? (
          <div className="col-span-full bg-white p-12 text-center rounded-2xl border border-dashed border-gray-300">
            <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">Bagus! Tidak ada tugas yang sedang diproses.</p>
          </div>
        ) : reports.map(report => (
          <div key={report.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
              <span className={`px-2.5 py-1 text-xs font-semibold rounded-full bg-purple-50 text-purple-600 capitalize`}>
                Sedang Diproses
              </span>
              <span className={`px-2.5 py-1 text-xs font-semibold rounded-full capitalize
                ${report.priority === 'tinggi' ? 'bg-red-50 text-red-600' : report.priority === 'sedang' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'}
              `}>
                Prioritas {report.priority}
              </span>
            </div>
            
            <h3 className="font-bold text-lg text-gray-900 mb-1">{report.title}</h3>
            <p className="text-sm text-gray-500 flex items-center gap-1 mb-6 flex-1">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full inline-block"></span>
              {report.location}
            </p>

            <button
              onClick={() => handleComplete(report.id)}
              disabled={actionLoading === report.id}
              className="w-full flex justify-center items-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium text-white bg-green-500 hover:bg-green-600 transition-colors disabled:opacity-50 shadow-sm shadow-green-200"
            >
              {actionLoading === report.id ? 'Menyelesaikan...' : <><CheckCircle className="w-4 h-4" /> Tandai Selesai</>}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
