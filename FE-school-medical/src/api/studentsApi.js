const studentsApi = {
    getStudents: async () => {
        try{
            const response = await fetch('/api/students'); // chờ server trả về danh sách học sinh
              if(!response.ok) {
                throw new Error('Network response was not ok');
              }
              return await response.json(); // chuyển đổi dữ liệu từ JSON sang đối tượng JavaScript
        }catch (error) {
            console.error('Catching error', error);
            throw error;
        }
    }   
}
export default studentsApi;