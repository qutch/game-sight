// client/src/components/Profile.jsx
import { useEffect, useState } from 'react';
import "./index.css";


function ProfileComponent() {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('/auth/user', {
            credentials: 'include'
        })
        .then(res => res.json())
        .then(data => {
            if (data.authenticated) {
                setUser(data.user);
            } else {
                setError('Not authenticated');
            }
        })
        .catch(err => setError(err.message));
    }, []);

    if (error) return <div class="text-white">Error: {error}</div>;
    if (!user) return <div class="text-white">Not logged in</div>;

    return (
        <div class="text-white">
            <h1>Welcome, {user.username}!</h1>
            <p>Steam ID: {user.steamId}</p>
        </div>
    );
}

export default ProfileComponent;
