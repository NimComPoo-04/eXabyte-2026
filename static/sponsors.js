import * as THREE from "three";

/* =========================================
   1. THREE.JS BACKGROUND (Put this first so it always loads)
   ========================================= */
const canvas = document.getElementById('background');

if (canvas) {
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0, 5, 10);

    const camera = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true }); // Alpha true for transparency

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    });

    // Custom Shaders for the "Flowing Dots" effect
    const vertexShader = `
    uniform float size; uniform float scale; uniform float time; varying float vFogDepth;
    float random(vec2 co){ return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453); }
    float noise(vec2 st) {
        vec2 i = floor(st); vec2 f = fract(st);
        float s00 = random(i); float s01 = random(i + vec2(0.0, 1.0));
        float s10 = random(i + vec2(1.0, 0.0)); float s11 = random(i + vec2(1.0, 1.0));
        float dx1 = s10 - s00; float dx2 = s11 - s01; float dy1 = s01 - s00; float dy2 = s11 - s10;
        float a = smoothstep(0.0, 1.0, f.x); float b = smoothstep(0.0, 1.0, f.y);
        return s00 + a * dx1 + (1.0 - a) * b * dy1 + a * b * dy2;
    }
    void main() {
        gl_PointSize = size;
        vec3 temp = position;
        temp.z = noise(temp.xy + vec2(0.0, time * 0.5)) * 0.3;
        vec4 mvPosition = modelViewMatrix * vec4(temp, 1.0);
        gl_PointSize *= (scale / -mvPosition.z);
        vFogDepth = -mvPosition.z;
        gl_Position = projectionMatrix * mvPosition;
    }
    `;

    const fragmentShader = `
    uniform vec3 diffuse; uniform float fogNear; uniform float fogFar; uniform float fogDensity; uniform vec3 fogColor;
    varying float vFogDepth;
    void main() {
        float d = length(gl_PointCoord - 0.5);
        if (d > 0.5) discard;
        gl_FragColor = vec4(mix(diffuse, fogColor, 0.0), 1.4 / vFogDepth);
    }
    `;

    // Grid Geometry
    const geometry = new THREE.BufferGeometry();
    const height = 12;
    const width = 5;
    const res = 180;
    const position = new Float32Array(res * res * 3);

    for (let i = 0; i < res; i++) {
        for (let j = 0; j < res; j++) {
            const x = width * (2 * j / (res - 1) - 1);
            const y = height * i / (res - 1);
            const idx = (i * res + j) * 3;
            position[idx] = x + (i % 2 === 0 ? width / res : 0);
            position[idx + 1] = y;
            position[idx + 2] = 0;
        }
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(position, 3));

    const material = new THREE.ShaderMaterial(THREE.ShaderLib.points);
    material.uniforms.diffuse.value = new THREE.Color(0xFFDA00);
    material.uniforms.size.value = 20;
    material.uniforms.time = { value: 0 };
    material.defines.USE_SIZEATTENUATION = true;
    material.fog = true;
    material.transparent = true;
    material.fragmentShader = fragmentShader;
    material.vertexShader = vertexShader;

    const plane = new THREE.Points(geometry, material);
    scene.add(plane);
    scene.add(new THREE.AmbientLight(0xFFFFFF, 1));

    camera.position.z = 0.3;
    camera.position.y = 1;
    camera.rotation.x = Math.PI / 2;
    camera.rotation.z = -Math.PI / 6;

    const clock = new THREE.Clock();

    function animateBG() {
        material.uniforms.time.value += clock.getDelta();
        renderer.render(scene, camera);
        requestAnimationFrame(animateBG);
    }
    animateBG();
}






/* =========================================
   2. UNIFIED VERTICAL SCROLLER
   ========================================= */

const TIER_CONFIG = {
    gold:   { title: "SPONSORS",   subtitle: "The Biggest Gs",          color: "#ffea00", shadow: "rgba(255, 234, 0, 0.5)" },
    silver: { title: "SPONSORS", subtitle: "The Rock Solid Supports", color: "#C0C0C0", shadow: "rgba(192, 192, 192, 0.5)" },
    bronze: { title: "SPONSORS", subtitle: "The elixir of eXabyte 2026",      color: "#cd7f32", shadow: "rgba(205, 127, 50, 0.5)" }
};

