import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AllocateSubjects = () => {
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [allocatedSubjects, setAllocatedSubjects] = useState([]);
  const [allocateSubject, setAllocateSubject] = useState({
    teacherId: '',
    subjectId: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const teachersResponse = await axios.get('https://localhost:44357/api/teachers');
      const subjectsResponse = await axios.get('https://localhost:44357/api/subjects');
      const allocatedSubjectsResponse = await axios.get('https://localhost:44357/api/allocateSubjects');

      setTeachers(teachersResponse.data);
      setSubjects(subjectsResponse.data);
      
      // Fetch additional details for each allocated subject
      const updatedAllocatedSubjects = await Promise.all(
        allocatedSubjectsResponse.data.map(async (allocatedSubject) => {
          const teacherResponse = await axios.get(`https://localhost:44357/api/teachers/${allocatedSubject.teacherId}`);
          const subjectResponse = await axios.get(`https://localhost:44357/api/subjects/${allocatedSubject.subjectId}`);
          
          return {
            ...allocatedSubject,
            teacher: teacherResponse.data,
            subject: subjectResponse.data,
          };
        })
      );

      setAllocatedSubjects(updatedAllocatedSubjects);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAllocateSubject({
      ...allocateSubject,
      [name]: value,
    });
  };

  const handleAllocateSubject = async () => {
    try {
      const response = await axios.post('https://localhost:44357/api/allocateSubjects', allocateSubject);
      fetchData();
      setAllocatedSubjects([...allocatedSubjects, response.data]);
    } catch (error) {
      console.error('Error allocating subject:', error);
    }
  };

  const handleRemoveAllocation = async (allocateSubjectId) => {
    try {
      await axios.delete(`https://localhost:44357/api/allocateSubjects/${allocateSubjectId}`);
      fetchData(); // Fetch fresh data after successful removal
    } catch (error) {
      console.error('Error removing allocation:', error);
    }
  };

  return (
    <div className="container">
      <div className="card mt-3">
    <div className="card-body">
        <div className="row justify-content-center">
            <h5 className="card-title text-center">Allocate Subjects</h5>
        </div>
        <form>
            <div className="row">
                <div className="col-md-6">
                    <div className="mb-3">
                        <label className="form-label">Teacher:</label>
                        <select name="teacherId" value={allocateSubject.teacherId} onChange={handleInputChange} className="form-select">
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
                        <label className="form-label">Subject:</label>
                        <select name="subjectId" value={allocateSubject.subjectId} onChange={handleInputChange} className="form-select">
                            <option value="">Select Subject</option>
                            {subjects.map((subject) => (
                                <option key={subject.subjectId} value={subject.subjectId}>
                                    {subject.subjectName}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
            <button type="button" onClick={handleAllocateSubject} className="btn btn-success">
                Allocate Subject
            </button>
        </form>
    </div>
</div>


      <table className="table table-dark table-hover mt-4">
        <thead>
          <tr>
            <th scope="col">AllocateSubject ID</th>
            <th scope="col">Teacher</th>
            <th scope="col">Subject</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {allocatedSubjects.map((allocatedSubject) => (
            <tr key={allocatedSubject.AllocateSubjectId}>
              <td>{allocatedSubject.allocateSubjectId}</td>
              <td>{allocatedSubject.teacher?.firstName}</td>
              <td>{allocatedSubject.subject?.subjectName}</td>
              <td>
                <button
                  className="btn btn-danger"
                  onClick={() => handleRemoveAllocation(allocatedSubject.allocateSubjectId)}
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

export default AllocateSubjects;
