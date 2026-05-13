// =========================================================
// GRAFO VISUAL (Vis-Network)
// =========================================================
let visualNodes = new vis.DataSet([]);
let visualEdges = new vis.DataSet([]);
let network = null;
let visualNodeCounter = 0;

function initVisualGraph() {
    const container = document.getElementById('visual-graph');
    if(!container) return;
    
    const data = { nodes: visualNodes, edges: visualEdges };
    const options = {
        nodes: {
            shape: 'dot',
            size: 10,
            font: { color: '#ffffff', size: 12 },
            borderWidth: 2,
            color: { background: '#3b82f6', border: '#1e40af' }
        },
        edges: {
            color: 'rgba(148, 163, 184, 0.5)',
            width: 1,
            arrows: { to: { enabled: true, scaleFactor: 0.5 } }
        },
        physics: {
            enabled: true,
            barnesHut: { gravitationalConstant: -2000, centralGravity: 0.3, springLength: 95 }
        }
    };
    window.network = new vis.Network(container, data, options);
}

function clearVisualGraph() {
    visualNodes.clear();
    visualEdges.clear();
    visualNodeCounter = 0;
    visualGraphQueue = [];
    window.nodeCubeStates = {};
    window.allExploredIds = [];
}

let visualGraphQueue = [];
let isDrawingGraph = false;
window.nodeCubeStates = {};

function translateMoveName(move) {
    if(move === 'Inicio') return 'O';
    const dict = {
        "R": "Der", "R'": "Der Anti",
        "L": "Izq", "L'": "Izq Anti",
        "U": "Arr", "U'": "Arr Anti",
        "D": "Aba", "D'": "Aba Anti",
        "F": "Frente", "F'": "Fre Anti",
        "B": "Atrás", "B'": "Atr Anti"
    };
    return dict[move] || move;
}

function addNodeToVisualGraph(nivel, parentId, moveName, estadoCubo) {
    // Límite visual aumentado para mayor detalle (max 600 nodos)
    if(visualNodeCounter > 600) return null;
    
    let currentId = visualNodeCounter++;
    
    // Registrar para la animación de exploración total
    if(!window.allExploredIds) window.allExploredIds = [];
    window.allExploredIds.push(currentId);
    
    window.nodeCubeStates[currentId] = estadoCubo.clonar();
    
    visualGraphQueue.push({
        id: currentId,
        label: translateMoveName(moveName),
        parentId: parentId,
        isRoot: moveName === 'Inicio'
    });
    
    if(!isDrawingGraph) {
        animateVisualGraph();
    }
    
    return currentId;
}

function animateVisualGraph() {
    if(visualGraphQueue.length === 0) {
        isDrawingGraph = false;
        return;
    }
    
    isDrawingGraph = true;
    let nodeData = visualGraphQueue.shift();
    
    visualNodes.add({
        id: nodeData.id,
        label: nodeData.label,
        color: nodeData.isRoot ? {background: '#10b981', border: '#047857'} : undefined,
        font: { color: '#ffffff', size: 10 }
    });
    
    if(nodeData.parentId !== null && nodeData.parentId !== undefined) {
        visualEdges.add({ from: nodeData.parentId, to: nodeData.id });
    }
    
    // Velocidad de dibujo acelerada: 15ms por nodo cuando hay muchos
    let speed = visualGraphQueue.length > 100 ? 15 : 30;
    setTimeout(animateVisualGraph, speed);
}

// Helper para UI - Registro de Nodos en la Consola HTML
function logNodeCreation(message) {
    const consoleDiv = document.getElementById('nodes-console');
    if(!consoleDiv) return;
    
    // Evitar que el navegador colapse si hay demasiados nodos logueados
    if(consoleDiv.childElementCount > 400) {
        consoleDiv.removeChild(consoleDiv.firstChild);
    }
    
    const line = document.createElement('div');
    line.innerText = message;
    consoleDiv.appendChild(line);
    consoleDiv.scrollTop = consoleDiv.scrollHeight; // Auto-scroll
}

const ColorCubo = {
    BLANCO: 0, AMARILLO: 1, AZUL: 2, VERDE: 3, ROJO: 4, NARANJA: 5
};

class Cara {
    constructor(colorInicial) {
        this.matriz = [
            [colorInicial, colorInicial],
            [colorInicial, colorInicial]
        ];
    }
    
