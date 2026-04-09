import React, { useEffect, useRef } from 'react';

const ParallaxStars = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;
        
        const container = containerRef.current;
        container.innerHTML = ''; // Clear existing
        const count = 150;
        
        for (let i = 0; i < count; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            star.style.width = `${Math.random() * 2 + 1}px`;
            star.style.height = `${Math.random() * 2 + 1}px`;
            star.style.setProperty('--duration', `${Math.random() * 3 + 2}s`);
            star.style.animationDelay = `${Math.random() * 3}s`;
            star.style.opacity = `${Math.random() * 0.7 + 0.3}`;
            container.appendChild(star);
        }
    }, []);

    return <div id="parallaxStars" ref={containerRef} className="parallax-stars"></div>;
};

export default ParallaxStars;
