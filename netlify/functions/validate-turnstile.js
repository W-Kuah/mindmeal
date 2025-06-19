const TURNSTILE_SECRET_KEY = process.env.VITE_TURNSTILE_SECRET_KEY;

const verifyUrl = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';


exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return {
        statusCode: 405,
        body: JSON.stringify({ errorMessage: 'Method not allowed' })
        };
    }

    try {
        const { token } = JSON.parse(event.body);
        if (!token) throw new Error('Missing token');

        const response = await fetch(verifyUrl, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                secret: TURNSTILE_SECRET_KEY,
                response: token
            })
        })

        const responseData = await response.json();

        if (responseData.success) {
            return {
                statusCode: 200,
                body: JSON.stringify({ 
                    success: responseData.success,
                    challenge_ts: responseData.challenge_ts,
                    hostname: responseData.hostname
                })
            };
        } else {
            return {
                statusCode: 400,
                body: JSON.stringify({ 
                dataDump: process.env.CONTEXT === 'dev' ? responseData : undefined,
                errorMessage: 'Invalid Request'
            })
            }
        }

    } catch (error) {
            return {
            statusCode: 500,
            body: JSON.stringify({ 
                errorMessage: error.message,
                stack: process.env.CONTEXT === 'dev' ? error.stack : undefined,
            })
        }
    }
}