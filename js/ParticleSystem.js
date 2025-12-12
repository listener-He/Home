class ParticleSystem {
    constructor(options = {}) {
        this.particleCount = options.particleCount || 22000;
        this.theme = options.theme || 'day';
        this.callbacks = options.callbacks || {};
        
        // 动画控制相关属性
        this.scaleFactor = 1.0;
        this.diffusionFactor = 1.0;
        this.forwardFactor = 0.0;
        this.speedFactor = 1.0;
        
        // 当前动画类型
        this.currentAnimation = 'saturn'; // 默认为土星动画
        
        // 动画状态
        this.animationState = 'scattered'; // 默认状态为分散状态
        
        this.init();
    }
    
    init() {
        this.geometry = new THREE.BufferGeometry();
        this.positions = new Float32Array(this.particleCount * 3);
        this.targets = new Float32Array(this.particleCount * 3);
        this.origin = new Float32Array(this.particleCount * 3);
        this.velocities = new Float32Array(this.particleCount * 3);
        this.sizes = new Float32Array(this.particleCount);
        this.seeds = new Float32Array(this.particleCount);
        
        this.simplex = new SimplexNoise();
        
        // 初始化为默认的平铺散布状态
        this.initScatteredParticles();
        
        this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
        this.geometry.setAttribute('size', new THREE.BufferAttribute(this.sizes, 1));
        this.geometry.setAttribute('seed', new THREE.BufferAttribute(this.seeds, 1));
        
        this.createMaterial();
        this.particleSystem = new THREE.Points(this.geometry, this.material);
        
        if (this.callbacks.onInit) {
            this.callbacks.onInit(this.particleSystem);
        }
    }
    
    // 初始化平铺散布的粒子分布（默认状态）
    initScatteredParticles() {
        for (let i = 0; i < this.particleCount; i++) {
            const i3 = i * 3;
            
            // 在一个较大的空间内随机分布粒子
            const x = (Math.random() - 0.5) * 2000;
            const y = (Math.random() - 0.5) * 2000;
            const z = (Math.random() - 0.5) * 2000;
            
            this.positions[i3] = x;
            this.origin[i3] = x;
            this.targets[i3] = x;
            this.positions[i3 + 1] = y;
            this.origin[i3 + 1] = y;
            this.targets[i3 + 1] = y;
            this.positions[i3 + 2] = z;
            this.origin[i3 + 2] = z;
            this.targets[i3 + 2] = z;
            
            this.sizes[i] = (Math.random() * 2.5 + 0.5) * (this.theme === 'day' ? 1.3 : 1.0);
            this.seeds[i] = Math.random();
        }
    }
    
    // 初始化土星动画的粒子分布
    initSaturnParticles() {
        // 土星主体粒子数量 (约占70%)
        const planetParticleCount = Math.floor(this.particleCount * 0.7);
        // 土星环粒子数量 (约占30%)
        const ringParticleCount = this.particleCount - planetParticleCount;
        
        // 初始化土星主体粒子 (球形分布)
        for (let i = 0; i < planetParticleCount; i++) {
            const i3 = i * 3;
            const y = 1 - (i / (planetParticleCount - 1)) * 2;
            const radius = Math.sqrt(1 - y * y);
            const theta = i * 2.39996;
            const r = 100; // 土星半径
            
            const x = Math.cos(theta) * radius * r;
            const z = Math.sin(theta) * radius * r;
            const py = y * r;
            
            this.positions[i3] = x;
            this.origin[i3] = x;
            this.targets[i3] = x;
            this.positions[i3 + 1] = py;
            this.origin[i3 + 1] = py;
            this.targets[i3 + 1] = py;
            this.positions[i3 + 2] = z;
            this.origin[i3 + 2] = z;
            this.targets[i3 + 2] = z;
            
            this.sizes[i] = (Math.random() * 2.5 + 0.5) * (this.theme === 'day' ? 1.3 : 1.0);
            this.seeds[i] = Math.random();
        }
        
        // 初始化土星环粒子 (圆环分布)
        for (let i = planetParticleCount; i < this.particleCount; i++) {
            const i3 = i * 3;
            // 多个环的配置
            const ringConfigs = [
                { innerRadius: 130, outerRadius: 140 },
                { innerRadius: 150, outerRadius: 160 },
                { innerRadius: 170, outerRadius: 180 },
                { innerRadius: 190, outerRadius: 200 }
            ];
            
            // 分配到不同环
            const ringIndex = (i - planetParticleCount) % ringConfigs.length;
            const ringConfig = ringConfigs[ringIndex];
            
            // 在环内随机分布
            const angle = Math.random() * Math.PI * 2;
            const radius = ringConfig.innerRadius + Math.random() * (ringConfig.outerRadius - ringConfig.innerRadius);
            
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            const y = (Math.random() - 0.5) * 20; // 环有一定的厚度
            
            this.positions[i3] = x;
            this.origin[i3] = x;
            this.targets[i3] = x;
            this.positions[i3 + 1] = y;
            this.origin[i3 + 1] = y;
            this.targets[i3 + 1] = y;
            this.positions[i3 + 2] = z;
            this.origin[i3 + 2] = z;
            this.targets[i3 + 2] = z;
            
            this.sizes[i] = (Math.random() * 1.5 + 0.5) * (this.theme === 'day' ? 1.3 : 1.0);
            this.seeds[i] = Math.random();
        }
    }
    
    createMaterial() {
        const colors = this.theme === 'day'
            ? {base: new THREE.Color(0x2c3e50), active: new THREE.Color(0x0055ff)}
            : {base: new THREE.Color(0xFFFFFF), active: new THREE.Color(0x00FFFF)};
            
        const paletteA = this.theme === 'day' ? new THREE.Color(0x6ec3ff) : new THREE.Color(0x00ffff);
        const paletteB = this.theme === 'day' ? new THREE.Color(0xffb4c8) : new THREE.Color(0xff7af3);
        const blending = this.theme === 'day' ? THREE.NormalBlending : THREE.AdditiveBlending;
        
        this.material = new THREE.ShaderMaterial({
            uniforms: {
                scale: {value: window.innerHeight / 2},
                baseColor: {value: colors.base},
                activeColor: {value: colors.active},
                mixVal: {value: 0.0},
                time: {value: 0.0},
                paletteA: {value: paletteA},
                paletteB: {value: paletteB},
                nebulaIntensity: {value: 0.0}
            },
            vertexShader: `
                attribute float size;
                attribute float seed;
                varying float vSeed;
                void main() {
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = size * (500.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                    vSeed = seed;
                }
            `,
            fragmentShader: `
                uniform vec3 baseColor;
                uniform vec3 activeColor;
                uniform vec3 paletteA;
                uniform vec3 paletteB;
                uniform float mixVal;
                uniform float time;
                uniform float nebulaIntensity;
                varying float vSeed;
                void main() {
                    float r = length(gl_PointCoord - vec2(0.5));
                    if (r > 0.5) discard;
                    vec3 baseMix = mix(baseColor, activeColor, mixVal);
                    float drift = 0.5 + 0.5 * sin(time * 0.15 + vSeed * 6.28318);
                    vec3 nebula = mix(paletteA, paletteB, drift);
                    vec3 finalColor = mix(baseMix, nebula, nebulaIntensity);
                    gl_FragColor = vec4(finalColor, 1.0);
                }
            `,
            blending: blending,
            depthTest: false,
            transparent: true
        });
    }
    
    update(time, mode, handCount, handL, handR) {
        const adjustedTime = time * this.speedFactor;
        this.material.uniforms.time.value = adjustedTime;
        
        if (this.theme === 'night') {
            this.material.uniforms.nebulaIntensity.value = mode === 'UNLOCKED' ? 0.55 : 0.35;
        } else {
            this.material.uniforms.nebulaIntensity.value = mode === 'UNLOCKED' ? 0.22 : 0.12;
        }
        
        let targetMix = 0;
        
        if (mode === 'LOCKED') {
            targetMix = handCount > 0 ? 0.6 : 0.0;
            const ns = 0.002 * this.diffusionFactor;
            const ts = adjustedTime * 0.15;
            
            for (let i = 0; i < this.particleCount; i++) {
                const i3 = i * 3;
                const ox = this.origin[i3] * this.scaleFactor;
                const oy = this.origin[i3 + 1] * this.scaleFactor;
                const oz = this.origin[i3 + 2] * this.scaleFactor;
                const noise = this.simplex.noise3D(ox * ns + ts, oy * ns, oz * ns + ts);
                
                let offX = 0, offY = 0;
                if (handCount === 1) {
                    offX = handL.x * 0.15 * this.forwardFactor;
                    offY = handL.y * 0.15 * this.forwardFactor;
                }
                
                const scale = 1 + noise * 0.3;
                this.targets[i3] = ox * scale + offX;
                this.targets[i3 + 1] = oy * scale + offY;
                this.targets[i3 + 2] = oz * scale;
            }
        } else {
            targetMix = 1.0;
        }
        
        this.material.uniforms.mixVal.value += (targetMix - this.material.uniforms.mixVal.value) * 0.1;
        
        for (let i = 0; i < this.particleCount; i++) {
            const i3 = i * 3;
            const px = this.positions[i3];
            const py = this.positions[i3 + 1];
            const pz = this.positions[i3 + 2];
            
            const stiff = mode === 'LOCKED' ? 0.03 : 0.05;
            this.velocities[i3] += (this.targets[i3] - px) * stiff;
            this.velocities[i3 + 1] += (this.targets[i3 + 1] - py) * stiff;
            this.velocities[i3 + 2] += (this.targets[i3 + 2] - pz) * stiff;
            
            if (handCount === 1) {
                const hx = handL.x;
                const hy = handL.y;
                const dx = hx - px;
                const dy = hy - py;
                const distSq = dx * dx + dy * dy;
                
                if (distSq < 150000) {
                    const f = (150000 - distSq) / 150000;
                    this.velocities[i3] += dx * f * 0.05;
                    this.velocities[i3 + 1] += dy * f * 0.05;
                    this.velocities[i3 + 2] += Math.sin(adjustedTime * 10 + distSq * 0.0001) * 8 * f;
                }
            } else if (handCount === 2) {
                [handL, handR].forEach(h => {
                    const dx = px - h.x;
                    const dy = py - h.y;
                    const distSq = dx * dx + dy * dy;
                    if (distSq < 80000) {
                        const f = (80000 - distSq) / 80000;
                        this.velocities[i3] -= dx * f * 0.3;
                        this.velocities[i3 + 1] -= dy * f * 0.3;
                        this.velocities[i3 + 2] += 15 * f;
                    }
                });
            }
            
            this.velocities[i3] *= 0.90;
            this.velocities[i3 + 1] *= 0.90;
            this.velocities[i3 + 2] *= 0.90;
            
            this.positions[i3] += this.velocities[i3];
            this.positions[i3 + 1] += this.velocities[i3 + 1];
            this.positions[i3 + 2] += this.velocities[i3 + 2];
        }
        
        this.geometry.attributes.position.needsUpdate = true;
        
        if (this.callbacks.onUpdate) {
            this.callbacks.onUpdate(this.particleSystem);
        }
        
        return targetMix;
    }
    
    explode(force) {
        for (let i = 0; i < this.particleCount; i++) {
            this.velocities[i * 3] += (Math.random() - 0.5) * force;
            this.velocities[i * 3 + 1] += (Math.random() - 0.5) * force;
            this.velocities[i * 3 + 2] += (Math.random() - 0.5) * force;
        }
    }
    
    scatter() {
        // 将粒子散开到随机位置
        for (let i = 0; i < this.particleCount; i++) {
            const i3 = i * 3;
            this.targets[i3] = (Math.random() - 0.5) * 2000;
            this.targets[i3 + 1] = (Math.random() - 0.5) * 2000;
            this.targets[i3 + 2] = (Math.random() - 0.5) * 2000;
        }
        this.animationState = 'scattered';
    }
    
    // 聚合粒子形成土星形状
    aggregate() {
        this.initSaturnParticles();
        this.animationState = 'aggregated';
    }
    
    setScaleFactor(factor) {
        this.scaleFactor = Math.max(0.1, Math.min(2.0, factor));
    }
    
    setDiffusionFactor(factor) {
        this.diffusionFactor = Math.max(0.1, Math.min(3.0, factor));
    }
    
    setForwardFactor(factor) {
        this.forwardFactor = Math.max(-2.0, Math.min(2.0, factor));
    }
    
    setSpeedFactor(factor) {
        this.speedFactor = Math.max(0.01, Math.min(3.0, factor));
    }
    
    // 处理来自手势的指令
    handleGestureCommand(command, value) {
        switch(command) {
            case 'scale':
                this.setScaleFactor(value);
                break;
            case 'diffusion':
                this.setDiffusionFactor(value);
                break;
            case 'forward':
                this.setForwardFactor(value);
                break;
            case 'speed':
                this.setSpeedFactor(value);
                break;
            case 'explode':
                this.explode(value);
                break;
            case 'scatter':
                this.scatter();
                break;
            case 'aggregate':
                this.aggregate();
                break;
        }
    }
    
    dispose() {
        this.geometry.dispose();
        this.material.dispose();
    }
}