"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import { useLatest, useSignal } from "@/lib/hooks";
import { createReadoutThrottle, SketchProps } from "./types";

interface PlanetData {
    name: string;
    size: number;
    color: string;
    distance: number;
    /** Orbits per Earth year */
    speed: number;
    /** Axial tilt in degrees */
    tilt: number;
    rings?: boolean;
}

const PLANETS: PlanetData[] = [
    { name: "Mercury", size: 0.38, color: "#9c8b78", distance: 8, speed: 4.15, tilt: 0.1 },
    { name: "Venus", size: 0.95, color: "#e8c27a", distance: 12, speed: 1.62, tilt: 177.4 },
    { name: "Earth", size: 1, color: "#5d8fd8", distance: 16, speed: 1, tilt: 23.4 },
    { name: "Mars", size: 0.53, color: "#c8562a", distance: 22, speed: 0.53, tilt: 25.2 },
    { name: "Jupiter", size: 2.5, color: "#d6c4a0", distance: 35, speed: 0.084, tilt: 3.1 },
    { name: "Saturn", size: 2.1, color: "#f0d5a2", distance: 50, speed: 0.034, tilt: 26.7, rings: true },
    { name: "Uranus", size: 1.6, color: "#86d4e2", distance: 65, speed: 0.012, tilt: 97.8 },
    { name: "Neptune", size: 1.5, color: "#4c6fdc", distance: 80, speed: 0.006, tilt: 28.3 },
];

const CAMERA_START = new THREE.Vector3(34, 22, 34);

/** Soft radial glow texture for the sun's corona */
function glowTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 256;
    const ctx = canvas.getContext("2d")!;
    const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    g.addColorStop(0, "rgba(255, 200, 120, 1)");
    g.addColorStop(0.2, "rgba(255, 140, 60, 0.55)");
    g.addColorStop(0.5, "rgba(255, 90, 36, 0.12)");
    g.addColorStop(1, "rgba(255, 90, 36, 0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 256);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
}

