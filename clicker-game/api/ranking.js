export default async function handler(req, res) {
    const DREAMLO_CODE = 's4zlcAk4Vk2wFWPPUJy78gnclmCxIN7U25yroiDeY5IQ';
    const DREAMLO_URL = `http://dreamlo.com/lb/${DREAMLO_CODE}`;

    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const { type, name, score } = req.query;

    try {
        let url = '';
        if (type === 'add') {
            // Add score
            if (!name || !score) {
                res.status(400).json({ error: 'Missing name or score' });
                return;
            }
            url = `${DREAMLO_URL}/add/${encodeURIComponent(name)}/${score}`;
        } else {
            // Get JSON
            url = `${DREAMLO_URL}/json`;
        }

        const response = await fetch(url);
        const data = await response.json(); // Dreamlo returns JSON for /json, what about /add?
        // /add returns text usually.
        if (type === 'add') {
            res.status(200).json({ success: true });
        } else {
            res.status(200).json(data);
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch from Dreamlo' });
    }
}
