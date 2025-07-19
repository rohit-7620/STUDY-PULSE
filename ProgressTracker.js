import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import { AuthContext } from '../../contexts/AuthContext'; // Removed - not used
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { auth } from '../firebaseConfig'; // Corrected path
import { onAuthStateChanged } from "firebase/auth";
import './ProgressTracker.css'; // Specific styles

// --- Duplicated Hook (Move to separate file/context later) ---
function useAuthStatus() {
  const [user, setUser] = useState(auth.currentUser); 
  const [loading, setLoading] = useState(!user); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { user, loading };
}
// --- End Duplicated Hook ---

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

// Placeholder components (replace with actual implementations)
const PlaceholderChart = ({ height = '300px' }) => (
  <div style={{ height: height, background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', marginBottom: '20px' }}>
    Chart Placeholder
  </div>
);

const PlaceholderTable = () => (
    <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', background: '#f9f9f9' }}>
        Smart Table Placeholder (Topics vs Performance)
        {/* You'd use a library like react-table or build a custom table here */}
    </div>
);

function ProgressTracker() {
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthStatus(); // Keep user hook for UI conditional rendering

  useEffect(() => {
    const fetchProgressData = async () => {
      // Remove the user check - fetch data regardless of login status
      // if (!user) { ... return; }

      setLoading(true);
      setError(null);
      try {
        // --- Remove token fetching and Authorization header ---
        // const token = await user.getIdToken(); 
        const response = await axios.get('http://127.0.0.1:8000/api/progress-tracker/'); // Simple GET request
        setProgressData(response.data);
      } catch (err) {
        console.error("Error fetching progress data:", err);
        // Simplified error handling as authentication isn't involved in the request
        if (err.response) {
            setError(`Failed to load progress data (${err.response.status}). Please try again later.`);
        } else {
            setError("Failed to connect to the server. Please check your connection and try again.");
        }
        setProgressData(null); // Clear potentially stale data on error
      } finally {
        setLoading(false);
      }
    };

    fetchProgressData();
    // Fetch only once on component mount, not based on user changes
  }, []); 

  // --- Chart Data Preparation ---
  const weeklyChartData = progressData?.weekly_graph ? {
    labels: progressData.weekly_graph.labels,
    datasets: [{
      label: 'Activity (XP/Lessons)',
      data: progressData.weekly_graph.data,
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
    }],
  } : { labels: [], datasets: [] };

  const monthlyChartData = progressData?.monthly_graph ? {
    labels: progressData.monthly_graph.labels,
    datasets: [{
      label: 'Progress (XP/Lessons)',
      data: progressData.monthly_graph.data,
      fill: false,
      borderColor: 'rgb(142, 45, 226)', // Purple line
      tension: 0.1,
    }],
  } : { labels: [], datasets: [] };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' ,
      },
      title: {
        display: false, // We have titles in the section headers
      },
    },
    scales: {
        y: {
            beginAtZero: true
        }
    }
  };

  // --- Render Logic ---
  if (loading) {
    return <div className="container">Loading progress...</div>;
  }

  if (error) {
    return <div className="container error-message">{error}</div>;
  }

  if (!progressData) {
    return <div className="container">No progress data available.</div>;
  }

  return (
    <div className="progress-tracker container">
      <h1>Track Your Progress</h1>
      <p className="page-subtitle">Monitor your performance, climb the ranks, and earn rewards!</p>
      
      {/* Grid layout */}          
      <div className="progress-grid">
        {/* Left Column: Leaderboard & Badges */}
        <div className="progress-column-left">
          {/* Leaderboard */}
          <section className="leaderboard-section card">
            <h2>Top Performers Leaderboard</h2>
            {progressData.leaderboard?.length > 0 ? (
                <ul className="leaderboard-list">
                {progressData.leaderboard.map((profile, index) => (
                    // Remove the current-user highlight logic as user context isn't reliably tied to data
                    <li key={profile.id} className={`leaderboard-item`}>
                    <span className="rank">#{index + 1}</span>
                    <span className="avatar">👤</span> {/* Placeholder avatar */}
                    <span className="name">{profile.user.first_name || profile.user.username}</span>
                    <span className="level">Lv. {profile.level}</span>
                    <span className="xp">{profile.xp} XP</span>
                    </li>
                ))}
                </ul>
            ) : (
                <p>Leaderboard is empty.</p>
            )}
          </section>

          {/* Badges / Rewards - Will show "You haven't earned..." as my_badges is empty */}
          <section className="badges-section card">
            <h2>Your Badges & Rewards</h2>
            {progressData.my_badges?.length > 0 ? (
                 <div className="badges-grid">
                    {/* This part likely won't render as my_badges is empty */}
                    {progressData.my_badges.map((userBadge) => (
                        <div key={userBadge.id} className="badge-item" title={userBadge.badge.description}>
                            <div className="badge-icon">{userBadge.badge.icon_emoji || '🏅'}</div>
                            <div className="badge-name">{userBadge.badge.name}</div>
                        </div>
                    ))}
                 </div>
            ) : (
                 <p>You haven't earned any badges yet. Keep learning!</p>
            )}
          </section>
        </div>

        {/* Right Column: Smart Table & Graphs */}
        <div className="progress-column-right">
            {/* Smart Table (Topics vs Performance) */}
            <section className="smart-table-section card">
                <h2>Topics vs Performance</h2>
                 {/* Render the placeholder data */} 
                 <table className="performance-table">
                     <thead>
                         <tr>
                             <th>Topic</th>
                             <th>Performance (%)</th>
                         </tr>
                     </thead>
                     <tbody>
                         {progressData.topic_performance?.map((item, index) => (
                             <tr key={index}>
                                 <td>{item.topic}</td>
                                 <td>{item.performance}%</td>
                             </tr>
                         ))}
                     </tbody>
                 </table>
                 <p><small>Note: Performance calculation is currently placeholder data.</small></p>
                {/* <PlaceholderTable /> */}
            </section>

            {/* Weekly & Monthly Graphs */}
            <section className="graphs-section card">
                <h2>Performance Graphs</h2>
                 <div className="chart-container">
                    <h3>Weekly Activity</h3>
                    {progressData.weekly_graph?.data.length > 0 ? (
                         <Bar options={chartOptions} data={weeklyChartData} />
                     ) : (
                         <p>No weekly data available yet.</p>
                     )}
                </div>
                 <div className="chart-container">
                    <h3>Monthly Progress</h3>
                     {progressData.monthly_graph?.data.length > 0 ? (
                         <Line options={chartOptions} data={monthlyChartData} />
                     ) : (
                         <p>No monthly data available yet.</p>
                     )}
                </div>
            </section>
        </div>
      </div>
    </div>
  );
}

export default ProgressTracker; 