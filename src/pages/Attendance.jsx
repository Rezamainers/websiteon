import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScanLine } from 'lucide-react';

const Attendance = ({ attendanceRecords, handleRfidScan }) => {
  const [rfidInput, setRfidInput] = useState('');

  const handleManualCheckIn = (e) => {
    e.preventDefault();
    if (rfidInput.trim()) {
      handleRfidScan(rfidInput.trim());
      setRfidInput('');
    }
  };

  return (
    <>
      <Helmet>
        <title>Data Kehadiran - Sistem Absensi</title>
        <meta name="description" content="Lihat semua riwayat data kehadiran guru dan lakukan absensi manual." />
      </Helmet>
      <AnimatePresence mode="wait">
        <motion.div
          key="attendance"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-6"
        >
          <Card className="glass-effect p-6">
            <h2 className="text-2xl font-bold mb-4">Absensi Manual</h2>
            <form onSubmit={handleManualCheckIn} className="flex items-center gap-4">
              <Input
                type="text"
                placeholder="Scan atau masukkan UID RFID..."
                value={rfidInput}
                onChange={(e) => setRfidInput(e.target.value)}
                className="flex-grow"
              />
              <Button type="submit" className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                <ScanLine className="w-4 h-4" />
                Check In / Out
              </Button>
            </form>
          </Card>

          <Card className="glass-effect p-6">
            <h2 className="text-2xl font-bold mb-6">Riwayat Kehadiran</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Tanggal</th>
                    <th className="text-left p-3">Nama Guru</th>
                    <th className="text-left p-3">Jam Masuk</th>
                    <th className="text-left p-3">Jam Keluar</th>
                    <th className="text-left p-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceRecords.length > 0 ? attendanceRecords
                    .sort((a, b) => new Date(b.checkInTime) - new Date(a.checkInTime))
                    .map(record => (
                      <tr key={record.id} className="border-b hover:bg-white/30">
                        <td className="p-3">{new Date(record.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
                        <td className="p-3">{record.teacherName}</td>
                        <td className="p-3">{record.checkIn || '-'}</td>
                        <td className="p-3">{record.checkOut || '-'}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium status-${record.status || 'tidak-hadir'}`}>
                            {record.status === 'tepat' ? 'Tepat Waktu' : 
                             record.status === 'terlambat' ? 'Terlambat' : 
                             record.status === 'lembur' ? 'Lembur' : 'Tidak Hadir'}
                          </span>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="5" className="text-center py-8 text-gray-500">Belum ada data kehadiran.</td>
                      </tr>
                    )}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default Attendance;