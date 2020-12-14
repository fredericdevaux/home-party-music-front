<template>
  <div>
    <canvas
      id="myCanvas"
      width="480"
      height="480"
      style="width: 480px; height: 480px"
    ></canvas>
  </div>
</template>

<script>
import * as THREE from 'three'
export default {
  name: 'SceneTest',
  mounted() {
    const renderer = new THREE.WebGLRenderer({
      canvas: document.getElementById('myCanvas'),
      antialias: true,
    })
    // eslint-disable-next-line prettier/prettier
renderer.setClearColor(0xFFFFFF)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)

    // camera
    const camera = new THREE.PerspectiveCamera(
      35,
      window.innerWidth / window.innerHeight,
      0.1,
      3000
    )
    camera.position.set(0, 0, 0)

    // scene
    const scene = new THREE.Scene()

    // light
    // eslint-disable-next-line unicorn/number-literal-case
    const light = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(light)
    // eslint-disable-next-line unicorn/number-literal-case
    const light1 = new THREE.PointLight(0xffffff, 0.5)
    scene.add(light1)

    // cube
    const geometry = new THREE.CubeGeometry(350, 350, 350)
    // eslint-disable-next-line unicorn/number-literal-case
    const material = new THREE.MeshPhongMaterial({ color: 0x335eea })
    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.set(0, 5, -1000)
    scene.add(mesh)

    // cube2
    const geometry2 = new THREE.CubeGeometry(140, 140, 140)
    // eslint-disable-next-line prettier/prettier
const material2 = new THREE.MeshPhongMaterial({ color: 0x629E1B })
    const mesh2 = new THREE.Mesh(geometry2, material2)
    mesh2.position.set(60, -80, -700)
    scene.add(mesh2)

    // cube2
    const geometry3 = new THREE.CubeGeometry(70, 70, 70)
    // eslint-disable-next-line prettier/prettier
const material3 = new THREE.MeshPhongMaterial({ color: 0xEB5A34 })
    const mesh3 = new THREE.Mesh(geometry3, material3)
    mesh3.position.set(-60, -20, -400)
    scene.add(mesh3)

    // render animation
    requestAnimationFrame(render)
    function render() {
      mesh.rotation.x += 0.003
      mesh.rotation.y += 0.003
      mesh2.rotation.x += 0.004
      mesh2.rotation.y += 0.004
      mesh3.rotation.x += 0.005
      mesh3.rotation.y += 0.005
      renderer.render(scene, camera)
      requestAnimationFrame(render)
    }
  },
}
</script>

<style>
html,
body {
  overflow: hidden;
  margin: 0;
  padding: 0;
  background: white;
}
canvas {
  width: 100%;
  height: 100%;
  background: red;
}
</style>
