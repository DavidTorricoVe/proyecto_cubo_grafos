// =========================================================
// GRAFICOS 3D CON THREE.JS
// =========================================================

const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0f172a); 

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(5, 5, 7);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);
const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
dirLight.position.set(10, 20, 10);
scene.add(dirLight);

// BLANCO(U):0, AMARILLO(D):1, AZUL(L):2, VERDE(R):3, ROJO(F):4, NARANJA(B):5
const colorHex = [0xffffff, 0xffd500, 0x0051ba, 0x009e60, 0xc41e3a, 0xff5800];

const cubies = [];
const offset = 0.51; 

for(let x of [-1, 1]) {
    for(let y of [-1, 1]) {
        for(let z of [-1, 1]) {
            // Un poco menos de 1 para que haya un espacio negro (bordes)
            const geometry = new THREE.BoxGeometry(0.96, 0.96, 0.96);
            
            // Configurar los materiales (el interior es negro)
            const materials = [
                new THREE.MeshLambertMaterial({color: x==1 ? colorHex[3] : 0x111111}), // R (Verde)
                new THREE.MeshLambertMaterial({color: x==-1 ? colorHex[2] : 0x111111}), // L (Azul)
                new THREE.MeshLambertMaterial({color: y==1 ? colorHex[0] : 0x111111}), // U (Blanco)
                new THREE.MeshLambertMaterial({color: y==-1 ? colorHex[1] : 0x111111}), // D (Amarillo)
                new THREE.MeshLambertMaterial({color: z==1 ? colorHex[4] : 0x111111}), // F (Rojo)
                new THREE.MeshLambertMaterial({color: z==-1 ? colorHex[5] : 0x111111}), // B (Naranja)
            ];
            const cubie = new THREE.Mesh(geometry, materials);
            cubie.position.set(x * offset, y * offset, z * offset);
            cubie.userData = {
                xSign: x, ySign: y, zSign: z,
                originalX: x * offset, originalY: y * offset, originalZ: z * offset
            };
            scene.add(cubie);
            cubies.push(cubie);
        }
    }
}

// Interacción con mouse para rotar la cámara alrededor del cubo
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };
let camAngleX = Math.PI / 4;
let camAngleY = Math.PI / 6;

document.addEventListener('mousedown', (e) => {
    if(e.target.tagName !== 'BUTTON' && e.target.tagName !== 'SELECT') {
        isDragging = true;
    }
});
document.addEventListener('mouseup', () => isDragging = false);
document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        let deltaX = e.movementX * 0.01;
        let deltaY = e.movementY * 0.01;
        
        camAngleX -= deltaX;
        camAngleY += deltaY;
        
        // Limitar la rotación vertical para no voltear la cámara
        camAngleY = Math.max(-Math.PI/2 + 0.1, Math.min(Math.PI/2 - 0.1, camAngleY));
        
        const radius = 8.6;
        camera.position.x = radius * Math.cos(camAngleY) * Math.sin(camAngleX);
        camera.position.z = radius * Math.cos(camAngleY) * Math.cos(camAngleX);
        camera.position.y = radius * Math.sin(camAngleY);
        camera.lookAt(0, 0, 0);
    }
});

// Animación de Giros lógicos
let isAnimating = false;
let animationQueue = [];

