import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AllocateSubject = () => {
    const [teachers, setTeachers] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [allocation, setAllocation] = useState({
        TeacherId: '',
        SubjectId: '',
    });
    const [allocations, setAllocations] = useState([]);

    useEffect(() => {
        fetchTeachers();
        fetchSubjects();
    }, []);

    const fetchTeachers = async () => {
        try {
            const response = await axios.get('https://localhost:44357/api/Teachers');
            setTeachers(response.data);
        } catch (error) {
            console.error('Error fetching teachers:', error);
        }
    };

    const fetchSubjects = async () => {
        try {
            const response = await axios.get('https://localhost:44357/api/Subjects');
            setSubjects(response.data);
        } catch (error) {
            console.error('Error fetching subjects:', error);
        }
    };

    const handleInputChange = (e) => {
        setAllocation({
            ...allocation,
            [e.target.name]: e.target.value,
        });
    };

    const handleAddAllocation = () => {
        if (allocation.TeacherId && allocation.SubjectId) {
          setAllocations([...allocations, { ...allocation }]); // Copy the allocation object
          setAllocation({
            TeacherId: '',
            SubjectId: '',
          });
        }
      };
      


    const handleRemoveAllocation = (index) => {
        const updatedAllocations = [...allocations];
        updatedAllocations.splice(index, 1);
        setAllocations(updatedAllocations);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          // Perform the API call to save allocations to the server
          await axios.post('https://localhost:44357/api/AllocateSubjects', {
            allocations: allocations.map((allocation) => ({
              TeacherId: allocation.TeacherId,
              SubjectId: allocation.SubjectId,
              
            })),
          });
          
          // You may want to handle success and reset the component state
          setAllocations([]);
        } catch (error) {
          console.error('Error adding allocations:', error);
        }
      };
      

    return (
        <div className='container'>
            <div className='card mt-3'>
                <div className='card-body'>
                    <div className='row justify-content-center'>
                        <h5 className='card-title text-center'>Allocate Subjects</h5>
                    </div>
                    <div className='mb-3'>
                        <label className='form-label'>Teacher:</label>
                        <select
                            className='form-control'
                            name='TeacherId'
                            value={allocation.TeacherId}
                            onChange={handleInputChange}
                        >
                            <option value='' disabled>
                                Select Teacher
                            </option>
                            {teachers.map((teacher) => (
                                <option key={teacher.teacherId} value={teacher.teacherId}>
                                    {teacher.teacherId}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className='mb-3'>
                        <label className='form-label'>Subject:</label>
                        <select
                            className='form-control'
                            name='SubjectId'
                            value={allocation.SubjectId}
                            onChange={handleInputChange}
                        >
                            <option value='' disabled>
                                Select Subject
                            </option>
                            {subjects.map((subject) => (
                                <option key={subject.subjectId} value={subject.subjectId}>
                                    {subject.subjectId}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button type='button' className='btn btn-primary' onClick={handleAddAllocation}>
                        Add Allocation
                    </button>
                </div>
            </div>

            {allocations.length > 0 && (
                <div className='card mt-3'>
                    <div className='card-body'>
                        <table className='table table-dark table-hover'>
                            <thead>
                                <tr>
                                    <th scope='col'>Teacher</th>
                                    <th scope='col'>Subject</th>
                                    <th scope='col'>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allocations.map((allocation, index) => (
                                    <tr key={index}>
                                        <td>{allocation.TeacherId}</td>
                                        <td>{allocation.SubjectId}</td>
                                        <td>
                                            <button
                                                className='btn btn-danger'
                                                onClick={() => handleRemoveAllocation(index)}
                                            >
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))}

                            </tbody>
                        </table>
                        <button type='button' className='btn btn-success' onClick={handleSubmit}>
                            Save Allocations
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllocateSubject;