    clonar() {
        let copia = new Cara(ColorCubo.BLANCO);
        for(let i=0; i<2; i++) {
            for(let j=0; j<2; j++) {
                copia.matriz[i][j] = this.matriz[i][j];
            }
        }
        return copia;
    }
    
    rotarHorario() {
        let temp = this.matriz[0][0];
        this.matriz[0][0] = this.matriz[1][0];
        this.matriz[1][0] = this.matriz[1][1];
        this.matriz[1][1] = this.matriz[0][1];
        this.matriz[0][1] = temp;
    }
    
    estaResuelta() {
        let c = this.matriz[0][0];
        return this.matriz[0][1] === c && this.matriz[1][0] === c && this.matriz[1][1] === c;
    }
}

class Cubo {
    constructor() {
        this.caras = [
            new Cara(ColorCubo.BLANCO),   // 0 U
            new Cara(ColorCubo.AMARILLO), // 1 D
            new Cara(ColorCubo.AZUL),     // 2 L
            new Cara(ColorCubo.VERDE),    // 3 R
            new Cara(ColorCubo.ROJO),     // 4 F
            new Cara(ColorCubo.NARANJA)   // 5 B
        ];
    }
    
    clonar() {
        let copia = new Cubo();
        for(let i=0; i<6; i++) {
            copia.caras[i] = this.caras[i].clonar();
        }
        return copia;
    }
    
    estaResuelto() {
        for(let cara of this.caras) {
            if(!cara.estaResuelta()) return false;
        }
        return true;
    }
    
    obtenerClave() {
        let clave = "";
        for(let c=0; c<6; c++) {
            for(let i=0; i<2; i++) {
                for(let j=0; j<2; j++) {
                    clave += this.caras[c].matriz[i][j];
                }
            }
        }
        return clave;
    }

    // Rotaciones
    movimientoR() {
        this.caras[3].rotarHorario();
        let tmp1 = this.caras[0].matriz[0][1];
        let tmp2 = this.caras[0].matriz[1][1];

        this.caras[0].matriz[0][1] = this.caras[4].matriz[0][1];
        this.caras[0].matriz[1][1] = this.caras[4].matriz[1][1];

        this.caras[4].matriz[0][1] = this.caras[1].matriz[0][1];
        this.caras[4].matriz[1][1] = this.caras[1].matriz[1][1];

        this.caras[1].matriz[0][1] = this.caras[5].matriz[1][0];
        this.caras[1].matriz[1][1] = this.caras[5].matriz[0][0];

        this.caras[5].matriz[1][0] = tmp1;
        this.caras[5].matriz[0][0] = tmp2;
    }
    movimientoRPrima() { this.movimientoR(); this.movimientoR(); this.movimientoR(); }

    movimientoU() {
        this.caras[0].rotarHorario();
        let tmp1 = this.caras[4].matriz[0][0];
        let tmp2 = this.caras[4].matriz[0][1];

        this.caras[4].matriz[0][0] = this.caras[3].matriz[0][0];
        this.caras[4].matriz[0][1] = this.caras[3].matriz[0][1];

        this.caras[3].matriz[0][0] = this.caras[5].matriz[0][0];
        this.caras[3].matriz[0][1] = this.caras[5].matriz[0][1];

        this.caras[5].matriz[0][0] = this.caras[2].matriz[0][0];
        this.caras[5].matriz[0][1] = this.caras[2].matriz[0][1];

        this.caras[2].matriz[0][0] = tmp1;
        this.caras[2].matriz[0][1] = tmp2;
    }
    movimientoUPrima() { this.movimientoU(); this.movimientoU(); this.movimientoU(); }

    movimientoF() {
        this.caras[4].rotarHorario();
        let tmp1 = this.caras[0].matriz[1][0];
        let tmp2 = this.caras[0].matriz[1][1];

        this.caras[0].matriz[1][0] = this.caras[2].matriz[1][1];
        this.caras[0].matriz[1][1] = this.caras[2].matriz[0][1];

        this.caras[2].matriz[0][1] = this.caras[1].matriz[0][0];
        this.caras[2].matriz[1][1] = this.caras[1].matriz[0][1];

        this.caras[1].matriz[0][0] = this.caras[3].matriz[1][0];
        this.caras[1].matriz[0][1] = this.caras[3].matriz[0][0];

        this.caras[3].matriz[0][0] = tmp1;
        this.caras[3].matriz[1][0] = tmp2;
    }
    movimientoFPrima() { this.movimientoF(); this.movimientoF(); this.movimientoF(); }

