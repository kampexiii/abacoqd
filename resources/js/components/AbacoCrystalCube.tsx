import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

// Derivado del símbolo real, sin fondo y con teal de marca para verse en
// light y dark sin depender de blanco puro.
const LOGO_TEXTURE_PATH =
    '/assets/branding/marca/simbolos/abaco-cube-brand.svg';

const CUBE_SIZE = 2.16;
const CAMERA_Z = 4.7;
const FOV = 36;
const INTRO_DURATION = 3.1;
const INTRO_SCALE = 7;

// Pseudo-aleatorio determinista: misma disposición en cada carga.
const rand = (seed: number) => {
    const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453;

    return value - Math.floor(value);
};

type FragmentTier = 'far' | 'macro' | 'near';
type FlashMode = 'compose' | 'explode';

type FragmentSpec = {
    depth: number;
    hasCore: boolean;
    rotation: readonly [number, number, number];
    scale: number;
    side: -1 | 1;
    spin: number;
    tier: FragmentTier;
    u: number;
    v: number;
};

type FragmentLogoFace = {
    normal: THREE.Vector3;
    plane: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;
};

// 42 piezas en tres capas de profundidad: cercanas (brillantes, entre texto y
// carrusel), lejanas (tenues, por todo el hero) y macro (cerca de cámara, en
// los bordes). Posiciones fijas, independientes de la rotación del cubo.
const FRAGMENTS: readonly FragmentSpec[] = Array.from(
    { length: 42 },
    (_, index) => {
        const tier: FragmentTier =
            index < 16 ? 'near' : index < 38 ? 'far' : 'macro';
        const depth =
            tier === 'near'
                ? -0.6 + rand(index * 11 + 5) * 1.5
                : tier === 'far'
                  ? -3.4 + rand(index * 11 + 5) * 2.0
                  : 0.7 + rand(index * 11 + 5) * 0.4;
        const scale =
            tier === 'near'
                ? 0.1 + rand(index * 13 + 6) * 0.15
                : tier === 'far'
                  ? 0.07 + rand(index * 13 + 6) * 0.11
                  : 0.14 + rand(index * 13 + 6) * 0.1;

        return {
            depth,
            hasCore: tier === 'near' && rand(index * 31 + 11) < 0.5,
            rotation: [
                rand(index * 17 + 7) * Math.PI,
                rand(index * 19 + 8) * Math.PI,
                rand(index * 23 + 9) * Math.PI,
            ] as const,
            scale,
            side: rand(index * 3 + 2) < 0.5 ? (-1 as const) : (1 as const),
            spin: 0.15 + rand(index * 29 + 10) * 0.4,
            tier,
            u: rand(index * 5 + 3),
            v: rand(index * 7 + 4),
        };
    },
);

// Rasteriza el SVG real en alta resolución. El canvas recorta la línea
// "ABACO DEVELOPMENTS" inferior y deja solo el símbolo (líneas + A).
const createLogoTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 432;

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;

    fetch(LOGO_TEXTURE_PATH)
        .then((response) => response.text())
        .then((markup) => {
            // Sin width/height explícitos el navegador rasteriza el SVG a
            // ~257px y los trazos finos desaparecen al escalar; se inyectan
            // dimensiones grandes y se rasteriza desde un blob.
            const sized = markup.replace(
                '<svg ',
                '<svg width="1024" height="434" ',
            );
            const blob = new Blob([sized], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            const image = new Image();
            image.onload = () => {
                const context = canvas.getContext('2d');

                if (context) {
                    context.clearRect(0, 0, 1024, 432);
                    context.drawImage(image, 0, 0, 1024, 434);
                    texture.needsUpdate = true;
                }

                URL.revokeObjectURL(url);
            };
            image.onerror = () => URL.revokeObjectURL(url);
            image.src = url;
        })
        .catch(() => undefined);

    return texture;
};

const ENERGY_VERTEX_SHADER = `
    uniform float uTime;
    varying vec3 vNormal;
    varying vec3 vObjectPosition;
    varying vec3 vPosition;
    varying float vWave;

    void main() {
        float t = uTime;
        vNormal = normalize(normalMatrix * normal);
        float w1 = sin(position.x * 4.2 + t * 1.1)
            * sin(position.y * 4.9 - t * 0.85);
        float w2 = sin(position.z * 5.6 + t * 1.5 + position.x * 2.2);
        float w3 = sin((position.x + position.y + position.z) * 2.9 - t * 0.65);
        float wave = w1 * 0.55 + w2 * 0.32 + w3 * 0.38;
        float ripple = sin(position.x * 7.4 - t * 1.45)
            * sin(position.y * 6.7 + t * 1.1)
            * sin(position.z * 5.3 - t * 0.95);
        vec3 stretch = vec3(
            1.0 + 0.1 * sin(t * 0.74),
            1.0 + 0.1 * sin(t * 0.61 + 2.1),
            1.0 + 0.1 * sin(t * 0.68 + 4.2)
        );
        vec3 displaced = position * stretch + normal * (wave * 0.11 + ripple * 0.055);
        vWave = wave * 0.5 + ripple * 0.28 + 0.5;
        vObjectPosition = position;
        vPosition = displaced;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
    }
`;

