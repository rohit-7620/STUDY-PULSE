import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthStatus } from '../contexts/AuthContext';
import './ProfilePage.css'; // Specific styles

// Re-using badge data/styling concept from ProgressTracker
const badges = [
    { name: 'React Master', icon: '⚛️', description: 'Completed all React modules' },
    { name: 'Python Pro', icon: '🐍', description: 'Mastered advanced Python concepts' },
    { name: 'Quiz Whiz', icon: '🏆', description: 'Achieved top score in 5 quizzes' },
    // Add more earned badges
  ];

// Placeholder data - replace with actual user data from backend/auth context
const initialUserInfo = {
    name: 'Aisha Sharma',
    email: 'aisha.sharma@example.com',
    joinDate: '2023-08-15',
    level: 12,
    xp: 4500,
    avatarUrl: 'https://via.placeholder.com/150/8E2DE2/FFFFFF?text=AS' // Placeholder image
};

const learningHistory = [
    { date: '2024-03-10', title: 'Completed: Advanced React Hooks', type: 'Course' },
    { date: '2024-03-05', title: 'Quiz: Python Fundamentals (Score: 95%)', type: 'Quiz' },
    { date: '2024-02-28', title: 'Started: Machine Learning Basics', type: 'Course' },
    { date: '2024-02-20', title: 'Video Summary: Scalable APIs', type: 'Tool' },
];

const certificates = [
    { id: 'cert-react-101', title: 'Certificate of Completion: React Fundamentals' },
    { id: 'cert-python-adv', title: 'Certificate of Achievement: Advanced Python' },
];

function ProfilePage() {
    const { user, loading: authLoading } = useAuthStatus();
    const [profileData, setProfileData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ firstName: '', lastName: '', bio: '' });
    const [isLoading, setIsLoading] = useState(true); // Start loading initially
    const [error, setError] = useState(null);
    const [updateError, setUpdateError] = useState(null); // Separate error for update failures

    // Fetch profile data on mount
    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) return; // Don't fetch if user not loaded
            setIsLoading(true);
            setError(null);
            try {
                const token = await user.getIdToken();
                const response = await axios.get('/api/profile/', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setProfileData(response.data);
                // Initialize form data when profile is loaded
                setFormData({
                    firstName: response.data.user.first_name || '',
                    lastName: response.data.user.last_name || '',
                    bio: response.data.bio || ''
                });
            } catch (err) {
                console.error("Error fetching profile:", err);
                setError(err.response?.data?.detail || 'Failed to load profile data.');
            } finally {
                setIsLoading(false);
            }
        };

        if (user) {
            fetchProfile();
        }
    }, [user]); // Re-fetch if user object changes

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleEditToggle = () => {
        if (!isEditing) {
             // Entering edit mode, ensure form is synced with latest profile data
            if(profileData) {
                 setFormData({
                    firstName: profileData.user.first_name || '',
                    lastName: profileData.user.last_name || '',
                    bio: profileData.bio || ''
                });
            }
            setUpdateError(null); // Clear previous update errors
        }
        setIsEditing(!isEditing);
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        if (!user) return;

        setIsLoading(true);
        setUpdateError(null);

        try {
            const token = await user.getIdToken();
            const payload = {
                user: {
                    first_name: formData.firstName,
                    last_name: formData.lastName
                },
                bio: formData.bio
            };
            const response = await axios.patch('/api/profile/', payload, {
                 headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                 }
            });
            setProfileData(response.data); // Update local profile data with response
            setIsEditing(false); // Exit editing mode on success
        } catch (err) {
            console.error("Error updating profile:", err);
            setUpdateError(err.response?.data || {'detail': 'Failed to update profile.'});
        } finally {
            setIsLoading(false);
        }
    };

    if (authLoading || (isLoading && !profileData)) {
        return <div className="profile-container loading">Loading Profile...</div>;
    }

    if (error) {
        return <div className="profile-container error">Error: {error}</div>;
    }

    if (!profileData) {
        // This case might happen briefly or if fetch fails silently
        return <div className="profile-container">Could not load profile data.</div>;
    }

    return (
        <div className="profile-container">
            <h2>User Profile</h2>
            <div className="profile-details card">
                <p><strong>Username:</strong> {profileData.user.username}</p>
                <p><strong>Email:</strong> {profileData.user.email}</p>
                <p><strong>XP:</strong> {profileData.xp}</p>
                <p><strong>Level:</strong> {profileData.level}</p>

                {!isEditing ? (
                    <>
                        <p><strong>First Name:</strong> {profileData.user.first_name || '-'}</p>
                        <p><strong>Last Name:</strong> {profileData.user.last_name || '-'}</p>
                        <p><strong>Bio:</strong> {profileData.bio || '-'}</p>
                        <button onClick={handleEditToggle} className="btn-primary">Edit Profile</button>
                    </>
                ) : (
                    <form onSubmit={handleUpdateProfile} className="profile-edit-form">
                        <div className="form-group">
                            <label htmlFor="firstName">First Name:</label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="lastName">Last Name:</label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="bio">Bio:</label>
                            <textarea
                                id="bio"
                                name="bio"
                                value={formData.bio}
                                onChange={handleInputChange}
                                rows="4"
                            />
                        </div>
                        {updateError && (
                            <div className="error-message update-error">
                                Error updating: 
                                {Object.entries(updateError).map(([key, value]) => (
                                    <div key={key}>{key}: {Array.isArray(value) ? value.join(', ') : String(value)}</div>
                                ))}
                            </div>
                        )}
                        <div className="form-actions">
                            <button type="submit" className="btn-primary" disabled={isLoading}>
                                {isLoading ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button type="button" onClick={handleEditToggle} className="btn-secondary" disabled={isLoading}>
                                Cancel
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

export default ProfilePage; 