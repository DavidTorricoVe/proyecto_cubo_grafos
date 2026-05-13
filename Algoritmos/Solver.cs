using System;
using System.Collections.Generic;

using CuboRubik2x2.Modelos;
using CuboRubik2x2.Estructuras;

namespace CuboRubik2x2.Algoritmos
{
    // HERENCIA: Esta es la clase base (el "molde") para todos los algoritmos
    // CLASE ABSTRACTA: No se puede crear un 'Solver' a secas, debe ser uno específico (BFS, DFS...)
    public abstract class Solver
    {
        // Este método es abstracto porque cada algoritmo tiene su forma de resolver
        public abstract void Resolver(Cubo cuboInicial);
        
        // REUTILIZACIÓN: Este método lo heredan todos los hijos para no repetir código
        protected void MostrarCamino(Nodo nodoFinal, Cubo cuboOriginal)
        {
            Stack<Movimiento> pasos = new Stack<Movimiento>();
            Nodo actual = nodoFinal;

            while (actual.NodoPadre != null)
            {
                // Guardamos el objeto Movimiento completo para poder ejecutarlo luego
                pasos.Push(actual.MovimientoGenerador);
                actual = actual.NodoPadre;
            }

            Console.WriteLine("\n--- RUTA DE SOLUCIÓN ENCONTRADA ---");
            if (pasos.Count == 0)
            {
                Console.WriteLine("El cubo ya estaba armado.");
                return;
            }

            Console.WriteLine($"Pasos totales: {pasos.Count}");
            int contador = 1;
            while (pasos.Count > 0)
            {
                Movimiento m = pasos.Pop();
                Console.WriteLine($"{contador}. Girar: {m.Nombre}");
                
                // ACTUALIZACIÓN DEL ESTADO: Aplicamos el movimiento al cubo original
                // para que los cambios persistan fuera del algoritmo.
                m.Ejecutar(cuboOriginal);
                contador++;
            }

            Console.WriteLine("\n¡Cubo sincronizado y resuelto!");
            Console.WriteLine("Estado final del cubo:");
            cuboOriginal.Imprimir();
        }
    }
}
