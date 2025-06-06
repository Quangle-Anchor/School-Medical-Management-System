import React, { useEffect, useState } from 'react'
import studentsApi from '../../api/studentsApi';
import { Card } from 'antd';
import Navbar from '../../components/Navbar';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom'; 
const HomePage = () => {
    const navigate = useNavigate();

  const [dataStudent, setDataStudent] = useState([]);
  const fetchData = async () => {
    try {
      const response = await studentsApi.getStudents();
      setDataStudent(response);
      console.log('Response:', response);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      {/* <Navbar /> */}
      {dataStudent.map(student => (
        <Card key={student.studentId} style={{ margin: '8px 0' }}>
          <div>{student.fullName}</div>
          <div>{student.className}</div>
        </Card>
      ))}
            <div style={{ textAlign: 'center', marginTop: '100px' }}>
        <h1>Welcome to School Medical Management System</h1>
        <Button type="primary" size="large" onClick={() => navigate('/login')}>
          Login
        </Button>
      </div>
    </div>
  )
}

export default HomePage