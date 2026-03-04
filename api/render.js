const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
ffmpeg.setFfmpegPath(ffmpegPath);

export default async function handler(req, res) {
    const { name } = req.query;
    
    // Ensure we use path.resolve for absolute paths in the Vercel environment
    const videoPath = path.resolve(process.cwd(), 'public', 'assets', 'Eid.mp4');
    const fontPath = path.resolve(process.cwd(), 'public', 'assets', 'font.ttf');

    // Set headers early to prepare for the download stream
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
                x: '(w-text_w)/2',
                y: 'h-(h*0.1)-th' 
            }
        })
        .format('mp4')
        .videoCodec('libx264') 
        // Optimized for Speed: Use a faster preset to beat the 10-second Vercel limit
        .outputOptions('-preset ultrafast') 
        .on('start', (commandLine) => {
            console.log('FFmpeg started with: ' + commandLine);
        })
        .on('error', (err, stdout, stderr) => {
            // DETAILED LOGGING: This will appear in your Vercel Logs tab
            console.error('FFmpeg Error:', err.message);
            console.error('FFmpeg stderr output:', stderr);
            
            if (!res.headersSent) {
                res.status(500).send(`Baking failed. Error: ${err.message}`);
            }
        })
        .on('end', () => {
            console.log('Baking finished successfully.');
        })
        .pipe(res, { end: true }); 
}
