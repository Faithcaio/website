const today = new Date();
const month = today.getMonth();
const seasonMap = {
    spring: [2, 3, 4], // March, April, May
    summer: [5, 6, 7], // June, July, August
    autumn: [8, 9, 10], // September, October, November
    winter: [11, 0, 1] // December, January, February
};
let currentSeason;
for (const [season, seasonMonths] of Object.entries(seasonMap)) {
    if (seasonMonths.includes(month)) {
        currentSeason = season;
        break;
    }
}

const particleDensity = {
    spring: 30,
    summer: 30,
    autumn: 30,
    winter: 40  // More particles in winter for a snowier effect
};
const spawnIntervalJitter = 15000; // Time between spawning new leaves in milliseconds
const referenceWindowArea = 1920 * 900;
let targetParticleCount = updateTargetParticleCount();

const seasonalColors = {
    spring: [
        '#90EE90', // Light green
        '#98FB98', //Pale green
        '#8FBC8F', // Dark sea green
        '#3CB371', // Medium sea green
        '#2E8B57', // Sea green
        '#00FA9A'  // Medium spring green
    ],
    summer: [
        '#228B22', // Forest green
        '#32CD32', // Lime green
        '#00FF00', // Lime
        '#7CFC00', // Lawn green
        '#7FFF00', // Chartreuse
        '#ADFF2F'  // Green yellow
    ],
    autumn: [
        '#FF4500', // Orange red
        '#FF6347', // Tomato
        '#FF8C00', // Dark orange
        '#FFA500', // Orange
        '#FFD700', // Gold
        '#DAA520', // Goldenrod
        '#B8860B', // Dark goldenrod
        '#8B4513'  // Saddle brown
    ],
    winter: [
        '#F0F8FF', // Alice blue
        '#E0FFFF', // Light cyan
        '#B0E0E6', // Powder blue
        '#ADD8E6', // Light blue
        '#87CEEB', // Sky blue
        '#87CEFA'  // Light sky blue
    ]
};

const leafShapes = [
    { path: 'm3.707 21.707 2.967-2.967a7.533 7.533 0 0 0 4.2 1.23 8.886 8.886 0 0 0 6.332-2.763C21.019 13.4 21.958 3.51 22 3.09a1 1 0 0 0-.289-.8 1.013 1.013 0 0 0-.8-.289 45.808 45.808 0 0 0-5.7.961 1 1 0 0 0-.714.64l-.649 1.834-.539-1.085a1 1 0 0 0-1.219-.5 13.782 13.782 0 0 0-5.295 2.94c-3.571 3.571-3.216 8.066-1.535 10.535l-2.967 2.967a1 1 0 0 0 1.414 1.414zm4.5-13.5a10.7 10.7 0 0 1 3.705-2.164l1.192 2.4a.98.98 0 0 0 .957.557 1 1 0 0 0 .881-.665L16.2 4.791a46.16 46.16 0 0 1 3.66-.647c-.367 2.694-1.48 9.066-4.063 11.649-2.788 2.788-5.945 2.457-7.668 1.5l4.582-4.582a1 1 0 0 0-1.414-1.414l-4.586 4.578C5.751 14.151 5.42 11 8.207 8.207z', width: 24, height: 24 },
    { path: 'm3.707 21.707 2.967-2.967a7.533 7.533 0 0 0 4.2 1.23 8.888 8.888 0 0 0 6.332-2.763C21.02 13.4 21.958 3.509 22 3.09a1 1 0 0 0-.289-.8A1.028 1.028 0 0 0 20.91 2c-.419.038-10.3.976-14.117 4.789-3.569 3.573-3.214 8.068-1.533 10.537l-2.967 2.967a1 1 0 0 0 1.414 1.414zm4.5-13.5c2.584-2.583 8.956-3.7 11.65-4.063-.365 2.693-1.477 9.062-4.064 11.649C13 18.581 9.848 18.25 8.125 17.289l4.582-4.582a1 1 0 0 0-1.414-1.414l-4.581 4.581c-.961-1.723-1.292-4.88 1.495-7.667z', width: 24, height: 24 },
    { path: 'M21 2c-5.363 0-9.4 1.517-11.992 4.507-3.241 3.736-3.171 8.56-3.05 10.121l-3.665 3.665a1 1 0 0 0 1.414 1.414l3.724-3.724c2.045-.1 9.949-.739 11.5-4.612A65.031 65.031 0 0 0 21.98 3.2 1 1 0 0 0 21 2zm-3.929 10.629c-.694 1.735-4.262 2.73-7.432 3.146l3.067-3.067 4-4a1 1 0 1 0-1.414-1.414L13 9.586V9a1 1 0 0 0-2 0v2.586l-3.04 3.04A11.489 11.489 0 0 1 10.53 7.8c2-2.3 5.1-3.563 9.215-3.773a63.686 63.686 0 0 1-2.674 8.602z', width: 24, height: 24 }
];

