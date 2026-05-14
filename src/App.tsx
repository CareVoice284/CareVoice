import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { InputLaporan } from './pages/InputLaporan';
import { Monitoring } from './pages/Monitoring';
import { Verifikasi } from './pages/Verifikasi';
import { Tugas } from './pages/Tugas';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/monitoring" element={<Monitoring />} />
          <Route path="/input" element={<InputLaporan />} />
          <Route path="/verifikasi" element={<Verifikasi />} />
          <Route path="/tugas" element={<Tugas />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
