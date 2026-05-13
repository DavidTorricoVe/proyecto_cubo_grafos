using System;

namespace CuboRubik2x2
{
    class Program
    {
        // El Main es el punto de entrada, aquí orquestamos todo el sistema
        static void Main(string[] args)
        {
            Console.WriteLine("--- SIMULADOR DE CUBO RUBIK 2x2 ---");
            Console.WriteLine("Proyecto de Estructura de Datos\n");
            
            // COMPOSICIÓN: Program usa una instancia de Cubo para funcionar
            Cubo cuboPrincipal = new Cubo();
            
            while (true)
            {
                Console.WriteLine("\n¿Qué quieres hacer?");
                Console.WriteLine("1. Ver el cubo");
                Console.WriteLine("2. Mezclar el cubo");
                Console.WriteLine("3. Resolver por BFS");
                Console.WriteLine("4. Resolver por DFS");
                Console.WriteLine("5. Resolver por Backtracking");
                Console.WriteLine("6. Resolver por Heurística (A*)");
                Console.WriteLine("7. Resetear (Cubo resuelto)");
                Console.WriteLine("8. Salir");
                Console.Write("Elige una opción: ");
                
                string op = Console.ReadLine();
                
                if (op == "8") 
                {
                    Console.WriteLine("Cerrando el programa...");
                    break;
                }

                if (op == "1")
                {
                    Console.WriteLine("\nAsí está el cubo ahora:");
                    cuboPrincipal.Imprimir();
                    if (cuboPrincipal.EstaResuelto()) {
                        Console.WriteLine("¡Está armadito!");
                    } else {
                        Console.WriteLine("Está desordenado.");
                    }
                }
                else if (op == "2")
                {
                    Console.Write("\n¿Cuántos giros quieres darle?: ");
                    if (!int.TryParse(Console.ReadLine(), out int n)) n = 4;

                    Console.WriteLine($"\nMezclando con {n} movimientos...");
                    string[] movsPosibles = { "R", "U", "F", "L", "D", "B", "R'", "U'", "F'", "L'", "D'", "B'" };
                    Random azar = new Random();
                    
                    for (int i = 0; i < n; i++)
                    {
                        string movElegido = movsPosibles[azar.Next(movsPosibles.Length)];
                        Console.WriteLine($"Giro {i + 1}: {movElegido}");
                        
                        // ENCAPSULAMIENTO: Solo nos importa el nombre del movimiento,
                        // la clase Movimiento se encarga del resto.
                        Movimiento m = new Movimiento(movElegido);
                        m.Ejecutar(cuboPrincipal);
                    }
                    Console.WriteLine("\nListo. El cubo quedó así:");
                    cuboPrincipal.Imprimir();
                }
                else if (op == "3" || op == "4" || op == "5" || op == "6")
                {
                    if (cuboPrincipal.EstaResuelto())
                    {
                        Console.WriteLine("\nYa está resuelto. Mezclalo primero.");
                        continue;
                    }

                    // POLIMORFISMO: Declaramos un 'buscador' de tipo Solver (la base)
                    Solver buscador = null;

                    // Instanciamos la clase hija que el usuario elija
                    if (op == "3") buscador = new SolverBFS();
                    else if (op == "4") buscador = new SolverDFS();
                    else if (op == "5") buscador = new SolverBacktracking();
                    else if (op == "6") buscador = new SolverHeuristico();

                    // POLIMORFISMO en acción: No importa qué algoritmo sea, 
                    // todos tienen el método Resolver() definido en la base.
                    buscador.Resolver(cuboPrincipal);
                }
                else if (op == "7")
                {
                    cuboPrincipal = new Cubo();
                    Console.WriteLine("\nCubo resuelto de nuevo.");
                    cuboPrincipal.Imprimir();
                }
                else
                {
                    Console.WriteLine("\nEsa opción no existe.");
                }
            }
        }
    }
}
