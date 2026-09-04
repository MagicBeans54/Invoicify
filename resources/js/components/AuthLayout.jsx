import React, { useEffect, useRef, useState } from 'react';
import { Head } from '@inertiajs/react';
import { TechstackMark } from '@/components/TechstackLogo';

function loadScript(src) {
    return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
            resolve();
            return;
        }
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
    });
}

export default function AuthLayout({ children, title }) {
    const containerRef = useRef(null);
    const canvasRef = useRef(null);
    const [modelFailed, setModelFailed] = useState(false);

    useEffect(() => {
        let renderer;
        let controls;
        let animationId;
        let cancelled = false;

        async function init() {
            try {
                await loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js');
                await loadScript('https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js');
                await loadScript('https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js');
            } catch {
                if (!cancelled) setModelFailed(true);
                return;
            }

            if (cancelled) return;

            const THREE = window.THREE;
            const container = containerRef.current;
            const canvas = canvasRef.current;
            if (!container || !canvas || !THREE) return;

            const fitRenderer = () => {
                const w = container.clientWidth || 220;
                const h = container.clientHeight || 220;
                renderer.setSize(w, h, false);
                camera.aspect = w / h;
                camera.updateProjectionMatrix();
            };

            const w = container.clientWidth || 220;
            const h = container.clientHeight || 220;

            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
            camera.position.set(0, 0, 8);

            renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
            renderer.setSize(w, h, false);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

            scene.add(new THREE.AmbientLight(0xffffff, 0.1));
            const dirLight = new THREE.DirectionalLight(0xffffff, 3);
            dirLight.position.set(10, 10, 10);
            scene.add(dirLight);

            controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.enablePan = false;
            controls.enableZoom = false;

            let logo;
            const loader = new THREE.GLTFLoader();
            loader.load(
                '/3d/techstacks-logo.gltf',
                (gltf) => {
                    if (cancelled) return;
                    logo = gltf.scene;
                    scene.add(logo);
                },
                undefined,
                () => {
                    if (!cancelled) setModelFailed(true);
                }
            );

            function animate() {
                animationId = requestAnimationFrame(animate);
                if (logo) logo.rotation.y += 0.01;
                controls.update();
                renderer.render(scene, camera);
            }
            animate();

            window.addEventListener('resize', fitRenderer);

            // Expose cleanup for the effect teardown below.
            cleanupResize = () => window.removeEventListener('resize', fitRenderer);
        }

        let cleanupResize = null;
        init();

        return () => {
            cancelled = true;
            if (cleanupResize) cleanupResize();
            if (animationId) cancelAnimationFrame(animationId);
            if (controls) controls.dispose();
            if (renderer) renderer.dispose();
        };
    }, []);

    return (
        <>
            <Head title={title} />
            <div className="flex min-h-screen bg-background">
                <aside className="relative hidden w-1/3 shrink-0 overflow-hidden bg-gradient-to-br from-[#0a2018] to-[#00896a] lg:block">
                    <div
                        aria-hidden="true"
                        className="absolute inset-0 z-[1] bg-[linear-gradient(to_top,rgba(0,0,0,0.35),transparent_60%)]"
                    />
                    <div className="relative z-[2] flex h-full flex-col items-center justify-center px-6 text-center text-white xl:px-10">
                        <div ref={containerRef} className="mb-4 h-64 w-64 xl:h-80 xl:w-80">
                            {modelFailed ? (
                                <TechstackMark className="size-full text-white" />
                            ) : (
                                <canvas ref={canvasRef} className="h-full w-full cursor-grab active:cursor-grabbing" />
                            )}
                        </div>
                        <p className="mb-5 text-sm font-semibold uppercase tracking-[2px] text-white/75">
                            Techstacks
                        </p>
                        <h2 className="mb-4 text-[32px] font-bold leading-tight">Invoicify</h2>
                        <p className="max-w-sm text-[15px] leading-[1.7] text-white/90">
                            Professional invoicing — create, send, and track
                            invoices with live totals and PDF delivery.
                        </p>
                    </div>
                </aside>
                <main className="flex flex-1 items-center justify-center p-4 py-10 sm:p-8">
                    <div className="w-full max-w-md">{children}</div>
                </main>
            </div>
        </>
    );
}
