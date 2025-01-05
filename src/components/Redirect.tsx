import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Redirect = () => {
    const { shorturl } = useParams();
    const backendURL = import.meta.env.VITE_PRODUCTION_BACKEND_URL || 'http://localhost:3000/';

    useEffect(() => {
        const redirectToLongUrl = async () => {
            if (shorturl) {
                try {
                    const response = await fetch(`${backendURL}${shorturl}`);

                    if (response.status === 200) {
                        const data = await response.json();
                        if (data.longUrl) {
                            window.location.href = data.longUrl;
                        } else {
                            console.error('No long URL found');
                            window.location.href = '/';
                        }
                    } else {
                        console.error('Short URL not found');
                        window.location.href = '/';
                    }
                } catch (error) {
                    console.error('Error fetching short link:', error);
                    window.location.href = '/';
                }
            }
        };

        redirectToLongUrl();
    }, [shorturl]);

    return (
        <div>
            Redirecting...
        </div>
    );
};

export default Redirect;
