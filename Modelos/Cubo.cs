using System;

namespace CuboRubik2x2.Modelos
{
    /* 
     * =========================================================================
     * CONCEPTO POO APLICADO: ENCAPSULAMIENTO Y COMPOSICIÓN (MODULARIDAD)
     * =========================================================================
     * 
     * - Composición: La clase Cubo "está compuesta" por 6 instancias de la clase Cara.
     * 
     * - Encapsulamiento: El arreglo de 'Caras' tiene 'private set', evitando que desde 
     *   el exterior se reemplace el arreglo entero accidentalmente.
     * 
     * - Modularidad: El Cubo delega la responsabilidad de rotar una cara individual a la 
     *   propia clase 'Cara', mientras que el 'Cubo' solo se encarga de la lógica compleja 
     *   de intercambiar los colores de los bordes entre caras adyacentes.
     * 
     * - Herencia: Permite que las clases especializadas reutilicen código de clases base.
     * 
     * - Clase Abstracta: Define un contrato común para otras clases, impidiendo ser instanciada directamente.
     */
    public class Cubo
    {
        public Cara[] Caras { get; private set; }

        public Cubo()
        {
            Caras = new Cara[6];
            Caras[0] = new Cara(ColorCubo.Blanco);   // 0: Arriba
            Caras[1] = new Cara(ColorCubo.Amarillo); // 1: Abajo
            Caras[2] = new Cara(ColorCubo.Azul);     // 2: Izquierda
            Caras[3] = new Cara(ColorCubo.Verde);    // 3: Derecha
            Caras[4] = new Cara(ColorCubo.Rojo);     // 4: Frente
            Caras[5] = new Cara(ColorCubo.Naranja);  // 5: Atras
        }

        public Cubo Clonar()
        {
            Cubo copia = new Cubo();
            for (int i = 0; i < 6; i++)
            {
                copia.Caras[i] = this.Caras[i].Clonar();
            }
            return copia;
        }

        public bool EstaResuelto()
        {
            foreach (var cara in Caras)
            {
                if (!cara.EstaResuelta()) return false;
            }
            return true;
        }

        public string ObtenerClave()
        {
            char[] clave = new char[24];
            int idx = 0;
            for (int c = 0; c < 6; c++)
            {
                for (int i = 0; i < 2; i++)
                {
                    for (int j = 0; j < 2; j++)
                    {
                        clave[idx++] = (char)((int)Caras[c].Matriz[i, j] + '0');
                    }
                }
            }
            return new string(clave);
        }

        public void MovimientoR()
        {
            Caras[3].RotarHorario();
            ColorCubo tmp1 = Caras[0].Matriz[0, 1];
            ColorCubo tmp2 = Caras[0].Matriz[1, 1];

            Caras[0].Matriz[0, 1] = Caras[4].Matriz[0, 1];
            Caras[0].Matriz[1, 1] = Caras[4].Matriz[1, 1];

            Caras[4].Matriz[0, 1] = Caras[1].Matriz[0, 1];
            Caras[4].Matriz[1, 1] = Caras[1].Matriz[1, 1];

            Caras[1].Matriz[0, 1] = Caras[5].Matriz[1, 0];
            Caras[1].Matriz[1, 1] = Caras[5].Matriz[0, 0];

            Caras[5].Matriz[1, 0] = tmp1;
            Caras[5].Matriz[0, 0] = tmp2;
        }

        public void MovimientoRPrima()
        {
            MovimientoR(); MovimientoR(); MovimientoR();
        }

        public void MovimientoU()
        {
            Caras[0].RotarHorario();
            ColorCubo tmp1 = Caras[4].Matriz[0, 0];
            ColorCubo tmp2 = Caras[4].Matriz[0, 1];

            Caras[4].Matriz[0, 0] = Caras[3].Matriz[0, 0];
            Caras[4].Matriz[0, 1] = Caras[3].Matriz[0, 1];

            Caras[3].Matriz[0, 0] = Caras[5].Matriz[0, 0];
            Caras[3].Matriz[0, 1] = Caras[5].Matriz[0, 1];

            Caras[5].Matriz[0, 0] = Caras[2].Matriz[0, 0];
            Caras[5].Matriz[0, 1] = Caras[2].Matriz[0, 1];

            Caras[2].Matriz[0, 0] = tmp1;
            Caras[2].Matriz[0, 1] = tmp2;
        }

        public void MovimientoUPrima()
        {
            MovimientoU(); MovimientoU(); MovimientoU();
        }

        public void MovimientoF()
        {
            Caras[4].RotarHorario();
            ColorCubo tmp1 = Caras[0].Matriz[1, 0];
            ColorCubo tmp2 = Caras[0].Matriz[1, 1];

            Caras[0].Matriz[1, 0] = Caras[2].Matriz[1, 1];
            Caras[0].Matriz[1, 1] = Caras[2].Matriz[0, 1];

            Caras[2].Matriz[0, 1] = Caras[1].Matriz[0, 0];
            Caras[2].Matriz[1, 1] = Caras[1].Matriz[0, 1];

            Caras[1].Matriz[0, 0] = Caras[3].Matriz[1, 0];
            Caras[1].Matriz[0, 1] = Caras[3].Matriz[0, 0];

            Caras[3].Matriz[0, 0] = tmp1;
            Caras[3].Matriz[1, 0] = tmp2;
        }

        public void MovimientoFPrima()
        {
            MovimientoF(); MovimientoF(); MovimientoF();
        }

