import { useEffect, useState } from "react";

function FriendCard({ friend }) {
    return (
        <div className="friend-card">
            <h3>{friend.friend_name}</h3>
        </div>
    )
}

function FriendsList({ friends }) {
    return (
        <div className="friends-list">
            {friends.map(friend => (
                <FriendCard key={friend.friend_id} friend={friend} />
            ))}
        </div>
    )
}

export default function Friends({ steamId }) {
    const [friends, setFriends] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Try DB first, fall back to Steam API if empty
        fetch(`/api/steam/db-friends/${steamId}`, {
            credentials: 'include'
        })
        .then(res => res.json())
        .then(data => {
            if (data && data.length > 0) {
                setFriends(data);
                setLoading(false);
            } else {
                // DB empty — fetch from Steam API directly
                return fetch(`/api/steam/friends/${steamId}`, {
                    credentials: 'include'
                })
                .then(res => res.json())
                .then(steamFriends => {
                    // Map Steam API shape to match what FriendCard expects
                    const mapped = steamFriends.map(f => ({
                        friend_id: f.steamid,
                        friend_name: f.steamid,
                    }));
                    setFriends(mapped);
                    setLoading(false);
                });
            }
        })
        .catch(err => {
            setError(err.message);
            setLoading(false);
        });
    }, [steamId]);

    if (error) return <div className="text-white">Error: {error}</div>;
    if (loading) return <div className="text-white">Loading friends...</div>;
    if (friends.length === 0) return <div className="text-white">No friends found</div>;

    return (
        <div className="text-white">
            <h2>Friends List</h2>
            <FriendsList friends={friends} />
        </div>
    )
}