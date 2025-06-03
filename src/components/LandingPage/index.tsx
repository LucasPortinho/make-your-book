'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, BookOpen, Palette, Zap, Star, ArrowRight } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

export function LandingPageComponent() {
  return (
    <div className="min-h-screen bg-white">

      <header className="border-b border-slate-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">

          <div className="flex items-center space-x-2 min-w-0">
            <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-slate-900" />
            <span className="text-lg sm:text-2xl font-bold text-slate-900 truncate">HaveYourBook</span>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-slate-600 hover:text-slate-900 transition-colors">
              Recursos
            </a>
            <a href="#pricing" className="text-slate-600 hover:text-slate-900 transition-colors">
              Preços
            </a>
            <a href="#testimonials" className="text-slate-600 hover:text-slate-900 transition-colors">
              Depoimentos
            </a>
          </nav>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <Button 
            variant="ghost" 
            className="text-slate-600 cursor-pointer hover:text-slate-900 hidden sm:inline-flex"
            onClick={() => redirect('/login')}>
              Entrar
            </Button>
            <Button 
            className="bg-slate-900 cursor-pointer hover:bg-slate-800 text-white text-sm sm:text-base px-3 sm:px-4"
            onClick={() => redirect('/register')}>
              Começar Grátis
            </Button>
          </div>

        </div>
      </header>

      <section className="py-20 lg:py-32 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4 text-center">

          <Badge className="mb-6 bg-slate-100 text-slate-800 hover:bg-slate-200">
            🚀 Transforme qualquer livro em experiências visuais
          </Badge>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 mb-6 leading-tight">
            Seus livros favoritos,
            <br />
            <span className="text-slate-600">reimaginados</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Resuma, ilustre e transforme livros em gibis incríveis com o poder da IA. Descubra uma nova forma de
            consumir e criar conteúdo literário.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
            size="lg" 
            className="bg-slate-900 cursor-pointer hover:bg-slate-800 text-white px-8 py-4 text-lg"
            onClick={() => redirect('/register')}>
              Começar Gratuitamente
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-slate-300 cursor-pointer text-slate-700 hover:bg-slate-50 px-8 py-4 text-lg"
              onClick={() => redirect('/register')}
            >
              Ver Demonstração
            </Button>
          </div>

          <div className="flex items-center justify-center space-x-8 text-sm text-slate-500">
            <div className="flex items-center">
              <Check className="h-4 w-4 text-green-500 mr-2" />
              Sem cartão de crédito
            </div>
            <div className="flex items-center">
              <Check className="h-4 w-4 text-green-500 mr-2" />
              Cancelamento gratuito
            </div>
            <div className="flex items-center">
              <Check className="h-4 w-4 text-green-500 mr-2" />
              Suporte 24/7
            </div>
          </div>

        </div>
      </section>

      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">Três superpoderes em uma plataforma</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Transforme sua experiência de leitura com ferramentas poderosas de IA
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-slate-200 hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-8 w-8 text-slate-700" />
                </div>
                <CardTitle className="text-2xl text-slate-900">Resumos Inteligentes</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-slate-600 text-lg leading-relaxed">
                  Extraia os pontos principais de qualquer livro em minutos. Nossa IA identifica conceitos-chave,
                  personagens e enredos essenciais.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-slate-200 hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Palette className="h-8 w-8 text-slate-700" />
                </div>
                <CardTitle className="text-2xl text-slate-900">Ilustrações Únicas</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-slate-600 text-lg leading-relaxed">
                  Dê vida aos seus livros com ilustrações personalizadas. Visualize personagens, cenários e momentos
                  marcantes da história.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-slate-200 hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-slate-700" />
                </div>
                <CardTitle className="text-2xl text-slate-900">Gibis Automáticos</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-slate-600 text-lg leading-relaxed">
                  Transforme livros inteiros em gibis envolventes. Combine texto, diálogos e ilustrações em formato de
                  quadrinhos.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
            <div>
              <div className="text-3xl font-bold text-slate-900">10K+</div>
              <div className="text-slate-600">Livros processados</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900">5K+</div>
              <div className="text-slate-600">Usuários ativos</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900">50K+</div>
              <div className="text-slate-600">Ilustrações criadas</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900">98%</div>
              <div className="text-slate-600">Satisfação</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">Planos para todos os leitores</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Escolha o plano ideal para suas necessidades de leitura e criação
            </p>
          </div>

            {/* Plans */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {/* Free Plan */}
            <Card className="border-slate-200 relative flex flex-col h-full">
              <CardHeader>
                <CardTitle className="text-xl text-slate-900">Gratuito</CardTitle>
                <div className="text-3xl font-bold text-slate-900">R$ 0</div>
                <CardDescription>Para experimentar a plataforma</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-slate-600">3 resumos por mês</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-slate-600">5 ilustrações por mês</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-slate-600">Suporte por email</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="mt-auto">
                <Button className="w-full cursor-pointer" variant="outline">
                  Começar Grátis
                </Button>
              </CardFooter>
            </Card>

            {/* Starter Plan */}
            <Card className="border-slate-200 flex flex-col h-full">
              <CardHeader>
                <CardTitle className="text-xl text-slate-900">Iniciante</CardTitle>
                <div className="text-3xl font-bold text-slate-900">R$ 29</div>
                <CardDescription>Para leitores casuais</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-slate-600">20 resumos por mês</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-slate-600">50 ilustrações por mês</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-slate-600">2 gibis por mês</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-slate-600">Suporte prioritário</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="mt-auto">
                <Button className="w-full bg-slate-900 cursor-pointer hover:bg-slate-800">Escolher Plano</Button>
              </CardFooter>
            </Card>

            {/* Pro Plan */}
            <Card className="border-slate-900 relative flex flex-col h-full">
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white">
                Mais Popular
              </Badge>
              <CardHeader>
                <CardTitle className="text-xl text-slate-900">Profissional</CardTitle>
                <div className="text-3xl font-bold text-slate-900">R$ 79</div>
                <CardDescription>Para leitores ávidos</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-slate-600">Resumos ilimitados</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-slate-600">200 ilustrações por mês</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-slate-600">10 gibis por mês</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-slate-600">Exportação em PDF</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-slate-600">Suporte 24/7</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="mt-auto">
                <Button className="w-full cursor-pointer bg-slate-900 hover:bg-slate-800">Escolher Plano</Button>
              </CardFooter>
            </Card>

            {/* Enterprise Plan */}
            <Card className="border-slate-200 flex flex-col h-full">
              <CardHeader>
                <CardTitle className="text-xl text-slate-900">Empresarial</CardTitle>
                <div className="text-3xl font-bold text-slate-900">R$ 199</div>
                <CardDescription>Para editoras e escolas</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-slate-600">Tudo ilimitado</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-slate-600">API personalizada</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-slate-600">Múltiplos usuários</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-slate-600">Gerente dedicado</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-slate-600">SLA garantido</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="mt-auto">
                <Button className="w-full bg-slate-900 cursor-pointer hover:bg-slate-800">Falar com Vendas</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">O que nossos usuários dizem</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-stretch">
            <Card className="border-slate-200 flex flex-col h-full">
              <CardContent className="pt-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-600 mb-4">
                  "Incrível como consegui resumir 'Dom Casmurro' em 10 minutos e ainda criar ilustrações dos
                  personagens. Revolucionou minha forma de estudar!"
                </p>
                <div className="flex items-center mt-auto">
                  <div className="w-10 h-10 bg-slate-200 rounded-full mr-3"></div>
                  <div>
                    <div className="font-semibold text-slate-900">Ana Silva</div>
                    <div className="text-sm text-slate-500">Estudante de Literatura</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 flex flex-col h-full">
              <CardContent className="pt-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-600 mb-4">
                  "Como professor, uso a HaveYourBook para criar material didático visual. Meus alunos adoram os gibis
                  que criamos a partir dos clássicos!"
                </p>
                <div className="flex items-center mt-auto">
                  <div className="w-10 h-10 bg-slate-200 rounded-full mr-3"></div>
                  <div>
                    <div className="font-semibold text-slate-900">Carlos Mendes</div>
                    <div className="text-sm text-slate-500">Professor de Português</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 flex flex-col h-full">
              <CardContent className="pt-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-600 mb-4">
                  "Finalmente consigo 'ler' mais livros! Os resumos são precisos e as ilustrações me ajudam a visualizar
                  melhor as histórias."
                </p>
                <div className="flex items-center mt-auto">
                  <div className="w-10 h-10 bg-slate-200 rounded-full mr-3"></div>
                  <div className="mt-auto">
                    <div className="font-semibold text-slate-900">Marina Costa</div>
                    <div className="text-sm text-slate-500">Executiva</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Pronto para transformar sua leitura?</h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de leitores que já descobriram uma nova forma de consumir literatura
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
            size="lg" 
            className="bg-white cursor-pointer transition text-slate-900 hover:bg-slate-300 px-8 py-4 text-lg"
            onClick={() => redirect('/register')}>
              Começar Gratuitamente
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="container mx-auto px-4">
          {/* <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <BookOpen className="h-6 w-6 text-slate-900" />
                <span className="text-xl font-bold text-slate-900">HaveYourBook</span>
              </div>
              <p className="text-slate-600">Transformando a experiência de leitura com inteligência artificial.</p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-4">Produto</h3>
              <ul className="space-y-2 text-slate-600">
                <li>
                  <Link href="#" className="hover:text-slate-900">
                    Recursos
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-slate-900">
                    Preços
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-slate-900">
                    API
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-4">Empresa</h3>
              <ul className="space-y-2 text-slate-600">
                <li>
                  <Link href="#" className="hover:text-slate-900">
                    Sobre
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-slate-900">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-slate-900">
                    Carreiras
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-4">Suporte</h3>
              <ul className="space-y-2 text-slate-600">
                <li>
                  <Link href="#" className="hover:text-slate-900">
                    Central de Ajuda
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-slate-900">
                    Contato
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-slate-900">
                    Status
                  </Link>
                </li>
              </ul>
            </div>
          </div> */}

          <div className="border-t border-slate-200 mt-8 pt-8 text-center text-slate-600">
            <p>&copy; 2024 HaveYourBook. Todos os direitos reservados.</p>
          </div>
          
        </div>
      </footer>
    </div>
  )
}
