using System;
using System.Collections.Generic;

using CuboRubik2x2.Modelos;
using CuboRubik2x2.Estructuras;

namespace CuboRubik2x2.Algoritmos
{
    /* 
     * =========================================================================
     * CONCEPTO ALGORÍTMICO: BÚSQUEDA HEURÍSTICA (A*)
     * =========================================================================
     * 
     * - Utiliza una Cola de Prioridad (PriorityQueue) para evaluar primero los 
     *   nodos que "parecen" estar más cerca de la solución.
     * - Heurística usada (H): Se cuenta cuántos cuadritos no están alineados con
     *   el color base de su respectiva cara. Mientras menos cuadritos desordenados,
     *   más prioridad tiene el nodo.
     * - Fórmula A*: F(n) = G(n) + H(n)
     *   donde G es el costo actual (profundidad) y H es la distancia estimada.
     */
    public class SolverHeuristico : Solver
    {
        public override void Resolver(Cubo cuboInicial)
        {
            Console.WriteLine("\nIniciando busqueda Heuristica (A* - PriorityQueue)...");
            
            // PriorityQueue evalúa primero los Nodos con un valor (prioridad) más bajo
            PriorityQueue<Nodo, int> colaPrioridad = new PriorityQueue<Nodo, int>();
            HashSet<string> visitados = new HashSet<string>();

            Nodo nodoInicial = new Nodo(cuboInicial, null, new Movimiento("Inicio"), 0);
            
            int heuristicaInicial = CalcularHeuristica(cuboInicial);
            colaPrioridad.Enqueue(nodoInicial, heuristicaInicial + 0); 
            
            visitados.Add(cuboInicial.ObtenerClave());

            int nodosExplorados = 0;

            while (colaPrioridad.Count > 0)
            {
                Nodo actual = colaPrioridad.Dequeue();
                nodosExplorados++;

                if (actual.EstadoCubo.EstaResuelto())
                {
                    Console.WriteLine($"!Solucion encontrada! Nodos explorados: {nodosExplorados}");
                    MostrarCamino(actual, cuboInicial);
                    return;
                }

                List<Nodo> vecinos = Grafo.GenerarVecinos(actual);
                foreach (Nodo vecino in vecinos)
                {
                    string clave = vecino.EstadoCubo.ObtenerClave();
                    if (!visitados.Contains(clave))
                    {
                        visitados.Add(clave);
                        
                        // Costo G(n)
                        int costoCamino = vecino.Nivel;
                        
                        // Heurística H(n)
                        int heuristica = CalcularHeuristica(vecino.EstadoCubo);
                        
                        // Costo Total F(n)
                        int costoTotal = costoCamino + heuristica;

                        colaPrioridad.Enqueue(vecino, costoTotal);
                    }
                }
            }
            Console.WriteLine("No se encontro solucion.");
        }

        // Cuenta cuántos colores no coinciden con el cuadrito [0,0] de cada cara
        private int CalcularHeuristica(Cubo cubo)
        {
            int piezasDesordenadas = 0;
            foreach (var cara in cubo.Caras)
            {
                ColorCubo colorBase = cara.Matriz[0, 0];
                if (cara.Matriz[0, 1] != colorBase) piezasDesordenadas++;
                if (cara.Matriz[1, 0] != colorBase) piezasDesordenadas++;
                if (cara.Matriz[1, 1] != colorBase) piezasDesordenadas++;
            }
            
            // Cada giro mueve 8 o 12 stickers. Dividimos por 4 para dar un costo admisible estimado.
            return piezasDesordenadas / 4;
        }
    }
}
