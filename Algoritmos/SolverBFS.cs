using System;
using System.Collections.Generic;

using CuboRubik2x2.Modelos;
using CuboRubik2x2.Estructuras;

namespace CuboRubik2x2.Algoritmos
{
    /* 
     * =========================================================================
     * CONCEPTO POO APLICADO: HERENCIA y POLIMORFISMO
     * =========================================================================
     * 
     * - Herencia: Esta clase "hereda" (extiende) de la clase base abstracta 'Solver' 
     *   usando la sintaxis 'SolverBFS : Solver'. Hereda automáticamente el método 'MostrarCamino'.
     * 
     * - Polimorfismo: Sobrescribe el método abstracto base usando la palabra clave 'override', 
     *   proveyendo su propia implementación algorítmica específica (Búsqueda en Anchura / BFS).
     * 
     * =========================================================================
     * CONCEPTO ESTRUCTURA DE DATOS: COLAS (Queue) y TABLAS HASH (HashSet)
     * =========================================================================
     * - Se utiliza una Cola (Queue) porque el algoritmo BFS requiere explorar el árbol de estados
     *   nivel por nivel en orden de llegada (FIFO - First In First Out).
     * - Se utiliza un HashSet para buscar estados ya visitados en tiempo Constante O(1), evitando 
     *   así caer en bucles infinitos.
     */
    public class SolverBFS : Solver
    {
        public override void Resolver(Cubo cuboInicial)
        {
            Console.WriteLine("Iniciando busqueda BFS (Breadth-First Search)...");
            
            Queue<Nodo> cola = new Queue<Nodo>();
            HashSet<string> visitados = new HashSet<string>();

            Nodo nodoInicial = new Nodo(cuboInicial, null, new Movimiento("Inicio"), 0);
            cola.Enqueue(nodoInicial);
            visitados.Add(cuboInicial.ObtenerClave());

            int nodosExplorados = 0;

            while (cola.Count > 0)
            {
                Nodo actual = cola.Dequeue();
                nodosExplorados++;

                if (actual.EstadoCubo.EstaResuelto())
                {
                    Console.WriteLine($"!Solucion encontrada! Nodos explorados en el grafo: {nodosExplorados}");
                    MostrarCamino(actual, cuboInicial); // Usando el método heredado de la clase base
                    return;
                }

                List<Nodo> vecinos = Grafo.GenerarVecinos(actual);
                foreach (Nodo vecino in vecinos)
                {
                    string clave = vecino.EstadoCubo.ObtenerClave();
                    if (!visitados.Contains(clave))
                    {
                        visitados.Add(clave);
                        cola.Enqueue(vecino);
                    }
                }
            }
            Console.WriteLine("No se encontro solucion.");
        }
    }
}
