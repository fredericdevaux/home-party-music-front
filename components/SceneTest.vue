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
var scene, camera, renderer, clock, mixer, actions, anims, position;
var positionX = -30;
var positionY = -20;
var positionZ = -700;

clock = new THREE.Clock();
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import * as THREE from 'three'
export default {
  name: 'SceneTest',
  mounted() {
    window.addEventListener("keydown", e => keyPressed(e.key));  
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
    camera.position.set(0, 0, 0)

    // scene
    scene = new THREE.Scene()



    // cube qui réagit à la musique



    const vshader = `
      uniform float u_time;
      uniform float u_radius;

      void main() {
        //vec3 pos = position; 

        float delta = ((sin(u_time)+1.0)/2.0);

        vec3 v = normalize(position) * u_radius;
        vec3 pos = mix(position, v, delta);

        gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );
      }
      `
      const fshader = `
        void main()
        {
          vec3 color = vec3(0.5);
          gl_FragColor = vec4(color, 1.0);
        }
      `
     
      const geometry = new THREE.BoxGeometry( 30, 30, 30, 10, 10, 10 );
      const uniforms = {};
      uniforms.u_time = { value: 0.0 };
      uniforms.u_mouse = { value:{ x:0.0, y:0.0 }};
      uniforms.u_resolution = { value:{ x:0, y:0 }};
      uniforms.u_radius = { value: 20.0 };
      
      const material = new THREE.ShaderMaterial( {
        uniforms: uniforms,
        vertexShader: vshader,
        fragmentShader: fshader,
        wireframe: true
      } );
     
      const material1 = new THREE.MeshBasicMaterial({
        color: 0xb7ff00,
        wireframe: true
      });

      const ball = new THREE.Mesh( geometry, material );
      scene.add( ball );
      console.log(JSON.stringify(ball) + "test lam");
      
  
    onWindowResize();
    if ('ontouchstart' in window){
      document.addEventListener('touchmove', move);
    }else{
      window.addEventListener( 'resize', onWindowResize, false );
      document.addEventListener('mousemove', move);
    }

    function move(evt){
      uniforms.u_mouse.value.x = (evt.touches) ? evt.touches[0].clientX : evt.clientX;
      uniforms.u_mouse.value.y = (evt.touches) ? evt.touches[0].clientY : evt.clientY;
    }

    animate();

    function onWindowResize( event ) {
      camera.aspect = window.innerWidth/window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize( window.innerWidth, window.innerHeight );
      uniforms.u_resolution.value.x = window.innerWidth;
      uniforms.u_resolution.value.y = window.innerHeight;
    }

    function animate() {
      requestAnimationFrame( animate );
      uniforms.u_time.value += clock.getDelta();
      renderer.render( scene, camera );
    }
    
    // light
    // eslint-disable-next-line unicorn/number-literal-case
    const light = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(light)
    // eslint-disable-next-line unicorn/number-literal-case
    const light1 = new THREE.PointLight(0xffffff, 0.5)
    scene.add(light1)

    // cube
    /*
    const geometry = new THREE.CubeGeometry(350, 350, 350)
    // eslint-disable-next-line unicorn/number-literal-case
    const material = new THREE.MeshPhongMaterial({ color: 0x335eea })
    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.set(0, 5, -1000)
    scene.add(mesh)
    */
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
      loader.load("models/girl-dance.fbx", (model)=> {
      console.log("MODEL",model)
      model.position.set(positionX, positionY, positionZ)
      mixer = new THREE.AnimationMixer(model)
      const action = mixer.clipAction(model.animations[0]);
      actions = [];
      action.play();
      scene.add(model)
      anims = ['kid-dance','kid-run','kid-jump','kid-back','girl-jump','girl-dance'];
      loadAnimation(loader);
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

function keyPressed(key){
  switch(key){
    case "d":
      playAction(0)
      break;
    case "z":
      playAction(1)
      break;
    case " ":
      playAction(2)
      break;
    case "s":
      playAction(3)
      break;
    case "o":
      playAction(4)
      break;
    case "p":
      playAction(5)
      break;
  }
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

function update(){
  renderer.render(scene, camera)
  requestAnimationFrame( update );
  const dt = clock.getDelta();
  mixer.update(dt);
}

function loadAnimation(loader){
  const anim = anims.shift();
  loader.load(`models/${anim}.fbx`, object => {
    const action = mixer.clipAction(object.animations[0]);
    actions.push(action);
    if (anims.length>0){
      loadAnimation(loader);
    }else{
      update();
    }
  })
}


function running() {
  setInterval(function(){positionZ = positionZ + 100; }, 200);
}
function playAction(animNumber){
  const action = actions[animNumber];
  mixer.stopAllAction();
  action.reset();
  action.fadeIn(0.5);
  action.play();
}

var responseApi;
axios.get('https://api.spotify.com/v1/audio-analysis/6rqhFgbbKwnb9MLmUQDhG6?access_token=BQDbeH4siisBr0EO3ZAM3-KRT0KzUUWJQ31livpOikAdOuCD_T2jSsLQ-V_IG5O_9LyxxmHqSN40ntcuTQJt0UGF21n2RERR66w28sbkfyrrb3_I7rD8cWTuEV9G9J6JVwRHNMZXRpTcecgfF1S-mmKogHMRPIiVrm-jMlb00PrX-2zJoe600-kB7hoRb12wFT_m2eCUhIpzhDiCQAWehcIzEjdNb8Za5jhxSX2_CkVjdSjaVTLmG8cMIvM8hypRAtojRITd4EurybnlL61SJcfmcVVoRJ1NrjKCwMrPrfut').then(resp => {
    console.log(resp.data);
    responseApi = resp.data;
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
