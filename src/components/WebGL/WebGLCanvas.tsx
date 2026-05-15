import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { CampaignBlock, GridShape } from '@/types/campaign';
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
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());
  const gridPositionsRef = useRef<ReturnType<typeof generateGridPositions>>([]);
  const animationFrameRef = useRef<number>();
  const particlesRef = useRef<THREE.Points | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f3);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 80;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowShadowMap;
    containerRef.current.appendChild(renderer.domElement);
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

    // Grid positions
    gridPositionsRef.current = generateGridPositions(gridShape, gridSize);

    // Create block meshes
    const createBlockMesh = (block: CampaignBlock, position: any) => {
      const color = boughtBlocks[block.id] || block.color;
      const geometry = new THREE.BoxGeometry(2.8, 2.8, 1.5);
      const material = new THREE.MeshPhongMaterial({
        color: new THREE.Color(color),
        shininess: 100,
        emissive: new THREE.Color(color),
        emissiveIntensity: 0.2,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.position.set(position.x, position.y, position.z);
      mesh.userData = { blockId: block.id, originalColor: color };
      return mesh;
    };

    blocks.forEach((block) => {
      const position = gridToWorldCoordinates(block.gridX, block.gridY, gridPositionsRef.current);
      if (position) {
        const mesh = createBlockMesh(block, position);
        scene.add(mesh);
        blockMeshesRef.current.set(block.id, mesh);
      }
    });

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

    // Mouse interaction
    const onMouseMove = (event: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycasterRef.current.setFromCamera(mouseRef.current, camera);
      const intersects = raycasterRef.current.intersectObjects(scene.children);

      let hoveredBlock: CampaignBlock | null = null;

      blockMeshesRef.current.forEach((mesh) => {
        const isIntersecting = intersects.some((int) => int.object === mesh);

        if (isIntersecting) {
          mesh.scale.set(1.1, 1.1, 1.1);
          const material = mesh.material as THREE.MeshPhongMaterial;
          material.emissiveIntensity = 0.4;
          hoveredBlock = blocks.find((b) => b.id === mesh.userData.blockId) || null;
        } else {
          mesh.scale.set(1, 1, 1);
          const material = mesh.material as THREE.MeshPhongMaterial;
          material.emissiveIntensity = 0.2;
        }
      });

      if (hoveredBlock) {
        onBlockHover(hoveredBlock);
      }
    };

    const onMouseClick = (event: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycasterRef.current.setFromCamera(mouseRef.current, camera);
      const intersects = raycasterRef.current.intersectObjects(scene.children);

      for (const intersection of intersects) {
        const mesh = intersection.object as THREE.Mesh;
        const blockId = mesh.userData.blockId;
        if (blockId) {
          const block = blocks.find((b) => b.id === blockId);
          if (block) {
            onBlockClick(block);
          }
          break;
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

      // Rotate and float blocks
      blockMeshesRef.current.forEach((mesh, blockId) => {
        mesh.rotation.x += 0.001;
        mesh.rotation.y += 0.002;

        const isSelected = blockId === selectedBlockId;
        if (isSelected) {
          mesh.position.z += Math.sin(time * 3) * 0.02;
        }
      });

      // Rotate particles
      if (particlesRef.current) {
        particlesRef.current.rotation.x += 0.0001;
        particlesRef.current.rotation.y += 0.0002;
      }

      // Subtle camera movement
      camera.position.x = Math.sin(time * 0.3) * 5;
      camera.position.y = Math.cos(time * 0.25) * 5;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

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

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      renderer.dispose();
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, [blocks, gridShape, gridSize, brandColor, boughtBlocks, selectedBlockId, onBlockClick, onBlockHover]);

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
