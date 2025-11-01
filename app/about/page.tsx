import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sobre - Achadinhos Xpress",
  description: "Conheça a história e missão da Achadinhos Xpress",
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-primary/10 to-background border-b border-primary/20">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center text-balance mb-4">
            Sobre a <span className="text-primary">Achadinhos Xpress</span>
          </h1>
          <p className="text-lg md:text-xl text-center text-muted-foreground max-w-3xl mx-auto text-balance">
            Onde encontrar o melhor se torna um hábito
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-4xl mx-auto space-y-6 text-foreground/90 leading-relaxed">
          <p>
            A Achadinhos Xpress surgiu com a missão de facilitar a vida de quem ama descobrir boas oportunidades. A
            ideia nasceu da necessidade de reunir, em um só lugar, produtos de qualidade, preços acessíveis e uma
            experiência de compra rápida, intuitiva e confiável. Mais do que um simples site de ofertas, a Achadinhos
            Xpress é um ambiente pensado para conectar pessoas a marcas, estilos e tendências, com praticidade e
            transparência.
          </p>

          <p>
            Desde o início, nosso foco foi unir tecnologia e experiência de mercado para criar uma plataforma capaz de
            atender às exigências do público moderno. Trabalhamos constantemente para oferecer um sistema dinâmico, leve
            e eficiente, que permita ao usuário navegar com fluidez e encontrar tudo o que precisa de forma simples.
            Cada detalhe foi desenvolvido com atenção, desde a organização das categorias até a apresentação visual dos
            produtos, garantindo uma navegação agradável e direta.
          </p>

          <p>
            A Achadinhos Xpress acredita que comprar bem não precisa ser complicado. Nosso compromisso é com a
            praticidade e a confiança, para que o cliente possa comparar, escolher e adquirir com segurança. Nossa
            curadoria é feita com base em qualidade, relevância e credibilidade dos vendedores e das marcas, assegurando
            que cada produto apresentado realmente valha a pena.
          </p>

          <p>
            Além da experiência do consumidor, também pensamos em quem faz o sistema funcionar. Contamos com uma equipe
            dedicada à atualização constante das ofertas, à gestão dos produtos e ao suporte para quem utiliza a
            plataforma. Nosso painel administrativo foi projetado para facilitar o trabalho colaborativo e manter tudo
            sempre organizado, com comunicação rápida e controle eficiente de cada etapa.
          </p>

          <p>
            Na Achadinhos Xpress, o design é parte essencial da experiência. A identidade visual reflete modernidade e
            confiança, com o preto simbolizando força e estabilidade, e o dourado representando valor, destaque e
            elegância. Cada cor, ícone e elemento foi pensado para transmitir sofisticação e credibilidade, sem perder a
            simplicidade que torna o uso do site natural e acessível a todos os públicos.
          </p>

          <p>
            O propósito da Achadinhos Xpress é ser mais do que uma vitrine virtual. Queremos ser uma ponte entre pessoas
            e oportunidades, promovendo uma relação de confiança e satisfação a cada nova descoberta. Nossa plataforma
            está em constante evolução, acompanhando as tendências do mercado e ouvindo o que os usuários realmente
            desejam, porque acreditamos que inovação só tem valor quando melhora a vida das pessoas.
          </p>

          <div className="pt-8 border-t border-primary/20 mt-8">
            <p className="text-center text-lg font-medium text-primary">
              Aqui, cada detalhe importa. Cada produto tem uma história. Cada clique pode levar a um novo achado.
            </p>
            <p className="text-center text-2xl font-bold mt-4 text-primary">
              Achadinhos Xpress — onde encontrar o melhor se torna um hábito.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
