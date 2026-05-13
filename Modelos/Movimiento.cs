namespace CuboRubik2x2.Modelos
{
    /* 
     * =========================================================================
     * CONCEPTO POO APLICADO: ENCAPSULAMIENTO Y MODULARIDAD
     * =========================================================================
     * 
     * - Encapsulamiento: La propiedad 'Nombre' está protegida con 'private set', por lo que 
     *   una vez instanciado un movimiento (por ejemplo "U"), nadie puede cambiarle el nombre 
     *   accidentalmente en medio de la ejecución.
     * 
     * - Modularidad: Esta clase aísla el concepto de un "Movimiento". Podría extenderse 
     *   fácilmente en el futuro para incluir la dirección (horario, antihorario) o animaciones.
     */
    public class Movimiento
    {
        public string Nombre { get; private set; } 
        
        public Movimiento(string nombre)
        {
            Nombre = nombre;
        }

        public void Ejecutar(Cubo cubo)
        {
            if (Nombre == "R") cubo.MovimientoR();
            else if (Nombre == "R'") cubo.MovimientoRPrima();
            else if (Nombre == "U") cubo.MovimientoU();
            else if (Nombre == "U'") cubo.MovimientoUPrima();
            else if (Nombre == "F") cubo.MovimientoF();
            else if (Nombre == "F'") cubo.MovimientoFPrima();
            else if (Nombre == "L") cubo.MovimientoL();
            else if (Nombre == "L'") cubo.MovimientoLPrima();
            else if (Nombre == "D") cubo.MovimientoD();
            else if (Nombre == "D'") cubo.MovimientoDPrima();
            else if (Nombre == "B") cubo.MovimientoB();
            else if (Nombre == "B'") cubo.MovimientoBPrima();
        }
    }
}
