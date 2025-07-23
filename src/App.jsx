
import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { toast } from '@/components/ui/use-toast';
import Layout from '@/components/Layout';
import Dashboard from '@/pages/Dashboard';
import Teachers from '@/pages/Teachers';
import AddTeacher from '@/pages/AddTeacher';
import Attendance from '@/pages/Attendance';
import Reports from '@/pages/Reports';
import { supabase } from '@/lib/customSupabaseClient';

function App() {
  const [teachers, setTeachers] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);

  const fetchTeachers = useCallback(async () => {
    const { data, error } = await supabase.from('teachers').select('*').order('created_at', { ascending: false });
    if (error) {
      toast({ title: 'Error fetching teachers', description: error.message, variant: 'destructive' });
    } else {
      const formattedData = data.map(teacher => ({ ...teacher, rfidId: teacher.rfid_id }));
      setTeachers(formattedData);
    }
  }, []);

  const fetchAttendanceRecords = useCallback(async () => {
    const { data, error } = await supabase.from('attendance_records').select('*').order('created_at', { ascending: false });
    if (error) {
      toast({ title: 'Error fetching attendance', description: error.message, variant: 'destructive' });
    } else {
      const formattedData = data.map(record => ({ ...record, checkIn: record.check_in, checkOut: record.check_out, checkInTime: record.check_in_time, checkOutTime: record.check_out_time, teacherId: record.teacher_id, teacherName: record.teacher_name, scheduledIn: record.scheduled_in, scheduledOut: record.scheduled_out }));
      setAttendanceRecords(formattedData);
    }
  }, []);

  useEffect(() => {
    fetchTeachers();
    fetchAttendanceRecords();
  }, [fetchTeachers, fetchAttendanceRecords]);

  const addTeacher = async (teacherData) => {
    const { name, nip, rfidId, schedule } = teacherData;
    const { data, error } = await supabase
      .from('teachers')
      .insert([{ name, nip, rfid_id: rfidId, schedule }])
      .select();

    if (error) {
      toast({ title: 'Error adding teacher', description: error.message, variant: 'destructive' });
    } else {
      const newTeacher = { ...data[0], rfidId: data[0].rfid_id };
      setTeachers(prev => [newTeacher, ...prev]);
      toast({ title: 'Berhasil!', description: 'Data guru berhasil ditambahkan' });
    }
  };

  const deleteTeacher = async (teacherId) => {
    const { error } = await supabase.from('teachers').delete().eq('id', teacherId);
    if (error) {
      toast({ title: 'Error deleting teacher', description: error.message, variant: 'destructive' });
    } else {
      setTeachers(prev => prev.filter(t => t.id !== teacherId));
      setAttendanceRecords(prev => prev.filter(a => a.teacherId !== teacherId));
      toast({ title: 'Berhasil!', description: 'Data guru berhasil dihapus' });
    }
  };

  const handleRfidScan = async (rfidId) => {
    const { data: teacherData, error: teacherError } = await supabase.from('teachers').select('*').eq('rfid_id', rfidId).single();
    if (teacherError || !teacherData) {
      toast({ title: 'Error!', description: 'RFID tidak terdaftar.', variant: 'destructive' });
      return;
    }
    const teacher = { ...teacherData, rfidId: teacherData.rfid_id };

    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);
    const currentDate = now.toISOString().split('T')[0];

    const { data: todayRecordData, error: recordError } = await supabase
      .from('attendance_records')
      .select('*')
      .eq('teacher_id', teacher.id)
      .eq('date', currentDate)
      .single();

    if (todayRecordData && todayRecordData.check_in && !todayRecordData.check_out) {
      const { data: updatedRecord, error } = await supabase
        .from('attendance_records')
        .update({ check_out: currentTime, check_out_time: now.toISOString() })
        .eq('id', todayRecordData.id)
        .select();
      
      if (error) {
        toast({ title: 'Error checking out', description: error.message, variant: 'destructive' });
      } else {
        await fetchAttendanceRecords();
        toast({ title: 'Check Out Berhasil!', description: `${teacher.name} telah check out pada ${currentTime}` });
      }
    } else {
      const dayIndex = now.getDay();
      const days = ['minggu', 'senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu'];
      const currentDayName = days[dayIndex];
      const todaySchedule = teacher.schedule ? teacher.schedule[currentDayName] : null;

      let status = 'lembur';
      if (todaySchedule && todaySchedule.isWorkDay) {
        const checkInTime = new Date(`${currentDate}T${todaySchedule.jamMasuk}:00`);
        status = now > checkInTime ? 'terlambat' : 'tepat';
      }

      const newRecord = {
        teacher_id: teacher.id,
        teacher_name: teacher.name,
        date: currentDate,
        check_in: currentTime,
        check_in_time: now.toISOString(),
        scheduled_in: (todaySchedule && todaySchedule.isWorkDay) ? todaySchedule.jamMasuk : 'N/A',
        scheduled_out: (todaySchedule && todaySchedule.isWorkDay) ? todaySchedule.jamKeluar : 'N/A',
        status,
      };

      const { error } = await supabase.from('attendance_records').insert(newRecord);

      if(error) {
        toast({ title: 'Error checking in', description: error.message, variant: 'destructive' });
      } else {
        await fetchAttendanceRecords();
        let statusMessage = "Lembur";
        if (status === 'tepat') statusMessage = "Tepat Waktu";
        if (status === 'terlambat') statusMessage = "Terlambat";
        toast({ title: 'Check In Berhasil!', description: `${teacher.name} masuk sebagai ${statusMessage} - ${currentTime}` });
      }
    }
  };

  const simulateRfidScan = (teacherId) => {
    const teacher = teachers.find(t => t.id === teacherId);
    if (teacher) {
        handleRfidScan(teacher.rfidId);
    }
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<Layout teachers={teachers} attendanceRecords={attendanceRecords} />}>
          <Route index element={<Dashboard teachers={teachers} attendanceRecords={attendanceRecords} simulateRfidScan={simulateRfidScan} />} />
          <Route path="teachers" element={<Teachers teachers={teachers} attendanceRecords={attendanceRecords} deleteTeacher={deleteTeacher} />} />
          <Route path="teachers/add" element={<AddTeacher addTeacher={addTeacher} />} />
          <Route path="attendance" element={<Attendance attendanceRecords={attendanceRecords} handleRfidScan={handleRfidScan} />} />
          <Route path="reports" element={<Reports teachers={teachers} attendanceRecords={attendanceRecords} />} />
        </Route>
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
