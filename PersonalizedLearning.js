import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // For linking to course details later
import axios from 'axios';
import './PersonalizedLearning.css'; // Specific styles

// Placeholder component for Flow Diagram (replace with actual implementation, e.g., React Flow)
const PlaceholderFlowDiagram = () => (
  <div style={{ height: '400px', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', margin: '20px 0' }}>
    Interactive Flow Diagram Placeholder
  </div>
);

function PersonalizedLearning() {
  // State for courses
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [errorCourses, setErrorCourses] = useState(null);

  // Placeholder data (can be removed later or used for recommendations)
  // const roadmapTitle = "Full-Stack Web Developer with Python & React";
  // const roadmapProgress = 45; 
  // const learningRecommendations = [...];

  // Fetch courses from backend
  useEffect(() => {
    const fetchCourses = async () => {
      setLoadingCourses(true);
      setErrorCourses(null);
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/courses/');
        setCourses(response.data); 
      } catch (err) {
        console.error("Error fetching courses:", err);
        setErrorCourses("Failed to load courses. Please try again later.");
      } finally {
        setLoadingCourses(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="personalized-learning container">
      <h1>Learning Paths & Courses</h1>
      <p className="page-subtitle">Explore available courses or follow your personalized roadmap.</p>

      {/* Roadmap Section (Keep placeholder for now) */}
      {/* <section className="roadmap-section card"> ... </section> */}
      
      {/* Available Courses Section */}
      <section className="available-courses-section card">
          <h2>Available Courses</h2>
          {loadingCourses && <p>Loading courses...</p>}
          {errorCourses && <p className="error-message">{errorCourses}</p>}
          {!loadingCourses && !errorCourses && (
              <div className="courses-grid">
                  {courses.length > 0 ? (
                      courses.map(course => (
                          <div key={course.id} className="course-card">
                              <div className="course-topic">{course.topic?.title || 'General'}</div>
                              <h3>{course.title}</h3>
                              <p>{course.description.substring(0, 100)}...</p> {/* Truncate description */} 
                              {/* Link to course detail page */}
                              <Link to={`/courses/${course.id}`} className="btn-secondary">
                                  View Course
                              </Link>
                               {/* <button className="btn-secondary" disabled>View Course (Soon)</button> */}
                          </div>
                      ))
                  ) : (
                      <p>No courses available yet. Add some via the admin panel!</p>
                  )}
              </div>
          )}
      </section>

      {/* Recommendations Section (Keep placeholder for now) */}
      {/* <section className="recommendations-section card"> ... </section> */}

    </div>
  );
}

export default PersonalizedLearning; 