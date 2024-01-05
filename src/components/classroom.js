import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Classroom = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [newClassName, setNewClassName] = useState('');
  const [selectedClassroom, setSelectedClassroom] = useState(null);

  useEffect(() => {
    // Fetch the list of classrooms on component mount
    fetchClassrooms();
  }, []);

  const fetchClassrooms = async () => {
    try {
      const response = await axios.get('https://localhost:44357/api/Classrooms'); // Replace with your API URL
      setClassrooms(response.data);
    } catch (error) {
      console.error('Error fetching classrooms:', error);
    }
  };

  const handleInputChange = (e) => {
    // Update selectedClassroom if it exists
    setSelectedClassroom((prevSelectedClassroom) => {
      if (prevSelectedClassroom) {
        return {
          ...prevSelectedClassroom,
          className: e.target.value,
        };
      }
      return null;
    });

    // Update newClassroomName if selectedClassroom is null
    if (!selectedClassroom) {
      setNewClassName(e.target.value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('https://localhost:44357/api/Classrooms', { className: newClassName }); // Replace with your API URL
      fetchClassrooms(); // Refresh the classroom list after adding a new classroom
      setNewClassName('');
    } catch (error) {
      console.error('Error adding Classroom:', error);
    }
  };

  const handleEditClick = async (classroomId) => {
    try {
      const response = await axios.get(`https://localhost:44357/api/Classrooms/${classroomId}`);
      const fetchedClassroom = response.data;

      // Set the fetched Classroom as selectedClassroom
      setSelectedClassroom({
        classroomId: fetchedClassroom.classroomId,
        className: fetchedClassroom.className,
      });
    } catch (error) {
      console.error('Error fetching classroom for edit:', error);
    }
  };

  const handleEditSubmit = async () => {
    try {
      await axios.put(`https://localhost:44357/api/Classrooms/${selectedClassroom.classroomId}`, {
        className: selectedClassroom.className,
      });

      // Update the local Classrooms state directly
      setClassrooms((prevClassrooms) =>
        prevClassrooms.map((classroom) =>
        classroom.classroomId === selectedClassroom.classroomId ? { ...classroom, className: selectedClassroom.className } : classroom
        )
      );

      setSelectedClassroom(null);
    } catch (error) {
      console.error('Error editing Classroom:', error);
    }
  };


  const handleDeleteClick = async (classroomId) => {
    try {
      const response = await axios.delete(`https://localhost:44357/api/Classrooms/${classroomId}`); // Replace with your API URL
      fetchClassrooms(); // Refresh the classroom list after deleting
    } catch (error) {
      console.error('Error deleting Classroom:', error);
    }
  };

  return (
    <div className='container'>

      
<div className='card mt-3'>
    <div className='card-body'>
        <div className='row justify-content-center'>
            <h5 className='card-title text-center'>Classrooms</h5>
        </div>
        <form onSubmit={selectedClassroom ? handleEditSubmit : handleSubmit}>
            <div className='row'>
                <div className='col-md-6'>
                    <div className='mb-3'>
                        <label className='form-label'>Classroom Name:</label>
                        <input
                            type='text'
                            className='form-control'
                            value={selectedClassroom ? selectedClassroom.className : newClassName}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
            </div>
            <button type='submit' className='btn btn-success'>
                {selectedClassroom ? 'Edit Classroom' : 'Add Classroom'}
            </button>
        </form>
    </div>
</div>


      <table className="table table-dark table-hover mt-4">
        <thead>
          <tr>
            <th scope="col">Classroom ID</th>
            <th scope="col">Classroom Name</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {classrooms.map((classroom) => (
            <tr key={classroom.classroomId}>
              <td>{classroom.classroomId}</td>
              <td>{classroom.className}</td>
              <td>
                <button className="btn btn-warning" onClick={() => handleEditClick(classroom.classroomId)}>
                  Edit
                </button> &nbsp;&nbsp;
                <button className="btn btn-danger" onClick={() => handleDeleteClick(classroom.classroomId)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
};

export default Classroom;
