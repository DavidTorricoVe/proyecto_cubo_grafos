namespace CuboRubik2x2.Modelos
{
    /* 
     * =========================================================================
     * CONCEPTO POO APLICADO: ENCAPSULAMIENTO Y MODULARIDAD
     * =========================================================================
     * 
     * - Encapsulamiento: La propiedad 'Matriz' tiene un 'private set'. Esto significa que 
     *   solo la propia clase Cara puede crear y modificar la instancia de su matriz. 
     *   Las demás clases solo pueden leerla u ordenar a la Cara que se modifique 
     *   a través de métodos controlados (como 'RotarHorario()').
     * 
     * - Modularidad: Esta clase tiene la responsabilidad única de gestionar una sola 
     *   cara (una cuadrícula de 2x2). No necesita saber nada del resto del cubo.
     * 
     * - Reutilización de Código: El método 'Clonar()' permite copiar el estado 
     *   de la cara para hacer simulaciones en los Grafos sin afectar la matriz original.
     */
    public class Cara
    {
        public ColorCubo[,] Matriz { get; private set; }

        public Cara(ColorCubo colorInicial)
        {
            Matriz = new ColorCubo[2, 2];
            for (int i = 0; i < 2; i++)
            {
                for (int j = 0; j < 2; j++)
                {
                    Matriz[i, j] = colorInicial;
                }
            }
        }

        public Cara Clonar()
        {
            Cara copia = new Cara(ColorCubo.Blanco);
            for (int i = 0; i < 2; i++)
                for (int j = 0; j < 2; j++)
                    copia.Matriz[i, j] = this.Matriz[i, j];
            return copia;
        }

        public void RotarHorario()
        {
            ColorCubo temp = Matriz[0, 0];
            Matriz[0, 0] = Matriz[1, 0];
            Matriz[1, 0] = Matriz[1, 1];
            Matriz[1, 1] = Matriz[0, 1];
            Matriz[0, 1] = temp;
        }

        public bool EstaResuelta()
        {
            ColorCubo c = Matriz[0, 0];
            return Matriz[0, 1] == c && Matriz[1, 0] == c && Matriz[1, 1] == c;
        }
    }
}
