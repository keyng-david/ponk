module.exports = async function checkProofHandler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        const { proof } = req.body;

        // Add your logic to validate the proof here
        const isValid = true; // Simplified for this example

        if (isValid) {
            res.status(200).json({ error: false, payload: { message: 'Proof valid' } });
        } else {
            res.status(400).json({ error: true, payload: { message: 'Invalid proof' } });
        }
    } catch (error) {
        console.error('Error validating proof:', error);
        res.status(500).json({ error: true, message: 'Internal Server Error' });
    }
};