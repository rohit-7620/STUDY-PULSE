import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './CourseDetailPage.css'; // Create this CSS file

// Placeholder for YouTube Player (install react-youtube later)
const YouTubePlayer = ({ videoId }) => {
    if (!videoId) return null;
    // Basic iframe for now
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    return (
        <div className="youtube-player-container">
            <iframe 
                width="560" 
                height="315" 
                src={embedUrl} 
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen>
            </iframe>
        </div>
    );
};

function CourseDetailPage() {
    const { courseId } = useParams(); // Get courseId from URL parameter
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeLesson, setActiveLesson] = useState(null); // State to track the currently viewed lesson

    useEffect(() => {
        const fetchCourseDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/courses/${courseId}/`);
                setCourse(response.data);
                // Optionally set the first lesson of the first module as active initially
                if (response.data?.modules?.[0]?.lessons?.[0]) {
                    setActiveLesson(response.data.modules[0].lessons[0]);
                }
            } catch (err) {
                console.error("Error fetching course details:", err);
                setError("Failed to load course details. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchCourseDetails();
    }, [courseId]); // Refetch if courseId changes

    const handleLessonClick = (lesson) => {
        setActiveLesson(lesson);
        // Optional: scroll to lesson content area
    };

    // TODO: Add function to mark lesson as complete (calls backend API)
    const handleMarkComplete = async () => {
        if (!activeLesson) return;
        console.log("Marking lesson complete (TODO: Implement API call):", activeLesson.id);
        // 1. Make POST request to a new backend endpoint (e.g., /api/progress/complete/)
        //    Send lesson_id in the request body.
        //    Backend view will create UserProgress record for request.user and lesson_id.
        // 2. On success, maybe update UI (e.g., show checkmark, update progress bar)
        // 3. Handle errors.
        alert('Mark complete functionality not yet implemented.');
    };

    if (loading) {
        return <div className="container">Loading course...</div>;
    }

    if (error) {
        return <div className="container error-message">{error}</div>;
    }

    if (!course) {
        return <div className="container">Course not found.</div>;
    }

    return (
        <div className="course-detail-page container">
            <Link to="/learn" className="back-link">&larr; Back to Courses</Link>
            <h1>{course.title}</h1>
            <p className="course-description">{course.description}</p>
            <div className="course-topic-badge">{course.topic?.title || 'General'}</div>

            <div className="course-layout">
                {/* Left Sidebar: Modules & Lessons */}
                <aside className="course-sidebar card">
                    <h2>Course Content</h2>
                    {course.modules?.map((module) => (
                        <div key={module.id} className="module-section">
                            <h3>{module.title}</h3>
                            <ul className="lesson-list">
                                {module.lessons?.map((lesson) => (
                                    <li 
                                        key={lesson.id} 
                                        className={`lesson-item ${activeLesson?.id === lesson.id ? 'active' : ''}`}
                                        onClick={() => handleLessonClick(lesson)}
                                    >
                                        <span className="lesson-type-icon">
                                            {lesson.content_type === 'youtube' ? '▶️' : lesson.content_type === 'text' ? '📄' : '🔗'}
                                        </span>
                                        {lesson.title}
                                        {/* TODO: Add completion checkmark based on UserProgress */} 
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                    {(!course.modules || course.modules.length === 0) && (
                        <p>No modules available for this course yet.</p>
                    )}
                </aside>

                {/* Main Content Area: Display Active Lesson */}
                <main className="lesson-content-area card">
                    {activeLesson ? (
                        <> 
                            <h2>{activeLesson.title}</h2>
                            <hr />
                            <div className="lesson-content">
                                {activeLesson.content_type === 'text' && (
                                    <div className="text-content" dangerouslySetInnerHTML={{ __html: activeLesson.text_content || '' }}></div>
                                    // Note: dangerouslySetInnerHTML is risky if content isn't sanitized on backend
                                    // Consider using a Markdown renderer if content is Markdown
                                )}
                                {activeLesson.content_type === 'youtube' && (
                                    <YouTubePlayer videoId={activeLesson.youtube_video_id} />
                                )}
                                {activeLesson.content_type === 'external_link' && (
                                    <div className="external-link-content">
                                        <p>This lesson links to an external resource:</p>
                                        <a href={activeLesson.external_url} target="_blank" rel="noopener noreferrer" className="btn-primary">
                                            Open Link
                                        </a> 
                                        <p><small>URL: {activeLesson.external_url}</small></p>
                                    </div>
                                )}
                                {/* Add rendering for other content types (quiz, ar) here */} 
                            </div>
                            <div className="lesson-actions">
                                <button onClick={handleMarkComplete} className="btn-primary">
                                    Mark as Complete (+{activeLesson.xp_value || 0} XP)
                                </button>
                                {/* Add Previous/Next Lesson buttons? */} 
                            </div>
                        </>
                    ) : (
                        <p>Select a lesson from the sidebar to view its content.</p>
                    )}
                </main>
            </div>
        </div>
    );
}

export default CourseDetailPage; 