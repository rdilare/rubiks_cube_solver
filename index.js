
// var THREE = require('three')
// import * from 'src/three/controls/TrackballControls.js'
//import Cube from 'src/cube'


function  dist(a,b){

	return Math.sqrt((a.x-b.x)**2+(a.y-b.y)**2+(a.z-b.z)**2);
}


function getPlane(color){
	let gem = new THREE.Geometry();
	gem.vertices.push(
	  new THREE.Vector3(-4, -4,  0),  // 0
	  new THREE.Vector3( 4, -4,  0),  // 1
	  new THREE.Vector3(-4,  4,  0),  // 2
	  new THREE.Vector3( 4,  4,  0),  // 3
	);
	gem.faces.push(
	  // front
	  new THREE.Face3(0, 3, 2),
	  new THREE.Face3(0, 1, 3),
	);
	let plane = new THREE.Mesh(gem, new THREE.MeshBasicMaterial({color:color}));
	plane.side=THREE.BackSide;

return plane;
}



var is_rotation=false;
var action_queue=[];


//		  ........
//	  	 /| U   /|         y
// 		-------- |        |    			    6	      15		  24   
// 		|L|  B |R|        | 			  7 3	   16 12	   25 21
// 		| |F   | |        /'''''x 		8 4 0	17 13 9		26 22 18
// 		| -----|--       / 				5 1		14 10  		23 19  
// 		|/  D  |/        z 				2		11     		20     
// 		''''''''


var F = [8,17,26,5,14,23,2,11,20];
var B = [24,15,6,21,12,3,18,9,0];
var L = [6,7,8,3,4,5,0,1,2];
var R = [26,25,24,23,22,21,20,19,18];
var U = [6,15,24,7,16,25,8,17,26];
var D = [2,11,20,1,10,19,0,9,18];

var faces = [F,B,L,R,U,D]


var scene = new THREE.Scene();
  const near_s = 2;
  const far_s = 20;
  const color_s = '#000000';
  scene.fog = new THREE.Fog(color_s, near_s, far_s);
  //scene.background = new THREE.Color("#ff8844");

const fov = 75;
const aspect = window.innerWidth/window.innerHeight; 
const near = 0.1;
const far = 50;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);


var renderer = new THREE.WebGLRenderer();
var light1 = new THREE.AmbientLight( 0xefefff,.7 );
scene.add( light1 );

var light = new THREE.PointLight( 0xffffff, 1, 180 );
light.position.set( 5, 5, 5 );
scene.add( light );

var light2 = new THREE.PointLight( 0xffffff, 1, 10 );
light2.position.set( -5, 5, 5 );
scene.add( light2 );

var canvas = document.getElementById("canvas");

renderer.setSize( window.innerWidth, window.innerHeight );
// renderer.setSize( canvas.style.Width, canvas.style.Height );

canvas.appendChild( renderer.domElement );


// var loader = new THREE.CubeTextureLoader();
// loader.setPath( 'img/' );

// var textureCube = loader.load( [
// 	'21.jpg', '21.jpg',
// 	'11.jpg', '11.jpg',
// 	'31.jpg', '31.jpg'
// ] );


var geometry = new THREE.BoxGeometry();
var material = new THREE.MeshLambertMaterial( { color: 0xffffff} );
// var material = new THREE.MeshDepthMaterial( { fog: true, skinning: true} );

var material=[
	new THREE.MeshLambertMaterial({color: "#ffffff"}),
	new THREE.MeshLambertMaterial({color: "#ff0000"}),
	new THREE.MeshLambertMaterial({color: "#00ff00"}),
	new THREE.MeshLambertMaterial({color: "#0000ff"}),
	new THREE.MeshLambertMaterial({color: "#ffff00"}),
	new THREE.MeshLambertMaterial({color: "#ee7800"}),
];

var rubik=[];
var x = -1;
var y = -1;
var z = -1;

