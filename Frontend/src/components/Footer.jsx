import youtube from "../assets/YoutubeLogo.png"
import tiktok from "../assets/TiktokLogo.png"
import facebook from "../assets/FacebookLogo.png"

function Footer() {
    return(
        <footer>
            <section id="redes">
                <h2>Nuestras redes sociales</h2>
                <a href="https://www.facebook.com/profile.php?id=61595732810169"><img className="redes-img" src={facebook} alt="Imagen de facebook" /></a>
                <a href="https://www.tiktok.com/@arcadex_gaming"><img className="redes-img" src={youtube} alt="Imagen de Youtube" /></a>
                <a href="http://www.youtube.com/@Arcadex-GG"><img className="redes-img" src={tiktok} alt="Imagen de Tiktok" /></a>
            </section>
            <p>© Arcadex 2026. Todos los derechos reservados.</p>
        </footer>
    )
}

export default Footer