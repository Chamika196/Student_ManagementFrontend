import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Subject = () => {
  const [subjects, setSubjects] = useState([]);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [selectedSubject, setSelectedSubject] = useState(null);

  useEffect(() => {
    // Fetch the list of subjects on component mount
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await axios.get('https://localhost:44357/api/Subjects'); // Replace with your API URL
      setSubjects(response.data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const handleInputChange = (e) => {
    // Update selectedSubject if it exists
    setSelectedSubject((prevSelectedSubject) => {
      if (prevSelectedSubject) {
        return {
          ...prevSelectedSubject,
          subjectName: e.target.value,
        };
      }
      return null;
    });

    // Update newSubjectName if selectedSubject is null
    if (!selectedSubject) {
      setNewSubjectName(e.target.value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('https://localhost:44357/api/Subjects', { subjectName: newSubjectName }); // Replace with your API URL
      fetchSubjects(); // Refresh the subject list after adding a new subject
      setNewSubjectName('');
    } catch (error) {
      console.error('Error adding subject:', error);
    }
  };

  const handleEditClick = async (subjectId) => {
    try {
      const response = await axios.get(`https://localhost:44357/api/Subjects/${subjectId}`);
      const fetchedSubject = response.data;

      // Set the fetched subject as selectedSubject
      setSelectedSubject({
        subjectId: fetchedSubject.subjectId,
        subjectName: fetchedSubject.subjectName,
      });
    } catch (error) {
      console.error('Error fetching subject for edit:', error);
    }
  };

  const handleEditSubmit = async () => {
    try {
      await axios.put(`https://localhost:44357/api/Subjects/${selectedSubject.subjectId}`, {
        subjectName: selectedSubject.subjectName,
      });

      // Update the local subjects state directly
      setSubjects((prevSubjects) =>
        prevSubjects.map((subject) =>
          subject.subjectId === selectedSubject.subjectId ? { ...subject, subjectName: selectedSubject.subjectName } : subject
        )
      );

      setSelectedSubject(null);
    } catch (error) {
      console.error('Error editing subject:', error);
    }
  };


  const handleDeleteClick = async (subjectId) => {
    try {
      const response = await axios.delete(`https://localhost:44357/api/Subjects/${subjectId}`); // Replace with your API URL
      fetchSubjects(); // Refresh the subject list after deleting
    } catch (error) {
      console.error('Error deleting subject:', error);
    }
  };

  return (
    <div className='container'>

      
<div className='card mt-3'>
    <div className='card-body'>
        <div className='row justify-content-center'>
            <h5 className='card-title text-center'>Subjects</h5>
        </div>
        <form onSubmit={selectedSubject ? handleEditSubmit : handleSubmit}>
            <div className='row'>
                <div className='col-md-6'>
                    <div className='mb-3'>
                        <label className='form-label'>Subject Name:</label>
                        <input
                            type='text'
                            className='form-control'
                            value={selectedSubject ? selectedSubject.subjectName : newSubjectName}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
            </div>
            <button type='submit' className='btn btn-success'>
                {selectedSubject ? 'Edit Subject' : 'Add Subject'}
            </button>
        </form>
    </div>
</div>


      <table className="table table-dark table-hover mt-4">
        <thead>
          <tr>
            <th scope="col">Subject ID</th>
            <th scope="col">Subject Name</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {subjects.map((subject) => (
            <tr key={subject.subjectId}>
              <td>{subject.subjectId}</td>
              <td>{subject.subjectName}</td>
              <td>
                <button className="btn btn-warning" onClick={() => handleEditClick(subject.subjectId)}>
                  Edit
                </button> &nbsp;&nbsp;
                <button className="btn btn-danger" onClick={() => handleDeleteClick(subject.subjectId)}>
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

export default Subject;
