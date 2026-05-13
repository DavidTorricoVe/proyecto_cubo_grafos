using System.Collections.Generic;

using CuboRubik2x2.Modelos;

namespace CuboRubik2x2.Estructuras
{
    /* 
     * =========================================================================
     * CONCEPTO ESTRUCTURA DE DATOS: GRAFOS (Expansión y Aristas)
     * =========================================================================
     * 
     * - Modularidad: Esta clase aísla la lógica matemática de "generar vecinos".
     *   A partir de un Nodo (estado del cubo), aplica todos los movimientos posibles
     *   para descubrir las ramas adyacentes (Nodos hijos). Estas ramas representan
     *   las aristas del Grafo.
     * 
     * - Reutilización: Genera la red de estados para cualquier algoritmo de búsqueda 
     *   (no está atado solo a BFS).
     */
    public class Grafo
    {
        public static List<Nodo> GenerarVecinos(Nodo actual)
        {
            List<Nodo> vecinos = new List<Nodo>();
            string[] nombresMovimientos = { "R", "R'", "U", "U'", "F", "F'", "L", "L'", "D", "D'", "B", "B'" };

            foreach (var nombre in nombresMovimientos)
            {
                Movimiento mov = new Movimiento(nombre);
                Cubo nuevoCubo = actual.EstadoCubo.Clonar();
                
                mov.Ejecutar(nuevoCubo);

                vecinos.Add(new Nodo(nuevoCubo, actual, mov, actual.Nivel + 1));
            }

            return vecinos;
        }
    }
}
