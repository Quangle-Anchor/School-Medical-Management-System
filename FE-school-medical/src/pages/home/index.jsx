import React, { useEffect, useState } from 'react'
import studentsApi from '../../api/studentsApi';
import { Card } from 'antd';

const HomePage = () => {
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
      {dataStudent.map(student => (
        <Card key={student.studentId} style={{ margin: '8px 0' }}>
          <div>{student.fullName}</div>
          <div>{student.className}</div>
        </Card>
      ))}
    </div>
  )
}

export default HomePage