export default function Planets({ values, playing, resetSignal, onReadouts }: SketchProps) {
    const mountRef = useRef<HTMLDivElement>(null);
    const valuesRef = useLatest(values);
    const playingRef = useLatest(playing);
    const onReadoutsRef = useLatest(onReadouts);
    const sceneRef = useRef<{
        camera: THREE.PerspectiveCamera;
        controls: OrbitControls;
    } | null>(null);

    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0b0b0a);

        const camera = new THREE.PerspectiveCamera(60, mount.clientWidth / mount.clientHeight, 0.1, 3000);
        camera.position.copy(CAMERA_START);

        // preserveDrawingBuffer lets the viewer save a PNG of the current frame
        const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(mount.clientWidth, mount.clientHeight);
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        mount.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.06;
        controls.minDistance = 8;
        controls.maxDistance = 260;
        controls.autoRotateSpeed = 0.4;
        sceneRef.current = { camera, controls };

        // Starfield
        const starPositions = new Float32Array(9000 * 3);
        for (let i = 0; i < starPositions.length; i += 3) {
            // Points on a distant shell so stars never drift through the system
            const u = Math.random() * 2 - 1;
            const theta = Math.random() * Math.PI * 2;
            const r = 600 + Math.random() * 900;
            const s = Math.sqrt(1 - u * u);
            starPositions[i] = r * s * Math.cos(theta);
            starPositions[i + 1] = r * u;
            starPositions[i + 2] = r * s * Math.sin(theta);
        }
        const starGeometry = new THREE.BufferGeometry();
        starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
        const stars = new THREE.Points(
            starGeometry,
            new THREE.PointsMaterial({ color: 0xecebe4, size: 1.4, sizeAttenuation: false, transparent: true, opacity: 0.8 }),
        );
        scene.add(stars);

        // Sun
        const sun = new THREE.Mesh(new THREE.SphereGeometry(3.2, 48, 48), new THREE.MeshBasicMaterial({ color: 0xffb260 }));
        scene.add(sun);
        const corona = new THREE.Sprite(
            new THREE.SpriteMaterial({ map: glowTexture(), blending: THREE.AdditiveBlending, depthWrite: false }),
        );
        corona.scale.setScalar(26);
        scene.add(corona);

        const sunLight = new THREE.PointLight(0xfff1dc, 2400, 0, 2);
        scene.add(sunLight);
        scene.add(new THREE.AmbientLight(0xffffff, 0.035));

        // Planets and their orbit lines
        const planetGroups: THREE.Group[] = [];
        const planetMeshes: THREE.Mesh[] = [];
        const orbitLines: THREE.LineLoop[] = [];

        PLANETS.forEach((planet, i) => {
            const group = new THREE.Group();
            const mesh = new THREE.Mesh(
                new THREE.SphereGeometry(planet.size, 48, 48),
                new THREE.MeshStandardMaterial({ color: planet.color, roughness: 0.85, metalness: 0 }),
            );
            mesh.rotation.z = THREE.MathUtils.degToRad(planet.tilt);
            group.add(mesh);

            if (planet.rings) {
                const ring = new THREE.Mesh(
                    new THREE.RingGeometry(planet.size * 1.35, planet.size * 2.3, 96),
                    new THREE.MeshStandardMaterial({
                        color: 0xd9c9a8,
                        side: THREE.DoubleSide,
                        transparent: true,
                        opacity: 0.75,
                        roughness: 1,
                    }),
                );
                // Parented to the tilted planet, so the rings sit in its equatorial plane
                ring.rotation.x = Math.PI / 2;
                mesh.add(ring);
            }

            // Stagger starting positions so planets don't begin in a line
            const startAngle = i * 2.17;
            group.position.set(Math.cos(startAngle) * planet.distance, 0, Math.sin(startAngle) * planet.distance);
            group.userData.angle = startAngle;
            scene.add(group);
            planetGroups.push(group);
            planetMeshes.push(mesh);

            const points = Array.from({ length: 160 }, (_, k) => {
                const a = (k / 160) * Math.PI * 2;
                return new THREE.Vector3(Math.cos(a) * planet.distance, 0, Math.sin(a) * planet.distance);
            });
            const orbit = new THREE.LineLoop(
                new THREE.BufferGeometry().setFromPoints(points),
                new THREE.LineBasicMaterial({ color: 0xecebe4, transparent: true, opacity: 0.12 }),
            );
            scene.add(orbit);
            orbitLines.push(orbit);
        });

        const resize = () => {
            const { clientWidth: w, clientHeight: h } = mount;
            if (w === 0 || h === 0) return;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        };
        const observer = new ResizeObserver(resize);
        observer.observe(mount);

        const throttle = createReadoutThrottle(400);
        const clock = new THREE.Clock();
        let years = 0;
        let frame = 0;

        const animate = () => {
            frame = requestAnimationFrame(animate);
            const dt = Math.min(clock.getDelta(), 1 / 20);
            const v = valuesRef.current;

            stars.visible = v.showStars as boolean;
            orbitLines.forEach(line => (line.visible = v.showOrbits as boolean));
            sunLight.intensity = 2400 * (v.sunIntensity as number);
            corona.material.opacity = Math.min(1, 0.55 + 0.25 * (v.sunIntensity as number));
            controls.autoRotate = v.autoRotate as boolean;

            if (playingRef.current) {
                // One Earth year every ~10 seconds at 1×
                const yearStep = dt * 0.1 * (v.orbitSpeed as number);
                years += yearStep;
                planetGroups.forEach((group, i) => {
                    group.userData.angle += yearStep * PLANETS[i].speed * Math.PI * 2;
                    const a = group.userData.angle;
                    group.position.set(Math.cos(a) * PLANETS[i].distance, 0, Math.sin(a) * PLANETS[i].distance);
                    planetMeshes[i].rotation.y += dt * 0.6;
                });
            }
            planetMeshes.forEach(mesh => mesh.scale.setScalar(v.planetScale as number));

            controls.update();
            renderer.render(scene, camera);

            throttle(() => onReadoutsRef.current({ "Earth years": years.toFixed(2), Bodies: PLANETS.length + 1 }));
        };
        animate();

        return () => {
            cancelAnimationFrame(frame);
            observer.disconnect();
            controls.dispose();
            scene.traverse(object => {
                if (object instanceof THREE.Mesh || object instanceof THREE.Points || object instanceof THREE.Line || object instanceof THREE.Sprite) {
                    object.geometry?.dispose();
                    const material = object.material as THREE.Material & { map?: THREE.Texture };
                    material.map?.dispose();
                    material.dispose();
                }
            });
            renderer.dispose();
            mount.removeChild(renderer.domElement);
            sceneRef.current = null;
        };
    }, [valuesRef, playingRef, onReadoutsRef]);

    useSignal(resetSignal, () => {
        const s = sceneRef.current;
        if (!s) return;
        s.controls.reset();
        s.camera.position.copy(CAMERA_START);
        s.controls.target.set(0, 0, 0);
        s.controls.update();
    });

    return <div ref={mountRef} className="h-full w-full cursor-grab active:cursor-grabbing" />;
}
