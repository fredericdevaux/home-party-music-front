<template>
  <div id="scenehtml" ref="container" class="min-h-full"></div>
</template>
<script>
/* eslint-disable */
import * as THREE from 'three'
import { mapGetters, mapState } from 'vuex'
import { gsap } from "gsap/dist/gsap";
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { GeometryUtils } from 'three/examples/jsm/utils/GeometryUtils.js';
// import { OrbitControls } from "https://threejs.org/examples/jsm/controls/OrbitControls.js";
export default {
  name: 'Ball',
  data: () => ({
    uniforms: {},
    clock: null,
    soundData: {},
    renderer: null,
    scene: null,
    camera: null,
    ancienneValeur: null
  }),
  computed: {
    ...mapGetters({
      isPlaying: 'player/isPlaying',
      currentTrackId: 'player/currentTrackId'
    }),
    ...mapState({
      playerProgress: (state) => state.player.playerProgress,
      currentTrackState: (state) => state.player.currentTrackState
    })
  },
  watch: {
    currentTrackId(newVal) {
      if (newVal) {
        this.$axios.get(`https://api.spotify.com/v1/audio-analysis/${newVal}?access_token=${this.$cookies.get('access_token')}`).then(resp => {
          console.log(resp.data)
          let responseApi = resp.data
          for (let i = 0; i < responseApi["segments"].length; i++) {
            let duration = responseApi['segments'][i]['duration']
            let start = responseApi['segments'][i]['start'].toFixed(1)
            let loudnessMax = responseApi['segments'][i]['loudness_max']
            this.soundData[start] = { duration: duration, loudnessMax: loudnessMax }
          }
          console.log(JSON.stringify(this.soundData));
          console.log(this.currentTrackId + "current id");
          this.animate();
        })
      }
    }
  },
  methods: {
    animate() {
      /*
      this.uniforms.u_time.value += this.clock.getDelta()
      if (this.currentTrackState && this.isPlaying) {
        var startFormated = (this.playerProgress/1000).toFixed(1)
        console.log('test in animate' + startFormated);
        if (this.soundData[startFormated] && this.ancienneValeur != startFormated) {
          var myData = this.soundData[startFormated]
          console.log('test in animate dans le if' + "start format: "+ startFormated +"ancienne valeur" + this.ancienneValeur );
          this.ancienneValeur = startFormated;
          gsap.to(this.uniforms.u_radius, { value: myData.loudnessMax, duration: myData.duration/1000});
        }
      }
      requestAnimationFrame(this.animate)
      this.renderer.render(this.scene, this.camera)
      */
    }
  },
  mounted() {

  class JoyStick{
    constructor(options){
      const circle = document.createElement("div");
      circle.style.cssText = "position:absolute; bottom:35px; width:80px; height:80px; background:rgba(126, 126, 126, 0.5); border:#444 solid medium; border-radius:50%; left:50%; transform:translateX(-50%);";
      const thumb = document.createElement("div");
      thumb.style.cssText = "position: absolute; left: 20px; top: 20px; width: 40px; height: 40px; border-radius: 50%; background: #fff;";
      circle.appendChild(thumb);
      document.body.appendChild(circle);
      this.domElement = thumb;
      this.maxRadius = options.maxRadius || 40;
      this.maxRadiusSquared = this.maxRadius * this.maxRadius;
      this.onMove = options.onMove;
      this.game = options.game;
      this.origin = { left:this.domElement.offsetLeft, top:this.domElement.offsetTop };
      this.rotationDamping = options.rotationDamping || 0.06;
      this.moveDamping = options.moveDamping || 0.01;
      if (this.domElement!=undefined){
        const joystick = this;
        if ('ontouchstart' in window){
          this.domElement.addEventListener('touchstart', function(evt){ evt.preventDefault(); joystick.tap(evt); evt.stopPropagation();});
        }else{
          this.domElement.addEventListener('mousedown', function(evt){ evt.preventDefault(); joystick.tap(evt); evt.stopPropagation();});
        }
      }
    }
    
    getMousePosition(evt){
      let clientX = evt.targetTouches ? evt.targetTouches[0].pageX : evt.clientX;
      let clientY = evt.targetTouches ? evt.targetTouches[0].pageY : evt.clientY;
      return { x:clientX, y:clientY };
    }
    
    tap(evt){
      evt = evt || window.event;
      // get the mouse cursor position at startup:
      this.offset = this.getMousePosition(evt);
      const joystick = this;
      if ('ontouchstart' in window){
        document.ontouchmove = function(evt){ evt.preventDefault(); joystick.move(evt); };
        document.ontouchend =  function(evt){ evt.preventDefault(); joystick.up(evt); };
      }else{
        document.onmousemove = function(evt){ evt.preventDefault(); joystick.move(evt); };
        document.onmouseup = function(evt){ evt.preventDefault(); joystick.up(evt); };
      }
    }
    
    move(evt){
      evt = evt || window.event;
      const mouse = this.getMousePosition(evt);
      // calculate the new cursor position:
      let left = mouse.x - this.offset.x;
      let top = mouse.y - this.offset.y;
      //this.offset = mouse;
      
      const sqMag = left*left + top*top;
      if (sqMag>this.maxRadiusSquared){
        //Only use sqrt if essential
        const magnitude = Math.sqrt(sqMag);
        left /= magnitude;
        top /= magnitude;
        left *= this.maxRadius;
        top *= this.maxRadius;
      }
      // set the element's new position:
      this.domElement.style.top = `${top + this.domElement.clientHeight/2}px`;
      this.domElement.style.left = `${left + this.domElement.clientWidth/2}px`;
      
      const forward = -(top - this.origin.top + this.domElement.clientHeight/2)/this.maxRadius;
      const turn = (left - this.origin.left + this.domElement.clientWidth/2)/this.maxRadius;
      
      if (this.onMove!=undefined){
        if (this.game){
          this.onMove.call(this.game, forward, turn);
        }else{
          this.onMove(forward, turn);
        }
      }
    }
    
    up(evt){
      if ('ontouchstart' in window){
        document.ontouchmove = null;
        document.touchend = null;
      }else{
        document.onmousemove = null;
        document.onmouseup = null;
      }
      this.domElement.style.top = `${this.origin.top}px`;
      this.domElement.style.left = `${this.origin.left}px`;
      
      this.onMove.call(this.game, 0, 0);
    }
  }



class Game{
  constructor(){
    
    this.container;
    this.player = { };
    this.animations = {};
    this.stats;
    this.camera;
    this.scene;
    this.renderer;
    
    this.container = document.createElement( 'div' );
    this.container.style.width = document.getElementById("scenehtml").width;
    console.log("test width scene html " + document.getElementById("scenehtml").width)
    console.log("test width container html " + this.container.style.width)
    document.getElementById("scenehtml").appendChild( this.container );
        
    const game = this;
    this.anims = ['common_idle', 'common_walk', 'common_run', 'common_backpedal', 'common_shuffle_left', 'common_shuffle_right'];
        
    this.assetsPath = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/2666677/';
    
    this.clock = new THREE.Clock();
        
        this.init();

    window.onError = function(error){
      console.error(JSON.stringify(error));
    }
  }
  
  init() {

    this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 5000 );
    this.camera.position.set(112, 100, 600);
        
    let col = 0x452E80;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color( col );
    this.scene.fog = new THREE.Fog( col, 500, 10000 );

    let light = new THREE.HemisphereLight( 0xffffff, 0x444444 );
    light.position.set( 0, 200, 0 );
    this.scene.add( light );

        const shadowSize = 200;
    light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( 0, 200, 100 );
    light.castShadow = true;
    light.shadow.camera.top = shadowSize;
    light.shadow.camera.bottom = -shadowSize;
    light.shadow.camera.left = -shadowSize;
    light.shadow.camera.right = shadowSize;
    this.scene.add( light );
        this.sun = light;
    

    // ground
    var mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 10000, 10000 ), new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false } ) );
    mesh.rotation.x = - Math.PI / 2;
    mesh.receiveShadow = true;
    this.scene.add( mesh );

    var grid = new THREE.GridHelper( 5000, 40, 0x000000, 0x000000 );
    grid.material.opacity = 0.2;
    grid.material.transparent = true;
    this.scene.add( grid );

    // model
    const loader= new FBXLoader();
    const game = this;
    
    loader.load( `${this.assetsPath}zombie_common.fbx`, function ( object ) {

      object.mixer = new THREE.AnimationMixer( object );
      game.player.mixer = object.mixer;
      game.player.root = object.mixer.getRoot();
      
      object.name = "Zombie";
          
      object.traverse( function ( child ) {
        if ( child.isMesh ) {
          child.castShadow = true;
          child.receiveShadow = false;    
        }
      } );
            
            object.children[3].material.visible = false;
            
            game.player.object = new THREE.Object3D();
            game.player.object.position.set(0, 0, 0);
            
            game.scene.add(game.player.object);
            game.player.object.add(object);

            game.loadNextAnim(loader);
    } );
    
    this.renderer = new THREE.WebGLRenderer( { antialias: true } );
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.renderer.shadowMap.enabled = true;
    this.container.appendChild( this.renderer.domElement );
        
    window.addEventListener( 'resize', function(){ game.onWindowResize(); }, false );
    
    const hilbertPoints = GeometryUtils.hilbert3D( new THREE.Vector3( 0, 0, 0 ), 200.0, 1, 0, 1, 2, 3, 4, 5, 6, 7 );

				const geometry1 = new THREE.BufferGeometry();
				const geometry2 = new THREE.BufferGeometry();
				const geometry3 = new THREE.BufferGeometry();

				const subdivisions = 6;

				let vertices = [];
				let colors1 = [];
				let colors2 = [];
				let colors3 = [];

				const point = new THREE.Vector3();
				const color = new THREE.Color();
        
				const spline = new THREE.CatmullRomCurve3( hilbertPoints );

				for ( let i = 0; i < hilbertPoints.length * subdivisions; i ++ ) {

					const t = i / ( hilbertPoints.length * subdivisions );
					spline.getPoint( t, point );

					vertices.push( point.x, point.y, point.z );

					color.setHSL( 0.6, 1.0, Math.max( 0, - point.x / 200 ) + 0.5 );
					colors1.push( color.r, color.g, color.b );

					color.setHSL( 0.9, 1.0, Math.max( 0, - point.y / 200 ) + 0.5 );
					colors2.push( color.r, color.g, color.b );

					color.setHSL( i / ( hilbertPoints.length * subdivisions ), 1.0, 0.5 );
					colors3.push( color.r, color.g, color.b );

				}

				geometry1.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
				geometry2.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
				geometry3.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );

				geometry1.setAttribute( 'color', new THREE.Float32BufferAttribute( colors1, 3 ) );
				geometry2.setAttribute( 'color', new THREE.Float32BufferAttribute( colors2, 3 ) );
				geometry3.setAttribute( 'color', new THREE.Float32BufferAttribute( colors3, 3 ) );

				//

				const geometry4 = new THREE.BufferGeometry();
				const geometry5 = new THREE.BufferGeometry();
				const geometry6 = new THREE.BufferGeometry();

				vertices = [];
				colors1 = [];
				colors2 = [];
				colors3 = [];

				for ( let i = 0; i < hilbertPoints.length; i ++ ) {

					const point = hilbertPoints[ i ];

					vertices.push( point.x, point.y, point.z );

					color.setHSL( 0.6, 1.0, Math.max( 0, ( 200 - hilbertPoints[ i ].x ) / 400 ) * 0.5 + 0.5 );
					colors1.push( color.r, color.g, color.b );

					color.setHSL( 0.3, 1.0, Math.max( 0, ( 200 + hilbertPoints[ i ].x ) / 400 ) * 0.5 );
					colors2.push( color.r, color.g, color.b );

					color.setHSL( i / hilbertPoints.length, 1.0, 0.5 );
					colors3.push( color.r, color.g, color.b );

				}

				geometry4.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
				geometry5.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
				geometry6.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );

				geometry4.setAttribute( 'color', new THREE.Float32BufferAttribute( colors1, 3 ) );
				geometry5.setAttribute( 'color', new THREE.Float32BufferAttribute( colors2, 3 ) );
				geometry6.setAttribute( 'color', new THREE.Float32BufferAttribute( colors3, 3 ) );

				// Create lines and add to scene

				var	material = new THREE.LineBasicMaterial( { color: 0xffffff, vertexColors: true } );

				let line, p;
				const scale = 0.3, d = 225;

				const parameters = [
					[ material, scale * 1.5, [ - d, - d / 2, 0 ], geometry1 ],
					[ material, scale * 1.5, [ 0, - d / 2, 0 ], geometry2 ],
					[ material, scale * 1.5, [ d, - d / 2, 0 ], geometry3 ],

					[ material, scale * 1.5, [ - d, d / 2, 0 ], geometry4 ],
					[ material, scale * 1.5, [ 0, d / 2, 0 ], geometry5 ],
					[ material, scale * 1.5, [ d, d / 2, 0 ], geometry6 ],
				];

				for ( let i = 0; i < parameters.length; i ++ ) {

					p = parameters[ i ];
					line = new THREE.Line( p[ 3 ], p[ 0 ] );
					line.scale.x = line.scale.y = line.scale.z = p[ 1 ];
					line.position.x = p[ 2 ][ 0 ];
					line.position.y = p[ 2 ][ 1 ];
					line.position.z = p[ 2 ][ 2 ];
					this.scene.add( line );

				}

        
        const textureLoader = new THREE.TextureLoader();
        const textureSona = textureLoader.load("../models/sona-texture.png");
        loader.load("../models/dj-sona.fbx", (model)=> {
          //model.material.map = textureSona;
          model.position.set(2000, 0, 2000)
          this.scene.add(model)
          //loadAnimation(loader);
          }, undefined, (error)=> {
            console.error('Error',error)
          }) ;



  }
  
 loadNextAnim(loader){
    let anim = this.anims.pop();
    const game = this;
    loader.load( `${this.assetsPath}${anim}.fbx`, function( object ){
      game.animations[anim] = object.animations[0];
      if (game.anims.length>0){
        game.loadNextAnim(loader);
      }else{
        game.createCameras();
        game.joystick = new JoyStick({
          onMove: game.playerControl,
          game: game
        });
        
        delete game.anims;
        game.action = "common_idle";
        game.animate();
      }
    }); 
  }
    
    createColliders(){
        const geometry = new THREE.BoxGeometry(500, 400, 500);
        const material = new THREE.MeshBasicMaterial({color:0x222222, wireframe:true});
        
        this.colliders = [];
        
        for (let x=-5000; x<5000; x+=1000){
            for (let z=-5000; z<5000; z+=1000){
                if (x==0 && z==0) continue;
                const box = new THREE.Mesh(geometry, material);
                box.position.set(x, 250, z);
                this.scene.add(box);
                this.colliders.push(box);
            }
        }
        
        const geometry2 = new THREE.BoxGeometry(1000, 40, 1000);
        const stage = new THREE.Mesh(geometry2, material);
        stage.position.set(0, 20, 0);
        this.colliders.push(stage);
        this.scene.add(stage);
    }
    
 movePlayer(dt){
    const pos = this.player.object.position.clone();
    pos.y += 60;
    let dir = new THREE.Vector3();
    this.player.object.getWorldDirection(dir);
    if (this.player.move.forward<0) dir.negate();
    let raycaster = new THREE.Raycaster(pos, dir);
    let blocked = false;
    const colliders = this.colliders;
  
    if (colliders!==undefined){ 
      const intersect = raycaster.intersectObjects(colliders);
      if (intersect.length>0){
        if (intersect[0].distance<50) blocked = true;
      }
    }
    
    if (!blocked){
      if (this.player.move.forward>0){
        const speed = (this.player.action=='common_run') ? 400 : 150;
        this.player.object.translateZ(dt*speed);
      }else{
        this.player.object.translateZ(-dt*30);
      }
    }
    
    if (colliders!==undefined){
      //cast left
      dir.set(-1,0,0);
      dir.applyMatrix4(this.player.object.matrix);
      dir.normalize();
      raycaster = new THREE.Raycaster(pos, dir);

      let intersect = raycaster.intersectObjects(colliders);
      if (intersect.length>0){
        if (intersect[0].distance<50) this.player.object.translateX(100-intersect[0].distance);
      }
      
      //cast right
      dir.set(1,0,0);
      dir.applyMatrix4(this.player.object.matrix);
      dir.normalize();
      raycaster = new THREE.Raycaster(pos, dir);

      intersect = raycaster.intersectObjects(colliders);
      if (intersect.length>0){
        if (intersect[0].distance<50) this.player.object.translateX(intersect[0].distance-100);
      }
      
      //cast down
      dir.set(0,-1,0);
      pos.y += 200;
      raycaster = new THREE.Raycaster(pos, dir);
      const gravity = 30;

      intersect = raycaster.intersectObjects(colliders);
      if (intersect.length>0){
        const targetY = pos.y - intersect[0].distance;
        if (targetY > this.player.object.position.y){
          //Going up
          this.player.object.position.y = 0.8 * this.player.object.position.y + 0.2 * targetY;
          this.player.velocityY = 0;
        }else if (targetY < this.player.object.position.y){
          //Falling
          if (this.player.velocityY==undefined) this.player.velocityY = 0;
          this.player.velocityY += dt * gravity;
          this.player.object.position.y -= this.player.velocityY;
          if (this.player.object.position.y < targetY){
            this.player.velocityY = 0;
            this.player.object.position.y = targetY;
          }
        }
      }else if (this.player.object.position.y>0){
                if (this.player.velocityY==undefined) this.player.velocityY = 0;
                this.player.velocityY += dt * gravity;
                this.player.object.position.y -= this.player.velocityY;
                if (this.player.object.position.y < 0){
                    this.player.velocityY = 0;
                    this.player.object.position.y = 0;
                }
            }
    }
        
        this.player.object.rotateY(this.player.move.turn*dt);
  }
    
  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize( window.innerWidth, window.innerHeight );

  }

    set action(name){
    const action = this.player.mixer.clipAction( this.animations[name] );
        action.time = 0;
    this.player.mixer.stopAllAction();
    this.player.action = name;
    this.player.actionTime = Date.now();
        this.player.actionName = name;
    
    action.fadeIn(0.5); 
    action.play();
  }
    
    get action(){
        if (this.player===undefined || this.player.actionName===undefined) return "";
        return this.player.actionName;
    }
    
  playerControl(forward, turn){
    //TO DO: switch turn direction
    this.activeCamera = this.player.cameras.back;
    
    if (forward>0.3){
      if (this.player.action!='common_walk' && this.player.action!='common_run'){
        this.action = 'common_walk';
      } 
    }else if (forward<-0.3){
      if (this.player.action!='common_backpedal') this.action = 'common_backpedal';
    }else{
      forward = 0;
      if (turn>0.1){
        if (this.player.action != 'common_shuffle_left') this.action = 'common_shuffle_left';
      }else if (turn<-0.1){
        if (this.player.action != 'common_shuffle_right') this.action = 'common_shuffle_right';
      }else if (this.player.action!="common_idle"){
        this.action = 'common_idle';
      }
    }
    
    if (forward==0 && turn==0){
      delete this.player.move;
    }else{
      this.player.move = { forward, turn }; 
    }
  }
    
  set activeCamera(object){
    this.player.cameras.active = object;
  }
  
  loadEnvironment(loader){
    const game = this;
    
    loader.load( `${this.assetsPath}environment.fbx`, function ( object ) {
      game.scene.add(object);
      game.doors = [];
      game.fans = []; 
      
      object.receiveShadow = true;
      object.scale.set(0.8, 0.8, 0.8);
      object.name = "Environment";
      let door = { trigger:null, proxy:[], doors:[]};
      
      object.traverse( function ( child ) {
        if ( child.isMesh ) {
          if (child.name.includes('main')){
            child.castShadow = true;
            child.receiveShadow = true;
          }else if (child.name.includes('ment_proxy')){
            child.material.visible = false;
            game.colliders = [child];
          }else if (child.name.includes('door-proxy')){
            child.material.visible = false;
            door.proxy.push(child);
            checkDoor();
          }else if (child.name.includes('door')){
            door.doors.push(child);
            checkDoor()
          }else if (child.name.includes('fan')){
            game.fans.push(child);
          }
        }else{
          if (child.name.includes('Door-null')){
            door.trigger = child;
            checkDoor();
          }
        }
        
        function checkDoor(){
          if (door.trigger!==null && door.proxy.length==2 && door.doors.length==2){
            game.doors.push(Object.assign({}, door));
            door = { trigger:null, proxy:[], doors:[]};
          }
        }
      } );
      
      game.loadNextAnim(loader);
    }, null, this.onError );
  }
  
  createCameras(){
    const offset = new THREE.Vector3(0, 80, 0);
    const front = new THREE.Object3D();
    front.position.set(112, 100, 600);
    front.parent = this.player.object;
    const back = new THREE.Object3D();
    back.position.set(0, 200, -500);
    back.parent = this.player.object;
    const wide = new THREE.Object3D();
    wide.position.set(178, 139, 1665);
    wide.parent = this.player.object;
    const overhead = new THREE.Object3D();
    overhead.position.set(0, 400, 0);
    overhead.parent = this.player.object;
    const collect = new THREE.Object3D();
    collect.position.set(40, 82, 94);
    collect.parent = this.player.object;
    this.player.cameras = { front, back, wide, overhead, collect };
    this.activeCamera = this.player.cameras.front;  
  }

    
  animate() {
    const game = this;
    const dt = this.clock.getDelta();
    const time = Date.now() * 0.0005;
    for ( let i = 0; i < this.scene.children.length; i ++ ) {

        const object = this.scene.children[ i ];

        if ( object.isLine ) {

          object.rotation.y = time * ( i % 2 ? 1 : - 1 );

        }

		}

    requestAnimationFrame( function(){ game.animate(); } );
    
    if (this.player.mixer!==undefined) this.player.mixer.update(dt);
    
     if (this.player.action=='common_walk'){
      const elapsedTime = Date.now() - this.player.actionTime;
      if (elapsedTime>1000 && this.player.move.forward>0){
        this.action = 'common_run';
      }
    }
    
    if (this.player.move !== undefined) this.movePlayer(dt);
    
    if (this.player.cameras!=undefined && this.player.cameras.active!=undefined){
      this.camera.position.lerp(this.player.cameras.active.getWorldPosition(new THREE.Vector3()), 0.05);
      const pos = this.player.object.position.clone();
      pos.y += 150;
      this.camera.lookAt(pos);
    }
        
        if (this.sun != undefined){
            this.sun.position.x = this.player.object.position.x;
            this.sun.position.y = this.player.object.position.y + 200;
            this.sun.position.z = this.player.object.position.z + 100;
            this.sun.target = this.player.object;
        }
        
    this.renderer.render( this.scene, this.camera );
    this.renderer.domElement.id = 'CanvasScene';

  }
}

  const game = new Game();
  }
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
#CanvasScene{
  width: 100% !important;
}
</style>