const seasonalShapes = {
    spring: leafShapes,
    summer: leafShapes,
    autumn: leafShapes,
    winter: [
        // Snowflake shapes - 6-pointed stars with decorative details
        { path: 'M 15 0 L 15 30 M 0 15 L 30 15 M 4 4 L 26 26 M 26 4 L 4 26 M 15 5 L 12 8 L 18 8 Z M 15 25 L 12 22 L 18 22 Z M 5 15 L 8 12 L 8 18 Z M 25 15 L 22 12 L 22 18 Z', width: 30, height: 30 },
        { path: 'M 12 0 L 12 24 M 0 12 L 24 12 M 3 3 L 21 21 M 21 3 L 3 21 M 12 4 L 10 6 L 14 6 Z M 12 20 L 10 18 L 14 18 Z M 4 12 L 6 10 L 6 14 Z M 20 12 L 18 10 L 18 14 Z', width: 24, height: 24 },
        { path: 'M 16 0 L 16 32 M 0 16 L 32 16 M 5 5 L 27 27 M 27 5 L 5 27 M 16 6 L 13 9 L 19 9 Z M 16 26 L 13 23 L 19 23 Z M 6 16 L 9 13 L 9 19 Z M 26 16 L 23 13 L 23 19 Z', width: 32, height: 32 },
        { path: 'M 14 0 L 14 28 M 0 14 L 28 14 M 4 4 L 24 24 M 24 4 L 4 24 M 14 5 L 11 8 L 17 8 Z M 14 23 L 11 20 L 17 20 Z M 5 14 L 8 11 L 8 17 Z M 23 14 L 20 11 L 20 17 Z', width: 28, height: 28 },
        { path: 'M 13 0 L 13 26 M 0 13 L 26 13 M 3.5 3.5 L 22.5 22.5 M 22.5 3.5 L 3.5 22.5 M 13 4.5 L 10.5 7 L 15.5 7 Z M 13 21.5 L 10.5 19 L 15.5 19 Z M 4.5 13 L 7 10.5 L 7 15.5 Z M 21.5 13 L 19 10.5 L 19 15.5 Z', width: 26, height: 26 },
    ]
};

let currentColors = seasonalColors[currentSeason];
let currentShapes = seasonalShapes[currentSeason];


const particles = [];

// Particle class to manage individual particle state and behavior
class Particle {
    constructor(element) {
        this.element = element;
        this.reset();
        this.isDragging = false;
    }

    reset() {
        if (particles.length > targetParticleCount) {
            const index = particles.indexOf(this);
            if (index > -1) {
                particles.splice(index, 1);
            }
            this.element.remove();
            return;
        }

        while (this.element.firstChild) {
            this.element.removeChild(this.element.firstChild);
        }
        const svg = createSvgElement(currentShapes, currentColors);
        this.element.appendChild(svg);

        this.x = Math.random() * (window.innerWidth - 50);
        this.y = -10 - Math.random() * 30; // Start above the viewport
        this.rotation = Math.random() * 360;
        this.scale = 0.9;
        this.opacity = 0.8;
        this.time = 0;
        let maxHSpeed = 40
        this.velocity = {
            x: -maxHSpeed / 2 + Math.random() * maxHSpeed,
            y: 30 + Math.random() * 20,
            rotationDirection: Math.random() < 0.5 ? -1 : 1,
            rotationSpeed: 3 + Math.random() * 5
        };

        this.hasStopped = false;
        const viewportHeight = window.innerHeight;
        const bottomThreshold = viewportHeight * 0.85;
        // Choose a random position in the bottom 20% to stop at
        this.stopY = bottomThreshold + (Math.random() * viewportHeight * 0.12);
        // Make sure we don't stop too close to the bottom
        this.stopY = Math.min(this.stopY, viewportHeight * 0.9);
        this.targetRotation = undefined;
    }

