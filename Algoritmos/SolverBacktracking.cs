using System;
using System.Collections.Generic;

using CuboRubik2x2.Modelos;
using CuboRubik2x2.Estructuras;

namespace CuboRubik2x2.Algoritmos
{
    /* 
     * =========================================================================
     * CONCEPTO ALGORÍTMICO: BACKTRACKING (Recursividad)
     * =========================================================================
     * 
     * - Backtracking explora las opciones de forma recursiva. Si llega a un 
     *   "callejón sin salida" (por ejemplo, alcanzó el límite de profundidad 
     *   sin resolver el cubo), retrocede ("backtrack") deshaciendo el estado 
     *   y probando otra rama (vecino).
     * - No requiere inicializar estructuras grandes (como Cola o Pila explícita) 
     *   ya que utiliza la "Pila de Llamadas" (Call Stack) natural del procesador.
     */
    public class SolverBacktracking : Solver
    {
        private int limiteProfundidad = 6;
        private bool encontrado = false;
        private int nodosExplorados = 0;

        public override void Resolver(Cubo cuboInicial)
        {
            Console.WriteLine("\nIniciando busqueda por Backtracking...");
            encontrado = false;
            nodosExplorados = 0;
            
            HashSet<string> visitados = new HashSet<string>();
            Nodo nodoInicial = new Nodo(cuboInicial, null, new Movimiento("Inicio"), 0);
            
            visitados.Add(cuboInicial.ObtenerClave());

            Backtrack(nodoInicial, visitados, cuboInicial);

            if (!encontrado)
            {
                Console.WriteLine("No se encontro solucion con Backtracking en el limite establecido.");
            }
        }

        private void Backtrack(Nodo actual, HashSet<string> visitados, Cubo cuboInicial)
        {
            // Si alguna otra rama recursiva ya lo encontró, detenemos todo para ahorrar cálculos
            if (encontrado) return; 

            nodosExplorados++;

            if (actual.EstadoCubo.EstaResuelto())
            {
                Console.WriteLine($"!Solucion encontrada! Nodos explorados: {nodosExplorados}");
                MostrarCamino(actual, cuboInicial);
                encontrado = true;
                return;
            }

            // Caso Base de la recursión: Alcanzó el límite y no es la solución
            if (actual.Nivel >= limiteProfundidad) return;

            List<Nodo> vecinos = Grafo.GenerarVecinos(actual);
            foreach (Nodo vecino in vecinos)
            {
                string clave = vecino.EstadoCubo.ObtenerClave();
                
                // Solo si el vecino no ha sido visitado en el camino actual
                if (!visitados.Contains(clave))
                {
                    visitados.Add(clave); // Hacemos el movimiento
                    
                    Backtrack(vecino, visitados, cuboInicial); // Exploramos recursivamente
                    
                    visitados.Remove(clave); // BACKTRACK: Deshacemos al regresar de la rama
                }
            }
        }
    }
}
