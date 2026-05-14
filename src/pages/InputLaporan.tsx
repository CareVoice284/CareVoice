import React, { useState } from 'react';
import { useAuthStore } from '../lib/store';
import { Camera, MapPin, AlertCircle, Send } from 'lucide-react';

export const InputLaporan = () => {
  const { user } = useAuthStore();
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [priority, setPriority] = useState('sedang');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/.netlify/functions/reports', {
        method: 'POST',
        body: JSON.stringify({
          title,
          location,
          priority,
          createdBy: user?.id,
          photoUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=400&q=80', // Dummy image for wow factor
        })
      });

      if (res.ok) {
        setSuccess(true);
        setTitle('');
        setLocation('');
        setPriority('sedang');
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Error submitting report:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900">Buat Laporan Baru</h1>
        <p className="text-gray-500 mt-1">Isi detail kerusakan atau masalah sarana prasarana yang Anda temukan.</p>
      </div>

      {success && (
        <div className="bg-green-50 text-green-700 p-4 rounded-xl border border-green-200 flex items-center gap-3">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <Send className="w-4 h-4" />
          </div>
          Laporan berhasil dikirim dan sedang menunggu verifikasi admin.
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Judul Laporan</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-gray-50/50"
            placeholder="Contoh: AC Ruang Rapat Bocor"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-gray-400" /> Lokasi</div>
            </label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-gray-50/50"
              placeholder="Contoh: Lantai 2, Ruang A"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center gap-2"><AlertCircle className="w-4 h-4 text-gray-400" /> Prioritas</div>
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-gray-50/50 appearance-none"
            >
              <option value="rendah">Rendah (Pengerjaan 3-5 hari)</option>
              <option value="sedang">Sedang (Pengerjaan 1-2 hari)</option>
              <option value="tinggi">Tinggi (Segera / Darurat)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center gap-2"><Camera className="w-4 h-4 text-gray-400" /> Foto Bukti</div>
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group">
            <div className="space-y-1 text-center">
              <Camera className="mx-auto h-12 w-12 text-gray-400 group-hover:text-primary transition-colors" />
              <div className="flex text-sm text-gray-600 justify-center">
                <span className="relative cursor-pointer rounded-md font-medium text-primary hover:text-secondary focus-within:outline-none">
                  <span>Upload a file</span>
                </span>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-primary hover:bg-secondary transition-colors disabled:opacity-50"
          >
            {loading ? 'Mengirim...' : <><Send className="w-4 h-4" /> Kirim Laporan</>}
          </button>
        </div>
      </form>
    </div>
  );
};