    movimientoL() {
        this.caras[2].rotarHorario();
        let tmp1 = this.caras[0].matriz[0][0];
        let tmp2 = this.caras[0].matriz[1][0];

        this.caras[0].matriz[0][0] = this.caras[5].matriz[1][1];
        this.caras[0].matriz[1][0] = this.caras[5].matriz[0][1];

        this.caras[5].matriz[0][1] = this.caras[1].matriz[1][0];
        this.caras[5].matriz[1][1] = this.caras[1].matriz[0][0];

        this.caras[1].matriz[0][0] = this.caras[4].matriz[0][0];
        this.caras[1].matriz[1][0] = this.caras[4].matriz[1][0];

        this.caras[4].matriz[0][0] = tmp1;
        this.caras[4].matriz[1][0] = tmp2;
    }
    movimientoLPrima() { this.movimientoL(); this.movimientoL(); this.movimientoL(); }

    movimientoD() {
        this.caras[1].rotarHorario();
        let tmp1 = this.caras[4].matriz[1][0];
        let tmp2 = this.caras[4].matriz[1][1];

        this.caras[4].matriz[1][0] = this.caras[2].matriz[1][0];
        this.caras[4].matriz[1][1] = this.caras[2].matriz[1][1];

        this.caras[2].matriz[1][0] = this.caras[5].matriz[1][0];
        this.caras[2].matriz[1][1] = this.caras[5].matriz[1][1];

        this.caras[5].matriz[1][0] = this.caras[3].matriz[1][0];
        this.caras[5].matriz[1][1] = this.caras[3].matriz[1][1];

        this.caras[3].matriz[1][0] = tmp1;
        this.caras[3].matriz[1][1] = tmp2;
    }
    movimientoDPrima() { this.movimientoD(); this.movimientoD(); this.movimientoD(); }

    movimientoB() {
        this.caras[5].rotarHorario();
        let tmp1 = this.caras[0].matriz[0][0];
        let tmp2 = this.caras[0].matriz[0][1];

        this.caras[0].matriz[0][0] = this.caras[3].matriz[0][1];
        this.caras[0].matriz[0][1] = this.caras[3].matriz[1][1];

        this.caras[3].matriz[0][1] = this.caras[1].matriz[1][1];
        this.caras[3].matriz[1][1] = this.caras[1].matriz[1][0];

        this.caras[1].matriz[1][0] = this.caras[2].matriz[0][0];
        this.caras[1].matriz[1][1] = this.caras[2].matriz[1][0];

        this.caras[2].matriz[0][0] = tmp2;
        this.caras[2].matriz[1][0] = tmp1;
    }
    movimientoBPrima() { this.movimientoB(); this.movimientoB(); this.movimientoB(); }
}

class Movimiento {
    constructor(nombre) { this.nombre = nombre; }
    ejecutar(cubo) {
        if (this.nombre === "R") cubo.movimientoR();
        else if (this.nombre === "R'") cubo.movimientoRPrima();
        else if (this.nombre === "U") cubo.movimientoU();
        else if (this.nombre === "U'") cubo.movimientoUPrima();
        else if (this.nombre === "F") cubo.movimientoF();
        else if (this.nombre === "F'") cubo.movimientoFPrima();
        else if (this.nombre === "L") cubo.movimientoL();
        else if (this.nombre === "L'") cubo.movimientoLPrima();
        else if (this.nombre === "D") cubo.movimientoD();
        else if (this.nombre === "D'") cubo.movimientoDPrima();
        else if (this.nombre === "B") cubo.movimientoB();
        else if (this.nombre === "B'") cubo.movimientoBPrima();
    }
}

class Nodo {
    constructor(cubo, padre, movimiento, nivel) {
        this.estadoCubo = cubo;
        this.nodoPadre = padre;
        this.movimientoGenerador = movimiento;
        this.nivel = nivel;
        
        let nombreMov = movimiento ? movimiento.nombre : "Inicial";
        logNodeCreation(`+ Nodo creado: Nivel ${nivel} | Movimiento: ${nombreMov}`);
        
        let parentVisualId = padre ? padre.visualId : null;
        this.visualId = addNodeToVisualGraph(nivel, parentVisualId, nombreMov, cubo);
    }
}

