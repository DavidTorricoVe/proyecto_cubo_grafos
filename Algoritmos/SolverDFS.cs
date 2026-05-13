using System;
using System.Collections.Generic;

using CuboRubik2x2.Modelos;
using CuboRubik2x2.Estructuras;

namespace CuboRubik2x2.Algoritmos
{
    /* 
     * =========================================================================
     * CONCEPTO ESTRUCTURA DE DATOS: PILAS (Stack) / DFS
     * =========================================================================
     * 
     * - DFS (Depth-First Search) utiliza una Pila (Stack) para explorar 
     *   profundamente en una rama antes de retroceder (LIFO).
     * - Debido a que el cubo de rubik genera un grafo con bucles o infinitas 
     *   ramas sin fin, se aplica un "límite de profundidad" (Depth-Limited Search) 
     *   para evitar quedarse sin memoria.
     */
    public class SolverDFS : Solver
    {
        // Límite de profundidad para evitar caer en bucles infinitos
        private int limiteProfundidad = 6; 

        public override void Resolver(Cubo cuboInicial)
        {
            Console.WriteLine("\nIniciando busqueda DFS (Depth-First Search Limitado)...");
            
            Stack<Nodo> pila = new Stack<Nodo>();
            HashSet<string> visitados = new HashSet<string>();

            Nodo nodoInicial = new Nodo(cuboInicial, null, new Movimiento("Inicio"), 0);
            pila.Push(nodoInicial);
            
            int nodosExplorados = 0;

            while (pila.Count > 0)
            {
                Nodo actual = pila.Pop();
                nodosExplorados++;

                if (actual.EstadoCubo.EstaResuelto())
                {
                    Console.WriteLine($"!Solucion encontrada! Nodos explorados: {nodosExplorados}");
                    MostrarCamino(actual, cuboInicial);
                    return;
                }

                // Si no hemos llegado al límite, generamos vecinos
                if (actual.Nivel < limiteProfundidad)
                {
                    List<Nodo> vecinos = Grafo.GenerarVecinos(actual);
                    // Se invierte para que evalúe en un orden más natural (como BFS) al meter en la pila
                    vecinos.Reverse(); 
                    
                    foreach (Nodo vecino in vecinos)
                    {
                        string clave = vecino.EstadoCubo.ObtenerClave();
                        if (!visitados.Contains(clave))
                        {
                            visitados.Add(clave);
                            pila.Push(vecino);
                        }
                    }
                }
            }
            Console.WriteLine($"No se encontro solucion en el limite de profundidad de {limiteProfundidad} movimientos.");
        }
    }
}
