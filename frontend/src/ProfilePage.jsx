import { useState, useEffect } from "react";
import axios from "axios";
import './ProfilePage.css';

const ProfilePage = () => {
    const [profileImage, setProfileImage] = useState(null);
    const [username, setUsername] = useState("");
    const [bio, setBio] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showTextarea, setShowTextarea] = useState(false);

    // Fetch profile data on mount
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get("http://localhost:8000/api/v1/users/profile", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                });

                console.log('response is: ',response);
                
                setProfileImage(response.data.profileImage);
                setUsername(response.data.username);
                setBio(response.data.bio || ""); // Set bio or default empty string
                setShowTextarea(false); // Textarea should be hidden by default
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    // Update bio in backend
    const updateBio = async () => {
        try {
            const token = localStorage.getItem("token");
            await axios.patch(
                "http://localhost:8000/api/v1/users/bio",
                { bio },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                }
            );

            setShowTextarea(false); // Hide textarea after bio is saved
            alert("Bio updated successfully!");
        } catch (error) {
            console.error("Error updating bio:", error.response?.data || error.message);
        }
    };

    const handleButtonClick = () => {
        // Toggle visibility of textarea
        setShowTextarea(!showTextarea);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="profile-page">
            <h1 className="welcome-message">Welcome, {username}!</h1>
            {profileImage ? (
                <img
                    className="profile-image"
                    src={profileImage}
                    alt="Profile"
                />
            ) : (
                <div className="profile-placeholder">No Image</div>
            )}

            <div className="bio-section">
                {!showTextarea ? (
                    <p className="bio-text">{bio || "Write about yourself!"}</p>
                ) : (
                    <textarea
                        className="area"
                        placeholder="Enter your bio..."
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                    ></textarea>
                )}
            </div>

            <button onClick={showTextarea ? updateBio : handleButtonClick}>
                Write Bio
            </button>
        </div>
    );
};

export default ProfilePage;
