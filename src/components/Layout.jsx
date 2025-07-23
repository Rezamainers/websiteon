import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Clock, Calendar, BarChart3, Wifi } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Outlet } from 'react-router-dom';
const StatCard = ({
  icon,
  label,
  value,
  color,
  bgColor
}) => <motion.div whileHover={{
  scale: 1.05
}} className="glass-effect rounded-xl p-4 card-hover">
    <div className="flex items-center gap-3">
      <div className={`p-2 ${bgColor} rounded-lg`}>
        {React.cloneElement(icon, {
        className: "w-5 h-5 text-white"
      })}
      </div>
      <div>
        <p className="text-sm text-gray-600">{label}</p>
        <p className={`text-2xl font-bold ${color}`}>{value}</p>
      </div>
    </div>
  </motion.div>;
const Layout = ({
  teachers,
  attendanceRecords
}) => {
  const [rfidConnected, setRfidConnected] = useState(false);
  const location = useLocation();
  useEffect(() => {
    const timer = setTimeout(() => setRfidConnected(true), 2000);
    return () => clearTimeout(timer);
  }, []);
  const getAttendanceStats = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayRecords = attendanceRecords.filter(r => r.date === today);
    return {
      total: teachers.length,
      present: todayRecords.filter(r => r.checkIn).length,
      onTime: todayRecords.filter(r => r.status === 'tepat').length,
      late: todayRecords.filter(r => r.status === 'terlambat').length,
      absent: teachers.length - todayRecords.filter(r => r.checkIn).length
    };
  };
  const stats = getAttendanceStats();
  const navItems = [{
    path: '/',
    label: 'Dashboard',
    icon: <BarChart3 className="w-4 h-4" />
  }, {
    path: '/teachers',
    label: 'Data Guru',
    icon: <Users className="w-4 h-4" />
  }, {
    path: '/attendance',
    label: 'Kehadiran',
    icon: <Clock className="w-4 h-4" />
  }, {
    path: '/reports',
    label: 'Rekap',
    icon: <Calendar className="w-4 h-4" />
  }];
  return <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        <motion.header initial={{
        opacity: 0,
        y: -20
      }} animate={{
        opacity: 1,
        y: 0
      }} className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold gradient-text mb-2">SISTEM ABSENSI GURU</h1>
              <p className="text-gray-600">SMK SINAR ISLAM ASIA PASIFIC</p>
            </div>
            <div className="flex items-center gap-2">
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${rfidConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                <Wifi className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {rfidConnected ? 'RFID Terhubung' : 'RFID Terputus'}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <StatCard icon={<Users />} label="Total Guru" value={stats.total} color="text-blue-600" bgColor="bg-blue-500" />
            <StatCard icon={<Clock />} label="Hadir Hari Ini" value={stats.present} color="text-green-600" bgColor="bg-green-500" />
            <StatCard icon={<Calendar />} label="Tepat Waktu" value={stats.onTime} color="text-emerald-600" bgColor="bg-emerald-500" />
            <StatCard icon={<Clock />} label="Terlambat" value={stats.late} color="text-yellow-600" bgColor="bg-yellow-500" />
            <StatCard icon={<Users />} label="Tidak Hadir" value={stats.absent} color="text-red-600" bgColor="bg-red-500" />
          </div>
        </motion.header>

        <nav className="flex flex-wrap gap-2 mb-6">
          {navItems.map(item => <NavLink to={item.path} key={item.path}>
              {({
            isActive
          }) => <Button variant={isActive ? 'default' : 'outline'} className="flex items-center gap-2">
                  {item.icon}
                  {item.label}
                </Button>}
            </NavLink>)}
        </nav>

        <main>
          <Outlet />
        </main>
      </div>
    </div>;
};
export default Layout;