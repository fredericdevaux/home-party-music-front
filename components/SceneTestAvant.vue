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
/* eslint-disable */
const axios = require('axios');
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
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
    mesh3.position.set(-40, -10, -400)
    //  scene.add(mesh3)

    // Personnage
    const loader= new FBXLoader();
      loader.load("models/aj.fbx", (model)=> {
      console.log("MODEL",model)
      model.position.set(-10, -20, -700)
      const anim = new FBXLoader();
      anim.setPath('models/');
      anim.load('dance.fbx', (anim) => {
        const m = new THREE.AnimationMixer(fbx);
        this._mixers = new THREE.AnimationMixer(fbx);
        const idle = this._mixers.clipAction(anim.animations[0]);
        idle.play();
      });
      scene.add(model)
      }, undefined, (error)=> {
        console.error('Error',error)
      }) ;

    // render animation
    requestAnimationFrame(render)
    function render() {
      mesh.rotation.x += beatMaker()
      mesh.rotation.y += volumeMaker()
      mesh2.rotation.x += beatMaker()
      mesh2.rotation.y += volumeMaker()
      mesh3.rotation.x += beatMaker()
      mesh3.rotation.y += volumeMaker()
      renderer.render(scene, camera)
      requestAnimationFrame(render)
    }
  },
}
function beatMaker() {
  const x = Math.floor(Math.random() * Math.floor(2))
  if (x === 0) {
    return 0.003
  } else {
    return 0.01
  }
}
function volumeMaker() {
  const x = Math.floor(Math.random() * Math.floor(2))
  if (x === 0) {
    return 0.004
  } else {
    return 0.001
  }
}

var test;
axios.get('https://api.spotify.com/v1/audio-analysis/6rqhFgbbKwnb9MLmUQDhG6?access_token=BQAhQZUbNpjewXDXXmRXY1uftRtIeDHqPQApzHuR5v1EFd6NHdppPZnvHQScYsCg91kkjQecxCFQVtO5F6zjA6PSFcEjPhPqn-dz1ZkavdOW50Nt-zK2S_BGvV_0NjyNt-vYCZ7WMJkNk1N_84NqZOK9r2cUVlnC').then(resp => {
    console.log(resp.data);
    test = resp.data;
});
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
