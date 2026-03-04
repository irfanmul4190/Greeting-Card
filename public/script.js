const video = document.getElementById('baseVideo');
const canvas = document.getElementById('recorderCanvas');
const ctx = canvas.getContext('2d');
const nameInput = document.getElementById('employeeName');
const btn = document.getElementById('recordBtn');

// Sync canvas to video dimensions when it loads
video.addEventListener('loadeddata', function() {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
});

// Real-time preview loop
function drawLoop() {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "italic 60px EnfactumFont, Georgia, serif"; 
    ctx.textAlign = "center";
    
    // Position text 10% from the bottom
    ctx.fillText(nameInput.value, canvas.width / 2, canvas.height * 0.9);

    if (!video.paused && !video.ended) {
        requestAnimationFrame(drawLoop);
    }
}

// Force the browser to recognize and load the video file
video.src = "assets/Eid.mp4"; 
video.load();

btn.onclick = function() {
    const name = nameInput.value.trim();
    if (!name) return alert("Please enter a name!");

    // Play preview
    video.currentTime = 0;
    video.play();
    drawLoop();

    // Trigger the Vercel Backend "Baker"
    btn.innerText = "Baking Video... Please Wait";
    btn.disabled = true;

    // Redirect to the /render route defined in vercel.json
    window.location.href = `/render?name=${encodeURIComponent(name)}`;
    
    // Re-enable button after 5 seconds
    setTimeout(() => {
        btn.disabled = false;
        btn.innerText = "Personalize & Download";
    }, 5000);
};

video.load(); 
video.muted = true; // Essential for some browsers to allow the video to "wake up"