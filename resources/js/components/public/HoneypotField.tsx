/**
 * Campo honeypot anti-spam: invisible visualmente y para lectores de pantalla
 * (`aria-hidden`, `tabIndex={-1}`). docs/07_VISTAS/PUBLIC_06_CONTACTO_RESERVA.md.
 * El backend rechaza el envío si llega relleno (`StoreContactMessageRequest`
 * / `StoreAppointmentBookingRequest`: regla `prohibited`).
 */
export default function HoneypotField({ id }: { readonly id: string }) {
    return (
        <div className="hidden" aria-hidden="true">
            <label htmlFor={id}>Website</label>
            <input
                id={id}
                name="honeypot"
                type="text"
                tabIndex={-1}
                autoComplete="off"
            />
        </div>
    );
}