    update(deltaTime) {

        deltaTime /= 1000;
        this.time += deltaTime

        let isStopping = false;
        // If we're in the stopping phase and haven't reached the stop position
        if (!this.isDragging && !this.hasStopped && this.y >= this.stopY) {
            isStopping = true;

            const deceleration = 50;
            this.velocity.y -= deceleration * deltaTime;
            this.velocity.y = Math.max(this.velocity.y, 0);

            // Slow down horizontal movement
            this.velocity.x *= 0.95;

            // Check if we've stopped moving
            if (this.velocity.y === 0) {
                this.hasStopped = true;
                this.velocity.x = 0;
                this.velocity.rotationSpeed = 0;
            }
        }
        if (isStopping) {
            const currentRot = (this.rotation + 360) % 360;
            if (!this.targetRotation) {
                const FLAT_POSITIONS = [22, 79, 195, 247];
                const STRAIGHT_STUCK_POS = 360-45
                // Find the closest flat position
                if (currentRot === STRAIGHT_STUCK_POS) {
                    this.targetRotation = currentRot;
                    this.velocity.rotationSpeed = 0;
                    this.velocity.x = 0;
                } else {
                    this.targetRotation = FLAT_POSITIONS.reduce((closest, pos) => {
                        const currentDiff = Math.abs((currentRot - closest + 180) % 360 - 180);
                        const newDiff = Math.abs((currentRot - pos + 180) % 360 - 180);
                        return newDiff < currentDiff ? pos : closest;
                    });
                    this.velocity.rotationSpeed = 80;
                }
            }

            if (this.targetRotation) {
                // Calculate rotation direction (shortest path)
                let rotDir = (((this.targetRotation - currentRot) +360) % 360) - 180;
                this.velocity.rotationDirection = rotDir > 0 ? -1 : 1;
            }
        }

        // If we're offscreen to the left or right, reset the particle
        if (this.x < -50 || this.x > window.innerWidth + 50) {
            this.reset();
        }

        if (!this.isDragging) {
            // Update position
            this.x += this.velocity.x * deltaTime;
            this.y += this.velocity.y * deltaTime;
        }
        this.rotation += this.velocity.rotationSpeed * deltaTime * this.velocity.rotationDirection;

        if (this.hasStopped) {
            const scaleDecrease = 0.05;
            this.scale = Math.max(0.3, this.scale - (scaleDecrease * deltaTime));
            const fadeSpeed = 0.4;
            this.opacity -= fadeSpeed * deltaTime
            this.opacity = Math.max(0, this.opacity);

            if (this.opacity === 0) {
                this.reset();
            }
        }

        let x = this.x - 20;
        let y = this.y - 20;
        // Apply transformations using CSS custom properties for better performance
        this.element.style.setProperty('--x', `${round(x, 2)}px`);
        this.element.style.setProperty('--y', `${round(y, 2)}px`);
        this.element.style.setProperty('--opacity', `${round(this.opacity, 3)}`);
        this.element.style.setProperty('--rotation', `${round(this.rotation)}deg`);
        this.element.style.setProperty('--scale', `${round(this.scale,3)}`);
    }
}

function round(n, p = 0) {
    return Math.round(n * Math.pow(10, p)) / Math.pow(10, p);
}

function createSvgElement(shapes, colors) {
    const shape = shapes[Math.floor(Math.random() * shapes.length)];

    // Create SVG element
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', shape.width);
    svg.setAttribute('height', shape.height);
    svg.setAttribute('viewBox', `0 0 ${shape.width} ${shape.height}`);

    // Create defs and gradient
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const gradientId = `gradient-${Math.random().toString(36).substr(2, 9)}`;
    const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    gradient.setAttribute('id', gradientId);
    gradient.setAttribute('x1', '0%');
    gradient.setAttribute('y1', '0%');
    gradient.setAttribute('x2', '100%');
    gradient.setAttribute('y2', '100%');

    // Add gradient stops
    const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop1.setAttribute('offset', '0%');
    let randomColor1 = colors[Math.floor(Math.random() * colors.length)];
    stop1.setAttribute('stop-color', randomColor1);

    const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop2.setAttribute('offset', '100%');
    let randomColor2 = colors[Math.floor(Math.random() * colors.length)];
    stop2.setAttribute('stop-color', randomColor2);

    gradient.appendChild(stop1);
    gradient.appendChild(stop2);
    defs.appendChild(gradient);
    svg.appendChild(defs);

    // Create path element
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', shape.path);
    path.setAttribute('fill', `url(#${gradientId})`);
    path.setAttribute('stroke', randomColor1);

    svg.appendChild(path);
    return svg;
}

