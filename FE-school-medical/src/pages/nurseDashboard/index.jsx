import Dashboard from '../../components/DashBoard';

const nurseCardData = [
  { title: 'Total Patients', value: '1,247', change: '+12%', changeType: 'positive'},
  // ...other nurse-specific cards
];

export default function NurseDashboard() {
  return <Dashboard cardData={nurseCardData} />;
}