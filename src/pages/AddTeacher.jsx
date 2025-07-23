import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Checkbox } from '@/components/ui/checkbox';

const days = [
  { id: 'senin', name: 'Senin' },
  { id: 'selasa', name: 'Selasa' },
  { id: 'rabu', name: 'Rabu' },
  { id: 'kamis', name: 'Kamis' },
  { id: 'jumat', name: 'Jumat' },
  { id: 'sabtu', name: 'Sabtu' },
  { id: 'minggu', name: 'Minggu' },
];

const AddTeacher = ({ addTeacher }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    nip: '',
    rfidId: '',
  });
  const [schedule, setSchedule] = useState(
    days.reduce((acc, day) => {
      acc[day.id] = { isWorkDay: true, jamMasuk: '08:00', jamKeluar: '16:00' };
      return acc;
    }, {})
  );

  const handleScheduleChange = (dayId, field, value) => {
    setSchedule(prev => ({
      ...prev,
      [dayId]: {
        ...prev[dayId],
        [field]: value,
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.nip || !formData.rfidId) {
      toast({
        title: "Error",
        description: "Informasi dasar guru harus diisi",
        variant: "destructive"
      });
      return;
    }
    addTeacher({ ...formData, schedule });
    navigate('/teachers');
  };

  return (
    <>
      <Helmet>
        <title>Tambah Guru - Sistem Absensi</title>
        <meta name="description" content="Halaman untuk menambahkan data guru baru beserta jadwal hariannya." />
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <Button variant="outline" onClick={() => navigate('/teachers')} className="mb-6 flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Data Guru
        </Button>
        <Card className="glass-effect p-6 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Tambah Data Guru Baru</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input id="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Masukkan nama lengkap" />
              </div>
              <div>
                <Label htmlFor="nip">NIP</Label>
                <Input id="nip" value={formData.nip} onChange={(e) => setFormData({...formData, nip: e.target.value})} placeholder="Masukkan NIP" />
              </div>
              <div>
                <Label htmlFor="rfidId">ID RFID</Label>
                <Input id="rfidId" value={formData.rfidId} onChange={(e) => setFormData({...formData, rfidId: e.target.value})} placeholder="Scan atau masukkan ID RFID" />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Jadwal Kerja Mingguan</h3>
              <div className="space-y-4">
                {days.map(day => (
                  <div key={day.id} className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 p-3 bg-white/30 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id={`workday-${day.id}`}
                        checked={schedule[day.id].isWorkDay}
                        onCheckedChange={(checked) => handleScheduleChange(day.id, 'isWorkDay', checked)}
                      />
                      <Label htmlFor={`workday-${day.id}`} className="font-semibold">{day.name}</Label>
                    </div>
                    <div className="col-span-3 grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`jamMasuk-${day.id}`}>Jam Masuk</Label>
                        <Input id={`jamMasuk-${day.id}`} type="time" value={schedule[day.id].jamMasuk} onChange={(e) => handleScheduleChange(day.id, 'jamMasuk', e.target.value)} disabled={!schedule[day.id].isWorkDay} />
                      </div>
                      <div>
                        <Label htmlFor={`jamKeluar-${day.id}`}>Jam Keluar</Label>
                        <Input id={`jamKeluar-${day.id}`} type="time" value={schedule[day.id].jamKeluar} onChange={(e) => handleScheduleChange(day.id, 'jamKeluar', e.target.value)} disabled={!schedule[day.id].isWorkDay} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">Simpan Data</Button>
              <Button type="button" variant="outline" onClick={() => navigate('/teachers')} className="flex-1">Batal</Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </>
  );
};

export default AddTeacher;