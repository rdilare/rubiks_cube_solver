
class Cube{
	constructor(pos,material){
		let geometry = new THREE.BoxGeometry();
		this.mesh = new THREE.Mesh(geometry, material);

		this.wireframe = new THREE.LineSegments( new THREE.EdgesGeometry( geometry ),
												 new THREE.LineBasicMaterial( { color: 0x000000,
												 								linewidth: 2 } ) );
		this.setPos(pos);

	};

	getPos(){
		var pos = {x:0, y:0, z:0};
		pos.x = this.mesh.position.x;
		pos.y = this.mesh.position.y;
		pos.z = this.mesh.position.z;
		return pos;
	};

	setPos(pos){
		this.mesh.position.x = pos.x;
		this.mesh.position.y = pos.y;
		this.mesh.position.z = pos.z;

		this.wireframe.position.x = pos.x;
		this.wireframe.position.y = pos.y;
		this.wireframe.position.z = pos.z;
	};

	getRot(){
		var rot = {x:0, y:0, z:0};
		rot.x = this.mesh.rotation.x;
		rot.y = this.mesh.rotation.y;
		rot.z = this.mesh.rotation.z;
		return rot;
	};

	setRot(rot){
		this.mesh.rotation.x = rot.x;
		this.mesh.rotation.y = rot.y;
		this.mesh.rotation.z = rot.z;

		this.wireframe.rotation.x = rot.x;
		this.wireframe.rotation.y = rot.y;
		this.wireframe.rotation.z = rot.z;
	};

	add(child){
		this.mesh.add(child);
		child.position.x -= this.mesh.position.x;
		child.position.y -= this.mesh.position.y;
		child.position.z -= this.mesh.position.z;


		child.rotation.x -= this.mesh.rotation.x;
		child.rotation.y -= this.mesh.rotation.y;
		child.rotation.z -= this.mesh.rotation.z;

	};

	remove(child){
		this.mesh.remove(child);
		child.position.x += this.mesh.position.x;
		child.position.y += this.mesh.position.y;
		child.position.z += this.mesh.position.z;


		child.rotation.x += this.mesh.rotation.x;
		child.rotation.y += this.mesh.rotation.y;
		child.rotation.z += this.mesh.rotation.z;

	};

	addto(parent){
		parent.add(this.wireframe);
		parent.add(this.mesh);
	};

	removefrom(parent){
		parent.remove(this.mesh);
		parent.remove(this.wireframe);
	};

	applyEuler(a){
		this.mesh.applyMatrix4(a);
		this.wireframe.applyMatrix4(a);
	};
}