class Grafo {
    static generarVecinos(actual) {
        let vecinos = [];
        let nombresMovimientos = ["R", "R'", "U", "U'", "F", "F'", "L", "L'", "D", "D'", "B", "B'"];
        
        for(let nombre of nombresMovimientos) {
            let mov = new Movimiento(nombre);
            let nuevoCubo = actual.estadoCubo.clonar();
            mov.ejecutar(nuevoCubo);
            vecinos.push(new Nodo(nuevoCubo, actual, mov, actual.nivel + 1));
        }
        return vecinos;
    }
}

// Helpers UI
function updateUIStats(nodes, status) {
    document.getElementById('stat-nodes').innerText = nodes;
    document.getElementById('stat-status').innerText = status;
}

// Estructura Auxiliar para Búsqueda Heurística (PriorityQueue)
class PriorityQueue {
    constructor() {
        this.elements = [];
    }
    enqueue(element, priority) {
        this.elements.push({element, priority});
        // Orden ascendente (menor prioridad primero)
        this.elements.sort((a, b) => a.priority - b.priority); 
    }
    dequeue() {
        return this.elements.shift().element;
    }
    get length() {
        return this.elements.length;
    }
}

// Algoritmos de Resolución (Traducción de C# a JS)

class Solver {
    obtenerCamino(nodoFinal) {
        let camino = [];
        let actual = nodoFinal;
        window.solvedPathIds = []; // Guardar para animar luego
        window.solvedPathMoves = []; // Guardar movimientos
        
        while(actual.nodoPadre != null) {
            camino.push(actual.movimientoGenerador.nombre);
            window.solvedPathMoves.push(actual.movimientoGenerador.nombre);
            // Guardar el ID visual incluso si es null para mantener sincronía
            window.solvedPathIds.push(actual.visualId !== undefined ? actual.visualId : null);
            actual = actual.nodoPadre;
        }
        window.solvedPathIds.push(actual.visualId !== undefined ? actual.visualId : null);
        
        window.solvedPathIds.reverse(); // Del inicio al fin
        window.solvedPathMoves.reverse();
        return camino.reverse(); 
    }
}

class SolverBFS extends Solver {
    resolver(cuboInicial, maxNodes = 10000) {
        logNodeCreation(`>> Iniciando BFS... (Límite: ${maxNodes})`);
        let cola = [];
        let visitados = new Set();
        let nodoInicial = new Nodo(cuboInicial, null, new Movimiento("Inicio"), 0);
        
        cola.push(nodoInicial);
        visitados.add(cuboInicial.obtenerClave());
        
        let nodosExplorados = 0;
        
        while(cola.length > 0) {
            let actual = cola.shift(); 
            nodosExplorados++;
            
            if(nodosExplorados % 500 === 0) updateUIStats(nodosExplorados, "Buscando...");

            if(nodosExplorados > maxNodes) {
                updateUIStats(nodosExplorados, "Límite Excedido");
                return null;
            }

            if(actual.estadoCubo.estaResuelto()) {
                updateUIStats(nodosExplorados, "Resuelto");
                logNodeCreation(`¡Solución encontrada en ${nodosExplorados} nodos explorados!`);
                return this.obtenerCamino(actual);
            }
            
            let vecinos = Grafo.generarVecinos(actual);
            for(let vecino of vecinos) {
                let clave = vecino.estadoCubo.obtenerClave();
                if(!visitados.has(clave)) {
                    visitados.add(clave);
                    cola.push(vecino);
                }
            }
        }
        return null;
    }
}

class SolverDFS extends Solver {
    resolver(cuboInicial, maxNodes = 10000) {
        logNodeCreation(`>> Iniciando DFS... (Límite: ${maxNodes})`);
        let pila = [];
        let visitados = new Set();
        let limite = 6;
        
        pila.push(new Nodo(cuboInicial, null, new Movimiento("Inicio"), 0));
        let nodosExplorados = 0;
        
        while(pila.length > 0) {
            let actual = pila.pop();
            nodosExplorados++;
            
            if(nodosExplorados > maxNodes) {
                updateUIStats(nodosExplorados, "Límite Excedido");
                return null;
            }

            if(actual.estadoCubo.estaResuelto()) {
                updateUIStats(nodosExplorados, "Resuelto");
                logNodeCreation(`¡Solución encontrada en ${nodosExplorados} nodos explorados!`);
                return this.obtenerCamino(actual);
            }
            
            if(actual.nivel < limite) {
                let vecinos = Grafo.generarVecinos(actual);
                vecinos.reverse();
                for(let vecino of vecinos) {
                    let clave = vecino.estadoCubo.obtenerClave();
                    if(!visitados.has(clave)) {
                        visitados.add(clave);
                        pila.push(vecino);
                    }
                }
            }
        }
        updateUIStats(nodosExplorados, "No Encontrado");
        return null;
    }
}

