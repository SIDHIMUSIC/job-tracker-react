import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [jobs, setJobs] = useState(() => {
    const saved = localStorage.getItem('jobTrackerData');
    return saved ? JSON.parse(saved) : [];
  });

  const [newJob, setNewJob] = useState("");
  const [company, setCompany] = useState("");

  useEffect(() => {
    localStorage.setItem('jobTrackerData', JSON.stringify(jobs));
  }, [jobs]);

  const addJob = () => {
    if (!newJob || !company) return alert("Please fill details");
    const jobItem = {
      id: Date.now(),
      title: newJob,
      company: company,
      status: 'Applied'
    };
    setJobs([...jobs, jobItem]);
    setNewJob("");
    setCompany("");
  };

  const deleteJob = (id) => {
    setJobs(jobs.filter(job => job.id !== id));
  };

  const onDragStart = (e, id) => {
    e.dataTransfer.setData("id", id);
  };

  const onDrop = (e, newStatus) => {
    let id = e.dataTransfer.getData("id");
    let updatedJobs = jobs.map(job => {
      if (job.id == id) {
        return { ...job, status: newStatus };
      }
      return job;
    });
    setJobs(updatedJobs);
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="app-container">
      <h1>Job Application Tracker</h1>
      <div className="input-group">
        <input 
          type="text" 
          placeholder="Job Role" 
          value={newJob} 
          onChange={(e) => setNewJob(e.target.value)} 
        />
        <input 
          type="text" 
          placeholder="Company" 
          value={company} 
          onChange={(e) => setCompany(e.target.value)} 
        />
        <button onClick={addJob}>Add Job</button>
      </div>

      <div className="board">
        {["Applied", "Interview", "Hired"].map(status => (
          <div 
            key={status}
            className="column"
            onDragOver={(e) => onDragOver(e)}
            onDrop={(e) => onDrop(e, status)}
          >
            <h2>{status}</h2>
            {jobs.filter(job => job.status === status).map(job => (
              <div 
                key={job.id} 
                className="job-card"
                draggable
                onDragStart={(e) => onDragStart(e, job.id)}
              >
                <h4>{job.title}</h4>
                <p>{job.company}</p>
                <button className="delete-btn" onClick={() => deleteJob(job.id)}>x</button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
