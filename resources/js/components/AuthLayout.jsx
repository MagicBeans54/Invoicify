import React, { useEffect, useRef, useState } from 'react';
import { Head } from '@inertiajs/react';
import { useReducedMotion } from 'framer-motion';
import { InvoicifyMark } from '@/components/InvoicifyLogo';

function loadScript(src) {
    return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
            resolve();
            return;
        }
        const script = document.createElement('script');
        script.src = src;
        script.defer = true;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
    });
}

export default function AuthLayout({ children, title }) {
    const containerRef = useRef(null);
    const canvasRef = useRef(null);
    const [modelFailed, setModelFailed] = useState(false);
    const reduceMotion = useReducedMotion();

    useEffect(() => {
        // Decorative 3D only: skip entirely on mobile (<lg), on reduced-motion,
        // or when the panel is hidden — saves CDN + model + battery.
        if (reduceMotion) return;
        if (typeof window === 'undefined') return;
        if (!window.matchMedia('(min-width: 1024px)').matches) return;

        let renderer;
        let controls;
        let animationId;
        let cancelled = false;
        let cleanupResize = null;

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

            const fitRenderer = () => {
                const cw = container.clientWidth || 220;
                const ch = container.clientHeight || 220;
                renderer.setSize(cw, ch, false);
                camera.aspect = cw / ch;
                camera.updateProjectionMatrix();
            };

            let logo;
            const loader = new THREE.GLTFLoader();
            loader.load(
                '/3d/techstacks-logo.gltf',
                (gltf) => {
                    if (cancelled) return;
                    logo = gltf.scene;
                    scene.add(logo);
                    // Reduced-motion or hidden tab: render one static frame, no loop.
                    renderer.render(scene, camera);
                    if (!reduceMotion && !document.hidden) startLoop();
                },
                undefined,
                () => {
                    if (!cancelled) setModelFailed(true);
                }
            );

            function startLoop() {
                function animate() {
                    if (cancelled) return;
                    // Pause when tab hidden to save battery.
                    if (!document.hidden && logo) logo.rotation.y += 0.01;
                    controls.update();
                    renderer.render(scene, camera);
                    animationId = requestAnimationFrame(animate);
                }
                animate();
            }

            const onVisibility = () => {
                if (document.hidden && animationId) {
                    cancelAnimationFrame(animationId);
                    animationId = null;
                } else if (!document.hidden && !animationId && logo && !cancelled && !reduceMotion) {
                    startLoop();
                }
            };
            document.addEventListener('visibilitychange', onVisibility);

            window.addEventListener('resize', fitRenderer);

            cleanupResize = () => {
                window.removeEventListener('resize', fitRenderer);
                document.removeEventListener('visibilitychange', onVisibility);
            };
        }

        // Defer decorative payload until idle so auth form paints first.
        let idleId = null;
        if ('requestIdleCallback' in window) {
            idleId = window.requestIdleCallback(() => init(), { timeout: 2000 });
        } else {
            idleId = window.setTimeout(() => init(), 800);
        }

        return () => {
            cancelled = true;
            if (idleId && 'cancelIdleCallback' in window) window.cancelIdleCallback(idleId);
            else if (idleId) clearTimeout(idleId);
            if (cleanupResize) cleanupResize();
            if (animationId) cancelAnimationFrame(animationId);
            if (controls) controls.dispose();
            if (renderer) renderer.dispose();
        };
    }, [reduceMotion]);

    const showFallback = modelFailed || reduceMotion;

    return (
        <>
            <Head title={title} />
            <div className="flex min-h-screen bg-background">
                <aside className="relative hidden w-1/3 shrink-0 overflow-hidden bg-gradient-to-br from-[#071A12] to-[#00553F] lg:block">
                    <div
                        aria-hidden="true"
                        className="absolute inset-0 z-[1] bg-[linear-gradient(to_top,rgba(0,0,0,0.55),transparent_65%)]"
                    />
                    <div className="relative z-[2] flex h-full flex-col items-center justify-center px-6 text-center text-white xl:px-10">
                        <div ref={containerRef} aria-hidden="true" className="mb-4 h-64 w-64 xl:h-80 xl:w-80">
                            {showFallback ? (
                                <InvoicifyMark className="size-full text-white" />
                            ) : (
                                <canvas ref={canvasRef} className="h-full w-full cursor-grab active:cursor-grabbing" />
                            )}
                        </div>
                        <div className="mb-4 flex items-center gap-2.5">
                            <InvoicifyMark className="size-8 text-white" />
                            <span className="font-display text-[32px] font-bold leading-tight">
                                Invoicify
                            </span>
                        </div>
                        <p className="max-w-sm text-[15px] font-medium leading-[1.7] text-white">
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