class SolverBacktracking extends Solver {
    resolver(cuboInicial, maxNodes = 20000) {
        logNodeCreation(`>> Iniciando Backtracking... (Límite: ${maxNodes})`);
        this.limiteProfundidad = 6;
        this.maxNodes = maxNodes;
        this.encontrado = false;
        this.nodosExplorados = 0;
        this.visitados = new Set();
        this.caminoResultado = null;
        
        let nodoInicial = new Nodo(cuboInicial, null, new Movimiento("Inicio"), 0);
        this.visitados.add(cuboInicial.obtenerClave());
        
        this.backtrack(nodoInicial);
        
        if(!this.encontrado) {
            updateUIStats(this.nodosExplorados, "No Encontrado");
        }
        return this.caminoResultado;
    }
    
    backtrack(actual) {
        if(this.encontrado) return;
        this.nodosExplorados++;
        
        if(this.nodosExplorados > this.maxNodes) { this.encontrado = true; return; } 
        
        if(actual.estadoCubo.estaResuelto()) {
            this.encontrado = true;
            this.caminoResultado = this.obtenerCamino(actual);
            updateUIStats(this.nodosExplorados, "Resuelto");
            logNodeCreation(`¡Solución encontrada en ${this.nodosExplorados} nodos explorados!`);
            return;
        }
        
        if(actual.nivel >= this.limiteProfundidad) return;
        
        let vecinos = Grafo.generarVecinos(actual);
        for(let vecino of vecinos) {
            let clave = vecino.estadoCubo.obtenerClave();
            if(!this.visitados.has(clave)) {
                this.visitados.add(clave);
                this.backtrack(vecino);
                this.visitados.delete(clave); // BACKTRACKING (Deshacer)
            }
        }
    }
}

class SolverHeuristico extends Solver {
    resolver(cuboInicial, maxNodes = 10000) {
        logNodeCreation(`>> Iniciando A*... (Límite: ${maxNodes})`);
        let colaPrioridad = new PriorityQueue();
        let visitados = new Set();
        
        let nodoInicial = new Nodo(cuboInicial, null, new Movimiento("Inicio"), 0);
        let heuristicaInicial = this.calcularHeuristica(cuboInicial);
        
        colaPrioridad.enqueue(nodoInicial, heuristicaInicial + 0);
        visitados.add(cuboInicial.obtenerClave());
        
        let nodosExplorados = 0;
        
        while(colaPrioridad.length > 0) {
            let actual = colaPrioridad.dequeue();
            nodosExplorados++;
            
            if(nodosExplorados % 500 === 0) updateUIStats(nodosExplorados, "Buscando...");
            if(nodosExplorados > maxNodes) return null;

            if(actual.estadoCubo.estaResuelto()) {
                updateUIStats(nodosExplorados, "Resuelto");
                logNodeCreation(`¡Solución encontrada en ${nodosExplorados} nodos explorados!`);
                return this.obtenerCamino(actual);
            }
            
            let vecinos = Grafo.generarVecinos(actual);
            for(let vecino of vecinos) {
                let clave = vecino.estadoCubo.obtenerClave();
                if(!visitados.has(clave)) {
                    visitados.add(clave);
                    let costoCamino = vecino.nivel;
                    let heuristica = this.calcularHeuristica(vecino.estadoCubo);
                    let costoTotal = costoCamino + heuristica;
                    colaPrioridad.enqueue(vecino, costoTotal);
                }
            }
        }
        return null;
    }
    
    calcularHeuristica(cubo) {
        let desordenadas = 0;
        for(let cara of cubo.caras) {
            let colorBase = cara.matriz[0][0];
            if(cara.matriz[0][1] !== colorBase) desordenadas++;
            if(cara.matriz[1][0] !== colorBase) desordenadas++;
            if(cara.matriz[1][1] !== colorBase) desordenadas++;
        }
        return Math.floor(desordenadas / 4);
    }
}
