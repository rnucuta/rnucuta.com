'use client'

import Fallback from './Fallback'
import {
  Float,
  Lightformer,
  Text,
  Html,
  Environment,
  MeshTransmissionMaterial,
  useDetectGPU,
  PerformanceMonitor,
} from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { EffectComposer, N8AO, TiltShift2 } from '@react-three/postprocessing'
import { Inter } from 'next/font/google'
import { useEffect, useRef, useState } from 'react'
import { useWindowSize } from 'react-use'

const inter = Inter({ subsets: ['latin'] })

const Sphere = (props: any) => (
  <mesh position={props.position}>
    <sphereGeometry args={[props.size, 42, 10]} />
    <MeshTransmissionMaterial
      backside
      backsideThickness={5}
      distortionScale={0}
      temporalDistortion={0}
      thickness={10}
    />
  </mesh>
)

const Cube = (props: any) => (
  <mesh position={props.position}>
    <boxGeometry args={props.size} />
    <MeshTransmissionMaterial
      distortionScale={0}
      temporalDistortion={4}
      thickness={20}
    />
  </mesh>
)

const Octahedron = (props: any) => (
  <mesh position={props.position}>
    <octahedronGeometry args={props.size} />
    <MeshTransmissionMaterial
      distortionScale={0}
      temporalDistortion={2}
      thickness={10}
    />
  </mesh>
)

function Title(props: any) {
  const asciiText = 'RNUCUTA'

  return (
    <>
      <Text color='white' font={inter} {...props}>
        {asciiText}
        <Html
          style={{
            color: 'transparent',
            fontSize: (props.fontSize * 2.4).toString().concat('em'),
          }}
          transform
        >
          {asciiText}
        </Html>
      </Text>
    </>
  )
}

function Content() {
  const { camera } = useThree()
  const viewport = useWindowSize()
  const scrollY = useRef(
    window.pageYOffset || document.documentElement.scrollTop
  )
  const scrollEndTimeoutRef = useRef<number | null>(null)
  const targetScrollY = useRef(scrollY.current)
  const isMobile = viewport.width / 30 < 20
  const sizeMultiplier = Math.max(Math.min(viewport.height / 37, 6), 3)
  const fontSize = isMobile
    ? Math.max(Math.min(viewport.width / 150, 6))
    : Math.min(viewport.width / 150, 6.9)

  const [scrolling, setScrolling] = useState(false)

  useFrame(() => {
    const lerpFactor = 0.2 // adjust this value for speed; closer to 1 is faster
    const diff = (targetScrollY.current - scrollY.current) * lerpFactor

    camera.position.y += diff * (isMobile ? 0.02 : 0.05)
    camera.position.z += diff * (isMobile ? 0.02 : 0.05)

    // Update the current scroll position
    scrollY.current += diff

    camera.updateProjectionMatrix()
  })

  const handleScroll = () => {
    setScrolling(true)
    targetScrollY.current = window.scrollY

    // Clear any existing timeouts to handle rapid firing of the scroll event
    if (scrollEndTimeoutRef.current !== null) {
      clearTimeout(scrollEndTimeoutRef.current)
    }

    // Assuming the user stops scrolling after 150ms. Adjust this value as needed.
    scrollEndTimeoutRef.current = window.setTimeout(() => {
      setScrolling(false)
    }, 10)
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      // Also clear any timeout when the component unmounts
      if (scrollEndTimeoutRef.current !== null) {
        clearTimeout(scrollEndTimeoutRef.current)
      }
    }
  }, [])

  return (
    <>
      <Title
        fontSize={fontSize * (isMobile ? 1.3 : 1)}
        position={[0, 8, -10 + (isMobile ? 2 : 0)]}
      />
      <Float enabled={isMobile ? !scrolling : true}>
        <Sphere
          position={[
            0,
            8 + (isMobile ? 1.2 : 0),
            0 - sizeMultiplier * 1.2 + (isMobile ? 2 : 0),
          ]}
          size={(fontSize / 1.1) * (isMobile ? 1.2 : 1)}
        />
        <Cube
          position={[
            7 - sizeMultiplier / 3 + (isMobile ? -1.3 : 4),
            isMobile ? 8 : 8,
            0,
          ]}
          size={[
            1.2 * fontSize,
            1.2 * fontSize,
            10 / fontSize / (isMobile ? 3 : 1),
          ]}
        />
        <Octahedron
          position={[-7 + sizeMultiplier / 4 + (isMobile ? 2 : -1), 8, 0]}
          size={[
            (fontSize / 1.5) * (isMobile ? 1.3 : 1) * (isMobile ? 1.2 : 1),
            0,
          ]}
        />
      </Float>
      {/* <Shadow
        opacity={0.45}
        position={[0, -8.5 - sizeMultiplier, 0]}
        scale={70}
    /> */}
    </>
  )
}

function Striplight(props: any) {
  return (
    <mesh {...props}>
      <boxGeometry />
      <meshBasicMaterial color='white' />
    </mesh>
  )
}

export default function Juice({ onLoaded }: { onLoaded: () => void }) {
  const GPUTier = useDetectGPU()
  const [degraded, degrade] = useState(false)
  useEffect(() => {
    // Assume that once the component has mounted, it's considered "loaded"
    onLoaded()
  }, [onLoaded])
  if (GPUTier.isMobile && GPUTier.tier === 0) return <Fallback />

  return (
    <>
      <Canvas
        camera={{ fov: 80, position: [0, 0, 20] }}
        eventPrefix='client'
        style={{
          height: '100%',
          left: 0,
          position: 'absolute',
          top: 0,
          width: '100%',
          zIndex: 0,
        }}
      >
        <color args={['#1f1f1f']} attach='background' />
        <Content />
        <PerformanceMonitor onDecline={() => degrade(true)} />
        <Environment
          frames={degraded ? 1 : Number.POSITIVE_INFINITY}
          resolution={64}
        >
          <Lightformer
            intensity={2}
            position={[-50, 2, 0]}
            rotation-y={Math.PI / 2}
            scale={[100, 2, 1]}
          />
        </Environment>
        <EffectComposer disableNormalPass enabled={!degraded}>
          <N8AO aoRadius={3} intensity={1} />
          <TiltShift2 blur={0.05} />
        </EffectComposer>
      </Canvas>
    </>
  )
}
