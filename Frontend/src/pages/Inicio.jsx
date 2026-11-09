import torneo from "../assets/Torneo.jpg"
import consolasJuegos from "../assets/ConsolasYJuegos.jpeg"
import accesorios from "../assets/Accesorios.jpg"

function Inicio() {
    return(
        <>
            <header>
                <h1>Arcadex</h1>
                <p>
                    Somos una tienda especializada en la venta de videojuegos, 
                    consolas y accesorios para jugadores de todas las plataformas. 
                    Nuestro objetivo es ofrecer productos de calidad que permitan a 
                    nuestros clientes disfrutar al máximo de su experiencia de juego.
                </p>
                <div className="mision-vision">
                    <article className="tarjeta">
                        <h2>Mision</h2>
                        <p>
                            Ofrecer productos y accesorios gamer de calidad, brindando una 
                            experiencia de compra satisfactoria y accesible para todos los 
                            amantes de los videojuegos.
                        </p>
                    </article>

                    <article className="tarjeta">
                        <h2>Vision</h2>
                        <p>
                            Convertirnos en una tienda reconocida por nuestra variedad de 
                            productos, atención al cliente y compromiso con la comunidad gamer.
                        </p>
                    </article>
                </div>
            </header>

            <main>
                <section>
                    <h2>Proyectos y actividades</h2>
                    <article className="tarjeta">
                        <h3>Venta de consolas y videojuegos</h3>

                        <img src={consolasJuegos} alt="Consolas y videojuegos" />

                        <p>
                            Ofrecemos una amplia variedad de videojuegos y consolas
                            de distintas plataformas para que nuestros clientes 
                            encuentren sus titulos favoritos.
                        </p>
                    </article>

                    <article className="tarjeta">
                        <h3>Accesorios y perifericos</h3>

                        <img src={accesorios} alt="Accesorios" />
                        
                        <p>
                            Contamos con accesorios como teclados, ratones,
                            audífonos y controles que ayudan a mejorar la
                            comodidad y la experiencia de juego.
                        </p>
                    </article>

                    <article className="tarjeta">
                        <h3>Torneos y eventos</h3>

                        <img src={torneo} alt="Torneo de videojuegos" />

                        <p>
                            Organizamos torneos y actividades para reunir
                            a jugadores, fomentar la competencia sana y
                            fortalecer la comunidad de videojuegos.
                        </p>
                    </article>
                </section>
            </main>

            <section>
                <h2>Contacto</h2>
                <form onSubmit={(e) => e.preventDefault()}>
                    <p>
                    Si necesita comunicarse con nuestro equipo para tratar cualquier tema, 
                    escriba sus datos en el siguiente espacio para poder comunicarnos con usted:
                    </p>

                    <label htmlFor="nombre">Nombre:</label>
                    <input type="text" id="nombre" name="nombre" required />

                    <label htmlFor="email">Correo:</label>
                    <input type="email" id="email" name="email" required />

                    <label htmlFor="mensaje">Escribe tu mensaje:</label>
                    <textarea id="mensaje" name="mensaje" rows="5" required></textarea>

                    <button type="submit">Enviar</button>
                </form>
            </section>
        </>
    )
}

export default Inicio