const ENERGY_FRAGMENT_SHADER = `
    uniform float uTime;
    uniform float uAlpha;
    uniform float uBoost;
    uniform float uThemeAlpha;
    uniform float uThemeBoost;
    varying vec3 vNormal;
    varying vec3 vObjectPosition;
    varying vec3 vPosition;
    varying float vWave;

    void main() {
        vec3 normal = normalize(vNormal);
        float facing = clamp(abs(normal.z), 0.16, 1.0);
        float radius = clamp(length(vPosition) / 0.95, 0.0, 1.4);
        float edgeMask = smoothstep(1.02, 0.46, radius);
        float body = smoothstep(1.04, 0.18, radius);
        float swirlA = 0.5 + 0.5 * sin(vPosition.x * 7.2 + vPosition.y * 5.6 + uTime * 1.34);
        float swirlB = 0.5 + 0.5 * sin(vPosition.z * 8.1 - vPosition.x * 4.9 - uTime * 1.72);
        float swirlC = 0.5 + 0.5 * sin((vObjectPosition.x - vObjectPosition.y + vObjectPosition.z) * 9.0 + uTime * 1.96);
        float veinA = pow(clamp(swirlA * swirlB + swirlC * 0.42, 0.0, 1.0), 1.6);
        float veinB = pow(0.5 + 0.5 * sin(vPosition.y * 11.0 - uTime * 2.05 + vWave * 4.0), 2.0);
        float plasma = clamp(veinA * 1.16 + veinB * 0.62 + body * 0.2, 0.0, 2.0);
        float whiteVeins = clamp(pow(veinA, 1.28) * 0.62 + veinB * 0.3 + body * 0.46, 0.0, 1.0);
        vec3 teal = vec3(0.031, 0.498, 0.549);
        vec3 brandCyan = vec3(0.031, 0.549, 0.549);
        vec3 electricCyan = vec3(0.5, 0.98, 1.0);
        vec3 cyan = vec3(0.94, 1.0, 1.0);
        vec3 mint = vec3(0.81, 0.99, 1.0);
        vec3 white = vec3(0.94, 1.0, 1.0);
        vec3 brandTint = mix(teal, brandCyan, 0.64 + veinA * 0.16);
        vec3 color = mix(white, cyan, 0.22 + plasma * 0.08 + body * 0.08);
        color = mix(color, electricCyan, clamp(0.28 + veinA * 0.24 + veinB * 0.24, 0.0, 0.7));
        color = mix(color, mint, 0.12 + veinB * 0.12 + body * 0.06);
        color = mix(color, brandTint, clamp(0.02 + plasma * 0.018, 0.0, 0.08));
        color = mix(color, white, 0.78 + whiteVeins * 0.18 + body * 0.04);
        float alpha = (0.05 + plasma * 0.3 + veinA * 0.14 + body * 0.08)
            * edgeMask
            * (0.48 + 0.52 * facing)
            * uAlpha
            * uThemeAlpha
            * (1.0 + uBoost * 1.45);

        gl_FragColor = vec4(color * (5.2 + plasma * 3.4 + whiteVeins * 2.0 + body * 0.75 + uBoost * 1.55) * uThemeBoost, alpha);
    }
`;

const disposeMaterial = (material: THREE.Material | THREE.Material[]) => {
    if (Array.isArray(material)) {
        material.forEach((item) => item.dispose());

        return;
    }

    material.dispose();
};

