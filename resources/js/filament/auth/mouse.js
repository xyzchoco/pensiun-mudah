/**
 * 3D Perspective Mouse Tilt Effect for Login Card
 * Converted 1-to-1 from AI Studio LoginCard.tsx mouse physics
 */
export function initializeMouseEffects() {
    const card = document.getElementById('login-card');
    if (!card) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let rafId = null;

    const updateTilt = () => {
        if (window.__isAuthenticating) return;
        currentX += (targetX - currentX) * 0.1;
        currentY += (targetY - currentY) * 0.1;

        card.style.transform = `perspective(1000px) rotateY(${currentX.toFixed(2)}deg) rotateX(${currentY.toFixed(2)}deg)`;

        if (Math.abs(targetX - currentX) > 0.01 || Math.abs(targetY - currentY) > 0.01) {
            rafId = requestAnimationFrame(updateTilt);
        } else {
            rafId = null;
        }
    };

    const handleMouseMove = (e) => {
        if (window.innerWidth > 768) {
            targetX = (window.innerWidth / 2 - e.pageX) / 90;
            targetY = (window.innerHeight / 2 - e.pageY) / 90;
            if (!rafId) {
                rafId = requestAnimationFrame(updateTilt);
            }
        }
    };

    const handleMouseLeave = () => {
        targetX = 0;
        targetY = 0;
        if (!rafId) {
            rafId = requestAnimationFrame(updateTilt);
        }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
}
