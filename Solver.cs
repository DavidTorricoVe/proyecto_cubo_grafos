using System;
using System.Collections.Generic;

namespace CuboRubik2x2
{
    // HERENCIA: Esta es la clase base (el "molde") para todos los algoritmos
    // CLASE ABSTRACTA: No se puede crear un 'Solver' a secas, debe ser uno específico (BFS, DFS...)
    public abstract class Solver
    {
        // Este método es abstracto porque cada algoritmo tiene su forma de resolver
        public abstract void Resolver(Cubo cuboInicial);
        
        // REUTILIZACIÓN: Este método lo heredan todos los hijos para no repetir código
        protected void MostrarCamino(Nodo nodoFinal)
        {
            Stack<string> pasos = new Stack<string>();
            Nodo actual = nodoFinal;

            while (actual.NodoPadre != null)
            {
                pasos.Push(actual.MovimientoGenerador.Nombre);
                actual = actual.NodoPadre;
            }

            Console.WriteLine("Movimientos realizados:");
            if (pasos.Count == 0)
            {
                Console.WriteLine("Ya estaba armado.");
                return;
            }

            int contador = 1;
            while (pasos.Count > 0)
            {
                Console.WriteLine($"{contador}. Girar: {pasos.Pop()}");
                contador++;
            }
        }
    }
}
