const Map = () => {
  return (
    <section className="w-full bg-[#333] py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-10">
        <div className="md:w-1/2 w-full bg-[#1a1a1a] text-white p-6 rounded-lg shadow-lg space-y-4 text-center md:text-left">
          <h2 className="text-2xl font-bold text-blue-400">Localização:</h2>
          <p className="text-lg font-semibold">Rua Carlos Faria, 810</p>
          <p className="text-md">Raposo Tavares, São Paulo - SP</p>
          <p className="text-md">CEP: 05563-110</p>
        </div>

        <div className="md:w-1/2 w-full rounded-lg overflow-hidden shadow-lg">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d8695.483210767832!2d-46.78738673094362!3d-23.604321097238458!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce54515c73bd39%3A0x51a4189528f68a95!2sRua%20Carlos%20Faria%2C%20810%20-%20Raposo%20Tavares%2C%20S%C3%A3o%20Paulo%20-%20SP%2C%2005563-110!5e0!3m2!1spt-BR!2sbr!4v1758248619887!5m2!1spt-BR!2sbr"
            loading="lazy"
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"></iframe>
        </div>
      </div>
    </section>
  );
};

export default Map;
