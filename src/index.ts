import SEASONS from './seasons'

const today = new Date();
const month = today.getMonth();


let currentSeason;
for (const [name, season] of Object.entries(SEASONS)) {
    if (season.months.includes(month)) {
        currentSeason = season;
        break;
    }
}

const spawnIntervalJitter = 15000; // Time between spawning new leaves in milliseconds
const referenceWindowArea = 1920 * 900;
let targetParticleCount = updateTargetParticleCount();
const particles = [];

console.log("it is", currentSeason.name)

// Particle class to manage individual particle state and behavior
class Particle {
    private element: HTMLElement;
    private isDragging: boolean;
    private x: number;
    private y: number;
    private hasStopped: boolean;
    private rotation: number;
    private scale: number;
    private opacity: number;
    private time: number;
    private velocity: { x: number; y: number; rotationDirection: number; rotationSpeed: number };
    private stopY: number;
    private targetRotation: number;
    
    
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
        let particleSettings = currentSeason.particles[0];
        const svg = createSvgElement(particleSettings.shapes, particleSettings.colors);
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
                const STRAIGHT_STUCK_POS = 360 - 45
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
                let rotDir = (((this.targetRotation - currentRot) + 360) % 360) - 180;
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
        this.element.style.setProperty('--scale', `${round(this.scale, 3)}`);
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
    let density = currentSeason.particles[0].density
    return Math.round(density * (window.innerWidth * window.innerHeight) / referenceWindowArea);
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
    updateParticles(0);

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
        const matchedName = Object.keys(SEASONS).find(season =>
            season.startsWith(keyBuffer)
        );

        if (matchedName && keyBuffer === matchedName) {
            if (currentSeason.name !== matchedName) {
                currentSeason = SEASONS[matchedName];
                console.log(`changed to ${matchedName}`);
            }
            keyBuffer = ''; // Reset buffer after successful match
        } else if (!matchedName) {
            keyBuffer = ''; // Reset buffer if no matching season
        }
    } else if (e.key === 'Escape') {
        keyBuffer = ''; // Clear buffer on escape
    }
}

document.addEventListener('keydown', handleKey);