<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>3D World with Three.js</title>
  <style> body { margin: 0; overflow: hidden; } </style>
</head>
<body>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  <script src="path/to/perlin.js"></script> <!-- Include Perlin Noise library if needed -->
  <script>
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 10, 7.5).normalize();
    scene.add(light);

    const playerGeometry = new THREE.BoxGeometry(1, 1, 1);
    const playerMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const player = new THREE.Mesh(playerGeometry, playerMaterial);
    scene.add(player);

    let playerSpeed = 0.1;
    const keys = {};
    window.addEventListener('keydown', (e) => { keys[e.key] = true; });
    window.addEventListener('keyup', (e) => { keys[e.key] = false; });

    function movePlayer() {
      if (keys['w']) player.position.z -= playerSpeed;
      if (keys['s']) player.position.z += playerSpeed;
      if (keys['a']) player.position.x -= playerSpeed;
      if (keys['d']) player.position.x += playerSpeed;
    }

    function createTerrain(width, depth, scale) {
      const geometry = new THREE.PlaneGeometry(width, depth, width - 1, depth - 1);
      const material = new THREE.MeshLambertMaterial({ color: 0x228B22, wireframe: false });

      geometry.vertices.forEach((vertex) => {
        vertex.z = Math.abs(perlin.noise(vertex.x / scale, vertex.y / scale, 0) * 10);
      });
      geometry.computeVertexNormals();

      const terrain = new THREE.Mesh(geometry, material);
      terrain.rotation.x = -Math.PI / 2;
      scene.add(terrain);
      return terrain;
    }

    createTerrain(50, 50, 5);

    camera.position.set(0, 5, 10);

    function updateCamera() {
      camera.position.x = player.position.x;
      camera.position.z = player.position.z + 10;
      camera.lookAt(player.position);
    }

    function animate() {
      requestAnimationFrame(animate);
      movePlayer();
      updateCamera();
      renderer.render(scene, camera);
    }
    animate();
  </script>
</body>
</html>
