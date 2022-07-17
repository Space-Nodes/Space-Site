const particles = 4000;
const speed = 20;
const dim = 200; // Dimensions of particle volume

const canvas = document.getElementById('canvas');
const renderer = new THREE.WebGLRenderer({canvas, preserveDrawingBuffer: true, alpha: true});
renderer.autoClearColor = false; // For trails
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(90, canvas.width/canvas.height, 0.1, 1000);
var vertices = [];

for ( let i = 0; i < particles; i ++ ) {
	const x = dim*8 * (Math.random() - 0.5);
	const y = dim*2 * (Math.random() - 0.5);
	const z = -dim * Math.random();

	vertices.push( x, y, z );
}

const starGeo = new THREE.BufferGeometry();
starGeo.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ));
let starMat = new THREE.PointsMaterial({
	color: 0xffffff,
	size: .5,
	transparent: true, // For trails
	depthTest: false // For trails
});
const starPoints = new THREE.Points( starGeo, starMat );

// The whole fade plate is for trails
const fadeGeo = new THREE.PlaneBufferGeometry(1, 1);
const fadeMat = new THREE.MeshBasicMaterial({
	color: 0x000000,
	transparent: true,
	opacity: .4,
})
const fadePlate = new THREE.Mesh(fadeGeo, fadeMat);
fadePlate.material.renderOrder = -1; // Important!
fadePlate.position.z = -.1;

scene.add(fadePlate);
scene.add(starPoints);
requestAnimationFrame(draw);

function draw() {
	if (canvas.height !== canvas.clientHeight ||
	   canvas.width !== canvas.clientWidth) {
		camera.aspect = canvas.clientWidth/canvas.clientHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(canvas.clientWidth, canvas.clientHeight, false)
	}
	starGeo.attributes.position.needsUpdate = true;
	let p = starGeo.attributes.position.array;
	for (let i = 0; i < p.length; i+=3) {
		const x = Math.abs(p[i]);
		const y = Math.abs(p[i+1]);
		const z = p[i+2];
		if (z >= 0) {
			p[i] = dim*8 * (Math.random() - 0.5);
			p[i+1] = dim*2 * (Math.random() - 0.5);
			p[i+2] = -dim;
		} else {
			p[i+2] += -speed/p[i+2];
		}
	}

	renderer.render(scene, camera);
	requestAnimationFrame(draw);
}