var cubeGeo = new THREE.Geometry();
cubeGeo.vertices.push( new THREE.Vector3( -25,  25, -25 ) );
cubeGeo.vertices.push( new THREE.Vector3(  25,  25, -25 ) );
cubeGeo.vertices.push( new THREE.Vector3( -25, -25, -25 ) );
cubeGeo.vertices.push( new THREE.Vector3(  25, -25, -25 ) );
cubeGeo.faces.push( new THREE.Face3( 0, 1, 2, new THREE.Vector3( 0,  0,  1 ), 0xffffff, 0) );


var plane = getPlane("#ff0000");
var plane1 = getPlane("#ffff00");
var plane2 = getPlane("#ff00ff");
var plane3 = getPlane("#00ff00");
//scene.add(plane);




var it = 0
for(let i =0;i<3;i++){
	for(let j =0;j<3;j++){
		for (let k =0;k<3;k++){

			// if(i==1 && j==1 && k==1){
			// 	continue;
			// }
			let cube = new Cube(geometry, material);

			cube.setPos({x:x+i, y:y+j, z:z+k});

			rubik.push(cube);
			cube.addto(scene);

			it+=1;
		}
	}
}



// var controls = new THREE.TrackballControls( camera, renderer.domElement );
var controls = new THREE.OrbitControls( camera, renderer.domElement );


camera.position.x = 5;
camera.position.y = 3;
camera.position.z = 6;
controls.update();



// var dt = 0.02;
// var t = dt;

var center = rubik[15].getPos();
var	re = dist(rubik[4].getPos(),rubik[1].getPos());
var	rc = dist(rubik[4].getPos(),rubik[0].getPos());


plane.position = center;
plane.position.x -= 5;
plane.rotation.y = Math.PI/2;

plane1.position = center;
plane1.position.x += 5;
plane1.rotation.y = Math.PI*1.5;

plane2.position = center;
plane2.position.z -= 5;
plane2.rotation.y = 0;

plane3.position = center;
plane3.position.z += 5;
plane3.rotation.y = Math.PI;

rubik[13].add(plane);
rubik[13].add(plane1);
rubik[13].add(plane2);
rubik[13].add(plane3);



function rotation_mode(status){
	is_rotation = status;
}



var animate = function () {

	if(action_queue.length!==0 && is_rotation===false){
		let ops = action_queue.shift();
		rotate(ops.faceID,ops.dir);
	}

	renderer.render( scene, camera );
	controls.update();
	requestAnimationFrame( animate );
};
animate();


function printArr(arr){
	let data="";
	for(let i=0;i<3;i++){
		for(let j=0;j<3;j++){
			data +=arr[i][j]+" ";
		}
		data+="\n";
	}

	console.log(data);
}


function update_rubik(faceIndices,dir){
	let arr = [];
	it=0;
	for(let i=0;i<3;i++){
		let row = []
		for(let j=0;j<3;j++){
			row.push(faceIndices[it]);
			it+=1;
		}
		arr.push(row);
	}

	// console.log(faceIndices);

	if(dir==="cw"){
		// printArr(arr)
		for(let i=0;i<2;i++){

			let temp = rubik[arr[2-i][0]];
			rubik[arr[2-i][0]] = rubik[arr[2][2-i]];
			rubik[arr[2][2-i]] = rubik[arr[i][2]];
			rubik[arr[i][2]] = rubik[arr[0][i]];
			rubik[arr[0][i]] = temp;

			temp = arr[2-i][0];
			arr[2-i][0] = arr[2][2-i];
			arr[2][2-i] = arr[i][2];
			arr[i][2] = arr[0][i];
			arr[0][i] = temp;
		}
	// printArr(arr)
	}
	else if(dir==="acw"){
		// printArr(arr)
		for(let i=0;i<2;i++){

			let temp = rubik[arr[2-i][0]];
			rubik[arr[2-i][0]] = rubik[arr[0][i]];
			rubik[arr[0][i]] = rubik[arr[i][2]];
			rubik[arr[i][2]] = rubik[arr[2][2-i]];
			rubik[arr[2][2-i]] = temp;

			temp = arr[2-i][0];
			arr[2-i][0] = arr[0][i];
			arr[0][i] = arr[i][2];
			arr[i][2] = arr[2][2-i];
			arr[2][2-i] = temp;
		}
	// printArr(arr)
	}

}



