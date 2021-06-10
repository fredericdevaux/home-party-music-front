<template>
  <div class="min-h-full" ref="container"></div>
</template>
<script>
/* eslint-disable */
import * as THREE from 'three'
import { mapGetters,mapState } from 'vuex'
import { gsap } from "gsap/dist/gsap";

// import { OrbitControls } from "https://threejs.org/examples/jsm/controls/OrbitControls.js";
export default {
  name: 'Ball',
  data: ()=> ({
    uniforms : {},
    clock : null,
    soundData: [],
    renderer: null,
  }),
  computed: {
    ...mapGetters({
      currentTrackProgress: 'player/currentTrackProgress',
      isPlaying: 'player/isPlaying',
      currentTrackId: 'player/currentTrackId',
    }),
    ...mapState({
      currentTrackState: (state)=> state.player.currentTrackState
    })
  },
  watch: {
    currentTrackId(newVal){
      if(newVal){
        this.$axios.get(`https://api.spotify.com/v1/audio-analysis/${newVal}?access_token=${this.$cookies.get('access_token')}`).then(resp => {
          console.log(resp.data);
          let responseApi = resp.data;
          for( let i = 0; i < responseApi["segments"].length; i++){
            console.log( responseApi["segments"][i]);
            let duration = responseApi["segments"][i]["duration"];
            let start = responseApi["segments"][i]["start"];
            let loudnessMax = responseApi["segments"][i]["loudness_max"];
            this.soundData[start] = {duration: duration, loudnessMax: loudnessMax};
            console.log(responseApi["segments"][i] + "test data");
          }
          console.log(JSON.stringify(this.soundData) + "test data");
          this.animate()
        })
      }
    }
  },
  methods: {
    animate(){
      this.uniforms.u_time.value += this.clock.getDelta();
      if(this.currentTrackState){
      //console.log(this.currentTrackProgress);
      //Récupérer le current time de la balise spotifySound
      if (this.soundData[this.currentTrackProgress / 1000]){
          var myData = this.soundData[this.currentTrackProgress]
          console.log("test in animate");
          // - Animation avec loudness
          //uniforms.u_radius = { value: en fonction de loudness max };
          //gsap.to(this.uniforms.u_radius, {duration: myData.duration, value: myData.loudnessMax});
         }


      }
      requestAnimationFrame( this.animate() );
      this.renderer.render( scene, camera );
    }
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

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize( this.$refs.container.getBoundingClientRect().width, this.$refs.container.getBoundingClientRect().height );
    this.$refs.container.appendChild( this.renderer.domElement );

    this.clock = new THREE.Clock();

    const geometry = new THREE.BoxGeometry( 30, 30, 30, 10, 10, 10 );
    this.uniforms.u_time = { value: 0.0 };
    this.uniforms.u_mouse = { value:{ x:0.0, y:0.0 }};
    this.uniforms.u_resolution = { value:{ x:0, y:0 }};
    this.uniforms.u_radius = { value: 20.0 };

    const material = new THREE.ShaderMaterial( {
      uniforms: this.uniforms,
      vertexShader: vshader,
      fragmentShader: fshader,
      wireframe: true
    } );


    const ball = new THREE.Mesh( geometry, material );
    scene.add( ball );

    //onWindowResize();
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
