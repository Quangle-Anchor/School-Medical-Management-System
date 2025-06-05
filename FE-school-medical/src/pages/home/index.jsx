import React from 'react'
import studentsApi from '../../api/studentsApi';
import { Card } from 'antd';

const HomePage = () => {
        const{dataStudent,setDataStudent} = useState([]);
        const fetchData = async () => {
            try {
                const response = await studentsApi.getStudents(); // Giả sử API trả về danh sách học sinh
                console.log('Response:', response);
            } catch (error) {
                console.error('Error fetching data:', error);  
            }
        }

        useEffect(() => {
            fetchData();
        }, []); 
  return (
    <div className="container mx-auto p-4">
      <div>
        {dataStudent.map((student) => (
          <Card hoverable
            key={student.id}
            title={`${student.firstName} ${student.lastName}`}
            className="mb-4"   
            >
            </Card>
        ))}
      </div>
    </div>
  )
}

export default HomePage