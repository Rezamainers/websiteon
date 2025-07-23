import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Trash2, Eye, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const daysMap = {
  senin: 'Senin',
  selasa: 'Selasa',
  rabu: 'Rabu',
  kamis: 'Kamis',
  jumat: 'Jumat',
  sabtu: 'Sabtu',
  minggu: 'Minggu',
};

const ViewScheduleDialog = ({ teacher }) => (
  <DialogContent className="max-w-md">
    <DialogHeader>
      <DialogTitle>Jadwal Kerja - {teacher.name}</DialogTitle>
    </DialogHeader>
    <div className="mt-4 space-y-3">
      {teacher.schedule && Object.entries(teacher.schedule).map(([day, sched]) => (
        <div key={day} className="flex justify-between items-center p-2 rounded-md bg-gray-50">
          <span className="font-semibold">{daysMap[day]}</span>
          {sched.isWorkDay ? (
            <span className="text-sm">{sched.jamMasuk} - {sched.jamKeluar}</span>
          ) : (
            <span className="text-sm text-gray-500">Libur</span>
          )}
        </div>
      ))}
    </div>
  </DialogContent>
);

const ViewAttendanceDialog = ({ teacher, records, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Riwayat Kehadiran - {teacher.name}</h2>
          <Button variant="outline" onClick={onClose}>Tutup</Button>
        </div>
        
        <div className="space-y-4">
          {records.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Belum ada data kehadiran</p>
          ) : (
            records
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .map(record => (
                <div key={record.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{new Date(record.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                      <p className="text-sm text-gray-600">
                        Masuk: {record.checkIn || '-'} | Keluar: {record.checkOut || '-'}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium status-${record.status || 'tidak-hadir'}`}>
                      {record.status === 'tepat' ? 'Tepat Waktu' : 
                       record.status === 'terlambat' ? 'Terlambat' : 
                       record.status === 'lembur' ? 'Lembur' : 'Tidak Hadir'}
                    </span>
                  </div>
                </div>
              ))
          )}
        </div>
      </motion.div>
    </div>
  );
};

const Teachers = ({ teachers, attendanceRecords, deleteTeacher }) => {
  const navigate = useNavigate();
  const [isViewAttendanceOpen, setIsViewAttendanceOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  return (
    <>
      <Helmet>
        <title>Data Guru - Sistem Absensi</title>
        <meta name="description" content="Kelola data guru, tambah, lihat, dan hapus data." />
      </Helmet>
      <AnimatePresence mode="wait">
        <motion.div
          key="teachers"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-6"
        >
          <Card className="glass-effect p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Data Guru</h2>
              <Button
                onClick={() => navigate('/teachers/add')}
                className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
              >
                <UserPlus className="w-4 h-4" />
                Tambah Guru
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teachers.map(teacher => (
                <motion.div
                  key={teacher.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.05 }}
                  className="p-4 bg-white/50 rounded-lg border card-hover"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      {teacher.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold">{teacher.name}</h3>
                      <p className="text-sm text-gray-600">{teacher.nip}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm mb-4">
                    <p><span className="font-medium">RFID:</span> {teacher.rfidId}</p>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" className="flex items-center gap-1">
                          <CalendarDays className="w-3 h-3" /> Jadwal
                        </Button>
                      </DialogTrigger>
                      <ViewScheduleDialog teacher={teacher} />
                    </Dialog>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedTeacher(teacher);
                        setIsViewAttendanceOpen(true);
                      }}
                      className="flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      Riwayat
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteTeacher(teacher.id)}
                      className="flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      Hapus
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>

      <Dialog open={isViewAttendanceOpen} onOpenChange={setIsViewAttendanceOpen}>
        {selectedTeacher && (
          <ViewAttendanceDialog 
            teacher={selectedTeacher} 
            records={attendanceRecords.filter(r => r.teacherId === selectedTeacher.id)}
            onClose={() => setIsViewAttendanceOpen(false)} 
          />
        )}
      </Dialog>
    </>
  );
};

export default Teachers;