function animate() {
    requestAnimationFrame(animate);
    
    if (animationQueue.length > 0 && !isAnimating) {
        const move = animationQueue.shift();
        performRotationAnimation(move);
    }
    
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Helpers para identificar las piezas que giran según su posición visual (Mundo)
function getCubiesByAxisPos(axis, sign) {
    return cubies.filter(c => {
        let pos = new THREE.Vector3();
        c.getWorldPosition(pos);
        if(axis === 'x') return sign > 0 ? pos.x > 0.1 : pos.x < -0.1;
        if(axis === 'y') return sign > 0 ? pos.y > 0.1 : pos.y < -0.1;
        if(axis === 'z') return sign > 0 ? pos.z > 0.1 : pos.z < -0.1;
    });
}

function performRotationAnimation(moveStr) {
    isAnimating = true;
    const axisStr = moveStr[0];
    const isPrime = moveStr.includes("'");
    
    let targetCubies = [];
    let rotAxis = '';
    
    // Identificar qué eje se rota y qué cara
    if(axisStr === 'R') { rotAxis = 'x'; targetCubies = getCubiesByAxisPos('x', 1); }
    if(axisStr === 'L') { rotAxis = 'x'; targetCubies = getCubiesByAxisPos('x', -1); }
    if(axisStr === 'U') { rotAxis = 'y'; targetCubies = getCubiesByAxisPos('y', 1); }
    if(axisStr === 'D') { rotAxis = 'y'; targetCubies = getCubiesByAxisPos('y', -1); }
    if(axisStr === 'F') { rotAxis = 'z'; targetCubies = getCubiesByAxisPos('z', 1); }
    if(axisStr === 'B') { rotAxis = 'z'; targetCubies = getCubiesByAxisPos('z', -1); }

    // Sentido del giro según Right-Hand Rule
    let sign = 1;
    if(axisStr === 'R' || axisStr === 'U' || axisStr === 'F') sign = -1;
    
    let targetAngle = isPrime ? -sign * Math.PI/2 : sign * Math.PI/2;
    let currentAngle = 0;
    const step = targetAngle / 15; // 15 frames duration

    // Crear un grupo temporal para rotar todas juntas desde el centro
    const group = new THREE.Group();
    scene.add(group);
    targetCubies.forEach(c => group.add(c));

    function rotateFrame() {
        if (Math.abs(currentAngle) >= Math.abs(targetAngle)) {
            // Terminar giro exacto
            group.rotation[rotAxis] = targetAngle;
            // Devolver las piezas a la escena con su nueva rotación
            targetCubies.forEach(c => {
                scene.attach(c);
                // Redondear posiciones para evitar errores de precisión por floats
                c.position.x = Math.round(c.position.x * 100) / 100;
                c.position.y = Math.round(c.position.y * 100) / 100;
                c.position.z = Math.round(c.position.z * 100) / 100;
            });
            scene.remove(group);
            isAnimating = false;
            return;
        }
        
        group.rotation[rotAxis] = currentAngle;
        currentAngle += step;
        requestAnimationFrame(rotateFrame);
    }
    rotateFrame();
}

// Forzar colores del cubo basado en un estado (sin animar)
function setCubeColorsFromState(estadoCubo) {
    if(!estadoCubo) return;
    // Reset posiciones y rotaciones
    cubies.forEach(c => {
        c.rotation.set(0,0,0);
        c.position.x = c.userData.originalX;
        c.position.y = c.userData.originalY;
        c.position.z = c.userData.originalZ;
    });

    cubies.forEach(c => {
        let x = c.userData.xSign;
        let y = c.userData.ySign;
        let z = c.userData.zSign;
        let mats = c.material;
        
        if(x == 1) mats[0].color.setHex(colorHex[estadoCubo.caras[3].matriz[y==1?0:1][z==1?0:1]]);
        else mats[0].color.setHex(0x111111);
        
        if(x == -1) mats[1].color.setHex(colorHex[estadoCubo.caras[2].matriz[y==1?0:1][z==-1?0:1]]);
        else mats[1].color.setHex(0x111111);
        
        if(y == 1) mats[2].color.setHex(colorHex[estadoCubo.caras[0].matriz[z==-1?0:1][x==-1?0:1]]);
        else mats[2].color.setHex(0x111111);
        
        if(y == -1) mats[3].color.setHex(colorHex[estadoCubo.caras[1].matriz[z==1?0:1][x==-1?0:1]]);
        else mats[3].color.setHex(0x111111);
        
        if(z == 1) mats[4].color.setHex(colorHex[estadoCubo.caras[4].matriz[y==1?0:1][x==-1?0:1]]);
        else mats[4].color.setHex(0x111111);
        
        if(z == -1) mats[5].color.setHex(colorHex[estadoCubo.caras[5].matriz[y==1?0:1][x==1?0:1]]);
        else mats[5].color.setHex(0x111111);
    });
}

// =========================================================
// CONEXIÓN ENTRE LA LÓGICA POO Y LA INTERFAZ 3D
// =========================================================

let logicCube = new Cubo();

// Inicializar el grafo visual (puntos y líneas)
initVisualGraph();
// Añadir un nodo inicial para que el grafo no esté vacío al cargar la página
new Nodo(logicCube, null, new Movimiento("Inicio"), 0);

document.getElementById('btn-scramble').addEventListener('click', () => {
    document.getElementById('btn-solve').disabled = false;
    document.getElementById('steps-list').innerHTML = '';
    document.getElementById('btn-show-path').style.display = 'none';
    window.solvedPathIds = [];
    
    // Limpiar consola de nodos y el grafo visual
    document.getElementById('nodes-console').innerHTML = '';
    clearVisualGraph();
    
    let depth = parseInt(document.getElementById('scramble-depth').value) || 4;
    logNodeCreation(`>> Desordenando Cubo (Mezcla de ${depth} movimientos)`);
    updateUIStats(0, "Desordenando...");
    
    let lastNode = new Nodo(logicCube, null, new Movimiento("Inicio"), 0);
    
    // Mezcla según profundidad seleccionada
    const opcionesMov = ["R", "U", "F", "L", "D", "B", "R'", "U'", "F'", "L'", "D'", "B'"];
    for (let i = 0; i < depth; i++) {
        let m = opcionesMov[Math.floor(Math.random() * opcionesMov.length)];
        let mov = new Movimiento(m);
        let nuevoCubo = lastNode.estadoCubo.clonar();
        mov.ejecutar(nuevoCubo); // Actualiza POO
        lastNode = new Nodo(nuevoCubo, lastNode, mov, i+1); // Crea nodos y dibuja grafo
        
        animationQueue.push(m);  // Actualiza 3D visualmente
        logNodeCreation(`- Mezcla: Aplicado movimiento ${m}`);
    }
    logicCube = lastNode.estadoCubo;
    
    setTimeout(() => {
        updateUIStats(0, "Desordenado");
    }, 500);
});

// Lógica de REINICIAR TODO
document.getElementById('btn-reset').addEventListener('click', () => {
    // Resetear lógica
    logicCube = new Cubo();
    
    // Resetear visual 3D
    setCubeColorsFromState(logicCube);
    animationQueue = [];
    isAnimating = false;
    
    // Limpiar UI
    document.getElementById('stat-nodes').innerText = "0";
    document.getElementById('stat-status').innerText = "Ordenado";
    document.getElementById('steps-list').innerHTML = "";
    document.getElementById('nodes-console').innerHTML = "";
    document.getElementById('btn-show-path').style.display = 'none';
    document.getElementById('btn-animate-exploration').style.display = 'none';
    
    // Limpiar Grafo
    clearVisualGraph();
    new Nodo(logicCube, null, new Movimiento("Inicio"), 0);
    
    logNodeCreation(">> SISTEMA REINICIADO: Cubo resuelto y grafo limpio.");
});

document.getElementById('btn-solve').addEventListener('click', () => {
    iniciarResolucion(10000); // Límite estándar
});

document.getElementById('btn-solve-unlimited').addEventListener('click', () => {
    iniciarResolucion(500000); // Límite masivo: "Hasta encontrar"
});

function iniciarResolucion(maxNodes) {
    if(logicCube.estaResuelto()) return;
    
    document.getElementById('btn-solve').disabled = true;
    document.getElementById('btn-solve-unlimited').disabled = true;
    updateUIStats(0, "Calculando grafo...");
    document.getElementById('btn-show-path').style.display = 'none';
    document.getElementById('btn-animate-exploration').style.display = 'none';
    window.solvedPathIds = [];
    
    setTimeout(() => {
        clearVisualGraph();
        
        let algo = document.getElementById('algorithm-select').value;
        let solver = null;
        if(algo === 'BFS') solver = new SolverBFS();
        else if(algo === 'DFS') solver = new SolverDFS();
        else if(algo === 'BACKTRACKING') solver = new SolverBacktracking();
        else if(algo === 'HEURISTICO') solver = new SolverHeuristico();
        
        let cuboTemporal = logicCube.clonar();
        let camino = solver.resolver(cuboTemporal, maxNodes);
        
        document.getElementById('btn-solve').disabled = false;
        document.getElementById('btn-solve-unlimited').disabled = false;
        
        if(camino && camino.length > 0) {
            let ul = document.getElementById('steps-list');
            ul.innerHTML = '';
            camino.forEach((paso, idx) => {
                let li = document.createElement('li');
                li.innerText = (idx+1) + ". " + translateMoveName(paso);
                ul.appendChild(li);
            });
            
            let btnPath = document.getElementById('btn-show-path');
            btnPath.style.display = 'inline-block';
            btnPath.disabled = false;

            let btnExploration = document.getElementById('btn-animate-exploration');
            btnExploration.style.display = 'inline-block';
            btnExploration.disabled = false;
        }
    }, 100);
}

// UI Controls for Graph Visual
document.getElementById('btn-expand-graph').addEventListener('click', () => {
    const panel = document.getElementById('graph-panel-container');
    panel.classList.toggle('fullscreen');
    const btn = document.getElementById('btn-expand-graph');
    
    if (panel.classList.contains('fullscreen')) {
        btn.innerHTML = 'Reducir 🗗';
    } else {
        btn.innerHTML = 'Ampliar 🔍';
    }
    
    // Forzar re-dibujado del canvas después de que termine la animación CSS (0.3s)
    setTimeout(() => {
        if(window.network) {
            window.network.setSize('100%', '100%');
            window.network.redraw();
            window.network.fit({ animation: { duration: 500, easingFunction: 'easeInOutQuad' } }); 
        }
    }, 350);
});

document.getElementById('btn-show-path').addEventListener('click', () => {
    if(!window.solvedPathIds || window.solvedPathIds.length === 0) return;
    
    // Detener la animación de dibujo del árbol para priorizar la solución
    visualGraphQueue = [];
    isDrawingGraph = false;
    
    // Atenuar todos los nodos para resaltar el camino
    let allNodes = visualNodes.get();
    allNodes.forEach(n => {
        visualNodes.update({id: n.id, color: {background: '#1e293b', border: '#0f172a'}, size: 5});
    });
    
    // Resetear el cubo al estado desordenado inicial para poder ver cómo se arma desde el principio
    if(window.nodeCubeStates && window.solvedPathIds.length > 0) {
        let firstNodeId = window.solvedPathIds[0];
        if(firstNodeId !== null && window.nodeCubeStates[firstNodeId]) {
            setCubeColorsFromState(window.nodeCubeStates[firstNodeId]);
        }
    }
    
    // Animar la ruta encontrada nodo por nodo
    let index = 0;
    // La longitud total es la cantidad de movimientos + el estado inicial
    let totalNodes = window.solvedPathIds.length;
    
    function highlightNext() {
        if(index >= totalNodes) return;
        
        let id = window.solvedPathIds[index];
        if(id !== null && id !== undefined) {
            visualNodes.update({
                id: id, 
                color: {background: '#f59e0b', border: '#b45309'}, 
                size: 18,
                font: {size: 16, color: '#ffffff', bold: true}
            });
        }
        
        if(index > 0 && window.solvedPathMoves && window.solvedPathMoves[index - 1]) {
            // Animar el giro físico del cubo en 3D
            let moveName = window.solvedPathMoves[index - 1];
            animationQueue.push(moveName);
            
            // Actualizar el estado lógico real conforme se anima
            let mov = new Movimiento(moveName);
            mov.ejecutar(logicCube);
        }
        
        index++;
        setTimeout(highlightNext, 450); 
    }
    highlightNext();
});

// Animación de la exploración total (todos los nodos creados)
document.getElementById('btn-animate-exploration').addEventListener('click', () => {
    if(!window.allExploredIds || window.allExploredIds.length === 0) return;
    
    // Detener dibujo del árbol
    visualGraphQueue = [];
    isDrawingGraph = false;

    let index = 0;
    function nextExploration() {
        if(index >= window.allExploredIds.length) return;
        
        let id = window.allExploredIds[index];
        if(window.nodeCubeStates && window.nodeCubeStates[id]) {
            setCubeColorsFromState(window.nodeCubeStates[id]);
            
            // Resaltar momentáneamente en el grafo
            visualNodes.update({id: id, color: {background: '#6366f1', border: '#4338ca'}});
        }
        
        index++;
        // Velocidad rápida para poder ver miles de nodos sin esperar horas
        setTimeout(nextExploration, 50); 
    }
    nextExploration();
});

// Detectar clics en los nodos del grafo para inspeccionar el estado
setTimeout(() => {
    if(window.network) {
        window.network.on('click', function(params) {
            if(params.nodes.length > 0) {
                let nodeId = params.nodes[0];
                if(window.nodeCubeStates && window.nodeCubeStates[nodeId]) {
                    setCubeColorsFromState(window.nodeCubeStates[nodeId]);
                }
            }
        });
    }
}, 1000);
