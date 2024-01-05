import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Teacher = () => {
  const [teachers, setTeachers] = useState([]);
  const [newTeacher, setNewTeacher] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  useEffect(() => {
    // Fetch the list of teachers on component mount
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await axios.get('https://localhost:44357/api/Teachers'); // Replace with your API URL
      setTeachers(response.data);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  const handleInputChange = (e) => {
    // Update selectedTeacher if it exists
    setSelectedTeacher((prevSelectedTeacher) => {
      if (prevSelectedTeacher) {
        return {
          ...prevSelectedTeacher,
         // teacherName:e.target.value,
          [e.target.name]: e.target.value,
          
        };
      }
      return null;
    });

    // Update newTeacher if selectedTeacher is null
    if (!selectedTeacher) {
      setNewTeacher((prevNewTeacher) => ({
        ...prevNewTeacher,
        [e.target.name]: e.target.value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('https://localhost:44357/api/Teachers', newTeacher); // Replace with your API URL
      fetchTeachers(); // Refresh the teacher list after adding a new teacher
      setNewTeacher({
        FirstName: '',
        LastName: '',
        ContactNo: '',
        Email: '',
      });
    } catch (error) {
      console.error('Error adding teacher:', error);
    }
  };

  const handleEditClick = async (teacherId) => {
    try {
      const response = await axios.get(`https://localhost:44357/api/Teachers/${teacherId}`);
      const fetchedTeacher = response.data;

      console.log(fetchedTeacher);
      // Set the fetched teacher as selectedTeacher
      setSelectedTeacher({
        teacherId: fetchedTeacher.teacherId,
        FirstName: fetchedTeacher.firstName,
        LastName: fetchedTeacher.lastName,
        ContactNo: fetchedTeacher.contactNo,
        Email: fetchedTeacher.email ,
      });
    } catch (error) {
      console.error('Error fetching teacher for edit:', error);
    }
  };

const handleEditSubmit = async () => {
    try {
      await axios.put(`https://localhost:44357/api/Teachers/${selectedTeacher.teacherId}`, {
        firstName: selectedTeacher.FirstName,
        lastName: selectedTeacher.LastName,
        email: selectedTeacher.Email,
        contactNo: selectedTeacher.ContactNo,
      });
  
      // Update the local teachers state directly
      setTeachers((prevTeachers) =>
        prevTeachers.map((teacher) =>
          teacher.teacherId === selectedTeacher.teacherId
            ? {
                ...teacher,
                firstName: selectedTeacher.FirstName,
                lastName: selectedTeacher.LastName,
                email: selectedTeacher.Email,
                contactNo: selectedTeacher.ContactNo,
              }
            : teacher
        )
      );
  
      setSelectedTeacher(null);
    } catch (error) {
      console.error('Error editing teacher:', error);
    }
  };
  

  const handleDeleteClick = async (teacherId) => {
    try {
      await axios.delete(`https://localhost:44357/api/Teachers/${teacherId}`); // Replace with your API URL
      fetchTeachers(); // Refresh the teacher list after deleting
    } catch (error) {
      console.error('Error deleting Teacher:', error);
    }
  };

  return (
    <div className='container'>
      <div className='card mt-3'>
    <div className='card-body'>
        <div className='row justify-content-center'>
            <h5 className='card-title text-center'>Teachers</h5>
        </div>
        <form onSubmit={selectedTeacher ? handleEditSubmit : handleSubmit}>
            <div className='row'>
                <div className='col-md-6'>
                    <div className='mb-3'>
                        <label className='form-label'>First Name:</label>
                        <input
                            type='text'
                            className='form-control'
                            name='FirstName'
                            value={selectedTeacher ? selectedTeacher.FirstName : newTeacher.FirstName}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
                <div className='col-md-6'>
                    <div className='mb-3'>
                        <label className='form-label'>Last Name:</label>
                        <input
                            type='text'
                            className='form-control'
                            name='LastName'
                            value={selectedTeacher ? selectedTeacher.LastName : newTeacher.LastName}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
            </div>
            <div className='row'>
                <div className='col-md-6'>
                    <div className='mb-3'>
                        <label className='form-label'>Contact No:</label>
                        <input
                            type='text'
                            className='form-control'
                            name='ContactNo'
                            value={selectedTeacher ? selectedTeacher.ContactNo : newTeacher.ContactNo}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
                <div className='col-md-6'>
                    <div className='mb-3'>
                        <label className='form-label'>Email:</label>
                        <input
                            type='text'
                            className='form-control'
                            name='Email'
                            value={selectedTeacher ? selectedTeacher.Email : newTeacher.Email}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
            </div>
            <button type='submit' className='btn btn-success'>
                {selectedTeacher ? 'Edit Teacher' : 'Add Teacher'}
            </button>
        </form>
    </div>
</div>


      <table className='table table-dark table-hover mt-4'>
        <thead>
          <tr>
            <th scope='col'>Teacher ID</th>
            <th scope='col'>First Name</th>
            <th scope='col'>Last Name</th>
            <th scope='col'>Email</th>
            <th scope='col'>Contact No</th>
            <th scope='col'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {teachers.map((teacher) => (
            <tr key={teacher.teacherId}>
              <td>{teacher.teacherId}</td>
              <td>{teacher.firstName}</td>
              <td>{teacher.lastName}</td>
              <td>{teacher.email}</td>
              <td>{teacher.contactNo}</td>
              <td>
                <button className='btn btn-warning' onClick={() => handleEditClick(teacher.teacherId)}>
                  Edit
                </button>
                &nbsp;&nbsp;
                <button className='btn btn-danger' onClick={() => handleDeleteClick(teacher.teacherId)}>
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

export default Teacher;
