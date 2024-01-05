import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AllocateClassrooms = () => {
  const [teachers, setTeachers] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [allocatedClassrooms, setAllocatedClassrooms] = useState([]);
  const [allocateClassroom, setAllocateClassroom] = useState({
    teacherId: '',
    classroomId: '',
  });

  useEffect(() => {
    fetchData();
    // Retrieve allocated classrooms data from localStorage on component mount
    const storedAllocatedClassrooms = JSON.parse(localStorage.getItem('allocatedClassrooms')) || [];
    setAllocatedClassrooms(storedAllocatedClassrooms);
  }, []);

  const fetchData = async () => {
    try {
      const teachersResponse = await axios.get('https://localhost:44357/api/teachers');
      const classroomsResponse = await axios.get('https://localhost:44357/api/classrooms');
  
      console.log('Teachers response:', teachersResponse.data);
      console.log('Classrooms response:', classroomsResponse.data);
  
      setTeachers(teachersResponse.data);
      setClassrooms(classroomsResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAllocateClassroom({
      ...allocateClassroom,
      [name]: value,
    });
  };
  

  const handleAllocateClassroom = () => {
    // Check if the allocation already exists
    const existingAllocation = allocatedClassrooms.find(
      (allocation) =>
        allocation.teacherId === allocateClassroom.teacherId && allocation.classroomId === allocateClassroom.classroomId
    );

    if (existingAllocation) {
      // Alert or handle the case where the allocation already exists
      console.warn('Allocation already exists');
      return;
    }

    const updatedAllocatedClassrooms = [...allocatedClassrooms, allocateClassroom];
    setAllocatedClassrooms(updatedAllocatedClassrooms);
    // Save the updated allocated classrooms data to localStorage
    localStorage.setItem('allocatedClassrooms', JSON.stringify(updatedAllocatedClassrooms));
  };

  const handleRemoveAllocation = (teacherId, classroomId) => {
    const updatedAllocatedClassrooms = allocatedClassrooms.filter(
      (allocation) => allocation.teacherId !== teacherId || allocation.classroomId !== classroomId
    );
    setAllocatedClassrooms(updatedAllocatedClassrooms);
    // Save the updated allocated classrooms data to localStorage
    localStorage.setItem('allocatedClassrooms', JSON.stringify(updatedAllocatedClassrooms));
  };

  return (
    <div className="container">
      <div className="card mt-3">
    <div className="card-body">
        <div className="row justify-content-center">
            <h5 className="card-title text-center">Allocate Classrooms</h5>
        </div>
        <form>
            <div className="row">
                <div className="col-md-6">
                    <div className="mb-3">
                        <label className="form-label">Teacher:</label>
                        <select
                            name="teacherId"
                            value={allocateClassroom.teacherId}
                            onChange={handleInputChange}
                            className="form-select"
                        >
                            <option value="">Select Teacher</option>
                            {teachers.map((teacher) => (
                                <option key={teacher.teacherId} value={teacher.teacherId}>
                                    {teacher.firstName}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="mb-3">
                        <label className="form-label">Classroom:</label>
                        <select
                            name="classroomId"
                            value={allocateClassroom.classroomId}
                            onChange={handleInputChange}
                            className="form-select"
                        >
                            <option value="">Select Classroom</option>
                            {classrooms.map((classroom) => (
                                <option key={classroom.classroomId} value={classroom.classroomId}>
                                    {classroom.className}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
            <button type="button" onClick={handleAllocateClassroom} className="btn btn-success">
                Allocate Classroom
            </button>
        </form>
    </div>
</div>


      <table className="table table-dark table-hover mt-4">
        <thead>
          <tr>
            <th scope="col">AllocateClassroom ID</th>
            <th scope="col">Teacher</th>
            <th scope="col">Classroom</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {allocatedClassrooms.map((allocation, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{allocation.teacher?.firstName}</td>
              <td>{allocation.classroom?.className}</td>
              <td>
                <button
                  className="btn btn-danger"
                  onClick={() => handleRemoveAllocation(allocation.teacherId, allocation.classroomId)}
                >
                  Remove Allocation
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllocateClassrooms;