        public void MovimientoL()
        {
            Caras[2].RotarHorario();
            ColorCubo tmp1 = Caras[0].Matriz[0, 0];
            ColorCubo tmp2 = Caras[0].Matriz[1, 0];

            Caras[0].Matriz[0, 0] = Caras[5].Matriz[1, 1];
            Caras[0].Matriz[1, 0] = Caras[5].Matriz[0, 1];

            Caras[5].Matriz[0, 1] = Caras[1].Matriz[1, 0];
            Caras[5].Matriz[1, 1] = Caras[1].Matriz[0, 0];

            Caras[1].Matriz[0, 0] = Caras[4].Matriz[0, 0];
            Caras[1].Matriz[1, 0] = Caras[4].Matriz[1, 0];

            Caras[4].Matriz[0, 0] = tmp1;
            Caras[4].Matriz[1, 0] = tmp2;
        }

        public void MovimientoLPrima() { MovimientoL(); MovimientoL(); MovimientoL(); }

        public void MovimientoD()
        {
            Caras[1].RotarHorario();
            ColorCubo tmp1 = Caras[4].Matriz[1, 0];
            ColorCubo tmp2 = Caras[4].Matriz[1, 1];

            Caras[4].Matriz[1, 0] = Caras[2].Matriz[1, 0];
            Caras[4].Matriz[1, 1] = Caras[2].Matriz[1, 1];

            Caras[2].Matriz[1, 0] = Caras[5].Matriz[1, 0];
            Caras[2].Matriz[1, 1] = Caras[5].Matriz[1, 1];

            Caras[5].Matriz[1, 0] = Caras[3].Matriz[1, 0];
            Caras[5].Matriz[1, 1] = Caras[3].Matriz[1, 1];

            Caras[3].Matriz[1, 0] = tmp1;
            Caras[3].Matriz[1, 1] = tmp2;
        }

        public void MovimientoDPrima() { MovimientoD(); MovimientoD(); MovimientoD(); }

        public void MovimientoB()
        {
            Caras[5].RotarHorario();
            ColorCubo tmp1 = Caras[0].Matriz[0, 0];
            ColorCubo tmp2 = Caras[0].Matriz[0, 1];

            Caras[0].Matriz[0, 0] = Caras[3].Matriz[0, 1];
            Caras[0].Matriz[0, 1] = Caras[3].Matriz[1, 1];

            Caras[3].Matriz[0, 1] = Caras[1].Matriz[1, 1];
            Caras[3].Matriz[1, 1] = Caras[1].Matriz[1, 0];

            Caras[1].Matriz[1, 0] = Caras[2].Matriz[0, 0];
            Caras[1].Matriz[1, 1] = Caras[2].Matriz[1, 0];

            Caras[2].Matriz[0, 0] = tmp2;
            Caras[2].Matriz[1, 0] = tmp1;
        }

        public void MovimientoBPrima() { MovimientoB(); MovimientoB(); MovimientoB(); }

        public void Imprimir()
        {
            Console.WriteLine("    +---+");
            Console.Write("    | "); DibujarCuadrito(Caras[0].Matriz[0, 0]); DibujarCuadrito(Caras[0].Matriz[0, 1]); Console.WriteLine("|");
            Console.Write("    | "); DibujarCuadrito(Caras[0].Matriz[1, 0]); DibujarCuadrito(Caras[0].Matriz[1, 1]); Console.WriteLine("|");
            Console.WriteLine("+---+---+---+---+");
            
            // Izquierda, Frente, Derecha, Atras
            for (int i = 0; i < 2; i++)
            {
                Console.Write("| ");
                DibujarCuadrito(Caras[2].Matriz[i, 0]); DibujarCuadrito(Caras[2].Matriz[i, 1]); Console.Write("| ");
                DibujarCuadrito(Caras[4].Matriz[i, 0]); DibujarCuadrito(Caras[4].Matriz[i, 1]); Console.Write("| ");
                DibujarCuadrito(Caras[3].Matriz[i, 0]); DibujarCuadrito(Caras[3].Matriz[i, 1]); Console.Write("| ");
                DibujarCuadrito(Caras[5].Matriz[i, 0]); DibujarCuadrito(Caras[5].Matriz[i, 1]); Console.WriteLine("|");
            }

            Console.WriteLine("+---+---+---+---+");
            Console.Write("    | "); DibujarCuadrito(Caras[1].Matriz[0, 0]); DibujarCuadrito(Caras[1].Matriz[0, 1]); Console.WriteLine("|");
            Console.Write("    | "); DibujarCuadrito(Caras[1].Matriz[1, 0]); DibujarCuadrito(Caras[1].Matriz[1, 1]); Console.WriteLine("|");
            Console.WriteLine("    +---+");
            Console.WriteLine("-------------------------");
        }

        private void DibujarCuadrito(ColorCubo color)
        {
            ConsoleColor original = Console.ForegroundColor;
            switch (color)
            {
                case ColorCubo.Blanco: Console.ForegroundColor = ConsoleColor.White; break;
                case ColorCubo.Amarillo: Console.ForegroundColor = ConsoleColor.Yellow; break;
                case ColorCubo.Azul: Console.ForegroundColor = ConsoleColor.Blue; break;
                case ColorCubo.Verde: Console.ForegroundColor = ConsoleColor.Green; break;
                case ColorCubo.Rojo: Console.ForegroundColor = ConsoleColor.Red; break;
                case ColorCubo.Naranja: Console.ForegroundColor = ConsoleColor.DarkYellow; break; // Naranja aproximado
            }
            Console.Write("■ "); // Carácter de cuadrito relleno
            Console.ForegroundColor = original;
        }
    }
}
