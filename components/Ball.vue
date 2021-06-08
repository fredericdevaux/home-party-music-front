<template>
  <div class="min-h-full" ref="container"></div>
</template>
<script>
/* eslint-disable */
import * as THREE from 'three'
import { mapGetters } from 'vuex'
// import { OrbitControls } from "https://threejs.org/examples/jsm/controls/OrbitControls.js";
export default {
  name: 'Ball',
  computed: {
    ...mapGetters({
      currentTrackProgress: 'player/currentTrackProgress'
    })
  },
  mounted() {
    const vshader = `
    uniform float u_time;
    uniform float u_radius;

    void main() {
      //vec3 pos = position;

      float delta = ((sin(u_time)+5.0)/2.0);

      vec3 v = normalize(position) * u_radius;
      vec3 pos = mix(position, v, delta);

      gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );
    }
    `
    const fshader = `
    void main()
    {
      vec3 color = vec3(0.5);
      gl_FragColor = vec4(color, 5.0);
    }
    `

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        1,
        1000
      );
    camera.position.z = 100;

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( this.$refs.container.getBoundingClientRect().width, this.$refs.container.getBoundingClientRect().height );
    this.$refs.container.appendChild( renderer.domElement );

    const clock = new THREE.Clock();

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


    const ball = new THREE.Mesh( geometry, material );
    scene.add( ball );

    //const controls = new THREE.OrbitControls(camera, renderer.domElement);

    //onWindowResize();

    animate();

    function animate() {
      uniforms.u_time.value += clock.getDelta();
      /* Récupérer le current time de la balise spotifySound
      // if (soundData[spotifySound.currentTime]){
          var myData = soundData[spotifySound.currentTime]
          - Animation avec loudness
          uniforms.u_radius = { value: en fonction de loudness max };
         }

         gsap.to(uniforms.u_radius, {duration: myData.duration, value: myData.loudnessMax});

      //
      */

      requestAnimationFrame( animate );
      renderer.render( scene, camera );
    }

    var soundData = {};

    /*
    var responseApi;
    this.$axios.get('https://api.spotify.com/v1/audio-analysis/6rqhFgbbKwnb9MLmUQDhG6?access_token=BQALfj8oV8SCbZseL_k58mO46JrSBj0YCQUZKrjmQGNpHOmRKFbGec7ykl8PQPnz8bNQctQworQDcO8wL4AxeYUHZsrQTbR4hMX0C0tsEvHAxnqKDKEGxIe8UowXh-jpnLWg-d2ZHuiVpapQirVovY8M_eI1028w-t7IKy8zUeCss5AMRhYWLWIYnJjC2LY0tHQrWoO72qI-0IPCEJNoe71mF1docUxL_18y6dMW-AmtvqU6Lqm0PYgif-Te3vz1_MUVrEQjNXxCvcbrk7leAM0lvWGHUmRrmbSwwmCVUXGj').then(resp => {
        console.log(resp.data);
        responseApi = resp.data;
        //data = resp.data;
        for( var i = 0; i < responseApi["segments"].length; i++){
          console.log( responseApi["segments"][i]);
          //duration = duration + responseApi["segments"][i]["duration"];
          //console.log(responseApi["segments"][i]["duration"] + "test lam");
          var duration = responseApi["segments"][i]["duration"];
          var start = responseApi["segments"][i]["start"];
          var loudnessMax = responseApi["segments"][i]["loudness_max"];
          //miseEnAttente(duration, loudnessMax);
          soundData[start] = {duration: duration, loudnessMax: loudnessMax};
          console.log(responseApi["segments"][i] + "test data");
        }
        console.log(soundData + "test data");
    });*/
    function miseEnAttente(temps,loudnessMax)
    {
    setTimeout(fonctionAExecuter(temps,loudnessMax), temps);
    }
    function fonctionAExecuter(temps,loudnessMax)
    {
      uniforms.u_radius = { value: 50 };
    }

  },
}

/*
Algo :

Lancer le son :

Ecrire programme qui lance le son
- Lancer le son
- Récupérer la duration
- Evenement pour lancer le son synchro avec le front

Ecrire un programme pour récupérer les data
- Dans la fonction animate, récupérer la duration depuis le tableau
-

*/
</script>

<style lang="scss">
div {
  & > canvas {
    width: 100%;
    height: calc(100vh - 64px);
  }
}
</style>
