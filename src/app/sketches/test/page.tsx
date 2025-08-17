/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface PlanetData {
    name: string;
    size: number;
    color: string;
    distance: number;
    speed: number;
    tilt: number;
    rings?: boolean;
}

const PlanetarySystemPage = (params: {test: string}) => {
    const mountRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const controlsRef = useRef<OrbitControls | null>(null);
    const animationIdRef = useRef<number | null>(null);
    const timeRef = useRef<number>(0);

    const [isPlaying, ] = useState(true);
    const [controls, ] = useState({
        timeSpeed: 1,
        planetScale: 1,
        orbitSpeed: 1,
        showOrbits: true,
        showStars: true,
        cameraAutoRotate: false,
        sunIntensity: 1
    });

    // Planet configuration
    const planetsData: PlanetData[] = [
        { name: 'Mercury', size: 0.38, color: '#8c7853', distance: 8, speed: 4.15, tilt: 0.1 },
        { name: 'Venus', size: 0.95, color: '#ffc649', distance: 12, speed: 1.62, tilt: 177.4 },
        { name: 'Earth', size: 1, color: '#6b93d6', distance: 16, speed: 1, tilt: 23.4 },
        { name: 'Mars', size: 0.53, color: '#c1440e', distance: 22, speed: 0.53, tilt: 25.2 },
        { name: 'Jupiter', size: 2.5, color: '#d8ca9d', distance: 35, speed: 0.08, tilt: 3.1 },
        { name: 'Saturn', size: 2.1, color: '#fad5a5', distance: 50, speed: 0.03, tilt: 26.7, rings: true },
        { name: 'Uranus', size: 1.6, color: '#4fd0e7', distance: 65, speed: 0.01, tilt: 97.8 },
        { name: 'Neptune', size: 1.5, color: '#4b70dd', distance: 80, speed: 0.006, tilt: 28.3 }
    ];

    const planetsRef = useRef<THREE.Group[]>([]);
    const orbitLinesRef = useRef<THREE.Line[]>([]);

    useEffect(() => {
        if (!mountRef.current) return;

        // Scene setup
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000011);
        sceneRef.current = scene;

        // Camera setup
        const camera = new THREE.PerspectiveCamera(
            75,
            mountRef.current.clientWidth / mountRef.current.clientHeight,
            0.1,
            1000
        );
        camera.position.set(30, 20, 30);
        cameraRef.current = camera;

        // Renderer setup
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        rendererRef.current = renderer;
        mountRef.current.appendChild(renderer.domElement);

        // Controls setup
        const orbitControls = new OrbitControls(camera, renderer.domElement);
        orbitControls.enableDamping = true;
        orbitControls.dampingFactor = 0.05;
        orbitControls.minDistance = 10;
        orbitControls.maxDistance = 200;
        controlsRef.current = orbitControls;

        // Create starfield
        createStarfield(scene);

        // Create sun
        createSun(scene);

        // Create planets
        createPlanets(scene);

        // Create orbit lines
        createOrbitLines(scene);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.1);
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xffffff, 2, 300);
        pointLight.position.set(0, 0, 0);
        pointLight.castShadow = true;
        pointLight.shadow.mapSize.width = 2048;
        pointLight.shadow.mapSize.height = 2048;
        pointLight.shadow.camera.near = 0.1;
        pointLight.shadow.camera.far = 300;
        scene.add(pointLight);

        // Handle resize
        const handleResize = () => {
            if (!mountRef.current) return;

            camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (animationIdRef.current) {
                cancelAnimationFrame(animationIdRef.current);
            }
            if (mountRef.current && renderer.domElement) {
                mountRef.current.removeChild(renderer.domElement);
            }
            renderer.dispose();
        };
    }, []);

    useEffect(() => {
        // let time = 0;
        const animate = () => {
            if (isPlaying) {
                timeRef.current += 0.01 * controls.orbitSpeed;

                // Animate planets
                planetsRef.current.forEach((planetGroup, index) => {
                    const planet = planetsData[index];
                    const angle = timeRef.current * planet.speed;

                    planetGroup.position.x = Math.cos(angle) * planet.distance;
                    planetGroup.position.z = Math.sin(angle) * planet.distance;

                    // Rotate planet on its axis
                    const planetMesh = planetGroup.children[0] as THREE.Mesh;
                    if (planetMesh) {
                        planetMesh.rotation.y += 0.01;
                    }
                });

                if (controlsRef.current) {
                    if (controls.cameraAutoRotate) {
                        controlsRef.current.autoRotate = true;
                        controlsRef.current.autoRotateSpeed = 0.5;
                    } else {
                        controlsRef.current.autoRotate = false;
                    }

                    controlsRef.current.update();
                }
            }

            
            if (sceneRef.current && cameraRef.current && rendererRef.current){
                rendererRef.current.render(sceneRef.current, cameraRef.current);
            }
            animationIdRef.current = requestAnimationFrame(animate);
        };

        if (animationIdRef.current !== null) {
            cancelAnimationFrame(animationIdRef.current);
        }
        animate();
    }, [controls.cameraAutoRotate, controls.orbitSpeed, controls.timeSpeed, isPlaying]);

    // Update controls effect
    useEffect(() => {
        if (sceneRef.current) {
            // Update orbit line visibility
            orbitLinesRef.current.forEach(line => {
                line.visible = controls.showOrbits;
            });

            // Update planet scales
            planetsRef.current.forEach((planetGroup, index) => {
                const planetMesh = planetGroup.children[0] as THREE.Mesh;
                if (planetMesh) {
                    const originalScale = planetsData[index].size;
                    planetMesh.scale.setScalar(originalScale * controls.planetScale);
                }
            });

            // Update starfield visibility
            const starfield = sceneRef.current.getObjectByName('starfield');
            if (starfield) {
                starfield.visible = controls.showStars;
            }

            // Update sun light intensity
            const pointLight = sceneRef.current.children.find(
                child => child instanceof THREE.PointLight
            ) as THREE.PointLight;
            if (pointLight) {
                pointLight.intensity = 2 * controls.sunIntensity;
            }
        }
    }, [controls.planetScale, controls.showOrbits, controls.showStars, controls.sunIntensity]);

    const createStarfield = (scene: THREE.Scene) => {
        const geometry = new THREE.BufferGeometry();
        const vertices = [];

        for (let i = 0; i < 10000; i++) {
            vertices.push(
                (Math.random() - 0.5) * 2000,
                (Math.random() - 0.5) * 2000,
                (Math.random() - 0.5) * 2000
            );
        }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        const material = new THREE.PointsMaterial({ color: 0xffffff, size: 1 });
        const starfield = new THREE.Points(geometry, material);
        starfield.name = 'starfield';
        scene.add(starfield);
    };

    const createSun = (scene: THREE.Scene) => {
        const sunGeometry = new THREE.SphereGeometry(3, 32, 32);
        const sunMaterial = new THREE.MeshBasicMaterial({
            color: 0xffff00,
        });
        const sun = new THREE.Mesh(sunGeometry, sunMaterial);
        scene.add(sun);
        return sun;
    };

    const createPlanets = (scene: THREE.Scene) => {
        planetsRef.current = [];

        planetsData.forEach((planet) => {
            const planetGroup = new THREE.Group();

            // Planet geometry and material
            const geometry = new THREE.SphereGeometry(planet.size, 32, 32);
            const material = new THREE.MeshBasicMaterial({ color: planet.color });
            const planetMesh = new THREE.Mesh(geometry, material);

            planetMesh.castShadow = true;
            planetMesh.receiveShadow = true;

            // Add tilt
            planetMesh.rotation.z = (planet.tilt * Math.PI) / 180;

            planetGroup.add(planetMesh);

            // Add rings for Saturn
            if (planet.rings) {
                const ringGeometry = new THREE.RingGeometry(planet.size * 1.2 * 2, planet.size * 2 * 2);
                const ringMaterial = new THREE.MeshBasicMaterial({
                    color: 0xcccccc,
                    side: THREE.DoubleSide
                });
                const rings = new THREE.Mesh(ringGeometry, ringMaterial);
                rings.rotation.x = Math.PI / 2;
                planetGroup.add(rings);
            }

            // Position planet
            planetGroup.position.x = planet.distance;

            scene.add(planetGroup);
            planetsRef.current.push(planetGroup);
        });
    };

    const createOrbitLines = (scene: THREE.Scene) => {
        orbitLinesRef.current = [];

        planetsData.forEach(planet => {
            const points = [];
            for (let i = 0; i <= 64; i++) {
                const angle = (i / 64) * Math.PI * 2;
                points.push(new THREE.Vector3(
                    Math.cos(angle) * planet.distance,
                    0,
                    Math.sin(angle) * planet.distance
                ));
            }

            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const material = new THREE.LineBasicMaterial({
                color: 0x555555,
                transparent: true,
                opacity: 0.3
            });
            const orbitLine = new THREE.Line(geometry, material);

            scene.add(orbitLine);
            orbitLinesRef.current.push(orbitLine);
        });
    };

    console.log(params);

    useEffect(()=>{
        console.log(params);
    }, [params]);

    return <div ref={mountRef} className="w-full h-full text-white">{params.test}</div>;
};

export default PlanetarySystemPage;