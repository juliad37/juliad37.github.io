let camera, scene, renderer, mesh, delta, controls, data;
let clock = new THREE.Clock(false);
let targetRotation = 0;
let targetRotationOnMouseDown = 0;
let mouseX = 0;
let mouseXOnMouseDown = 0;
let windowHalfX = window.innerWidth / 2;


function init(data) {
     camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 1, 4000);
     camera.position.z = 2000;
     scene = new THREE.Scene();

    /* add some lights*/
    let light = new THREE.PointLight(0xffffff, 0, 1);
     light.position.set(0, 200, 800);
     scene.add(light);

     let grid_size = 150;
     let colors = [0xe6ffe6, 0xccffcc, 0x99ffcc, 0x66ffcc, 0x00ffcc, 0x009999, 0x006666];

     let colorScale = d3.scaleQuantile()
         .domain([0, 66])
         .range(colors);

    let group = new THREE.Object3D(); //empty


    let zs = [];

    for(let i = 0; i < data.length; i++){
        if(data[i].hour === 1) {
            zs.push([data[i].value]);
        }else{
             zs[zs.length-1].push(data[i].value);
        }
    }

     for (let i = 0; i < zs.length; i++) {//move Y
         for (let j = 0; j < zs[i].length; j++) {//move X
            let geometry = new THREE.BoxBufferGeometry(grid_size, grid_size, zs[i][j]);

             let mesh_params = {
                 color: colorScale(zs[i][j]),
                 emissive: colorScale(zs[i][j]),
                 side: THREE.DoubleSide,
                 flatShading: true
             };

            let mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial(mesh_params));
            mesh.position.set(i * grid_size, j * grid_size, zs[i][j] / 2);
            group.add(mesh);
       }
    }


     scene.add(group);

     renderer = new THREE.WebGLRenderer({antialias: true});
     renderer.setPixelRatio(window.devicePixelRatio);
     renderer.setSize(window.innerWidth, window.innerHeight);
     document.body.appendChild(renderer.domElement);

     window.addEventListener('resize', onWindowResize, false);

     controls = new THREE.TrackballControls(camera);
     controls.rotateSpeed = 4;
 }

 function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
     camera.updateProjectionMatrix();
     renderer.setSize(window.innerWidth, window.innerHeight);
 }

 function animate() {
    requestAnimationFrame(animate);
     delta = clock.getDelta();
     targetRotation = 0;
     //mesh.rotation.x += 3*delta;
   // mesh.rotation.y += 1*delta;
    renderer.render(scene, camera);
     controls.update();
 }

d3.tsv("data.tsv").then(
    function (data){
        data.forEach(function(d) {
            d.day = +d.day;
            d.hour = +d.hour;
            d.value = +d.value;
        });
        init(data);
        clock.start();
        animate();
});