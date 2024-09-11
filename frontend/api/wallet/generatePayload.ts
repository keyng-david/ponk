const { v4: uuidv4 } = require('uuid');

module.exports = async function generatePayloadHandler(req, res) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        const payload = uuidv4(); // Generate a unique payload
        res.status(200).json({ error: false, payload: { payload } });
    } catch (error) {
        console.error('Error generating payload:', error);
        res.status(500).json({ error: true, message: 'Internal Server Error' });
    }
};