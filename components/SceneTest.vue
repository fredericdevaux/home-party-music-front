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
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import * as THREE from 'three'
// import { OrbitControls } from "https://threejs.org/examples/jsm/controls/OrbitControls.js";
export default {
  name: 'SceneTest',
  mounted() {
    let camera, mesh, mesh2, scene, renderer;
    const keyboard = {};
    const player = { height:1.8, speed:4, turnSpeed:Math.PI*0.02 };

    function init(){
      renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('myCanvas'),
        antialias: true,
      })

      // eslint-disable-next-line prettier/prettier
      renderer.setClearColor(0xFFFFFF)
      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.setSize(window.innerWidth, window.innerHeight)

      // camera
      camera = new THREE.PerspectiveCamera(
        35,
        window.innerWidth / window.innerHeight,
        0.1,
        3000
      )

      // scene
      scene = new THREE.Scene()

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
      mesh = new THREE.Mesh(geometry, material)
      mesh.position.set(0, 5, -1000)
      scene.add(mesh)

      // cube2
      const geometry2 = new THREE.CubeGeometry(140, 140, 140)
      // eslint-disable-next-line prettier/prettier
      const material2 = new THREE.MeshPhongMaterial({ color: 0x629E1B })
      mesh2 = new THREE.Mesh(geometry2, material2)
      mesh2.position.set(60, -80, -700)
      scene.add(mesh2)

      const loader= new FBXLoader();
      loader.load("models/aj.fbx", (model)=> {
        console.log("MODEL",model)
        model.position.set(-10, -20, -700)
        // model.add(camera)
        scene.add(model)

        camera.lookAt(model.position)
        scene.add(camera)

      }, undefined, (error)=> {
        console.error('Error',error)
      }) ;

      animate();
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

    function animate(){
      requestAnimationFrame(animate);

      // mesh.rotation.x += 0.01;
      // mesh.rotation.y += 0.02;

      // Keyboard movement inputs
      if(keyboard[83]){ // S key
        camera.position.x -= Math.sin(camera.rotation.y) * player.speed;
        camera.position.z -= -Math.cos(camera.rotation.y) * player.speed;
      }
      if(keyboard[90]){ // Z key
        camera.position.x += Math.sin(camera.rotation.y) * player.speed;
        camera.position.z += -Math.cos(camera.rotation.y) * player.speed;
      }
      if(keyboard[81]){ // Q key
        camera.position.x += Math.sin(camera.rotation.y + Math.PI/2) * player.speed;
        camera.position.z += -Math.cos(camera.rotation.y + Math.PI/2) * player.speed;
      }
      if(keyboard[68]){ // D key
        camera.position.x += Math.sin(camera.rotation.y - Math.PI/2) * player.speed;
        camera.position.z += -Math.cos(camera.rotation.y - Math.PI/2) * player.speed;
      }

      // Keyboard turn inputs
      if(keyboard[37]){ // left arrow key
        camera.rotation.y -= player.turnSpeed;
      }
      if(keyboard[39]){ // right arrow key
        camera.rotation.y += player.turnSpeed;
      }

      mesh.rotation.x += beatMaker()
      mesh.rotation.y += volumeMaker()
      mesh2.rotation.x += beatMaker()
      mesh2.rotation.y += volumeMaker()

      renderer.render(scene, camera);
    }

    function keyDown(event){
      keyboard[event.keyCode] = true;
    }

    function keyUp(event){
      keyboard[event.keyCode] = false;
    }

    window.addEventListener('keydown', keyDown);
    window.addEventListener('keyup', keyUp);

    window.onload = init;

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