class UnifiedSlider {
    constructor(element) {
        if (!element) {
            console.error("UnifiedSlider: Grid element not found!");
            return;
        }
        
        this.container = element; 
        this.cards = Array.from(element.querySelectorAll('.card'));
        
        if (this.cards.length === 0) {
            console.warn("UnifiedSlider: No cards found in grid.");
            return;
        }

        // Physics variables
        this.currentY = 0;
        this.targetY = 0;
        this.isDragging = false;
        this.startY = 0;
        this.startCurrentY = 0;
        
        // Dimensions
        const style = window.getComputedStyle(this.container);
        const gap = parseFloat(style.gap) || 0;
        this.cardHeight = this.cards[0].offsetHeight || 300; // Fallback size
        this.itemStride = this.cardHeight + gap;
        
        // Find start indices
        this.tierIndices = {
            gold: this.cards.findIndex(c => c.dataset.tier === 'gold'),
            silver: this.cards.findIndex(c => c.dataset.tier === 'silver'),
            bronze: this.cards.findIndex(c => c.dataset.tier === 'bronze')
        };

        this.initEvents();
        this.animate();
        this.snapToIndex(0);
    }

    initEvents() {
        // Desktop
        window.addEventListener('mousedown', e => { 
            // Allow clicking anywhere to drag if interacting with the slider area
            if(e.target.closest('.slider-viewport') || e.target.closest('.cards-grid')) {
                this.startDrag(e.clientY); 
            }
        });
        window.addEventListener('mousemove', e => this.onDrag(e.clientY));
        window.addEventListener('mouseup', () => this.endDrag());

        // Mobile
        window.addEventListener('touchstart', e => { 
            if(e.target.closest('.slider-viewport') || e.target.closest('.cards-grid')) {
                this.startDrag(e.touches[0].clientY); 
            }
        });
        window.addEventListener('touchmove', e => this.onDrag(e.touches[0].clientY));
        window.addEventListener('touchend', () => this.endDrag());

        // Wheel
        window.addEventListener('wheel', e => this.onWheel(e), { passive: false });
    }

    onWheel(e) {
        e.preventDefault();
        this.targetY -= e.deltaY * 0.8;
        this.clampTarget();
        clearTimeout(this.scrollTimeout);
        this.scrollTimeout = setTimeout(() => this.snapToNearest(), 100);
    }

    startDrag(y) {
        this.isDragging = true;
        this.startY = y;
        this.startCurrentY = this.currentY;
        this.targetY = this.currentY;
        this.container.style.cursor = 'grabbing';
    }

    onDrag(y) {
        if (!this.isDragging) return;
        const delta = y - this.startY;
        this.targetY = this.startCurrentY + delta * 1.5; 
    }

    endDrag() {
        if (!this.isDragging) return;
        this.isDragging = false;
        this.container.style.cursor = 'grab';
        this.snapToNearest();
    }

    clampTarget() {
        const screenCenterOffset = (window.innerHeight / 2) - (this.cardHeight / 2);
        const maxScroll = screenCenterOffset; 
        const minScroll = screenCenterOffset - ((this.cards.length - 1) * this.itemStride);
        
        if (this.targetY > maxScroll + 50) this.targetY = maxScroll + 50;
        if (this.targetY < minScroll - 50) this.targetY = minScroll - 50;
    }

    snapToNearest() {
        const screenCenterOffset = (window.innerHeight / 2) - (this.cardHeight / 2);
        let index = Math.round((screenCenterOffset - this.targetY) / this.itemStride);
        index = Math.max(0, Math.min(index, this.cards.length - 1));
        this.snapToIndex(index);
    }

    snapToIndex(index) {
        const screenCenterOffset = (window.innerHeight / 2) - (this.cardHeight / 2);
        this.targetY = screenCenterOffset - (index * this.itemStride);
        
        const activeCard = this.cards[index];
        if(!activeCard) return;

        const tier = activeCard.dataset.tier || 'gold'; // Fallback to gold
        const config = TIER_CONFIG[tier];

        if (config) {
            this.updateInterface(tier, config, activeCard);
        }
    }

