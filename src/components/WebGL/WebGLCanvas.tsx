import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import type { CampaignBlock, GridShape } from '@/types/campaign';
import { generateGridPositions, gridToWorldCoordinates } from '@/utils/gridGeometry';

interface WebGLCanvasProps {
  blocks: CampaignBlock[];
  gridShape: GridShape;
  gridSize: number;
  brandColor: string;
  onBlockClick: (block: CampaignBlock) => void;
  onBlockHover: (block: CampaignBlock | null) => void;
  selectedBlockId?: string;
  boughtBlocks?: Record<string, string>;
}

export const WebGLCanvas: React.FC<WebGLCanvasProps> = ({
  blocks,
  gridShape,
  gridSize,
  brandColor,
  onBlockClick,
  onBlockHover,
  selectedBlockId,
  boughtBlocks = {},
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.Camera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const blockMeshesRef = useRef<Map<string, THREE.Mesh>>(new Map());
  const instancedMeshRef = useRef<THREE.InstancedMesh | null>(null);
  const baseZsRef = useRef<number[]>([]);
  const [hoveredLocal, setHoveredLocal] = useState<CampaignBlock | null>(null);
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());
  const gridPositionsRef = useRef<ReturnType<typeof generateGridPositions>>([]);
  const controlsRef = useRef<OrbitControls | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const clickCallbackRef = useRef(onBlockClick);
  const hoverCallbackRef = useRef(onBlockHover);
  const isInitializingRef = useRef(false);
  const lastHoveredIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    if (isInitializingRef.current || sceneRef.current) {
      console.log('[WebGLCanvas] skipping init (already initializing or initialized)');
      return;
    }
    isInitializingRef.current = true;

    console.log('[WebGLCanvas] init effect', { blocksLength: blocks.length, gridShape, gridSize });

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f3);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      60,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    const cameraDistance = Math.max(40, gridSize * 6);
    camera.position.set(cameraDistance, cameraDistance * 0.9, cameraDistance * 0.7);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    console.log('[WebGLCanvas] camera pos', camera.position.x, camera.position.y, camera.position.z, 'distance', cameraDistance);

    // create (or reuse) a dedicated canvas for this renderer to avoid context clashes
    let canvas = containerRef.current.querySelector('#buongesto-webgl') as HTMLCanvasElement | null;
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'buongesto-webgl';
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.style.display = 'block';
      containerRef.current.appendChild(canvas);
    }

    const _ctx = (canvas.getContext('webgl2') || canvas.getContext('webgl')) as WebGLRenderingContext | WebGL2RenderingContext | null;
    const context = (_ctx ?? undefined) as unknown as WebGLRenderingContext | undefined;
    const renderer = new THREE.WebGLRenderer({ canvas, context, antialias: true, alpha: true });
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    // ensure canvas drawing buffer matches DPR-scaled size
    canvas.width = Math.floor(containerRef.current.clientWidth * dpr);
    canvas.height = Math.floor(containerRef.current.clientHeight * dpr);
    renderer.setPixelRatio(dpr);
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    // Force an opaque clear color for debugging so we can see if the renderer draws
    renderer.setClearColor(new THREE.Color(0xf0f0f0), 1);
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.zIndex = '0';
    renderer.shadowMap.type = THREE.PCFShadowMap;
    // renderer.domElement is the same as `canvas` we appended above; no need to append again
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(50, 50, 50);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // debug helpers removed for production; keep logs for verification

    // Grid positions
    gridPositionsRef.current = generateGridPositions(gridShape, gridSize);

    // Orbit controls - tuned for smoothness
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.12;
    controls.enablePan = true;
    controls.minDistance = 20;
    controls.maxDistance = 250;
    controls.rotateSpeed = 0.6;
    controls.zoomSpeed = 0.9;
    controls.panSpeed = 0.6;
    controls.target.set(0, 0, 0);
    controls.update();
    controlsRef.current = controls;

    // Create block meshes
    const createBlockMesh = (block: CampaignBlock, position: any) => {
      const isAvailable = block.owner === 'Available';
      const color = boughtBlocks[block.id] || block.color;
      const geometry = new THREE.BoxGeometry(2.8, 2.8, isAvailable ? 0.9 : 1.5);
      const material = new THREE.MeshPhongMaterial({
        color: new THREE.Color(color),
        shininess: 100,
        emissive: new THREE.Color(isAvailable ? 0xcccccc : color),
        emissiveIntensity: isAvailable ? 0.05 : 0.2,
        transparent: isAvailable,
        opacity: isAvailable ? 0.65 : 1,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.position.set(position.x, position.y, position.z);
      mesh.userData = {
        blockId: block.id,
        originalColor: color,
        baseZ: position.z,
        isAvailable,
      };
      return mesh;
    };

    // initial meshes are created/updated in a separate effect to avoid
    // re-creating the entire scene when props like handlers change

    // Particle system
    const particleCount = 100;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 200;
      particlePositions[i + 1] = (Math.random() - 0.5) * 200;
      particlePositions[i + 2] = (Math.random() - 0.5) * 200;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: brandColor,
      size: 0.3,
      sizeAttenuation: true,
      opacity: 0.3,
      transparent: true,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
    particlesRef.current = particles;

    // Mouse interaction (raycast against instanced mesh)
    const onMouseMove = (event: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycasterRef.current.setFromCamera(mouseRef.current, camera);
      const instMesh = instancedMeshRef.current;
      if (!instMesh) return;
      const intersects = raycasterRef.current.intersectObject(instMesh, false);
      let hoveredBlock: CampaignBlock | null = null;
      if (intersects.length) {
        const instId = intersects[0].instanceId ?? -1;
        if (instId >= 0 && blocks[instId]) {
          hoveredBlock = blocks[instId];
          // set local hovered state (no parent updates to avoid re-renders)
          if (lastHoveredIdRef.current !== hoveredBlock.id) {
            lastHoveredIdRef.current = hoveredBlock.id;
            setHoveredLocal(hoveredBlock);
          }
        }
      } else {
        if (lastHoveredIdRef.current !== null) {
          lastHoveredIdRef.current = null;
          setHoveredLocal(null);
        }
      }
    };

    const onMouseClick = (event: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycasterRef.current.setFromCamera(mouseRef.current, camera);
      const intersects = raycasterRef.current.intersectObjects(Array.from(blockMeshesRef.current.values()));

      // click: raycast against instanced mesh and forward the block to parent
      const instMesh = instancedMeshRef.current;
      if (instMesh) {
        const intersects = raycasterRef.current.intersectObject(instMesh, false);
        for (const intersection of intersects) {
          const instId = intersection.instanceId ?? -1;
          if (instId >= 0) {
            const block = blocks[instId];
            if (block) {
              try {
                clickCallbackRef.current?.(block);
              } catch (e) {
                console.error('[WebGLCanvas] click callback error', e);
              }
            }
            break;
          }
        }
      }
    };

    containerRef.current.addEventListener('mousemove', onMouseMove);
    containerRef.current.addEventListener('click', onMouseClick);

    // Animation loop
    let time = 0;
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      time += 0.016;

      // Animate instanced mesh per-instance bobbing
      const instMesh = instancedMeshRef.current;
      if (instMesh) {
        const dummy = new THREE.Object3D();
        for (let i = 0; i < (instMesh.count || blocks.length); i++) {
          const pos = gridToWorldCoordinates(blocks[i].gridX, blocks[i].gridY, gridPositionsRef.current);
          if (!pos) continue;
          const baseZ = baseZsRef.current[i] ?? pos.z;
          const bob = (selectedBlockId === blocks[i].id) ? 0.8 + Math.sin(time * 4) * 0.2 : Math.sin(time * 2 + i) * 0.18;
          dummy.position.set(pos.x, pos.y, baseZ + bob);
          dummy.rotation.set(0.0015 * time, 0.0025 * time, 0);
          dummy.updateMatrix();
          instMesh.setMatrixAt(i, dummy.matrix);
        }
        instMesh.instanceMatrix.needsUpdate = true;
      }

      // Rotate particles with life-like drift
      if (particlesRef.current) {
        particlesRef.current.rotation.x += 0.0003;
        particlesRef.current.rotation.y += 0.0005;
        particlesRef.current.rotation.z += 0.00015;
      }

      // Smooth controls and subtle animation
      controlsRef.current?.update();
      renderer.render(scene, camera);
    };

    animate();

    try {
      const gl = renderer.getContext();
      console.log('[WebGLCanvas] GL VENDOR/RENDERER', gl.getParameter(gl.VENDOR), gl.getParameter(gl.RENDERER));
      console.log('[WebGLCanvas] GL VERSION', gl.getParameter(gl.VERSION));
      console.log('[WebGLCanvas] renderer.info', renderer.info);
      const size = new THREE.Vector2();
      renderer.getSize(size);
      console.log('[WebGLCanvas] renderer size', size.x, size.y, 'canvas dims', renderer.domElement.width, renderer.domElement.height, 'css', renderer.domElement.clientWidth, renderer.domElement.clientHeight);
    } catch (e) {
      console.warn('[WebGLCanvas] cannot read GL information', e);
    }

    // Handle resize
    const onResize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      camera.aspect = width / height;
      (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      containerRef.current?.removeEventListener('mousemove', onMouseMove);
      containerRef.current?.removeEventListener('click', onMouseClick);
      controls.dispose();

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      console.log('[WebGLCanvas] cleanup -- disposing renderer and removing canvas');
      renderer.dispose();
      try {
        containerRef.current?.removeChild(renderer.domElement);
      } catch (e) {
        // ignore
      }
      // clear refs so future mounts can initialize cleanly
      sceneRef.current = null;
      cameraRef.current = null;
      rendererRef.current = null;
      controlsRef.current = null;
      isInitializingRef.current = false;
    };
    }, [gridShape, gridSize, brandColor]);

  // keep callback refs up to date without re-creating the scene
  useEffect(() => {
    clickCallbackRef.current = onBlockClick;
    hoverCallbackRef.current = onBlockHover;
  }, [onBlockClick, onBlockHover]);

  // incrementally create / update / remove meshes when blocks or boughtBlocks change
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const existing = new Set(blockMeshesRef.current.keys());

    // switch to instanced mesh representation
    let instMesh = instancedMeshRef.current;
    const count = blocks.length;
    if (!instMesh || instMesh.count !== count) {
      // dispose old
      if (instMesh) {
        scene.remove(instMesh);
        instMesh.geometry.dispose();
        // @ts-ignore
        if (instMesh.material) instMesh.material.dispose();
      }

      const geometry = new THREE.BoxGeometry(3.6, 3.6, 1.8);
      const material = new THREE.MeshBasicMaterial({ vertexColors: true });
      instMesh = new THREE.InstancedMesh(geometry, material, count);
      instMesh.frustumCulled = false;
      instancedMeshRef.current = instMesh;
      scene.add(instMesh);
      baseZsRef.current = new Array(count).fill(0);
    }

    // fill instances
    const dummy = new THREE.Object3D();
    for (let i = 0; i < count; i++) {
      const block = blocks[i];
      const pos = gridToWorldCoordinates(block.gridX, block.gridY, gridPositionsRef.current);
      if (!pos) continue;
      baseZsRef.current[i] = pos.z;
      dummy.position.set(pos.x, pos.y, pos.z);
      dummy.updateMatrix();
      instMesh.setMatrixAt(i, dummy.matrix);
      const color = new THREE.Color(boughtBlocks[block.id] || block.color);
      // setColorAt exists on newer three versions
      // @ts-ignore
      if (instMesh.setColorAt) instMesh.setColorAt(i, color);
    }
    instMesh.instanceMatrix.needsUpdate = true;
    // @ts-ignore
    if (instMesh.instanceColor) instMesh.instanceColor.needsUpdate = true;

    // remove leftover meshes
    existing.forEach((id) => {
      const mesh = blockMeshesRef.current.get(id);
      if (mesh) {
        scene.remove(mesh);
        if (mesh.geometry) mesh.geometry.dispose();
        // @ts-ignore
        if (mesh.material) mesh.material.dispose();
        blockMeshesRef.current.delete(id);
      }
    });

    console.log('[WebGLCanvas] mesh update, instanced count:', blocks.length);

  }, [blocks, boughtBlocks]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
      }}
    />
  );
};

export default WebGLCanvas;