export default function AbacoCrystalCube() {
    const mountRef = useRef<HTMLDivElement | null>(null);
    const zoneRef = useRef<HTMLDivElement | null>(null);
    const flashRef = useRef<HTMLDivElement | null>(null);
    const composeFlashTimerRef = useRef<number | null>(null);
    const desiredDecomposedRef = useRef(false);
    const pressActionRef = useRef<() => void>(() => undefined);
    const pressedRef = useRef(false);
    const releaseActionRef = useRef<() => void>(() => undefined);
    const scrollDecomposedRef = useRef(false);
    const scrollFrameRef = useRef<number | null>(null);
    const syncDesiredDecompositionRef = useRef<() => void>(() => undefined);
    const boostRef = useRef(0);
    const [pressed, setPressed] = useState(false);

    // Fogonazo direccional: `explode` expande desde el centro; `compose`
    // contrae desde fuera para ocultar la reunión de piezas.
    const triggerFlash = (mode: FlashMode) => {
        boostRef.current = 1;

        const flash = flashRef.current;

        if (!flash) {
            return;
        }

        flash.getAnimations().forEach((animation) => animation.cancel());
        flash.dataset.mode = mode;
        const reduced = window.matchMedia(
            '(prefers-reduced-motion: reduce)',
        ).matches;
        const keyframes =
            mode === 'explode'
                ? reduced
                    ? [
                          { opacity: 0, transform: 'scale(0.76)' },
                          { opacity: 1, transform: 'scale(1.18)' },
                          { opacity: 0, transform: 'scale(1.5)' },
                      ]
                    : [
                          { opacity: 0, transform: 'scale(0.18)' },
                          {
                              offset: 0.08,
                              opacity: 1,
                              transform: 'scale(0.82)',
                          },
                          {
                              offset: 0.26,
                              opacity: 1,
                              transform: 'scale(1.24)',
                          },
                          {
                              offset: 0.52,
                              opacity: 0.72,
                              transform: 'scale(1.76)',
                          },
                          { opacity: 0, transform: 'scale(2.18)' },
                      ]
                : reduced
                  ? [
                        { opacity: 0, transform: 'scale(1.32)' },
                        { opacity: 1, transform: 'scale(0.78)' },
                        { opacity: 0, transform: 'scale(0.5)' },
                    ]
                  : [
                        { opacity: 0, transform: 'scale(2.26)' },
                        {
                            offset: 0.14,
                            opacity: 1,
                            transform: 'scale(1.26)',
                        },
                        {
                            offset: 0.34,
                            opacity: 1,
                            transform: 'scale(0.6)',
                        },
                        {
                            offset: 0.62,
                            opacity: 0.82,
                            transform: 'scale(0.34)',
                        },
                        { opacity: 0, transform: 'scale(0.2)' },
                    ];

        flash.animate(keyframes, {
            duration: reduced ? 120 : mode === 'explode' ? 470 : 240,
            easing:
                mode === 'explode'
                    ? 'cubic-bezier(0.18, 0.76, 0.24, 1)'
                    : 'cubic-bezier(0.12, 0.78, 0.18, 1)',
        });
    };

    const syncDesiredDecomposition = () => {
        const next = scrollDecomposedRef.current !== pressedRef.current;

        if (next === desiredDecomposedRef.current) {
            return;
        }

        desiredDecomposedRef.current = next;

        if (composeFlashTimerRef.current !== null) {
            window.clearTimeout(composeFlashTimerRef.current);
            composeFlashTimerRef.current = null;
        }

        if (next) {
            triggerFlash('explode');

            return;
        }

        composeFlashTimerRef.current = window.setTimeout(
            () => {
                composeFlashTimerRef.current = null;
                triggerFlash('compose');
            },
            window.matchMedia('(prefers-reduced-motion: reduce)').matches
                ? 0
                : 40,
        );
    };

    const press = () => {
        if (pressedRef.current) {
            return;
        }

        if (composeFlashTimerRef.current !== null) {
            window.clearTimeout(composeFlashTimerRef.current);
            composeFlashTimerRef.current = null;
        }

        pressedRef.current = true;
        setPressed(true);
        syncDesiredDecomposition();
    };

    const release = () => {
        if (!pressedRef.current) {
            return;
        }

        pressedRef.current = false;
        setPressed(false);
        syncDesiredDecomposition();
    };

    useEffect(() => {
        syncDesiredDecompositionRef.current = syncDesiredDecomposition;
        pressActionRef.current = press;
        releaseActionRef.current = release;
    });

    useEffect(() => {
        const mount = mountRef.current;
        const zone = zoneRef.current;

        if (!mount || !zone) {
            return undefined;
        }

        const reducedMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)',
        ).matches;
        const renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
            powerPreference: 'high-performance',
        });
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.12;
        renderer.setClearColor(0x000000, 0);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
        renderer.domElement.className = 'abaco-crystal-cube__canvas';
        mount.appendChild(renderer.domElement);

        const pmrem = new THREE.PMREMGenerator(renderer);
        const environmentTexture = pmrem.fromScene(
            new RoomEnvironment(),
            0.04,
        ).texture;

        const scene = new THREE.Scene();
        scene.environment = environmentTexture;

        const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 100);
        camera.position.set(0, 0, CAMERA_Z);

        const root = new THREE.Group();
        scene.add(root);

        scene.add(new THREE.AmbientLight(0xb0d9d9, 1.1));

        const keyLight = new THREE.DirectionalLight(0xffffff, 1.9);
        keyLight.position.set(2.8, 3.5, 4.2);
        scene.add(keyLight);

        const tealLight = new THREE.PointLight(0x7abfbf, 5.4, 10);
        tealLight.position.set(-1.8, -0.2, 1.8);
        scene.add(tealLight);

        const innerLight = new THREE.PointLight(0x088c8c, 4.2, 4.5);
        root.add(innerLight);

        const glassGeometry = new THREE.BoxGeometry(
            CUBE_SIZE,
            CUBE_SIZE,
            CUBE_SIZE,
        );
        const glassMaterial = new THREE.MeshPhysicalMaterial({
            clearcoat: 1,
            clearcoatRoughness: 0.05,
            color: 0xd2ecee,
            depthWrite: false,
            emissive: 0x66c2c8,
            emissiveIntensity: 0,
            envMapIntensity: 1.2,
            ior: 1.5,
            metalness: 0,
            opacity: 0.07,
            roughness: 0.03,
            side: THREE.DoubleSide,
            thickness: 1.15,
            transmission: 0.97,
            transparent: true,
        });
        const glassCube = new THREE.Mesh(glassGeometry, glassMaterial);
        root.add(glassCube);

        const edgeGeometry = new THREE.EdgesGeometry(glassGeometry);
        const edgeMaterial = new THREE.LineBasicMaterial({
            blending: THREE.AdditiveBlending,
            color: 0x7abfbf,
            opacity: 0.4,
            transparent: true,
        });
        const edges = new THREE.LineSegments(edgeGeometry, edgeMaterial);
        root.add(edges);

        const fineEdgeMaterial = new THREE.LineBasicMaterial({
            blending: THREE.AdditiveBlending,
            color: 0xffffff,
            opacity: 0.12,
            transparent: true,
        });
        const fineEdges = new THREE.LineSegments(
            edgeGeometry.clone(),
            fineEdgeMaterial,
        );
        fineEdges.scale.setScalar(1.004);
        root.add(fineEdges);

        const logoTexture = createLogoTexture();
        const logoGeometry = new THREE.PlaneGeometry(1.9, 0.8);
        const logoMaterial = new THREE.MeshBasicMaterial({
            depthWrite: false,
            map: logoTexture,
            opacity: 0.94,
            transparent: true,
        });
        const logo = new THREE.Mesh(logoGeometry, logoMaterial);
        logo.position.set(0, 0.02, CUBE_SIZE / 2 - 0.048);
        root.add(logo);

        const logoGlow = new THREE.Mesh(
            logoGeometry,
            new THREE.MeshBasicMaterial({
                blending: THREE.AdditiveBlending,
                depthWrite: false,
                map: logoTexture,
                color: 0xe6ffff,
                opacity: 0.16,
                transparent: true,
            }),
        );
        logoGlow.position.set(0, 0.02, CUBE_SIZE / 2 - 0.064);
        logoGlow.scale.setScalar(1.05);
        root.add(logoGlow);

        const backLogo = new THREE.Mesh(
            logoGeometry,
            new THREE.MeshBasicMaterial({
                depthWrite: false,
                map: logoTexture,
                opacity: 0.48,
                transparent: true,
            }),
        );
        backLogo.position.set(0, 0.02, -CUBE_SIZE / 2 + 0.048);
        backLogo.rotation.y = Math.PI;
        root.add(backLogo);

        const backLogoGlow = new THREE.Mesh(
            logoGeometry,
            new THREE.MeshBasicMaterial({
                blending: THREE.AdditiveBlending,
                depthWrite: false,
                map: logoTexture,
                color: 0xe6ffff,
                opacity: 0.11,
                transparent: true,
            }),
        );
        backLogoGlow.position.set(0, 0.02, -CUBE_SIZE / 2 + 0.064);
        backLogoGlow.rotation.y = Math.PI;
        backLogoGlow.scale.setScalar(1.04);
        root.add(backLogoGlow);

        // Una sola malla de plasma: sin sprites ni capas externas para evitar
        // siluetas circulares alrededor del núcleo.
        const sharedTime = { value: 0 };
        const sharedBoost = { value: 0 };
        const createEnergyMaterial = (alpha: number) =>
            new THREE.ShaderMaterial({
                blending: THREE.AdditiveBlending,
                depthWrite: false,
                fragmentShader: ENERGY_FRAGMENT_SHADER,
                transparent: true,
                uniforms: {
                    uAlpha: { value: alpha },
                    uThemeAlpha: { value: 1 },
                    uThemeBoost: { value: 1 },
                    uBoost: sharedBoost,
                    uTime: sharedTime,
                },
                vertexShader: ENERGY_VERTEX_SHADER,
            });
        const energyGeometry = new THREE.IcosahedronGeometry(0.65, 4);
        const energyInner = new THREE.Mesh(
            energyGeometry,
            createEnergyMaterial(1),
        );
        root.add(energyInner);

        const fragmentsGroup = new THREE.Group();
        fragmentsGroup.visible = false;
        scene.add(fragmentsGroup);

        const fragmentGeometry = new THREE.BoxGeometry(1, 1, 1);
        const fragmentEdgeGeometry = new THREE.EdgesGeometry(fragmentGeometry);
        const fragmentCoreGeometry = new THREE.SphereGeometry(0.16, 16, 16);
        const fragmentLogoGeometry = new THREE.PlaneGeometry(0.58, 0.242);
        const fragmentCoreMaterial = new THREE.MeshBasicMaterial({
            blending: THREE.AdditiveBlending,
            color: 0x9dd8d8,
            depthWrite: false,
            opacity: 0.55,
            transparent: true,
        });
        const createFragmentMaterial = (emissive: number, opacity: number) =>
            new THREE.MeshPhysicalMaterial({
                clearcoat: 0.6,
                clearcoatRoughness: 0.15,
                color: 0x0c3338,
                emissive: 0x087f8c,
                emissiveIntensity: emissive,
                envMapIntensity: 0.6,
                metalness: 0.05,
                opacity,
                roughness: 0.3,
                transparent: true,
            });
        const createFragmentEdgeMaterial = (opacity: number) =>
            new THREE.LineBasicMaterial({
                blending: THREE.AdditiveBlending,
                color: 0x7abfbf,
                opacity,
                transparent: true,
            });
        const fragmentMaterials: Record<
            FragmentTier,
            THREE.MeshPhysicalMaterial
        > = {
            far: createFragmentMaterial(0.08, 0.32),
            macro: createFragmentMaterial(0.04, 0.2),
            near: createFragmentMaterial(0.16, 0.48),
        };
        const fragmentEdgeMaterials: Record<
            FragmentTier,
            THREE.LineBasicMaterial
        > = {
            far: createFragmentEdgeMaterial(0.24),
            macro: createFragmentEdgeMaterial(0.12),
            near: createFragmentEdgeMaterial(0.5),
        };
        const fragmentLogoMaterials: Record<
            FragmentTier,
            THREE.MeshBasicMaterial
        > = {
            far: new THREE.MeshBasicMaterial({
                depthWrite: false,
                map: logoTexture,
                opacity: 0.16,
                transparent: true,
            }),
            macro: new THREE.MeshBasicMaterial({
                depthWrite: false,
                map: logoTexture,
                opacity: 0.28,
                transparent: true,
            }),
            near: new THREE.MeshBasicMaterial({
                depthWrite: false,
                map: logoTexture,
                opacity: 0.48,
                transparent: true,
            }),
        };
        const fragmentTargets = FRAGMENTS.map(() => new THREE.Vector3());
        const fragmentCameraDirection = new THREE.Vector3();
        const fragmentInverseQuaternion = new THREE.Quaternion();
        const fragmentFaceConfigs = [
            {
                normal: new THREE.Vector3(0, 0, 1),
                position: new THREE.Vector3(0, 0, 0.502),
                rotation: new THREE.Euler(0, 0, 0),
            },
            {
                normal: new THREE.Vector3(0, 0, -1),
                position: new THREE.Vector3(0, 0, -0.502),
                rotation: new THREE.Euler(0, Math.PI, 0),
            },
            {
                normal: new THREE.Vector3(1, 0, 0),
                position: new THREE.Vector3(0.502, 0, 0),
                rotation: new THREE.Euler(0, Math.PI / 2, 0),
            },
            {
                normal: new THREE.Vector3(-1, 0, 0),
                position: new THREE.Vector3(-0.502, 0, 0),
                rotation: new THREE.Euler(0, -Math.PI / 2, 0),
            },
            {
                normal: new THREE.Vector3(0, 1, 0),
                position: new THREE.Vector3(0, 0.502, 0),
                rotation: new THREE.Euler(-Math.PI / 2, 0, 0),
            },
            {
                normal: new THREE.Vector3(0, -1, 0),
                position: new THREE.Vector3(0, -0.502, 0),
                rotation: new THREE.Euler(Math.PI / 2, 0, 0),
            },
        ] as const;
        const fragments = FRAGMENTS.map((spec, index) => {
            const mesh = new THREE.Mesh(
                fragmentGeometry,
                fragmentMaterials[spec.tier],
            );
            mesh.add(
                new THREE.LineSegments(
                    fragmentEdgeGeometry,
                    fragmentEdgeMaterials[spec.tier],
                ),
            );

            if (spec.hasCore) {
                mesh.add(
                    new THREE.Mesh(fragmentCoreGeometry, fragmentCoreMaterial),
                );
            }

            const logoFaces: FragmentLogoFace[] = [];
            const shouldAddLogo =
                spec.tier !== 'far' || rand(index * 41 + 17) > 0.36;

            if (shouldAddLogo) {
                fragmentFaceConfigs.forEach((face) => {
                    const plane = new THREE.Mesh(
                        fragmentLogoGeometry,
                        fragmentLogoMaterials[spec.tier],
                    );
                    plane.position.copy(face.position);
                    plane.rotation.copy(face.rotation);
                    plane.visible = false;
                    mesh.add(plane);
                    logoFaces.push({
                        normal: face.normal.clone(),
                        plane,
                    });
                });
            }

            fragmentsGroup.add(mesh);

            return { logoFaces, mesh };
        });

        // Tema: sobre fondo claro los trazos aditivos pierden contraste y los
        // módulos oscuros pesan demasiado; se ajustan colores sin recrear nada.
        const themeState = { edgeOpacity: 0.4 };
        const applyTheme = () => {
            const dark = document.documentElement.classList.contains('dark');
            edgeMaterial.blending = dark
                ? THREE.AdditiveBlending
                : THREE.NormalBlending;
            edgeMaterial.color.set(dark ? 0x7abfbf : 0x087f8c);
            themeState.edgeOpacity = dark ? 0.4 : 0.6;
            fineEdges.visible = dark;
            glassMaterial.color.set(dark ? 0xd2ecee : 0xaad6da);
            glassMaterial.opacity = dark ? 0.07 : 0.16;
            const energyMaterial = energyInner.material as THREE.ShaderMaterial;
            energyMaterial.blending = THREE.AdditiveBlending;
            energyMaterial.uniforms.uThemeAlpha.value = dark ? 1.12 : 1.68;
            energyMaterial.uniforms.uThemeBoost.value = dark ? 1.45 : 2.35;
            energyMaterial.needsUpdate = true;
            (['far', 'macro', 'near'] as const).forEach((tier) => {
                fragmentMaterials[tier].color.set(dark ? 0x0c3338 : 0x9fcfd4);
                fragmentEdgeMaterials[tier].blending = dark
                    ? THREE.AdditiveBlending
                    : THREE.NormalBlending;
                fragmentEdgeMaterials[tier].color.set(
                    dark ? 0x7abfbf : 0x087f8c,
                );
            });
        };

        applyTheme();

        const themeObserver = new MutationObserver(applyTheme);
        themeObserver.observe(document.documentElement, {
            attributeFilter: ['class'],
            attributes: true,
        });

        const anchor = new THREE.Vector3();
        let restScale = 1;

        const layout = () => {
            const mountRect = mount.getBoundingClientRect();
            const zoneRect = zone.getBoundingClientRect();
            const hero = mount.closest('.abaco-hero');
            const copyRect =
                hero
                    ?.querySelector('.abaco-hero__copy')
                    ?.getBoundingClientRect() ?? null;
            const railsRect =
                hero
                    ?.querySelector('.abaco-brand-rails')
                    ?.getBoundingClientRect() ?? null;
            const width = Math.max(1, mountRect.width);
            const height = Math.max(1, mountRect.height);
            renderer.setSize(width, height, false);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();

            const halfH =
                Math.tan(THREE.MathUtils.degToRad(FOV / 2)) * CAMERA_Z;
            const toWorld = (
                px: number,
                py: number,
                depth: number,
                target: THREE.Vector3,
            ) => {
                const ndcX = ((px - mountRect.left) / width) * 2 - 1;
                const ndcY = -(((py - mountRect.top) / height) * 2 - 1);
                const planeHalfH =
                    Math.tan(THREE.MathUtils.degToRad(FOV / 2)) *
                    (CAMERA_Z - depth);
                target.set(
                    ndcX * planeHalfH * camera.aspect,
                    ndcY * planeHalfH,
                    depth,
                );
            };

            toWorld(
                zoneRect.left + zoneRect.width / 2,
                zoneRect.top + zoneRect.height / 2,
                0,
                anchor,
            );
            // 0.8: deja sitio a la diagonal del cubo rotado (~+37% de la arista)
            const cubePx = zoneRect.height * 0.8;
            restScale = ((cubePx / height) * (halfH * 2)) / CUBE_SIZE;
            // Zonas protegidas: topbar, bloque de texto y carrusel.
            const topLimit = mountRect.top + 96;
            const bottomLimit = railsRect
                ? railsRect.top - 10
                : mountRect.bottom - 90;
            const copyBottom = copyRect
                ? copyRect.bottom + 16
                : mountRect.top + height * 0.5;
            const copyLeft = copyRect ? copyRect.left - 24 : mountRect.left;
            const copyRight = copyRect ? copyRect.right + 24 : mountRect.right;
            const sideLeftWidth = copyLeft - mountRect.left;
            const sideRightWidth = mountRect.right - copyRight;

            FRAGMENTS.forEach((spec, index) => {
                let px = 0;
                let py = 0;

                if (spec.tier === 'near') {
                    px = mountRect.left + 36 + spec.u * (width - 72);
                    py =
                        copyBottom +
                        spec.v * Math.max(60, bottomLimit - copyBottom - 30);
                } else if (spec.tier === 'far') {
                    px = mountRect.left + 24 + spec.u * (width - 48);
                    py = topLimit + spec.v * (bottomLimit - topLimit - 20);

                    // Si cae sobre el bloque de texto, reubicar al lateral
                    // libre; si no hay hueco, bajo el texto.
                    if (px > copyLeft && px < copyRight && py < copyBottom) {
                        const sideWidth =
                            spec.side === -1 ? sideLeftWidth : sideRightWidth;

                        if (sideWidth >= 80) {
                            px =
                                spec.side === -1
                                    ? mountRect.left +
                                      20 +
                                      spec.u * (sideLeftWidth - 40)
                                    : copyRight +
                                      20 +
                                      spec.u * (sideRightWidth - 40);
                        } else {
                            py =
                                copyBottom +
                                spec.v *
                                    Math.max(60, bottomLimit - copyBottom - 30);
                        }
                    }
                } else {
                    const band = width * 0.14;
                    px =
                        spec.side === -1
                            ? mountRect.left + spec.u * band
                            : mountRect.right - spec.u * band;
                    py =
                        mountRect.top + height * 0.5 + spec.v * (height * 0.42);
                }

                toWorld(px, py, spec.depth, fragmentTargets[index]);
            });
        };

        const resizeObserver = new ResizeObserver(layout);
        resizeObserver.observe(mount);
        resizeObserver.observe(zone);
        layout();

        const updateScrollState = () => {
            scrollFrameRef.current = null;

            const hero = mount.closest('.abaco-hero');

            if (!hero) {
                return;
            }

            const rect = hero.getBoundingClientRect();
            const progress = Math.max(0, Math.min(1, -rect.top / rect.height));
            const nextScrollDecomposed = scrollDecomposedRef.current
                ? progress > 0
                : progress > 0;

            if (nextScrollDecomposed === scrollDecomposedRef.current) {
                return;
            }

            scrollDecomposedRef.current = nextScrollDecomposed;
            syncDesiredDecompositionRef.current();
        };

        const requestScrollStateUpdate = () => {
            if (scrollFrameRef.current !== null) {
                return;
            }

            scrollFrameRef.current =
                window.requestAnimationFrame(updateScrollState);
        };

        window.addEventListener('scroll', requestScrollStateUpdate, {
            passive: true,
        });
        window.addEventListener('resize', requestScrollStateUpdate);
        updateScrollState();

        const isBlockedHeroTarget = (target: EventTarget | null) => {
            if (!(target instanceof Element)) {
                return true;
            }

            return Boolean(
                target.closest(
                    'a, button, input, textarea, select, [role="button"], .abaco-header, .abaco-hero__copy, .abaco-brand-rails',
                ),
            );
        };

        const hero = mount.closest('.abaco-hero');
        const handleHeroPointerDown = (event: Event) => {
            const pointerEvent = event as PointerEvent;

            if (
                pointerEvent.button !== 0 ||
                isBlockedHeroTarget(pointerEvent.target)
            ) {
                return;
            }

            pressActionRef.current();
        };
        const handleGlobalPointerRelease = () => releaseActionRef.current();

        if (hero) {
            hero.addEventListener('pointerdown', handleHeroPointerDown);
        }

        window.addEventListener('pointerup', handleGlobalPointerRelease);
        window.addEventListener('pointercancel', handleGlobalPointerRelease);

        const timer = new THREE.Timer();
        let frameId = 0;
        let decomposeProgress = 0;

        const animate = () => {
            timer.update();
            const elapsed = timer.getElapsed();
            const delta = Math.min(timer.getDelta(), 0.05);

            const introProgress = reducedMotion
                ? 1
                : Math.min(elapsed / INTRO_DURATION, 1);
            const easedIntro = 1 - Math.pow(1 - introProgress, 4);
            const introScale = THREE.MathUtils.lerp(INTRO_SCALE, 1, easedIntro);

            const motionScale = reducedMotion ? 0.18 : 1;
            root.position.copy(anchor);
            root.scale.setScalar(restScale * introScale);
            root.rotation.y =
                0.58 + elapsed * 0.16 * motionScale + (1 - easedIntro) * 0.5;
            root.rotation.x =
                -0.2 +
                Math.sin(elapsed * 0.42) * 0.055 * motionScale +
                (1 - easedIntro) * 0.18;
            root.rotation.z =
                0.05 + Math.sin(elapsed * 0.27) * 0.03 * motionScale;

            const decomposeTarget = desiredDecomposedRef.current ? 1 : 0;
            const decomposeLambda = desiredDecomposedRef.current
                ? reducedMotion
                    ? 18
                    : 6.4
                : reducedMotion
                  ? 24
                  : 12.5;
            decomposeProgress = THREE.MathUtils.damp(
                decomposeProgress,
                decomposeTarget,
                decomposeLambda,
                delta,
            );
            const eased =
                decomposeProgress *
                decomposeProgress *
                (3 - 2 * decomposeProgress);
            const energyVisibility = 1 - eased;
            const softenedVisibility = Math.max(
                0,
                energyVisibility * energyVisibility,
            );

            root.visible = desiredDecomposedRef.current
                ? decomposeProgress < 0.44
                : decomposeProgress < 0.14;
            fragmentsGroup.visible = desiredDecomposedRef.current
                ? decomposeProgress >= 0.035
                : decomposeProgress >= 0.02;

            if (fragmentsGroup.visible) {
                fragments.forEach((fragment, index) => {
                    const spec = FRAGMENTS[index];
                    const target = fragmentTargets[index];
                    const bob =
                        Math.sin(elapsed * (0.7 + spec.spin) + index * 1.7) *
                        0.07 *
                        eased;
                    const mesh = fragment.mesh;
                    mesh.position.set(
                        THREE.MathUtils.lerp(anchor.x, target.x, eased),
                        THREE.MathUtils.lerp(anchor.y, target.y, eased) + bob,
                        THREE.MathUtils.lerp(0, target.z, eased),
                    );
                    mesh.scale.setScalar(
                        THREE.MathUtils.lerp(0.1, spec.scale, eased),
                    );
                    mesh.rotation.set(
                        spec.rotation[0] * eased,
                        spec.rotation[1] * eased +
                            elapsed * 0.12 * spec.spin * eased,
                        spec.rotation[2] * eased,
                    );

                    if (fragment.logoFaces.length > 0) {
                        fragmentCameraDirection
                            .copy(camera.position)
                            .sub(mesh.position)
                            .normalize();
                        fragmentInverseQuaternion
                            .copy(mesh.quaternion)
                            .invert();
                        fragmentCameraDirection.applyQuaternion(
                            fragmentInverseQuaternion,
                        );
                        let bestIndex = 0;
                        let bestDot = -Infinity;
                        fragment.logoFaces.forEach((face, faceIndex) => {
                            const dot = face.normal.dot(
                                fragmentCameraDirection,
                            );

                            if (dot > bestDot) {
                                bestDot = dot;
                                bestIndex = faceIndex;
                            }
                        });
                        fragment.logoFaces.forEach((face, faceIndex) => {
                            face.plane.visible =
                                faceIndex === bestIndex && bestDot > 0.16;
                        });
                    }
                });
            }

            // Decaimiento del fogonazo (~450 ms) aplicado a materiales y luz:
            // el estallido parece emitirse desde las caras y aristas del cubo.
            boostRef.current = Math.max(0, boostRef.current - delta * 2.2);
            const boost = boostRef.current;
            sharedTime.value = elapsed;
            sharedBoost.value = boost;
            glassMaterial.emissiveIntensity = boost * 1.3;
            edgeMaterial.opacity = themeState.edgeOpacity + boost * 0.55;
            fineEdgeMaterial.opacity = 0.12 + boost * 0.5;
            innerLight.intensity =
                (3.8 +
                    Math.sin(elapsed * 1.9) * 1.3 * motionScale +
                    boost * 28) *
                (0.2 + softenedVisibility * 0.8);
            energyInner.visible = softenedVisibility > 0.015;
            energyInner.scale.setScalar(0.94 + softenedVisibility * 0.13);
            (
                energyInner.material as THREE.ShaderMaterial
            ).uniforms.uAlpha.value = 1.42 * softenedVisibility;
            logoMaterial.opacity =
                0.92 + Math.sin(elapsed * 1.15) * 0.04 * motionScale;
            backLogo.material.opacity =
                0.34 + Math.sin(elapsed * 0.8 + 1.2) * 0.04 * motionScale;
            logoGlow.material.opacity = 0.14 + boost * 0.28;
            backLogoGlow.material.opacity = 0.08 + boost * 0.18;

            renderer.render(scene, camera);
            frameId = window.requestAnimationFrame(animate);
        };

        animate();

        return () => {
            if (composeFlashTimerRef.current !== null) {
                window.clearTimeout(composeFlashTimerRef.current);
                composeFlashTimerRef.current = null;
            }

            if (scrollFrameRef.current !== null) {
                window.cancelAnimationFrame(scrollFrameRef.current);
                scrollFrameRef.current = null;
            }

            window.removeEventListener('scroll', requestScrollStateUpdate);
            window.removeEventListener('resize', requestScrollStateUpdate);
            hero?.removeEventListener('pointerdown', handleHeroPointerDown);
            window.removeEventListener('pointerup', handleGlobalPointerRelease);
            window.removeEventListener(
                'pointercancel',
                handleGlobalPointerRelease,
            );
            window.cancelAnimationFrame(frameId);
            resizeObserver.disconnect();
            themeObserver.disconnect();
            timer.dispose();
            scene.traverse((object) => {
                const disposableObject = object as {
                    geometry?: THREE.BufferGeometry;
                    material?: THREE.Material | THREE.Material[];
                };
                disposableObject.geometry?.dispose();

                if (disposableObject.material) {
                    disposeMaterial(disposableObject.material);
                }
            });
            logoTexture.dispose();
            environmentTexture.dispose();
            pmrem.dispose();
            renderer.dispose();
            renderer.forceContextLoss();
            renderer.domElement.remove();
        };
    }, []);

    return (
        <div className="abaco-crystal-cube">
            <div
                ref={mountRef}
                className="abaco-crystal-cube__mount"
                aria-hidden="true"
            />
            <div ref={zoneRef} className="abaco-crystal-cube__zone">
                <div
                    ref={flashRef}
                    className="abaco-crystal-cube__flash"
                    aria-hidden="true"
                />
                <button
                    type="button"
                    className="abaco-crystal-cube__hit"
                    aria-label="Mantener pulsado para descomponer el cubo de Ábaco"
                    aria-pressed={pressed}
                    onBlur={release}
                    onContextMenu={(event) => event.preventDefault()}
                    onKeyDown={(event) => {
                        if (event.key === ' ' || event.key === 'Enter') {
                            event.preventDefault();
                            press();
                        }
                    }}
                    onKeyUp={(event) => {
                        if (event.key === ' ' || event.key === 'Enter') {
                            release();
                        }
                    }}
                    onPointerCancel={release}
                    onPointerDown={press}
                    onPointerLeave={release}
                    onPointerUp={release}
                />
            </div>
        </div>
    );
}