    updateInterface(tier, config, activeCard) {
        const titleEl = document.getElementById('tierTitle');
        const subEl = document.getElementById('tierSubtitle');
        const historyText = document.getElementById('historyText');
        
        // Update Sidebar Title (Check if changed to avoid flicker)
        if (titleEl && titleEl.innerText !== config.title) {
            titleEl.style.opacity = 0;
            if(subEl) subEl.style.opacity = 0;
            
            setTimeout(() => {
                titleEl.innerText = config.title;
                if(subEl) subEl.innerText = config.subtitle;
                
                titleEl.style.color = config.color;
                titleEl.style.textShadow = `0 0 20px ${config.shadow}`;
                
                titleEl.style.opacity = 1;
                if(subEl) subEl.style.opacity = 1;
            }, 200);
        }

        // Update Nav Pills
        document.querySelectorAll('.nav-item').forEach(item => {
            const isTarget = item.dataset.targetTier === tier;
            item.classList.toggle('active', isTarget);
            
            if (isTarget) {
                const pill = document.getElementById('navPill');
                if(pill) pill.style.borderColor = config.color;
                
                item.style.background = config.color;
                item.style.boxShadow = `0 0 15px ${config.shadow}`;
                item.style.color = 'black';
            } else {
                item.style.background = 'transparent';
                item.style.boxShadow = 'none';
                item.style.color = 'rgba(255,255,255,0.5)';
            }
        });

        // Update History Text
        if(historyText) {
            historyText.innerText = activeCard.getAttribute('data-history') || "";
            historyText.style.color = config.color;
            historyText.style.textShadow = `0 0 10px ${config.shadow}`;
        }
    }

    scrollToTier(tierName) {
        const index = this.tierIndices[tierName];
        if (index !== -1 && index !== undefined) {
            this.snapToIndex(index);
        }
    }

    animate() {
        if (!this.isDragging) {
            this.currentY += (this.targetY - this.currentY) * 0.1;
        }

        // Apply movement
        this.container.style.transform = `translate(-50%, ${this.currentY}px)`;
        
        // Visual Scaling Logic
        const focalPoint = (window.innerHeight / 2);
        const isDesktop = window.innerWidth > 900;

        this.cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const centerY = rect.top + rect.height / 2;
            const dist = Math.abs(focalPoint - centerY);
            
            let normDist = Math.min(dist / (window.innerHeight * 0.5), 1);
            
            // CONFIG: Adjust sizes here
            let maxScale = isDesktop ? 1.5 : 1.2;
            let minScale = isDesktop ? 0.6 : 0.2;

            const scaleDropoff = Math.pow(normDist, 2); 
            let scale = maxScale - (scaleDropoff * (maxScale - minScale));
            if (scale < minScale) scale = minScale;

            card.style.transform = `scale(${scale})`;
            card.style.filter = `blur(${normDist * 10}px) brightness(${1 - normDist * 0.5})`;
            card.style.opacity = Math.max(1 - normDist, 0.3);
            card.style.zIndex = Math.round(100 - normDist * 100);
        });

        requestAnimationFrame(() => this.animate());
    }
}

// === INITIALIZATION ===
const gridElement = document.getElementById('mainGrid');

// Only start the slider if the grid exists
if(gridElement) {
    const slider = new UnifiedSlider(gridElement);

    // Setup Pill Clicks
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            const tier = item.dataset.targetTier;
            slider.scrollToTier(tier);
        });
    });
    
    // Auto-zoom for laptop layout
    function applySmartZoom() {
        const width = window.outerWidth; 
        if (width > 1600) {
            document.body.style.zoom = "125%";
        } else {
            document.body.style.zoom = "100%";
        }
    }
    applySmartZoom();
    window.addEventListener('resize', applySmartZoom);

} else {
    console.error("CRITICAL ERROR: #mainGrid not found in HTML.");
}
