let animationFrameId;

function drawDotsGridWave(time = 0) {
    const canvas = document.getElementById('bg-dots');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    // Set canvas size to window size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const spacingX = 64; // doubled horizontal space between dots
    const spacingY = 64; // doubled vertical space between dots
    const dotRadius = 2.2;
    const color = "#ff9900"; // orange

    // Animate the dots in a wave pattern
    for (let y = 0; y < canvas.height; y += spacingY) {
        for (let x = 0; x < canvas.width; x += spacingX) {
            // Calculate vertical offset for wave
            const wave = Math.sin((x / 80) + (time / 700)) * 8;
            ctx.beginPath();
            ctx.arc(x, y + wave, dotRadius, 0, 2 * Math.PI, false);
            ctx.fillStyle = color;
            ctx.shadowColor = color;
            ctx.shadowBlur = 6;
            ctx.fill();
            ctx.shadowBlur = 0; // reset for next dot
        }
    }

    animationFrameId = requestAnimationFrame(drawDotsGridWave);
}

// Redraw on resize
window.addEventListener('resize', () => drawDotsGridWave(performance.now()));
// Draw and animate on load
window.addEventListener('DOMContentLoaded', () => drawDotsGridWave(performance.now()));