function get_face_indices_and_axis(faceID,dir){
	if (faceID==="f"){
		if(dir==='cw'){
			var axis = [0,0,-1];
		}else if(dir==="acw"){
			var axis = [0,0,1];
		}
		return [faces[0],axis];
	}else if(faceID==="b"){
		if(dir==='cw'){
			var axis = [0,0,1];
		}else if(dir==="acw"){
			var axis = [0,0,-1];
		}
		return [faces[1],axis];
	}else if(faceID==="l"){
		if(dir==='cw'){
			var axis = [1,0,0];
		}else if(dir==="acw"){
			var axis = [-1,0,0];
		}
		return [faces[2],axis];
	}else if(faceID==="r"){
		if(dir==='cw'){
			var axis = [-1,0,0];
		}else if(dir==="acw"){
			var axis = [1,0,0];
		}
		return [faces[3],axis];
	}else if(faceID==="u"){
		if(dir==='cw'){
			var axis = [0,-1,0];
		}else if(dir==="acw"){
			var axis = [0,1,0];
		}
		return [faces[4],axis];
	}else if(faceID==="d"){
		if(dir==='cw'){
			var axis = [0,1,0];
		}else if(dir==="acw"){
			var axis = [0,-1,0];
		}
		return [faces[5],axis];
	}
}



function rotate(faceID, dir){

	rotation_mode(true);

	let [faceindices,axis] = get_face_indices_and_axis(faceID,dir);
	let f = faceindices;

	let k = 0;
	let ang = Math.PI/2.0;
	let da = ang/20;
	let dt = 30;

	for(let i=0;i<ang;i+=da){
		setTimeout(()=>{
				for(let c of f){
					var a = new THREE.Euler( axis[0]*da, axis[1]*da, axis[2]*da, 'XYZ' )
					rubik[c].applyEuler(new THREE.Matrix4().makeRotationFromEuler(a));
				}
		},dt*k);
		k+=1;
	}
	update_rubik(faceindices,dir);

	setTimeout(()=>{
		rotation_mode(false);
	},dt*k);
}



function count_rubik(){
	let c = rubik[13];
	let pc = c.getPos();

	for(let i=0;i<27;i++){

		let p_cube = rubik[i].getPos();

		let dir = {x:p_cube.x-pc.x, y:p_cube.y-pc.y, z:p_cube.z-pc.z}

		let x=p_cube.x+dir.x;
		let y=p_cube.y+dir.y;
		let z=p_cube.z+dir.z;
		
		setTimeout(()=>{
			// rubik[i].setPos({x:x, y:y, z:z});
			for(let j=0;j<=1;j+=.1){
				setTimeout(()=>{
					rubik[i].setPos({x:p_cube.x+(j*dir.x) ,y:p_cube.y+(j*dir.y), z:p_cube.z+j*dir.z});
				},250*j);

				setTimeout(()=>{
					rubik[i].setPos({x:x-(j*dir.x) ,y:y-(j*dir.y), z:z-(j*dir.z)});
				},250+250*j);
			}
		},300*i);

		// setTimeout(()=>{
		// 	rubik[i].setPos({x:p_cube.x, y:p_cube.y, z:p_cube.z});
		// 	console.log(i)
		// },250+500*i);

	}
}

function load_action(faceID,dir){
	if(action_queue.length<20){
		action_queue.push({faceID:faceID, dir:dir});
	}
}