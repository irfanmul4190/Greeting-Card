const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
ffmpeg.setFfmpegPath(ffmpegPath);

export default async function handler(req, res) {
    const { name } = req.query;
    
    // FIX: Updated paths to look inside 'public/assets'
    const videoPath = path.join(process.cwd(), 'public', 'assets', 'Eid.mp4');
    const fontPath = path.join(process.cwd(), 'public', 'assets', 'font.ttf');

    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Content-Disposition', `attachment; filename="Enfactum_${name}.mp4"`);

    ffmpeg(videoPath)
        .videoFilters({
            filter: 'drawtext',
            options: {
                text: name || 'Team Enfactum',
                fontfile: fontPath,
                fontsize: 60,
                fontcolor: 'white',
                // Dynamic X: Center of width
                x: '(w-text_w)/2',
                // Dynamic Y: 10% up from the bottom
                // 'h' is total height, 'th' is text height
                y: 'h-(h*0.1)-th' 
            }
        })
        .format('mp4')
        // Important for Vercel: specify the video codec for WhatsApp compatibility
        .videoCodec('libx264') 
        .on('error', (err) => {
            console.error('FFmpeg error:', err);
            if (!res.headersSent) {
                res.status(500).send('Error baking video');
            }
        })
        .pipe(res, { end: true }); 
}