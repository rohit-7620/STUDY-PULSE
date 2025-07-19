import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuthStatus } from '../contexts/AuthContext';
// import './QuizPage.css'; // Optional styling

function QuizPage() {
  const { quizId } = useParams(); // Get quiz ID from URL
  const navigate = useNavigate();
  const { user, loading: loadingAuth } = useAuthStatus();

  const [quizData, setQuizData] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { questionId: choiceId, ... }
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null); // To store results after submission

  // Fetch Quiz Data
  useEffect(() => {
    if (loadingAuth) return; // Wait for auth check
    if (!user) { 
        setError("Please log in to take the quiz.");
        setIsLoading(false);
        return;
     } 
    
    const fetchQuiz = async () => {
      setIsLoading(true);
      setError(null);
      setResult(null); // Clear previous results
      setSelectedAnswers({}); // Clear previous answers

      try {
        const token = await user.getIdToken();
        const response = await axios.get(
            `/api/quizzes/${quizId}/`, // Use the quizId from URL
            { headers: { 'Authorization': `Bearer ${token}` } }
        );
        setQuizData(response.data);
      } catch (err) {
        console.error("Error fetching quiz data:", err);
        setError(err.response?.data?.detail || err.message || "Failed to load quiz.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId, user, loadingAuth]);

  // Handle Answer Selection
  const handleSelectAnswer = (questionId, choiceId) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: choiceId
    }));
  };

  // Handle Quiz Submission
  const handleSubmit = async () => {
    if (!user) { setError("Please log in again."); return; }
    // Optional: Check if all questions are answered
    const answeredQuestions = Object.keys(selectedAnswers).length;
    if (quizData && answeredQuestions < quizData.questions.length) {
         if (!window.confirm("You haven't answered all questions. Submit anyway?")) {
             return;
         }
    }

    setIsSubmitting(true);
    setError(null);

    try {
        const token = await user.getIdToken();
        const response = await axios.post(
            '/api/quizzes/submit/',
            {
                quiz_id: quizId,
                answers: selectedAnswers
            },
            { headers: { 'Authorization': `Bearer ${token}` } }
        );
        setResult(response.data); // Store the attempt results
        // Maybe navigate away or show a summary based on result
        // navigate('/some-result-page/' + response.data.id);
    } catch (err) {
        console.error("Error submitting quiz:", err);
        setError(err.response?.data?.error || err.message || "Failed to submit quiz.");
    } finally {
        setIsSubmitting(false);
    }
  };

  // --- Render Logic ---
  if (isLoading || loadingAuth) {
    return <div className="container">Loading Quiz...</div>;
  }

  if (error) {
    return <div className="container error-message">Error: {error}</div>;
  }

  if (!quizData) {
    return <div className="container">Quiz not found or failed to load.</div>;
  }

  // Display Results if submission is complete
  if (result) {
    return (
      <div className="container quiz-results" style={{ padding: '20px' }}>
        <h1>Quiz Results: {quizData.title}</h1>
        <h2>Score: {result.score}%</h2>
        <h3 style={{ color: result.passed ? 'green' : 'red' }}>
          {result.passed ? 'Congratulations! You Passed!' : 'Try Again! You Did Not Pass.'}
        </h3>
        {result.passed && quizData.xp_reward > 0 && (
            <p style={{ color: 'blue' }}>You earned {quizData.xp_reward} XP!</p>
        )}
        {/* TODO: Add review functionality - show questions, selected answers, correct answers */}
        <button onClick={() => navigate(-1)} style={{ marginTop: '20px' }}>Back</button> 
        {/* Or navigate to dashboard/module */}
      </div>
    );
  }

  // Display Quiz Taking Interface
  return (
    <div className="container quiz-page" style={{ padding: '20px' }}>
      <h1>{quizData.title}</h1>
      <p>{quizData.description}</p>
      <hr />

      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        {quizData.questions.map((question, index) => (
          <div key={question.id} style={{ marginBottom: '25px', paddingBottom: '15px', borderBottom: '1px solid #eee' }}>
            <h4>{index + 1}. {question.text}</h4>
            <div style={{ marginLeft: '15px' }}>
              {question.choices.map((choice) => (
                <div key={choice.id} style={{ margin: '5px 0' }}>
                  <label style={{ display: 'flex', alignItems: 'center' }}>
                    <input 
                      type="radio" 
                      name={`question-${question.id}`}
                      value={choice.id}
                      checked={selectedAnswers[question.id] === choice.id}
                      onChange={() => handleSelectAnswer(question.id, choice.id)}
                      required // Make answering mandatory
                      style={{ marginRight: '10px' }}
                    />
                    {choice.text}
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}

        <button 
          type="submit" 
          disabled={isSubmitting || Object.keys(selectedAnswers).length === 0} 
          style={{ padding: '10px 20px', fontSize: '1.1em' }}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
        </button>
      </form>
    </div>
  );
}

export default QuizPage; 