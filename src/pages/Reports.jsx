import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';

const Reports = ({ teachers, attendanceRecords }) => {
  const [reportPeriod, setReportPeriod] = useState('week');

  const getReportData = () => {
    const now = new Date();
    let startDate;
    
    switch (reportPeriod) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '6months':
        startDate = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
        break;
      case 'year':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    const filteredRecords = attendanceRecords.filter(r => 
      new Date(r.date) >= startDate
    );

    return filteredRecords;
  };

  const reportData = getReportData();
  const onTimeCount = reportData.filter(r => r.status === 'tepat').length;
  const lateCount = reportData.filter(r => r.status === 'terlambat').length;
  const presentCount = reportData.filter(r => r.checkIn).length;

  return (
    <>
      <Helmet>
        <title>Rekap Kehadiran - Sistem Absensi</title>
        <meta name="description" content="Lihat rekapitulasi dan statistik kehadiran guru." />
      </Helmet>
      <AnimatePresence mode="wait">
        <motion.div
          key="reports"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-6"
        >
          <Card className="glass-effect p-6">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <h2 className="text-2xl font-bold">Rekap Kehadiran</h2>
              <div className="flex items-center gap-3">
                <Select value={reportPeriod} onValueChange={setReportPeriod}>
                  <option value="week">1 Minggu</option>
                  <option value="month">1 Bulan</option>
                  <option value="6months">6 Bulan</option>
                  <option value="year">1 Tahun</option>
                </Select>
                <Button
                  onClick={() => toast({
                    title: "🚧 Fitur ini belum diimplementasikan—tapi jangan khawatir! Anda bisa memintanya di prompt berikutnya! 🚀"
                  })}
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-green-100 rounded-lg">
                <h3 className="font-semibold text-green-800">Tepat Waktu</h3>
                <p className="text-3xl font-bold text-green-600">{onTimeCount}</p>
              </div>
              <div className="p-4 bg-yellow-100 rounded-lg">
                <h3 className="font-semibold text-yellow-800">Terlambat</h3>
                <p className="text-3xl font-bold text-yellow-600">{lateCount}</p>
              </div>
              <div className="p-4 bg-blue-100 rounded-lg">
                <h3 className="font-semibold text-blue-800">Total Kehadiran</h3>
                <p className="text-3xl font-bold text-blue-600">{presentCount}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Rekap Per Guru</h3>
              {teachers.map(teacher => {
                const teacherRecords = reportData.filter(r => r.teacherId === teacher.id);
                const onTime = teacherRecords.filter(r => r.status === 'tepat').length;
                const late = teacherRecords.filter(r => r.status === 'terlambat').length;
                const present = teacherRecords.filter(r => r.checkIn).length;
                
                return (
                  <div key={teacher.id} className="p-4 bg-white/50 rounded-lg border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                          {teacher.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-semibold">{teacher.name}</h4>
                          <p className="text-sm text-gray-600">{teacher.nip}</p>
                        </div>
                      </div>
                      <div className="flex gap-4 text-sm">
                        <div className="text-center">
                          <p className="font-semibold text-green-600 text-lg">{onTime}</p>
                          <p className="text-gray-600">Tepat</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold text-yellow-600 text-lg">{late}</p>
                          <p className="text-gray-600">Terlambat</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold text-blue-600 text-lg">{present}</p>
                          <p className="text-gray-600">Total Hadir</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default Reports;