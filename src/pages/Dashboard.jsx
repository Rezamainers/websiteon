import React from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Dashboard = ({ teachers, attendanceRecords, simulateRfidScan }) => {
  const today = new Date().toISOString().split('T')[0];
  const rfidConnected = true; // Assuming connected for dashboard view

  return (
    <>
      <Helmet>
        <title>Dashboard - Sistem Absensi Guru</title>
        <meta name="description" content="Dashboard utama untuk memonitor absensi guru secara real-time." />
      </Helmet>
      <AnimatePresence mode="wait">
        <motion.div
          key="dashboard"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-6"
        >
          <Card className="glass-effect p-6">
            <h2 className="text-2xl font-bold mb-4">Absensi Hari Ini</h2>
            <div className="space-y-4">
              {teachers.length > 0 ? teachers.map(teacher => {
                const todayRecord = attendanceRecords.find(
                  r => r.teacherId === teacher.id && r.date === today
                );
                
                return (
                  <motion.div
                    key={teacher.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center justify-between p-4 bg-white/50 rounded-lg border"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                        {teacher.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold">{teacher.name}</h3>
                        <p className="text-sm text-gray-600">
                          Jadwal: {teacher.jamMasuk} - {teacher.jamKeluar}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {todayRecord ? (
                        <div className="flex items-center gap-2 text-right">
                          <div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium status-${todayRecord.status}`}>
                              {todayRecord.status === 'tepat' ? 'Tepat Waktu' : 'Terlambat'}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">
                            <p>Masuk: {todayRecord.checkIn}</p>
                            <p>Keluar: {todayRecord.checkOut || '...'}</p>
                          </div>
                        </div>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-medium status-tidak-hadir">
                          Belum Absen
                        </span>
                      )}
                      <Button
                        size="sm"
                        onClick={() => simulateRfidScan(teacher.id)}
                        disabled={!rfidConnected}
                        className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 w-28"
                      >
                        {todayRecord?.checkIn && !todayRecord?.checkOut ? 'Check Out' : 'Check In'}
                      </Button>
                    </div>
                  </motion.div>
                );
              }) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Belum ada data guru.</p>
                  <p>Silakan tambahkan data guru terlebih dahulu.</p>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default Dashboard;