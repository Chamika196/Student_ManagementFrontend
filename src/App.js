import React, { useState } from "react";
import AllocateClassrooms from "./components/allocateclassroom";
import AllocateSubjects from "./components/allocatesubjects";
import Classroom from "./components/classroom";
import Student from "./components/student";
import Subject from "./components/subject";
import Teacher from "./components/teacher";

function App() {
  const [activeComponent, setActiveComponent] = useState("student");

  const renderComponent = () => {
    switch (activeComponent) {
      case "subject":
        return <Subject />;
      case "teacher":
        return <Teacher />;
      case "classroom":
        return <Classroom />;
      case "student":
        return <Student />;
      case "allocate-subjects":
        return <AllocateSubjects />;
      case "allocate-classrooms":
        return <AllocateClassrooms />;
      default:
        return null;
    }
  };

  return (
    <div className="container mt-4">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="navbar-nav">
          <button className={`nav-link btn ${activeComponent === "student" && "active"}`} onClick={() => setActiveComponent("student")}>Student</button>
          <button className={`nav-link btn ${activeComponent === "teacher" && "active"}`} onClick={() => setActiveComponent("teacher")}>Teacher</button>
          <button className={`nav-link btn ${activeComponent === "subject" && "active"}`} onClick={() => setActiveComponent("subject")}>Subject</button>
          <button className={`nav-link btn ${activeComponent === "classroom" && "active"}`} onClick={() => setActiveComponent("classroom")}>Classroom</button>
          <button className={`nav-link btn ${activeComponent === "allocate-subjects" && "active"}`} onClick={() => setActiveComponent("allocate-subjects")}>Allocate Subjects</button>
          <button className={`nav-link btn ${activeComponent === "allocate-classrooms" && "active"}`} onClick={() => setActiveComponent("allocate-classrooms")}>Allocate Classrooms</button>
        </div>
      </nav>

      {renderComponent()}
    </div>
  );
}

export default App;
