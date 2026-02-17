// client/src/components/Profile.jsx
import { useEffect, useState } from 'react';
import "./index.css";

import Friends from './Friends';


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

    if (error) return <div className="text-white">Error: {error}</div>;
    if (!user) return <div className="text-white">Not logged in</div>;

    return (
        <div className="text-white">
            <h1>Welcome, {user.username}!</h1>
            <p>Steam ID: {user.steamId}</p>
            <Friends steamId={user.steamId} />
        </div>
    );
}

export default ProfileComponent;
