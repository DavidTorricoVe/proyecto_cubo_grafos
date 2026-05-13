using CuboRubik2x2.Modelos;

namespace CuboRubik2x2.Estructuras
{
    /* 
     * =========================================================================
     * CONCEPTO ESTRUCTURA DE DATOS: GRAFOS (Nodos)
     * =========================================================================
     * - Los Nodos son los vértices de nuestro Grafo de búsqueda.
     * - Guardan una referencia a su 'NodoPadre' para poder recorrer el camino a la inversa 
     *   (usando una Pila) una vez que se encuentra la solución.
     * 
     * =========================================================================
     * CONCEPTO POO APLICADO: ENCAPSULAMIENTO
     * =========================================================================
     * - Todos los atributos son de solo lectura ('private set') para garantizar que un estado 
     *   histórico del cubo en el grafo nunca sea alterado una vez guardado.
     */
    public class Nodo
    {
        public Cubo EstadoCubo { get; private set; }
        public Nodo NodoPadre { get; private set; }
        public Movimiento MovimientoGenerador { get; private set; }
        public int Nivel { get; private set; }

        public Nodo(Cubo cubo, Nodo padre, Movimiento movimiento, int nivel)
        {
            EstadoCubo = cubo;
            NodoPadre = padre;
            MovimientoGenerador = movimiento;
            Nivel = nivel;
        }
    }
}
