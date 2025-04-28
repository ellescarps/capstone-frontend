import React, {useState, useEffect} from "react";
import CalloutCard from "./CalloutCard";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../API";

function CalloutPage( {search} ) {
    const [callouts, setCallouts] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect( () => {
        async function fetchCallouts() {
            try {
                const response = await fetch(`${API_URL}/posts`);
                const json = await response.json();
                const filtered = json.filter(post => post.type === "callout");
                setCallouts(filtered);
            } catch (error) {
                console.error("Error fetching callouts:", error);
                setError("Failed to load callouts");
            }
        }
        fetchCallouts();
    }, []);
   
    if (error) return <div> error </div>;

    if (!callouts.length) return <p>Loading callouts...</p>

    const filteredCallouts = search
        ? callouts.filter(callout => 
            callout.title.toLowerCase().includes(search.toLowerCase()) ||
            callout.description.toLowerCase().includes(search.toLowerCase())
        )
        : callouts;

return (

    <div className="callout-page">
        <h1>Callouts</h1>
        <div className="callouts-container">
        {filteredCallouts
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) 
            .map(callout => (
            <CalloutCard
            key= {callout.id}
            post={callout}
            onClick={() => navigate(`/posts/${callout.id}`)}
            />
        ))}
        </div>
    </div>
 );
}

export default CalloutPage