function spawnParticle() {
    const particleElement = document.createElement('div');
    particleElement.className = 'particle';

    const particle = new Particle(particleElement);
    document.body.appendChild(particleElement);
    particles.push(particle);

    // Add event listeners
    particleElement.addEventListener('mousedown', (e) => onClickParticle(e, particle));

    return particle;
}



function updateTargetParticleCount() {
    return Math.round(particleDensity[currentSeason] * (window.innerWidth * window.innerHeight) / referenceWindowArea);
}


function fillupParticles() {
    targetParticleCount = updateTargetParticleCount();
    let startCount = particles.length
    if (targetParticleCount - startCount > 0) {
        console.log(`Spawning ${targetParticleCount - startCount} particles`)
        for (let i = startCount; i < targetParticleCount; i++) {
            const jitter = Math.random() * spawnIntervalJitter;
            setTimeout(spawnParticle, jitter);
        }
    }
    setTimeout(fillupParticles, spawnIntervalJitter + 10)
}

fillupParticles();



document.addEventListener('DOMContentLoaded', () => {
    let lastTime = 0;
    let animationFrameId;

    // Function to update all particles
    function updateParticles(timestamp) {
        if (!lastTime) lastTime = timestamp;
        const deltaTime = timestamp - lastTime;
        lastTime = timestamp;

        for (const particle of particles) {
            particle.update(deltaTime);
        }

        animationFrameId = requestAnimationFrame(updateParticles);
    }

    // Start the particle update loop
    updateParticles();

    // Clean up animation frame on page unload
    window.addEventListener('beforeunload', () => {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
    });
});

function onClickParticle(e, particle) {
    if (e.button !== 0) return; // Only left mouse button
    
    e.preventDefault();
    e.stopPropagation();
    
    // Store initial position and mouse offset
    particle.isDragging = true;

    function move(e) {
        if (!particle.isDragging) return;
        
        // Update position based on mouse position and initial offset
        particle.x = e.clientX
        particle.y = e.clientY
        particle.element.classList.add('grabbed');
    }

    function stopDragging() {
        particle.isDragging = false;
        particle.element.classList.remove('grabbed');
        document.removeEventListener('mousemove', move);
        document.removeEventListener('mouseup', stopDragging);
        document.removeEventListener('mouseleave', stopDragging);
    }

    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', stopDragging);
    document.addEventListener('mouseleave', stopDragging);
}

// Track last keys pressed for season detection
let keyBuffer = '';

function handleKey(e) {
    const resetBuffer = () => {
        setTimeout(() => {
            if (keyBuffer.length > 0) keyBuffer = '';
        }, 1500); // Reset buffer after 1.5 seconds of inactivity
    };

    if (e.key.length === 1 && /[a-zA-Z]/.test(e.key)) {
        keyBuffer += e.key.toLowerCase();
        resetBuffer();
        // Check if buffer matches any season name
        const matchedSeason = Object.keys(seasonMap).find(season =>
            season.startsWith(keyBuffer)
        );

        if (matchedSeason && keyBuffer === matchedSeason) {
            if (currentSeason !== matchedSeason) {
                currentSeason = matchedSeason;
                currentColors = seasonalColors[currentSeason];
                currentShapes = seasonalShapes[currentSeason];
                console.log(`Changed to ${currentSeason} season`);
            }
            keyBuffer = ''; // Reset buffer after successful match
        } else if (!matchedSeason) {
            keyBuffer = ''; // Reset buffer if no matching season
        }
    } else if (e.key === 'Escape') {
        keyBuffer = ''; // Clear buffer on escape
    }
}

document.addEventListener('keydown',  handleKey);