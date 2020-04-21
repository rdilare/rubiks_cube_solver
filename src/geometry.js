
gem = new THREE.Geometry();

gem.vertices.push(
  new THREE.Vector3(-1, -1,  1),  // 0
  new THREE.Vector3( 1, -1,  1),  // 1
  new THREE.Vector3(-1,  1,  1),  // 2
  new THREE.Vector3( 1,  1,  1),  // 3

);

gem.faces.push(
  // front
  new THREE.Face3(0, 3, 2),
  new THREE.Face3(0, 1, 3),
);


plane = new THREE.Mesh(gem, new THREE.MeshBasicMaterial({color:"#ff0000"}));
plane.side=THREE.FrontSide;

scene.add(plane);
