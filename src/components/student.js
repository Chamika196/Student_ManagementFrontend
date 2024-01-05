import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Student = () => {
    const [students, setStudents] = useState([]);
    const [newStudent, setNewStudent] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);

    useEffect(() => {
        // Fetch the list of students on component mount
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const response = await axios.get('https://localhost:44357/api/Students'); // Replace with your API URL
            setStudents(response.data);
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    };

    const calculateAge = (birthDate) => {
        const today = new Date();
        const dob = new Date(birthDate);
        let age = today.getFullYear() - dob.getFullYear();
    
        // Check if birthday has occurred this year
        if (today.getMonth() < dob.getMonth() || (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())) {
            age--;
        }
    
        return age;
    };
    
    const handleInputChange = (e) => {
        const dob = e.target.value; // Assuming that DateOfBirth field triggers this function
    
        // Update selectedStudent if it exists
        setSelectedStudent((prevSelectedStudent) => {
            if (prevSelectedStudent) {
                return {
                    ...prevSelectedStudent,
                    [e.target.name]: e.target.value,
                    Age: calculateAge(dob),
                };
            }
            return null;
        });
    
        // Update newStudent if selectedStudent is null
        if (!selectedStudent) {
            setNewStudent((prevNewStudent) => ({
                ...prevNewStudent,
                [e.target.name]: e.target.value,
                Age: calculateAge(dob),
            }));
        }
    };
    
    

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post('https://localhost:44357/api/Students', newStudent); // Replace with your API URL
            fetchStudents(); // Refresh the student list after adding a new student
            setNewStudent({
                FirstName: '',
                LastName: '',
                ContactPerson: '',
                ContactNo: '',
                Email: '',
                DateOfBirth: '',
                Age: 0,
            });
        } catch (error) {
            console.error('Error adding student:', error);
        }
    };

    const handleEditClick = async (studentId) => {
        try {
            const response = await axios.get(`https://localhost:44357/api/Students/${studentId}`);
            const fetchedStudent = response.data;

            // Set the fetched student as selectedStudent
            setSelectedStudent({
                studentId: fetchedStudent.studentId,
                FirstName: fetchedStudent.firstName,
                LastName: fetchedStudent.lastName,
                ContactPerson: fetchedStudent.contactPerson,
                ContactNo: fetchedStudent.contactNo,
                Email: fetchedStudent.email,
                DateOfBirth: fetchedStudent.dateOfBirth,
                Age: fetchedStudent.age,
            });
        } catch (error) {
            console.error('Error fetching student for edit:', error);
        }
    };

    const handleEditSubmit = async () => {
        try {
            await axios.put(`https://localhost:44357/api/Students/${selectedStudent.studentId}`, {
                firstName: selectedStudent.FirstName,
                lastName: selectedStudent.LastName,
                contactPerson: selectedStudent.ContactPerson,
                contactNo: selectedStudent.ContactNo,
                email: selectedStudent.Email,
                dateOfBirth: selectedStudent.DateOfBirth,
                age: selectedStudent.Age,
            });

            // Update the local teachers state directly
            setStudents((prevStudents) =>
                prevStudents.map((student) =>
                    student.studentId === selectedStudent.studentId
                        ? {
                            ...student,
                            firstName: selectedStudent.FirstName,
                            lastName: selectedStudent.LastName,
                            contactPerson: selectedStudent.contactPerson,
                            contactNo: selectedStudent.contactNo,
                            email: selectedStudent.email,
                            dateOfBirth: selectedStudent.dateOfBirth,
                            age: selectedStudent.age,
                        }
                        : student
                )
            );

            setSelectedStudent(null);
        } catch (error) {
            console.error('Error editing teacher:', error);
        }
    };

    const handleDeleteClick = async (studentId) => {
        try {
            await axios.delete(`https://localhost:44357/api/Students/${studentId}`); // Replace with your API URL
            fetchStudents(); // Refresh the student list after deleting
        } catch (error) {
            console.error('Error deleting student:', error);
        }
    };

    return (
        <div className='container'>
            <div className='card mt-3'>
    <div className='card-body'>
        <div className='row justify-content-center'>
            <h5 className='card-title text-center'>Students</h5>
        </div>
        <form onSubmit={selectedStudent ? handleEditSubmit : handleSubmit}>
            <div className='row'>
                <div className='col-md-6'>
                    <div className='mb-3'>
                        <label className='form-label'>First Name:</label>
                        <input
                            type='text'
                            className='form-control'
                            name='FirstName'
                            value={selectedStudent ? selectedStudent.FirstName : newStudent.FirstName}
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
                            value={selectedStudent ? selectedStudent.LastName : newStudent.LastName}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
            </div>
            <div className='row'>
                <div className='col-md-6'>
                    <div className='mb-3'>
                        <label className='form-label'>Contact Person:</label>
                        <input
                            type='text'
                            className='form-control'
                            name='ContactPerson'
                            value={selectedStudent ? selectedStudent.ContactPerson : newStudent.ContactPerson}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
                <div className='col-md-6'>
                    <div className='mb-3'>
                        <label className='form-label'>Contact No:</label>
                        <input
                            type='text'
                            className='form-control'
                            name='ContactNo'
                            value={selectedStudent ? selectedStudent.ContactNo : newStudent.ContactNo}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
            </div>
            <div className='row'>
                <div className='col-md-6'>
                    <div className='mb-3'>
                        <label className='form-label'>Email:</label>
                        <input
                            type='text'
                            className='form-control'
                            name='Email'
                            value={selectedStudent ? selectedStudent.Email : newStudent.Email}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
                <div className='col-md-6'>
                    <div className='mb-3'>
                        <label className='form-label'>Date of Birth:</label>
                        <input
                            type='date'
                            className='form-control'
                            name='DateOfBirth'
                            value={selectedStudent ? selectedStudent.DateOfBirth : newStudent.DateOfBirth}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
            </div>
            <div className='row'>
                <div className='col-md-6'>
                    <div className='mb-3'>
                        <label className='form-label'>Age:</label>
                        <input
                            type='number'
                            className='form-control'
                            name='Age'
                            value={selectedStudent ? selectedStudent.Age : newStudent.Age}
                            onChange={handleInputChange}
                            disabled
                        />
                    </div>
                </div>
                
            </div>
            <button type='submit' className='btn btn-success'>
                {selectedStudent ? 'Edit Student' : 'Add Student'}
            </button>
        </form>
    </div>
</div>


            <table className='table table-dark table-hover mt-4'>
                <thead>
                    <tr>
                        <th scope='col'>Student ID</th>
                        <th scope='col'>First Name</th>
                        <th scope='col'>Last Name</th>
                        <th scope='col'>Contact Person</th>
                        <th scope='col'>Contact No</th>
                        <th scope='col'>Email</th>
                        <th scope='col'>Date of Birth</th>
                        <th scope='col'>Age</th>
                        <th scope='col'>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((student) => (
                        <tr key={student.studentId}>
                            <td>{student.studentId}</td>
                            <td>{student.firstName}</td>
                            <td>{student.lastName}</td>
                            <td>{student.contactPerson}</td>
                            <td>{student.contactNo}</td>
                            <td>{student.email}</td>
                            <td>{student.dateOfBirth}</td>
                            <td>{student.age}</td>
                            <td>
                                <button className='btn btn-warning' onClick={() => handleEditClick(student.studentId)}>
                                    Edit
                                </button>
                                &nbsp;&nbsp;
                                <button className='btn btn-danger' onClick={() => handleDeleteClick(student.studentId)}>
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

export default Student;
