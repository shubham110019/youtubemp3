const express = require('express');
const router = express.Router();
const cors = require('cors');
const bodyParser = require('body-parser');
const ytdl = require('ytdl-core');

router.use(express.urlencoded({ extended: true }));
router.use(express.static('public'));

router.use(cors());
router.use(bodyParser.json());

router.post('/getLinksmp3', async (req, res) => {
    try {
        const { url } = req.body;
        if (!ytdl.validateURL(url)) {
            return res.json({ success: false, error: 'Invalid YouTube URL' });
        }

        const videoInfo = await ytdl.getInfo(url);
        const audioFormats = ytdl.filterFormats(videoInfo.formats, 'audioonly');

        if (audioFormats.length === 0) {
            return res.json({ success: false, error: 'No audio available for this video' });
        }

        const audioStream = ytdl.downloadFromInfo(videoInfo, {
            quality: 'highestaudio'
        });

        // Set response headers for the audio file
        res.setHeader('Content-Disposition', `attachment; filename="${videoInfo.title}.mp3"`);
        res.setHeader('Content-Type', 'audio/mpeg');

        // Pipe audio stream directly to the response
        audioStream.pipe(res);

        // Log errors
        audioStream.on('error', (err) => {
            console.error('Audio stream error:', err);
            res.status(500).json({ success: false, error: 'An error occurred during audio streaming' });
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: 'An error occurred' });
    }
});

module.exports = router;
