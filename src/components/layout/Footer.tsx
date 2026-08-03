

export default function Footer() {
  return (
    <footer className="bg-[#1C1C1C] text-[#f1f1f1] py-12">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <ul className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-6 list-none p-0 text-center">
        <li>
          <a href="#" className="text-[#f1f1f1] font-medium transition-all duration-300 hover:text-[#088455] hover:bg-[#e8f5e9] hover:p-4 hover:rounded-2xl">Contacto</a>
        </li>

          <li>
              <a href="#"
              className="text-[#f1f1f1] font-medium transition-all duration-300 hover:text-[#088455] hover:bg-[#e8f5e9] hover:p-4 hover:rounded-2xl">
              Privacidad
            </a>
          </li>
          <li>
             <a href="#"
              className="text-[#f1f1f1] font-medium transition-all duration-300 hover:text-[#088455] hover:bg-[#e8f5e9] hover:p-4 hover:rounded-2xl">
              Términos de uso
            </a>
          </li>
          <li>
          <a href="#"
              className="text-[#f1f1f1] font-medium transition-all duration-300 hover:text-[#088455] hover:bg-[#e8f5e9] hover:p-4 hover:rounded-2xl">
              Tienda
            </a>
          </li>
        </ul>
      </div>

      <div className="bg-[#1C1C1C] py-10 text-center">
        <p className="text-[#f1f1f1] text-sm m-0">
          © 2024 JardinSmart. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}