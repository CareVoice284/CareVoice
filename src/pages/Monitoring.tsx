import React, { useEffect, useState } from 'react';

export const Monitoring = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch('/.netlify/functions/reports');
        const data = await res.json();
        // Mock data if DB is empty for UI demonstration
        if (data.length === 0) {
           setReports([
             { id: '1', title: 'AC Ruang Rapat Bocor', location: 'Lantai 2', status: 'menunggu', priority: 'sedang', createdAt: new Date().toISOString() },
             { id: '2', title: 'Lampu Koridor Mati', location: 'Lantai 1', status: 'diproses', priority: 'rendah', createdAt: new Date().toISOString() },
             { id: '3', title: 'Pintu Utama Rusak', location: 'Lobi', status: 'selesai', priority: 'tinggi', createdAt: new Date().toISOString() }
           ]);
        } else {
           setReports(data);
        }
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'menunggu': return 'bg-yellow-100 text-yellow-800';
      case 'diproses': return 'bg-purple-100 text-purple-800';
      case 'selesai': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'tinggi': return 'text-red-600 bg-red-50';
      case 'sedang': return 'text-orange-600 bg-orange-50';
      case 'rendah': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Monitoring Tiket</h1>
          <p className="text-gray-500 mt-1">Pantau status semua laporan sarana prasarana secara real-time.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Laporan</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lokasi</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prioritas</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">Memuat data...</td></tr>
              ) : reports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{report.title}</div>
                    <div className="text-xs text-gray-500">ID: {report.id.substring(0,8)}...</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {report.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(report.priority)} capitalize`}>
                      {report.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(report.status)} capitalize`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(report.createdAt).toLocaleDateString('id-ID')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
