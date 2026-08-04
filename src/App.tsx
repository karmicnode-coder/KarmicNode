import React, { useState, useEffect, useRef, useCallback, type ReactNode } from 'react'

// ─── Types ───────────────────────────────────────────────────────────────────

type Page = 'home' | 'shop' | 'product' | 'contact' | 'about' | 'blog' | 'custom'

interface Product {
  id: number
  stripeId?: string
  name: string
  category: string
  tags: string[]
  price: number
  originalPrice: number | null
  badge: string | null
  badgeColor: 'bordo' | 'gold'
  rating: number
  reviews: number
  image: string
  images: string[]
  stock: number
  description: string
  specs: { label: string; value: string }[]
}

interface CartItem extends Product { qty: number }

interface BlogPost {
  id: number
  title: string
  slug: string
  category: string
  excerpt: string
  body: string[]
  image: string
  author: string
  date: string
  readTime: number
  featured?: boolean
}

// ─── Blog data ────────────────────────────────────────────────────────────────

const BLOG_POSTS: BlogPost[] = [
  {
    id: 1,
    title: 'Como construir um guarda-roupa cápsula em 2026',
    slug: 'guarda-roupa-capsula-2026',
    category: 'Estilo',
    excerpt: 'Menos peças, mais versatilidade. Descobrimos como criar um guarda-roupa funcional com menos de 30 peças que combinam entre si.',
    body: [
      'O conceito de guarda-roupa cápsula surgiu nos anos 70 mas nunca foi tão relevante como hoje. Com o excesso de consumo em debate, muitos optam por uma abordagem mais consciente e inteligente ao vestuário.',
      'A base de qualquer guarda-roupa cápsula são as peças neutras: brancos, pretos, bege, cinzentos e azul-marinho. Estas cores combinam entre si e com qualquer acento de cor que queira adicionar sazonalmente.',
      'Invista em qualidade, não em quantidade. Uma camisola de algodão premium dura anos e mantém a forma. Uma peça barata pode sair mais cara a longo prazo — desbota, perde forma, e acaba substituída em meses.',
      'As peças essenciais para começar: 3 camisas básicas (branca, preta, cinzenta), 2 calças de corte clássico (uma azul escuro, uma bege), 1 casaco de qualidade, 2 camisolas, 1 vestido versátil e 2 pares de sapatos (um casual, um mais formal).',
      'Adicione 3 a 5 peças de acento por estação — uma cor vibrante, um padrão, um acessório especial. Estas peças dão personalidade ao look sem comprometer a versatilidade do conjunto.',
    ],
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=85',
    author: 'Karmic Node',
    date: '18 Jul 2026',
    readTime: 6,
    featured: true,
  },
  {
    id: 2,
    title: 'Tendências de moda para o outono/inverno 2026',
    slug: 'tendencias-moda-outono-inverno-2026',
    category: 'Tendências',
    excerpt: 'Os tons terrosos, os tecidos texturados e o regresso do oversized dominam a estação mais elegante do ano.',
    body: [
      'O outono/inverno 2026 traz um retorno à substância. Após anos de minimalismo extremo, os criadores apostam em texturas ricas, volumes generosos e paletas de cor que evocam a natureza.',
      'Os tons terrosos são a grande aposta: camel, terracota, mostarda e chocolate substituem os cinzentos neutros das últimas temporadas. Combinados com tecidos como tweed, veludo e lã grossa, criam looks de grande impacto visual.',
      'O oversized mantém-se relevante, mas desta vez com mais estrutura. Casacos de ombros marcados, blazers largos com cinto e blusões de grandes proporções definem a silhueta da estação.',
      'Os acessórios ganham protagonismo: chapéus de aba larga, botas de cano alto e malas com textura animal print (mas em versão eco-friendly) são os complementos do momento.',
      'A dica principal: misture texturas. Veludo com lã, couro com algodão, seda com tweed. É nesse contraste que reside a sofisticação desta temporada.',
    ],
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&q=85',
    author: 'Karmic Node',
    date: '12 Jul 2026',
    readTime: 5,
  },
  {
    id: 3,
    title: 'Guia completo de cuidados com tecidos premium',
    slug: 'cuidados-tecidos-premium',
    category: 'Cuidados',
    excerpt: 'Lã merino, cashmere, linho, seda — cada tecido tem as suas regras. Aprenda a fazer as suas peças durarem anos.',
    body: [
      'Investir em peças de qualidade é apenas metade da equação. A outra metade é saber tratá-las corretamente. Um cashmere mal lavado nunca mais volta ao estado original.',
      'A lã merino e o cashmere devem ser lavados à mão em água fria com detergente neutro, ou em programa de lã a 30°C. Nunca torcer — pressione suavemente e seque na horizontal para manter a forma.',
      'O linho é um dos tecidos mais resistentes mas amassa facilmente. Lave a 40°C, estenda logo após a lavagem para minimizar amarrotamento, e passe a ferro com vapor enquanto ainda ligeiramente húmido.',
      'A seda exige cuidado redobrado. Lave à mão em água fria, nunca use lixívia, e seque à sombra. O calor direto do sol desbota e fragiliza as fibras. Passe a ferro pelo lado errado com temperatura baixa.',
      'Para guardar peças fora de estação: dobre (não pendure) as malhas para não deformar, use sacos de tecido respirável para peças delicadas, e adicione sachets de lavanda para repelir traças de forma natural.',
    ],
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=85',
    author: 'Karmic Node',
    date: '5 Jul 2026',
    readTime: 4,
  },
  {
    id: 4,
    title: 'Como vestir bem sem gastar muito: o guia definitivo',
    slug: 'vestir-bem-sem-gastar-muito',
    category: 'Estilo',
    excerpt: 'Elegância não é sinónimo de preço elevado. Com estratégia e alguns princípios básicos, é possível ter um estilo impecável com orçamento controlado.',
    body: [
      'O maior mito da moda é que é preciso gastar muito para vestir bem. A realidade é que o estilo é uma questão de proporcionalidade, qualidade de corte e coerência — não de marcas ou preços.',
      'Priorize o corte acima de tudo. Uma peça de preço médio bem ajustada ao seu corpo supera sempre uma peça de marca cara que não assenta bem. Se necessário, invista em pequeñas alterações de costura — valem cada cêntimo.',
      'Compre menos e melhor. Em vez de 10 peças a 20€, opte por 3 a 60€. Vai usar mais, durar mais, e sentir-se melhor. A equação económica também favorece a qualidade a longo prazo.',
      'Aproveite as épocas de saldos para comprar peças clássicas — não tendências. Um casaco de lã, uma camisa oxford, umas calças de corte reto — estas peças não ficam desatualizadas e valem o investimento em desconto.',
      'As lojas de segunda mão e vintage são aliadas fantásticas. É possível encontrar peças de marcas premium em excelente estado por uma fração do preço original. Requer paciência, mas as descobertas compensam.',
    ],
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&q=85',
    author: 'Karmic Node',
    date: '28 Jun 2026',
    readTime: 7,
  },
  {
    id: 5,
    title: 'Moda sustentável: como fazer escolhas mais conscientes',
    slug: 'moda-sustentavel-escolhas-conscientes',
    category: 'Sustentabilidade',
    excerpt: 'A indústria da moda é uma das mais poluentes do mundo. Mostramos como fazer escolhas que fazem diferença sem abdicar do estilo.',
    body: [
      'A moda rápida (fast fashion) tem um custo ambiental enorme: toneladas de roupas descartadas anualmente, poluição de rios por corantes, e emissões de carbono significativas. Mas há alternativas.',
      'Comprar menos é o passo mais impactante. Cada peça que não é comprada é a mais sustentável de todas. Antes de qualquer compra, pergunte: já tenho algo similar? Vou usar isto mais de 30 vezes?',
      'Prefira materiais naturais e certificados: algodão orgânico (GOTS), lã certificada (RWS), linho europeu, ou alternativas inovadoras como Tencel e Modal (fibras de madeira de reflorestação).',
      'A durabilidade é sustentabilidade. Uma peça que dura 10 anos tem muito menor impacto ambiental do que 10 peças que duram 1 ano cada. Invista em qualidade — é uma decisão ambiental tanto quanto estética.',
      'Dê nova vida às peças que já tem: aprenda a fazer pequenas reparações, personalize com bordados ou patches, ou troque com amigos. O melhor guarda-roupa sustentável é o que já existe.',
    ],
    image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1200&q=85',
    author: 'Karmic Node',
    date: '20 Jun 2026',
    readTime: 5,
  },
  {
    id: 6,
    title: 'O regresso do alfaiate: por que o fato voltou',
    slug: 'regresso-alfaiate-fato-voltou',
    category: 'Tendências',
    excerpt: 'Após anos de dominação do casual, o fato bem cortado regressa em força — e desta vez para ficar.',
    body: [
      'Havia uma certa melancolia na morte do fato. A pandemia acelerou a casualização do vestuário, e muitos proclamaram o fim do alfaiate clássico. Estavam enganados.',
      'O fato ressurge em 2026 com uma nova energia: menos formal, mais expressivo. Padrões ousados como o príncipe de Gales e o xadrez coexistem com cortes oversized em cores inesperadas — lilás, mostarda, verde floresta.',
      'A nova regra é quebrar o fato. Calças do fato com sapatilhas e t-shirt básica. Casaco do fato sobre jeans e bota de cowboy. O fato deixou de ser uma armadura rígida e tornou-se uma ferramenta de estilo versátil.',
      'Para o mercado de trabalho, o "smart casual" abriu espaço ao fato sem gravata, ao casaco sem calças combinadas, ao colete como peça isolada. A fronteira entre formal e casual dissolve-se definitivamente.',
      'Invista num bom fato clássico — azul-marinho ou cinzento carvão, corte ligeiramente slim — e terá uma peça para décadas. Com as combinações certas, serve para uma entrevista de emprego, um casamento e um jantar de negócios.',
    ],
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4b1df2?w=1200&q=85',
    author: 'Karmic Node',
    date: '10 Jun 2026',
    readTime: 6,
  },
  {
    id: 7,
    title: 'Acessórios que transformam qualquer look',
    slug: 'acessorios-que-transformam-look',
    category: 'Acessórios',
    excerpt: 'Um cinto certo, um lenço bem colocado ou a mala ideal podem elevar um look simples ao patamar seguinte.',
    body: [
      'Os acessórios são o segredo mais subestimado do estilo. São eles que revelam personalidade e transformam um look básico em algo memorável — sem mudar uma única peça de roupa.',
      'O cinto é o acessório mais funcional e estético ao mesmo tempo. Define a cintura, estrutura a silhueta e adiciona um ponto de interesse ao conjunto. Invista em couro genuíno de cor neutra — dura décadas e combina com tudo.',
      'O lenço de seda ou algodão é o acessório mais versátil que existe: no pescoço, no cabelo, na mala, no pulso, ou como lenço de bolso no casaco. É pequeno, fácil de transportar e multiplica as combinações possíveis.',
      'As malas merecem investimento especial — são o acessório mais visível e usado. Prefira couro ou materiais de qualidade, formas clássicas e cores que durem além das temporadas. Uma boa mala é um investimento de décadas.',
      'Bijuteria minimalista e discreta é sempre segura — camadas de correntes finas, brincos pequenos, pulseiras simples. Quando quer impacto, escolha UMA peça statement e deixe o resto limpo.',
    ],
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=1200&q=85',
    author: 'Karmic Node',
    date: '1 Jun 2026',
    readTime: 5,
  },
  {
    id: 8,
    title: 'Como combinar padrões sem errar',
    slug: 'como-combinar-padroes-sem-errar',
    category: 'Estilo',
    excerpt: 'Riscas com xadrez, florais com geométrico — misturar padrões parece arriscado mas há regras simples que tornam o resultado sempre elegante.',
    body: [
      'Misturar padrões é um dos gestos de estilo mais ousados e, quando bem feito, mais impressionantes. O truque está em perceber as regras antes de as quebrar.',
      'A regra mais importante: varie a escala. Um padrão grande com um padrão pequeno do mesmo tipo funciona quase sempre. Riscas largas com riscas finas, xadrez grande com xadrez pequeno, floral grande com floral pequeno.',
      'Partilhe uma cor em comum. Se ambos os padrões partilham pelo menos uma cor, a combinação fica automaticamente coesa. Um casaco às riscas azul e branco com uma camisa xadrez azul e verde funciona porque o azul é o elo de ligação.',
      'Use o sólido como árbitro. Entre dois padrões, uma peça sólida (calça, cinto, sapato) na cor dominante de um dos padrões une o conjunto e dá ao olho um ponto de descanso.',
      'Comece com dois padrões máximo. Quando ganhar confiança, experimente três. Mais do que isso raramente funciona fora de contextos muito específicos de alta moda.',
    ],
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&q=85',
    author: 'Karmic Node',
    date: '22 Mai 2026',
    readTime: 7,
  },
]

// ─── Products ────────────────────────────────────────────────────────────────

const ALL_PRODUCTS: Product[] = [
  {
    id: 1, name: 'Camisola Oversized Premium', category: 'Tops', tags: ['tops', 'camisola', 'oversized'],
    price: 49, originalPrice: 69, badge: 'Mais Vendido', badgeColor: 'bordo',
    rating: 4.9, reviews: 214, stock: 32,
    image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=85',
    images: [
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=85',
      'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800&q=85',
    ],
    description: 'Camisola oversized em algodão 100% orgânico com acabamento escovado no interior. Conforto máximo com um toque contemporâneo — a peça certa para o dia a dia.',
    specs: [
      { label: 'Material', value: '100% Algodão Orgânico' },
      { label: 'Corte', value: 'Oversized relaxed' },
      { label: 'Tamanhos', value: 'XS ao XXL' },
      { label: 'Cuidados', value: 'Lavagem a 30°C, não torcer' },
      { label: 'Cores disponíveis', value: 'Branco, Preto, Bege, Cinzento' },
      { label: 'Certificação', value: 'GOTS — Algodão Orgânico' },
    ],
  },
  {
    id: 2, name: 'Calças Slim Fit Algodão', category: 'Calças', tags: ['calças', 'slim', 'algodão'],
    price: 79, originalPrice: 99, badge: '−20%', badgeColor: 'gold',
    rating: 4.7, reviews: 98, stock: 24,
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=85',
    images: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=85',
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=85',
    ],
    description: 'Calças de corte slim em algodão elastano com acabamento premium. Versáteis o suficiente para escritório ou lazer — o essencial de qualquer guarda-roupa moderno.',
    specs: [
      { label: 'Material', value: '97% Algodão, 3% Elastano' },
      { label: 'Corte', value: 'Slim fit, cintura média' },
      { label: 'Tamanhos', value: '34 ao 46' },
      { label: 'Cuidados', value: 'Lavagem a 40°C' },
      { label: 'Cores disponíveis', value: 'Navy, Preto, Bege, Cinzento Carvão' },
      { label: 'Fecho', value: 'Zip YKK com botão' },
    ],
  },
  {
    id: 3, name: 'Vestido Midi Linho', category: 'Vestidos', tags: ['vestidos', 'linho', 'midi'],
    price: 89, originalPrice: 119, badge: 'Novo', badgeColor: 'bordo',
    rating: 4.8, reviews: 67, stock: 18,
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=85',
    images: [
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=85',
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=85',
    ],
    description: 'Vestido midi em linho europeu com decote em V e mangas a três quartos. Elegante, respirável e perfeito para dias quentes — da praia ao jantar.',
    specs: [
      { label: 'Material', value: '100% Linho Europeu' },
      { label: 'Comprimento', value: 'Midi (abaixo do joelho)' },
      { label: 'Tamanhos', value: 'XS ao XL' },
      { label: 'Cuidados', value: 'Lavagem a 30°C, engomar húmido' },
      { label: 'Cores disponíveis', value: 'Natural, Branco, Terracota, Azul Ceú' },
      { label: 'Fecho', value: 'Zip lateral invisible' },
    ],
  },
  {
    id: 4, name: 'Casaco Lã Merino', category: 'Casacos', tags: ['casacos', 'lã', 'merino'],
    price: 149, originalPrice: 199, badge: '−25%', badgeColor: 'gold',
    rating: 4.9, reviews: 143, stock: 12,
    image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&q=85',
    images: [
      'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&q=85',
      'https://images.unsplash.com/photo-1548126032-079a0fb0099d?w=800&q=85',
    ],
    description: 'Casaco de lã merino com forro interior em seda. Estrutura clássica com corte contemporâneo — quente, elegante e durável. A peça de investimento por excelência.',
    specs: [
      { label: 'Material exterior', value: '100% Lã Merino (RWS Certificada)' },
      { label: 'Forro', value: '100% Seda natural' },
      { label: 'Corte', value: 'Classic fit, ombros estruturados' },
      { label: 'Tamanhos', value: 'XS ao XXL' },
      { label: 'Cuidados', value: 'Lavagem a seco ou à mão a 20°C' },
      { label: 'Cores disponíveis', value: 'Camel, Cinzento, Preto, Castanho' },
    ],
  },
  {
    id: 5, name: 'Sapatilhas Classic White', category: 'Calçado', tags: ['calçado', 'sapatilhas', 'classic'],
    price: 99, originalPrice: 129, badge: '−23%', badgeColor: 'gold',
    rating: 4.8, reviews: 312, stock: 29,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=85',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=85',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=85',
    ],
    description: 'Sapatilhas de couro genuíno com sola de borracha vulcanizada. O clássico atemporal que combina com tudo — do casual ao smart casual.',
    specs: [
      { label: 'Material', value: 'Couro genuíno bovino' },
      { label: 'Sola', value: 'Borracha vulcanizada' },
      { label: 'Palmilha', value: 'Espuma de memória removível' },
      { label: 'Tamanhos', value: '36 ao 46' },
      { label: 'Cuidados', value: 'Limpar com pano húmido, usar creme de couro' },
      { label: 'Cores', value: 'Branco, Branco/Bege, Preto' },
    ],
  },
  {
    id: 6, name: 'Camisa Oxford Premium', category: 'Camisas', tags: ['camisas', 'oxford', 'algodão'],
    price: 59, originalPrice: 79, badge: '−25%', badgeColor: 'gold',
    rating: 4.7, reviews: 189, stock: 41,
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=85',
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=85',
      'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800&q=85',
    ],
    description: 'Camisa Oxford em algodão de dupla torção. Tecido resistente com toque suave — ideal do escritório ao fim-de-semana. Colarinho button-down e punhos com botão duplo.',
    specs: [
      { label: 'Material', value: '100% Algodão Oxford dupla torção' },
      { label: 'Corte', value: 'Regular fit, levemente slim' },
      { label: 'Tamanhos', value: 'XS ao XXL (por colarinho: 38–45)' },
      { label: 'Cuidados', value: 'Lavagem a 40°C, engomar a vapor' },
      { label: 'Cores disponíveis', value: 'Branco, Azul Claro, Rosa, Listado' },
      { label: 'Detalhe', value: 'Colarinho button-down, bolso no peito' },
    ],
  },
  {
    id: 7, name: 'Jeans Straight Leg', category: 'Calças', tags: ['calças', 'jeans', 'denim'],
    price: 89, originalPrice: 109, badge: 'Popular', badgeColor: 'bordo',
    rating: 4.6, reviews: 276, stock: 38,
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=85',
    images: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=85',
      'https://images.unsplash.com/photo-1475178626620-a4d074967452?w=800&q=85',
    ],
    description: 'Jeans de corte reto em denim selvedge japonês de 12 oz. Desbota de forma natural com o uso, tornando-se cada vez mais pessoal. Uma peça para a vida.',
    specs: [
      { label: 'Material', value: 'Denim Selvedge 12oz (Japão)' },
      { label: 'Corte', value: 'Straight leg, cintura alta' },
      { label: 'Tamanhos', value: '26 ao 38 (cintura) × 28/30/32/34 (comprimento)' },
      { label: 'Lavagem', value: 'Cru (não lavado) ou Stone-washed' },
      { label: 'Cuidados', value: 'Lavar raramente, preferencialmente à mão a frio' },
      { label: 'Detalhe', value: 'Fio selvedge visível no dobra' },
    ],
  },
  {
    id: 8, name: 'Blazer Estruturado', category: 'Casacos', tags: ['casacos', 'blazer', 'formal'],
    price: 129, originalPrice: 169, badge: '−24%', badgeColor: 'gold',
    rating: 4.8, reviews: 91, stock: 15,
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=85',
    images: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=85',
      'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=800&q=85',
    ],
    description: 'Blazer de estrutura clássica em mistura de lã e poliéster reciclado. Ombros levemente padded, forro em Tencel. Do formal ao casual com a mesma elegância.',
    specs: [
      { label: 'Material', value: '60% Lã, 40% Poliéster Reciclado' },
      { label: 'Forro', value: '100% Tencel™' },
      { label: 'Corte', value: 'Slim fit, dois botões' },
      { label: 'Tamanhos', value: 'XS ao XXL' },
      { label: 'Cuidados', value: 'Lavagem a seco recomendada' },
      { label: 'Cores disponíveis', value: 'Navy, Cinzento Antracite, Bege, Preto' },
    ],
  },
  {
    id: 9, name: 'Vestido Floral Verão', category: 'Vestidos', tags: ['vestidos', 'floral', 'verão'],
    price: 69, originalPrice: 89, badge: '−22%', badgeColor: 'gold',
    rating: 4.7, reviews: 154, stock: 22,
    image: 'https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=800&q=85',
    images: [
      'https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=800&q=85',
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=85',
    ],
    description: 'Vestido de verão em viscose de bambu com estampa floral exclusiva. Fluido, fresco e confortável — perfeito para os dias mais quentes do ano.',
    specs: [
      { label: 'Material', value: '100% Viscose de Bambu' },
      { label: 'Comprimento', value: 'Midi (ao joelho)' },
      { label: 'Tamanhos', value: 'XS ao XL' },
      { label: 'Cuidados', value: 'Lavagem a 30°C, secar à sombra' },
      { label: 'Estampa', value: 'Floral exclusiva, impressão digital' },
      { label: 'Fecho', value: 'Sem fecho, elástico na cintura' },
    ],
  },
  {
    id: 10, name: 'Ténis Minimalistas', category: 'Calçado', tags: ['calçado', 'ténis', 'minimalista'],
    price: 129, originalPrice: 169, badge: 'Novo', badgeColor: 'bordo',
    rating: 4.8, reviews: 87, stock: 20,
    image: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800&q=85',
    images: [
      'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800&q=85',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=85',
    ],
    description: 'Ténis de design minimalista em pele nappa italiana. Sola de borracha natural, palmilha em couro. O equilíbrio perfeito entre sofisticação e conforto urbano.',
    specs: [
      { label: 'Material', value: 'Pele Nappa Italiana' },
      { label: 'Sola', value: 'Borracha natural vulcanizada' },
      { label: 'Palmilha', value: 'Couro natural, amovível' },
      { label: 'Tamanhos', value: '36 ao 46' },
      { label: 'Cuidados', value: 'Limpar com crème de pele, guardar com forma' },
      { label: 'Cores', value: 'Branco Puro, Preto, Bege Arena' },
    ],
  },
  {
    id: 11, name: 'Fato de Treino Completo', category: 'Desporto', tags: ['desporto', 'treino', 'conjunto'],
    price: 99, originalPrice: 129, badge: '−23%', badgeColor: 'gold',
    rating: 4.6, reviews: 203, stock: 35,
    image: 'https://images.unsplash.com/photo-1556906781-9a412961a28c?w=800&q=85',
    images: [
      'https://images.unsplash.com/photo-1556906781-9a412961a28c?w=800&q=85',
      'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=800&q=85',
    ],
    description: 'Conjunto de treino em French Terry de algodão orgânico. Camisola com capuz e calças de cordão — conforto técnico com estética lifestyle.',
    specs: [
      { label: 'Material', value: '85% Algodão Orgânico, 15% Elastano' },
      { label: 'Inclui', value: 'Camisola com capuz + Calças' },
      { label: 'Tamanhos', value: 'XS ao XXL' },
      { label: 'Cuidados', value: 'Lavagem a 40°C, não secar em máquina' },
      { label: 'Cores disponíveis', value: 'Cinzento Mesclado, Preto, Navy, Bordeaux' },
      { label: 'Detalhe', value: 'Bolsos laterais, cordão ajustável' },
    ],
  },
  {
    id: 12, name: 'Carteira Pele Slim', category: 'Acessórios', tags: ['acessórios', 'carteira', 'pele'],
    price: 49, originalPrice: 69, badge: '−29%', badgeColor: 'gold',
    rating: 4.7, reviews: 118, stock: 44,
    image: 'https://images.unsplash.com/photo-1627123424574-724758594913?w=800&q=85',
    images: [
      'https://images.unsplash.com/photo-1627123424574-724758594913?w=800&q=85',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=85',
    ],
    description: 'Carteira slim em couro de grão pleno curtido ao vegetal. Minimalista e durável — melhora com o tempo e o uso. Encaixe para 6 cartões e bilhetes.',
    specs: [
      { label: 'Material', value: 'Couro Grão Pleno (Curtimento Vegetal)' },
      { label: 'Capacidade', value: '6 cartões + notas dobradas' },
      { label: 'Dimensões', value: '9 × 11 cm (fechada)' },
      { label: 'Espessura', value: '6 mm (sem cartões)' },
      { label: 'Cores', value: 'Castanho Cognac, Preto, Conhaque, Verde' },
      { label: 'Detalhe', value: 'Costura à mão, bordas enceradas' },
    ],
  },
  {
    id: 13, name: 'Cachecol Cashmere', category: 'Acessórios', tags: ['acessórios', 'cachecol', 'cashmere'],
    price: 79, originalPrice: 109, badge: '−28%', badgeColor: 'gold',
    rating: 4.9, reviews: 76, stock: 19,
    image: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=800&q=85',
    images: [
      'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=800&q=85',
    ],
    description: 'Cachecol em cashmere de grau A da Mongólia Interior. Incrivelmente suave e leve, quente sem ser pesado. O acessório de inverno definitivo.',
    specs: [
      { label: 'Material', value: '100% Cashmere Grau A (Mongólia)' },
      { label: 'Dimensões', value: '180 × 30 cm' },
      { label: 'Peso', value: '180g' },
      { label: 'Cuidados', value: 'Lavagem à mão a 20°C, secar na horizontal' },
      { label: 'Cores disponíveis', value: 'Camel, Cinzento, Marfim, Preto, Bordeaux' },
      { label: 'Acabamento', value: 'Franjas tecidas à mão' },
    ],
  },
  {
    id: 14, name: 'Polo Piqué Premium', category: 'Tops', tags: ['tops', 'polo', 'piqué'],
    price: 65, originalPrice: 85, badge: '−24%', badgeColor: 'gold',
    rating: 4.7, reviews: 142, stock: 27,
    image: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=800&q=85',
    images: [
      'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=800&q=85',
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=85',
    ],
    description: 'Polo em piqué de algodão egípcio. Textura clássica, toque excepcional e durabilidade superior. Do campo de ténis ao jantar casual — sempre impecável.',
    specs: [
      { label: 'Material', value: '100% Algodão Egípcio Piqué' },
      { label: 'Corte', value: 'Regular fit, levemente estruturado' },
      { label: 'Tamanhos', value: 'XS ao XXL' },
      { label: 'Cuidados', value: 'Lavagem a 40°C, não usar branqueador' },
      { label: 'Cores disponíveis', value: 'Branco, Navy, Bordeaux, Verde Inglês, Preto' },
      { label: 'Detalhe', value: 'Colarinho com 2 botões, punhos canelados' },
    ],
  },
  {
    id: 15, name: 'Saia Plissada Midi', category: 'Saias', tags: ['saias', 'plissada', 'midi'],
    price: 75, originalPrice: 95, badge: 'Novo', badgeColor: 'bordo',
    rating: 4.8, reviews: 93, stock: 16,
    image: 'https://images.unsplash.com/photo-1583496661160-fb5218b5f3bb?w=800&q=85',
    images: [
      'https://images.unsplash.com/photo-1583496661160-fb5218b5f3bb?w=800&q=85',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=85',
    ],
    description: 'Saia plissada midi em cetim de seda. Movimento fluido e elegante com cada passo. Elástico confortável na cintura — do dia à noite com um simples cambio de top.',
    specs: [
      { label: 'Material', value: '100% Seda Cetim' },
      { label: 'Comprimento', value: 'Midi (abaixo do joelho)' },
      { label: 'Tamanhos', value: 'XS ao XL' },
      { label: 'Cuidados', value: 'Lavagem à mão a 20°C, engomar pelo avesso' },
      { label: 'Cores disponíveis', value: 'Champagne, Preto, Rosa Pó, Verde Esmeralda' },
      { label: 'Detalhe', value: 'Pregas permanentes, elástico na cintura' },
    ],
  },
]

const CATEGORIES_LIST = ['Todos', 'Tops', 'Calças', 'Vestidos', 'Casacos', 'Calçado', 'Camisas', 'Acessórios', 'Desporto', 'Saias']

const NAV_LINKS: { label: string; page: Page; filter?: string }[] = [
  { label: 'Início', page: 'home' },
  { label: 'Loja', page: 'shop' },
  { label: 'Personalizada', page: 'custom' },
  { label: 'Blog', page: 'blog' },
  { label: 'Contacto', page: 'contact' },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return n.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 })
}

function Stars({ rating, size = 11 }: { rating: number; size?: number }) {
  return (
    <span className="kn-stars">
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} width={size} height={size} viewBox="0 0 12 12" fill={i <= Math.round(rating) ? 'var(--gold)' : 'var(--bg-3)'}>
          <path d="M6 1l1.3 3h3.2l-2.6 1.9.9 3.1L6 7.3l-2.8 1.7.9-3.1L1.5 4H4.7z" />
        </svg>
      ))}
    </span>
  )
}

function Eyebrow({ text }: { text: string }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, fontFamily: 'var(--f-sans)', fontSize: 11, letterSpacing: '.28em', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 500 }}>
      <span style={{ width: 28, height: 1, background: 'linear-gradient(90deg,transparent,var(--gold))', flexShrink: 0 }} />
      {text}
    </div>
  )
}

function SectionHead({ eyebrow, title, lead, cta }: { eyebrow: string; title: string; lead?: string; cta?: ReactNode }) {
  return (
    <div className="kn-section-head">
      <div>
        <Eyebrow text={eyebrow} />
        <h2 style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(30px,3.5vw,52px)', fontWeight: 500, margin: '16px 0 0', lineHeight: 1.08 }} dangerouslySetInnerHTML={{ __html: title }} />
      </div>
      {(lead || cta) && (
        <div style={{ paddingBottom: 6 }}>
          {lead && <p style={{ color: 'var(--fg-dim)', fontSize: 'clamp(15px,1.1vw,17px)', maxWidth: '46ch', lineHeight: 1.65 }}>{lead}</p>}
          {cta && <div style={{ marginTop: 28 }}>{cta}</div>}
        </div>
      )}
    </div>
  )
}

function GhostBtn({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  const [hov, setHov] = useState(false)
  return (
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '12px 22px', background: 'transparent', border: `1px solid ${hov ? 'var(--gold)' : 'var(--gold-3)'}`, color: hov ? 'var(--fg)' : 'var(--gold-2)', fontFamily: 'var(--f-sans)', fontSize: 11, letterSpacing: '.22em', textTransform: 'uppercase', fontWeight: 500, transition: 'all .2s ease' }}>
      {children}
      <svg width="12" height="8" viewBox="0 0 14 10" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 5h12M9 1l4 4-4 4" /></svg>
    </button>
  )
}

function PrimaryBtn({ children, onClick, full }: { children: ReactNode; onClick?: () => void; full?: boolean }) {
  const [hov, setHov] = useState(false)
  return (
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '14px 28px', background: hov ? 'var(--bordo-2)' : 'var(--bordo)', border: 'none', color: '#F5F2ED', fontFamily: 'var(--f-sans)', fontSize: 12, letterSpacing: '.24em', textTransform: 'uppercase', fontWeight: 500, transition: 'background .2s ease', width: full ? '100%' : 'auto' }}>
      {children}
      <svg width="13" height="9" viewBox="0 0 14 10" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 5h12M9 1l4 4-4 4" /></svg>
    </button>
  )
}

// ─── ProductCard ─────────────────────────────────────────────────────────────

function ProductCard({ p, onAdd, onOpen, wishlist, toggleWish }: {
  p: Product
  onAdd: (p: Product) => void
  onOpen: (p: Product) => void
  wishlist: Set<number>
  toggleWish: (id: number) => void
}) {
  const [hov, setHov] = useState(false)
  const disc = p.originalPrice ? Math.round((1 - p.price / p.originalPrice) * 100) : 0

  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: 'var(--bg-1)', border: `1px solid ${hov ? 'var(--gold-3)' : 'var(--border)'}`, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', transition: 'border-color .3s, transform .3s, box-shadow .3s', transform: hov ? 'translateY(-4px)' : 'none', boxShadow: hov ? '0 16px 48px rgba(0,0,0,.45)' : 'none', cursor: 'pointer' }}
    >
      {/* Badge */}
      {p.badge && (
        <div style={{ position: 'absolute', top: 14, left: 14, zIndex: 3, padding: '4px 10px', fontSize: 10, fontWeight: 700, letterSpacing: '.16em', textTransform: 'uppercase' }} className={p.badgeColor === 'bordo' ? 'kn-badge-bordo' : 'kn-badge-gold'}>
          {p.badge}
        </div>
      )}

      {/* Wishlist */}
      <button onClick={e => { e.stopPropagation(); toggleWish(p.id) }}
        style={{ position: 'absolute', top: 12, right: 12, zIndex: 3, width: 32, height: 32, background: 'rgba(11,11,12,.7)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" stroke={wishlist.has(p.id) ? 'var(--bordo)' : 'var(--fg-mute)'} strokeWidth="2" className={`kn-heart${wishlist.has(p.id) ? ' active' : ''}`} fill={wishlist.has(p.id) ? 'var(--bordo)' : 'none'}>
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </button>

      {/* Image */}
      <div style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden', background: 'var(--bg-2)' }} onClick={() => onOpen(p)}>
        <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .7s ease', transform: hov ? 'scale(1.06)' : 'scale(1)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(11,11,12,.52)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: hov ? 1 : 0, transition: 'opacity .3s ease', zIndex: 2 }}>
          <button onClick={e => { e.stopPropagation(); onOpen(p) }}
            style={{ padding: '10px 20px', background: 'var(--bg-1)', border: '1px solid var(--gold-3)', color: 'var(--fg)', fontFamily: 'var(--f-sans)', fontSize: 10, letterSpacing: '.2em', textTransform: 'uppercase', fontWeight: 500 }}>
            Ver produto
          </button>
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: '18px 18px 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: 7 }}>
        <div style={{ fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 500 }}>{p.category}</div>
        <div style={{ fontFamily: 'var(--f-display)', fontSize: 17, fontWeight: 500, color: 'var(--fg)', lineHeight: 1.25, cursor: 'pointer' }} onClick={() => onOpen(p)}>{p.name}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Stars rating={p.rating} />
          <span style={{ fontSize: 11, color: 'var(--fg-mute)' }}>({p.reviews})</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 4 }}>
          <span style={{ fontFamily: 'var(--f-display)', fontSize: 21, fontWeight: 600 }}>{fmt(p.price)}</span>
          {p.originalPrice && <span style={{ fontSize: 12, color: 'var(--fg-mute)', textDecoration: 'line-through' }}>{fmt(p.originalPrice)}</span>}
          {disc > 0 && <span style={{ fontSize: 11, color: 'var(--gold)', fontWeight: 600 }}>−{disc}%</span>}
        </div>
      </div>

      {/* Add to cart */}
      <button onClick={() => onAdd(p)}
        onMouseEnter={e => (e.currentTarget.style.background = 'var(--bordo-2)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'var(--bg-3)')}
        style={{ margin: '0 18px 18px', padding: '11px', background: 'var(--bg-3)', border: '1px solid var(--border)', color: 'var(--fg)', fontFamily: 'var(--f-sans)', fontSize: 10, letterSpacing: '.2em', textTransform: 'uppercase', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'background .2s ease' }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L4 7v13h16V7L18 2Z" /><path d="M8 10c0 2 1.8 4 4 4s4-2 4-4" /></svg>
        Adicionar ao carrinho
      </button>

      {/* Bottom hover accent */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: 'var(--bordo)', transform: hov ? 'scaleX(1)' : 'scaleX(0)', transformOrigin: 'left', transition: 'transform .4s ease' }} />
    </div>
  )
}

// ─── ProductCarousel ──────────────────────────────────────────────────────────

function NavArrow({ dir, disabled, onClick }: { dir: 'prev' | 'next'; disabled: boolean; onClick: () => void }) {
  const [hov, setHov] = useState(false)
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ width: 46, height: 46, border: `1px solid ${hov && !disabled ? 'var(--gold)' : 'var(--border)'}`, background: 'transparent', color: disabled ? 'var(--bg-3)' : hov ? 'var(--gold)' : 'var(--fg-mute)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: disabled ? .35 : 1, transition: 'all .2s ease' }}>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        {dir === 'prev' ? <path d="M15 18l-6-6 6-6" /> : <path d="M9 18l6-6-6-6" />}
      </svg>
    </button>
  )
}

function ProductCarousel({ eyebrow, title, products, onAdd, onOpen, wishlist, toggleWish }: {
  eyebrow: string; title: string; products: Product[]
  onAdd: (p: Product) => void; onOpen: (p: Product) => void
  wishlist: Set<number>; toggleWish: (id: number) => void
}) {
  const [idx, setIdx] = useState(0)
  const hoverRef = useRef(false)
  const timerRef = useRef<number | null>(null)
  const VISIBLE = 4
  const max = Math.max(0, products.length - VISIBLE)

  const next = useCallback(() => setIdx(p => Math.min(p + 1, max)), [max])
  const prev = useCallback(() => setIdx(p => Math.max(p - 1, 0)), [])

  useEffect(() => {
    timerRef.current = window.setInterval(() => {
      if (!hoverRef.current) setIdx(p => p >= max ? 0 : p + 1)
    }, 4000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [max])

  const cardW = `calc((100% - ${(VISIBLE - 1) * 20}px) / ${VISIBLE})`

  return (
    <section style={{ padding: 'clamp(64px,8vw,110px) 0', borderTop: '1px solid var(--border)' }}>
      <div className="wrap">
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 44, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <Eyebrow text={eyebrow} />
            <h2 style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(30px,3.5vw,52px)', fontWeight: 500, margin: '14px 0 0', lineHeight: 1.08 }} dangerouslySetInnerHTML={{ __html: title }} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <NavArrow dir="prev" disabled={idx === 0} onClick={prev} />
            <NavArrow dir="next" disabled={idx >= max} onClick={next} />
          </div>
        </div>

        <div style={{ overflow: 'hidden' }} onMouseEnter={() => { hoverRef.current = true }} onMouseLeave={() => { hoverRef.current = false }}>
          <div style={{ display: 'flex', gap: 20, transition: 'transform .6s cubic-bezier(.25,.1,.25,1)', transform: `translateX(calc(-${idx} * (${cardW} + 20px)))` }}>
            {products.map(p => (
              <div key={p.id} style={{ width: cardW, flexShrink: 0 }}>
                <ProductCard p={p} onAdd={onAdd} onOpen={onOpen} wishlist={wishlist} toggleWish={toggleWish} />
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 28 }}>
          {Array.from({ length: max + 1 }).map((_, i) => (
            <button key={i} onClick={() => setIdx(i)}
              style={{ width: i === idx ? 28 : 8, height: 8, background: i === idx ? 'var(--gold)' : 'var(--bg-3)', border: 'none', borderRadius: 4, padding: 0, transition: 'all .35s ease' }} />
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── CartDrawer ───────────────────────────────────────────────────────────────

function CartDrawer({ open, onClose, items, updateQty, remove }: {
  open: boolean; onClose: () => void; items: CartItem[]
  updateQty: (id: number, qty: number) => void; remove: (id: number) => void
}) {
  const total = items.reduce((s, i) => s + i.price * i.qty, 0)
  const [loading, setLoading] = React.useState(false)

  async function handleCheckout() {
    setLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, origin: window.location.origin }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else alert('Erro ao iniciar pagamento. Tente novamente.')
    } catch {
      alert('Erro ao iniciar pagamento. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className={`cart-overlay ${open ? 'open' : ''}`} onClick={onClose} />
      <div className={`cart-drawer ${open ? 'open' : ''}`}>
        <div style={{ padding: '22px 26px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <Eyebrow text="Carrinho" />
            <div style={{ fontFamily: 'var(--f-display)', fontSize: 24, fontWeight: 500, marginTop: 8 }}>
              {items.length} {items.length === 1 ? 'artigo' : 'artigos'}
            </div>
          </div>
          <button onClick={onClose} style={{ width: 38, height: 38, border: '1px solid var(--border)', background: 'transparent', color: 'var(--fg-mute)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '18px 26px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--fg-mute)' }}>
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" style={{ margin: '0 auto 16px', opacity: .4 }}>
                <path d="M6 2L4 7v13h16V7L18 2Z" /><path d="M8 10c0 2 1.8 4 4 4s4-2 4-4" />
              </svg>
              <div style={{ fontFamily: 'var(--f-display)', fontSize: 20 }}>Carrinho vazio</div>
              <div style={{ fontSize: 13, marginTop: 8 }}>Adicione produtos para continuar.</div>
            </div>
          ) : items.map(item => (
            <div key={item.id} style={{ display: 'flex', gap: 12, paddingBottom: 14, borderBottom: '1px solid var(--border)' }}>
              <img src={item.image} alt={item.name} style={{ width: 68, height: 68, objectFit: 'cover', background: 'var(--bg-2)', flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--f-display)', fontSize: 15, fontWeight: 500, lineHeight: 1.3 }}>{item.name}</div>
                <div style={{ fontSize: 10, color: 'var(--gold)', letterSpacing: '.16em', textTransform: 'uppercase', marginTop: 3 }}>{item.category}</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                  <div className="kn-qty">
                    <button onClick={() => item.qty === 1 ? remove(item.id) : updateQty(item.id, item.qty - 1)}>−</button>
                    <span>{item.qty}</span>
                    <button onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
                  </div>
                  <span style={{ fontFamily: 'var(--f-display)', fontSize: 18, fontWeight: 600 }}>{fmt(item.price * item.qty)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {items.length > 0 && (
          <div style={{ padding: '20px 26px', borderTop: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--fg-mute)' }}>Subtotal</span>
              <span style={{ fontFamily: 'var(--f-display)', fontSize: 26, fontWeight: 600 }}>{fmt(total)}</span>
            </div>
            <PrimaryBtn full onClick={handleCheckout} disabled={loading}>
              {loading ? 'A processar...' : 'Finalizar Compra'}
            </PrimaryBtn>
            <p style={{ fontSize: 11, color: 'var(--fg-mute)', textAlign: 'center', letterSpacing: '.06em', marginTop: 12 }}>
              Envio grátis a partir de 150€ · Devolução em 30 dias
            </p>
          </div>
        )}
      </div>
    </>
  )
}

// ─── Header ───────────────────────────────────────────────────────────────────

function HeaderNavLink({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  const [hov, setHov] = useState(false)
  return (
    <a href="#" onClick={e => { e.preventDefault(); onClick() }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ fontFamily: 'var(--f-sans)', fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase', color: active ? 'var(--gold)' : hov ? 'var(--fg)' : 'var(--fg-mute)', fontWeight: 400, padding: '4px 0', position: 'relative', transition: 'color .2s ease' }}>
      {label}
      {active && <span style={{ position: 'absolute', bottom: -2, left: 0, right: 0, height: 1, background: 'var(--gold)' }} />}
    </a>
  )
}

function Header({ activePage, shopFilter, navigate, cartCount, openCart }: {
  activePage: Page; shopFilter: string; navigate: (page: Page, filter?: string) => void; cartCount: number; openCart: () => void
}) {
  const [scrolled, setScrolled] = useState(false)
  const [navOpen, setNavOpen] = useState(false)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])

  return (
    <>
      {/* Announcement */}
      <div style={{ background: 'var(--bordo)', padding: '9px 20px', textAlign: 'center', fontFamily: 'var(--f-sans)', fontSize: 12, letterSpacing: '.16em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
        <span style={{ color: 'rgba(245,242,237,.7)' }}>🚚</span>
        <span style={{ color: '#F5F2ED' }}>Envio grátis a partir de <b>150€</b> · Portugal Continental</span>
        <span style={{ color: 'var(--gold-2)' }}>·</span>
        <span style={{ color: 'var(--gold-2)' }}>Até 24 meses sem juros · MBWay</span>
      </div>

      {/* Header bar */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, padding: `${scrolled ? 11 : 17}px var(--pad-x)`, background: scrolled ? 'rgba(11,11,12,.96)' : 'rgba(11,11,12,.72)', backdropFilter: 'blur(16px)', borderBottom: `1px solid ${scrolled ? 'var(--border)' : 'transparent'}`, display: 'flex', alignItems: 'center', gap: 28, transition: 'all .3s ease' }}>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 11, cursor: 'pointer', flexShrink: 0 }} onClick={() => navigate('home')}>
          <svg viewBox="0 0 40 40" fill="none" style={{ width: 34, height: 34 }}>
            <path d="M20 3L34 8V21C34 29 27.5 34.5 20 37C12.5 34.5 6 29 6 21V8Z" stroke="#B08D57" strokeWidth="1.2" fill="rgba(139,30,45,0.4)" />
            <line x1="20" y1="9" x2="20" y2="30" stroke="#B08D57" strokeWidth="1.2" />
            <line x1="15.5" y1="14" x2="24.5" y2="14" stroke="#B08D57" strokeWidth="1.2" />
          </svg>
          <span style={{ fontFamily: 'var(--f-display)', fontSize: 20, letterSpacing: '.14em', textTransform: 'uppercase', fontWeight: 500 }}>
            Karmic<span style={{ color: 'var(--gold)' }}>·</span>Node
          </span>
        </div>

        {/* Desktop nav */}
        <nav className="kn-header-nav">
          {NAV_LINKS.map(({ label, page, filter }) => {
            const active = page === 'shop'
              ? activePage === 'shop' && (filter ? shopFilter === filter : shopFilter === 'Todos')
              : activePage === page
            return (
              <HeaderNavLink key={label} label={label} active={active}
                onClick={() => navigate(page, filter)} />
            )
          })}
        </nav>

        {/* Right actions */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          <IconBtn onClick={() => navigate('contact')}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
          </IconBtn>

          <button onClick={openCart}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--bordo-2)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--bordo)')}
            style={{ padding: '9px 16px', background: 'var(--bordo)', border: 'none', color: '#F5F2ED', fontFamily: 'var(--f-sans)', fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 7, transition: 'background .2s ease', flexShrink: 0 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L4 7v13h16V7L18 2Z" /><path d="M8 10c0 2 1.8 4 4 4s4-2 4-4" /></svg>
            <span>Carrinho</span>
            {cartCount > 0 && (
              <span style={{ background: 'var(--gold)', color: '#0B0B0C', width: 17, height: 17, borderRadius: '50%', fontSize: 9, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{cartCount}</span>
            )}
          </button>

          {/* Mobile hamburger */}
          <button onClick={() => setNavOpen(v => !v)} className="kn-mobile-toggle"
            style={{ width: 38, height: 38, border: '1px solid var(--border)', background: 'transparent', color: 'var(--fg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
            <span style={{ width: 16, height: 1, background: 'currentColor', display: 'block', transition: 'transform .3s ease', transform: navOpen ? 'rotate(45deg) translate(4px, 4px)' : 'none' }} />
            <span style={{ width: 16, height: 1, background: 'currentColor', display: 'block', opacity: navOpen ? 0 : 1, transition: 'opacity .2s ease' }} />
            <span style={{ width: 16, height: 1, background: 'currentColor', display: 'block', transition: 'transform .3s ease', transform: navOpen ? 'rotate(-45deg) translate(4px, -4px)' : 'none' }} />
          </button>
        </div>
      </header>

      {/* Mobile nav */}
      <nav className={`kn-nav-mobile ${navOpen ? 'open' : ''}`}>
        {NAV_LINKS.map(({ label, page, filter }) => (
          <a key={label} href="#" onClick={e => { e.preventDefault(); navigate(page, filter); setNavOpen(false) }}
            style={{ fontFamily: 'var(--f-display)', fontSize: 28, fontWeight: 500, color: 'var(--fg)', letterSpacing: '.04em' }}>
            {label}
          </a>
        ))}
        <div style={{ marginTop: 16, paddingTop: 24, borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <a href="#" onClick={e => { e.preventDefault(); navigate('about'); setNavOpen(false) }} style={{ fontSize: 14, color: 'var(--fg-mute)', letterSpacing: '.14em', textTransform: 'uppercase' }}>Quem Somos</a>
          <a href="#" onClick={e => { e.preventDefault(); navigate('contact'); setNavOpen(false) }} style={{ fontSize: 14, color: 'var(--fg-mute)', letterSpacing: '.14em', textTransform: 'uppercase' }}>Contacto</a>
          <a href="#" onClick={e => { e.preventDefault(); navigate('custom'); setNavOpen(false) }} style={{ fontSize: 14, color: 'var(--gold)', letterSpacing: '.14em', textTransform: 'uppercase', fontWeight: 600 }}>✦ Personalizada</a>
        </div>
      </nav>
    </>
  )
}

function IconBtn({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  const [hov, setHov] = useState(false)
  return (
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ width: 38, height: 38, border: `1px solid ${hov ? 'var(--gold)' : 'var(--border)'}`, background: 'transparent', color: hov ? 'var(--gold)' : 'var(--fg-mute)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .2s ease' }}>
      {children}
    </button>
  )
}

// ─── HomePage ─────────────────────────────────────────────────────────────────

function HomeCatCard({ cat, onClick }: { cat: { name: string; count: number; icon: ReactNode }; onClick: () => void }) {
  const [hov, setHov] = useState(false)
  return (
    <a href="#" onClick={e => { e.preventDefault(); onClick() }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '28px 16px', border: `1px solid ${hov ? 'var(--gold-3)' : 'var(--border)'}`, background: hov ? 'var(--bg-1)' : 'transparent', textAlign: 'center', transition: 'all .3s ease', transform: hov ? 'translateY(-2px)' : 'none' }}>
      <div style={{ color: hov ? 'var(--gold)' : 'var(--fg-mute)', transition: 'color .3s ease' }}>{cat.icon}</div>
      <div>
        <div style={{ fontFamily: 'var(--f-display)', fontSize: 16, fontWeight: 500 }}>{cat.name}</div>
        <div style={{ fontSize: 10, letterSpacing: '.14em', color: 'var(--fg-mute)', marginTop: 3 }}>{cat.count} artigos</div>
      </div>
    </a>
  )
}

function HomeTesti({ t }: { t: { q: string; name: string; role: string; rating: number } }) {
  const [hov, setHov] = useState(false)
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ padding: '36px 30px', border: `1px solid ${hov ? 'var(--gold-3)' : 'var(--border)'}`, background: 'var(--bg)', display: 'flex', flexDirection: 'column', transition: 'border-color .3s, transform .3s', transform: hov ? 'translateY(-4px)' : 'none' }}>
      <div style={{ fontFamily: 'var(--f-display)', fontSize: 60, lineHeight: 1, color: 'var(--gold)', opacity: .3, marginBottom: -12 }}>"</div>
      <div style={{ fontFamily: 'var(--f-display)', fontSize: 17, fontStyle: 'italic', lineHeight: 1.55, flex: 1 }}>{t.q}</div>
      <div style={{ marginTop: 24, paddingTop: 18, borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--gold)', flexShrink: 0 }} />
        <div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>{t.name}</div>
          <div style={{ fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--fg-mute)', marginTop: 2 }}>{t.role}</div>
        </div>
        <div style={{ marginLeft: 'auto' }}><Stars rating={t.rating} /></div>
      </div>
    </div>
  )
}

function HomePage({ onAdd, onOpen, wishlist, toggleWish, setPage, products }: {
  onAdd: (p: Product) => void; onOpen: (p: Product) => void
  wishlist: Set<number>; toggleWish: (id: number) => void
  setPage: (p: Page) => void; products: Product[]
}) {
  const CATS = [
    { name: 'Tops', count: 38, icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z" /></svg> },
    { name: 'Calças', count: 24, icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M6 2h12l2 6-4 14H8L4 8z" /><path d="M8 8h8M12 8v12" /></svg> },
    { name: 'Vestidos', count: 19, icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M12 2c0 0-3 4-6 5l2 15h8l2-15c-3-1-6-5-6-5z" /></svg> },
    { name: 'Casacos', count: 16, icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M3 6l3-3 6 3 6-3 3 3v14H3z" /><path d="M12 6v15" /></svg> },
    { name: 'Calçado', count: 22, icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M3 18h18v2H3zM3 14c0-4 3-8 6-9l4 5 5-1 3 4H3z" /></svg> },
    { name: 'Acessórios', count: 41, icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M20 12V6H4v6a8 8 0 0 0 16 0z" /><path d="M12 6V2M8 6V3M16 6V3" /></svg> },
  ]

  const TESTIMONIALS = [
    { q: 'Qualidade excepcional. O casaco de lã merino que comprei é simplesmente perfeito — quente, elegante e já recebi vários elogios. Entrega rápida e embalagem cuidada.', name: 'Mariana Sousa', role: 'Arquiteta', rating: 5 },
    { q: 'Finalmente uma loja com peças que duram. Tenho o blazer há dois anos e continua impecável. O atendimento foi excelente e a devolução do primeiro tamanho, sem complicações.', name: 'João Ferreira', role: 'Consultor de Negócios', rating: 5 },
    { q: 'As sapatilhas classic white são o meu item favorito do guarda-roupa. Couro genuíno, confortáveis desde o primeiro dia. Vou voltar a comprar com certeza.', name: 'Sofia Mendes', role: 'Designer de Moda', rating: 5 },
  ]

  return (
    <>
      {/* HERO */}
      <section style={{ minHeight: '86vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden', background: 'var(--bg-1)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(900px 600px at 72% 50%, rgba(139,30,45,0.24), transparent 65%), radial-gradient(500px 400px at 8% 80%, rgba(176,141,87,0.08), transparent 60%)', zIndex: 0 }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(43,41,38,.35) 1px,transparent 1px),linear-gradient(90deg,rgba(43,41,38,.35) 1px,transparent 1px)', backgroundSize: '80px 80px', maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%,#000 40%,transparent 100%)', zIndex: 0 }} />

        <div className="wrap" style={{ position: 'relative', zIndex: 2, width: '100%', padding: '80px var(--pad-x)' }}>
          <div className="kn-hero-grid">
            <div className="reveal">
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 30, padding: '6px 16px', border: '1px solid var(--gold-3)', color: 'var(--gold)', fontSize: 10, letterSpacing: '.28em', textTransform: 'uppercase', fontWeight: 600 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--gold)', boxShadow: '0 0 10px var(--gold)', animation: 'pulse 2s ease-in-out infinite' }} />
                Loja Online Oficial · Karmic Node
              </div>

              <h1 style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(48px,6.5vw,100px)', fontWeight: 500, lineHeight: 1.05, margin: 0 }}>
                Moda<br />
                com <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>alma</em>.<br />
                <span style={{ color: 'transparent', WebkitTextStroke: '1px rgba(245,242,237,.3)' }}>Estilo</span><br />
                <em style={{ color: 'var(--bordo-3)', fontStyle: 'italic' }}>atemporal</em>.
              </h1>

              <p style={{ fontFamily: 'var(--f-sans)', fontSize: 'clamp(15px,1.2vw,19px)', color: 'var(--fg-dim)', maxWidth: '44ch', marginTop: 26, lineHeight: 1.65 }}>
                Roupa e acessórios selecionados com rigor — materiais premium, design atemporal, entregues em sua casa.
              </p>

              <div style={{ display: 'flex', gap: 14, marginTop: 42, flexWrap: 'wrap' }}>
                <PrimaryBtn onClick={() => setPage('shop')}>Explorar Produtos</PrimaryBtn>
                <GhostBtn onClick={() => setPage('shop')}>Ver Promoções</GhostBtn>
              </div>

              <div style={{ display: 'flex', gap: 40, marginTop: 52, paddingTop: 28, borderTop: '1px solid var(--border)' }}>
                {[['500+', 'Produtos'], ['48h', 'Entrega'], ['100%', 'Garantia']].map(([n, l]) => (
                  <div key={l}>
                    <div style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(28px,3vw,40px)', fontWeight: 500, color: 'var(--gold)', lineHeight: 1 }}>{n}</div>
                    <div style={{ fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--fg-mute)', marginTop: 6 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="kn-hero-right" style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
              <div style={{ position: 'relative', maxWidth: 480, width: '100%' }}>
                <div style={{ position: 'absolute', top: -1, left: -1, width: 20, height: 20, borderTop: '1px solid var(--gold)', borderLeft: '1px solid var(--gold)', zIndex: 3 }} />
                <div style={{ position: 'absolute', top: -1, right: -1, width: 20, height: 20, borderTop: '1px solid var(--gold)', borderRight: '1px solid var(--gold)', zIndex: 3 }} />
                <div style={{ position: 'absolute', bottom: -1, left: -1, width: 20, height: 20, borderBottom: '1px solid var(--gold)', borderLeft: '1px solid var(--gold)', zIndex: 3 }} />
                <div style={{ position: 'absolute', bottom: -1, right: -1, width: 20, height: 20, borderBottom: '1px solid var(--gold)', borderRight: '1px solid var(--gold)', zIndex: 3 }} />
                <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=960&q=85" alt="Moda premium" style={{ width: '100%', display: 'block', filter: 'brightness(.82) saturate(.9)', border: '1px solid var(--border)' }} />
                <div style={{ position: 'absolute', bottom: 22, left: 22, right: 22, background: 'rgba(11,11,12,.88)', backdropFilter: 'blur(12px)', border: '1px solid var(--border)', padding: '15px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 4 }}>Em Destaque</div>
                    <div style={{ fontFamily: 'var(--f-display)', fontSize: 16, fontWeight: 500 }}>Camisola Oversized Premium</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                      <Stars rating={4.9} />
                      <span style={{ fontSize: 10, color: 'var(--fg-mute)' }}>(214 avaliações)</span>
                    </div>
                  </div>
                  <button onClick={() => products[0] && onAdd(products[0])}
                    style={{ padding: '9px 14px', background: 'var(--bordo)', border: 'none', color: '#F5F2ED', fontSize: 10, letterSpacing: '.16em', textTransform: 'uppercase', fontWeight: 500, flexShrink: 0, whiteSpace: 'nowrap' }}>
                    {fmt(49)}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section style={{ padding: 'clamp(52px,6vw,80px) 0', borderBottom: '1px solid var(--border)' }}>
        <div className="wrap">
          <SectionHead eyebrow="Categorias" title="Navegue por <em class='gold-text'>área</em>."
            lead="De tops e calças a casacos e acessórios — temos tudo para o seu guarda-roupa."
            cta={<GhostBtn onClick={() => setPage('shop')}>Ver todas as categorias</GhostBtn>} />
          <div className="kn-cat-grid">
            {CATS.map(cat => (
              <HomeCatCard key={cat.name} cat={cat} onClick={() => setPage('shop')} />
            ))}
          </div>
        </div>
      </section>

      {/* BESTSELLERS CAROUSEL */}
      <ProductCarousel eyebrow="Bestsellers" title="Mais <em class='gold-text'>vendidos</em>." products={products} onAdd={onAdd} onOpen={onOpen} wishlist={wishlist} toggleWish={toggleWish} />

      {/* PROMO BANNER */}
      <section style={{ position: 'relative', overflow: 'hidden', background: `radial-gradient(900px 500px at 25% 50%, rgba(139,30,45,0.45), transparent 65%), var(--bg-2)`, borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: 'clamp(56px,7vw,96px) 0' }}>
        <div className="wrap">
          <div className="kn-promo-grid">
            <div>
              <div style={{ display: 'inline-block', padding: '4px 14px', background: 'var(--bordo)', color: '#F5F2ED', fontSize: 10, letterSpacing: '.28em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 22 }}>Oferta Limitada</div>
              <h2 style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(34px,4vw,64px)', fontWeight: 500, margin: '0 0 22px', lineHeight: 1.05 }}>
                Até <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>30% OFF</em><br />em peças<br />selecionadas.
              </h2>
              <p style={{ color: 'var(--fg-dim)', fontSize: 16, maxWidth: '40ch', lineHeight: 1.65, marginBottom: 34 }}>
                Os preços mais baixos do ano em computadores portáteis e acessórios premium. Oferta válida por tempo limitado.
              </p>
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                <button onClick={() => setPage('shop')} style={{ padding: '13px 28px', background: 'var(--gold)', border: 'none', color: '#0B0B0C', fontFamily: 'var(--f-sans)', fontSize: 11, letterSpacing: '.22em', textTransform: 'uppercase', fontWeight: 700 }}>Ver Promoções</button>
                <GhostBtn onClick={() => setPage('contact')}>Falar com Perito</GhostBtn>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Countdown />
            </div>
          </div>
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section style={{ padding: 'clamp(64px,8vw,110px) 0', borderBottom: '1px solid var(--border)' }}>
        <div className="wrap">
          <SectionHead eyebrow="Novidades" title="Novas <em class='gold-text'>chegadas</em>."
            lead="As peças mais recentes, selecionadas com rigor para o seu guarda-roupa."
            cta={<GhostBtn onClick={() => setPage('shop')}>Ver todas as novidades</GhostBtn>} />
          <div className="kn-products-4">
            {ALL_PRODUCTS.slice(0, 4).map(p => <ProductCard key={p.id} p={p} onAdd={onAdd} onOpen={onOpen} wishlist={wishlist} toggleWish={toggleWish} />)}
          </div>
        </div>
      </section>

      {/* ACCESSORIES CAROUSEL */}
      <ProductCarousel eyebrow="Acessórios" title="Acessórios <em class='gold-text'>essenciais</em>." products={[...products].reverse()} onAdd={onAdd} onOpen={onOpen} wishlist={wishlist} toggleWish={toggleWish} />

      {/* BRAND TICKER */}
      <div style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'var(--bg-1)', overflow: 'hidden', padding: '16px 0' }}>
        <div className="ticker-track">
          {[...Array(2)].flatMap((_, ri) =>
            ['Zara', 'H&M', 'Mango', 'Pull&Bear', 'Massimo Dutti', "Levi's", 'Nike', 'Adidas', 'Stradivarius', 'Reserved', 'COS', 'Arket', 'Weekday', 'Monki', 'Bershka'].map(brand => (
              <div key={`${brand}-${ri}`} style={{ display: 'flex', alignItems: 'center', gap: 24, paddingRight: 40 }}>
                <span style={{ fontFamily: 'var(--f-display)', fontSize: 17, fontStyle: 'italic', color: 'var(--fg-mute)', whiteSpace: 'nowrap', letterSpacing: '.08em' }}>{brand}</span>
                <span style={{ width: 4, height: 4, background: 'var(--gold)', borderRadius: '50%', flexShrink: 0 }} />
              </div>
            ))
          )}
        </div>
      </div>

      {/* TRUST BADGES */}
      <section style={{ padding: 'clamp(48px,5vw,70px) 0', borderBottom: '1px solid var(--border)' }}>
        <div className="wrap">
          <div className="kn-trust-grid" style={{ border: '1px solid var(--border)' }}>
            {[
              { icon: <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><rect x="1" y="3" width="15" height="13" /><path d="M16 8h4l3 3v5h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>, title: 'Envio Rápido', desc: 'Despacho em 24h úteis · CTT / DPD' },
              { icon: <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>, title: 'Devolução 30 Dias', desc: 'Satisfação garantida ou reembolso total' },
              { icon: <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>, title: 'Pagamento Seguro', desc: 'SSL · MB · VISA · PayPal · MBWay' },
              { icon: <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M21 15a2 2 0 0 1-2 2H7l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>, title: 'Suporte Especializado', desc: 'Seg–Sex · 09h–19h · Chat & Email' },
            ].map((b, i) => (
              <div key={b.title} style={{ padding: '32px 24px', borderRight: i < 3 ? '1px solid var(--border)' : 'none', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{ color: 'var(--gold)', flexShrink: 0, marginTop: 2 }}>{b.icon}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg)', marginBottom: 5 }}>{b.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--fg-mute)', lineHeight: 1.5 }}>{b.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: 'clamp(64px,8vw,110px) 0', background: 'var(--bg-1)', borderBottom: '1px solid var(--border)' }}>
        <div className="wrap">
          <SectionHead eyebrow="Avaliações" title="O que dizem os nossos <em class='gold-text'>clientes</em>." lead="Mais de 500 clientes satisfeitos em Portugal. Leia as suas experiências." />
          <div className="kn-tst-grid">
            {TESTIMONIALS.map(t => (
              <HomeTesti key={t.name} t={t} />
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section style={{ padding: 'clamp(64px,7vw,100px) 0', background: `radial-gradient(700px 400px at 50% 0%, rgba(139,30,45,0.28), transparent 70%), var(--bg)`, borderBottom: '1px solid var(--border)', textAlign: 'center' }}>
        <div className="wrap" style={{ maxWidth: 580 }}>
          <Eyebrow text="Newsletter" />
          <h2 style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(30px,3.5vw,50px)', fontWeight: 500, margin: '20px 0 14px', lineHeight: 1.1 }}>
            Fique a par das <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>melhores ofertas</em>.
          </h2>
          <p style={{ color: 'var(--fg-mute)', fontSize: 15, marginBottom: 34 }}>
            Promoções exclusivas, novas coleções e tendências de moda direto no seu email.
          </p>
          <NewsletterForm />
          <p style={{ fontSize: 11, color: 'var(--fg-mute)', marginTop: 14, letterSpacing: '.06em' }}>Sem spam. Pode cancelar a qualquer momento.</p>
        </div>
      </section>
    </>
  )
}

// ─── ShopPage ─────────────────────────────────────────────────────────────────

function ShopPage({ onAdd, onOpen, wishlist, toggleWish, initialCategory, products }: {
  onAdd: (p: Product) => void; onOpen: (p: Product) => void
  wishlist: Set<number>; toggleWish: (id: number) => void
  initialCategory?: string; products: Product[]
}) {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState(
    initialCategory && initialCategory !== 'promo' ? initialCategory : 'Todos'
  )
  const [showPromoOnly, setShowPromoOnly] = useState(initialCategory === 'promo')
  const [sort, setSort] = useState('relevance')
  const [maxPrice, setMaxPrice] = useState(2200)

  const filtered = products
    .filter(p => {
      if (activeCategory !== 'Todos' && p.category !== activeCategory) return false
      if (showPromoOnly && !p.originalPrice) return false
      if (p.price > maxPrice) return false
      if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.category.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
    .sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price
      if (sort === 'price-desc') return b.price - a.price
      if (sort === 'rating') return b.rating - a.rating
      return 0
    })

  return (
    <div style={{ minHeight: '80vh' }}>
      {/* Page hero */}
      <div style={{ background: 'var(--bg-1)', borderBottom: '1px solid var(--border)', padding: '52px var(--pad-x) 36px' }}>
        <div style={{ maxWidth: 'var(--maxw)', margin: '0 auto' }}>
          <div style={{ fontSize: 11, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--fg-mute)', marginBottom: 16 }}>
            Karmic Node · <span style={{ color: 'var(--gold)' }}>Loja</span>
          </div>
          <h1 style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(40px,5vw,72px)', fontWeight: 500, margin: '0 0 20px', lineHeight: 1.05 }}>
            Todos os <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>produtos</em>.
          </h1>

          {/* Search bar */}
          <div style={{ position: 'relative', maxWidth: 480 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--fg-mute)" strokeWidth="2" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
              <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" />
            </svg>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Pesquisar produtos..."
              style={{ width: '100%', background: 'var(--bg-2)', border: '1px solid var(--border)', color: 'var(--fg)', padding: '13px 14px 13px 40px', fontFamily: 'var(--f-sans)', fontSize: 14, outline: 'none', transition: 'border-color .2s' }}
              onFocus={e => (e.currentTarget.style.borderColor = 'var(--gold-3)')}
              onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')} />
          </div>
        </div>
      </div>

      <div className="wrap" style={{ padding: '40px var(--pad-x) 80px' }}>
        <div className="kn-shop-layout">
          {/* Sidebar filters */}
          <aside className="kn-shop-sidebar" style={{ position: 'sticky', top: 100 }}>
            <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: 24, marginBottom: 28 }}>
              <div style={{ fontSize: 11, letterSpacing: '.24em', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 500, marginBottom: 16 }}>Categorias</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {CATEGORIES_LIST.map(cat => (
                  <button key={cat} onClick={() => { setActiveCategory(cat); setShowPromoOnly(false) }}
                    style={{ background: 'none', border: 'none', textAlign: 'left', color: activeCategory === cat && !showPromoOnly ? 'var(--gold)' : 'var(--fg-dim)', fontSize: 14, padding: '5px 0', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontWeight: activeCategory === cat && !showPromoOnly ? 500 : 300, transition: 'color .2s ease' }}>
                    {activeCategory === cat && !showPromoOnly && <span style={{ width: 16, height: 1, background: 'var(--gold)', flexShrink: 0 }} />}
                    {cat}
                    <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--fg-mute)' }}>
                      ({cat === 'Todos' ? products.length : products.filter(p => p.category === cat).length})
                    </span>
                  </button>
                ))}
                <button onClick={() => { setShowPromoOnly(v => !v); setActiveCategory('Todos') }}
                  style={{ background: 'none', border: 'none', textAlign: 'left', color: showPromoOnly ? 'var(--gold)' : 'var(--fg-dim)', fontSize: 14, padding: '5px 0', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontWeight: showPromoOnly ? 500 : 300, transition: 'color .2s ease' }}>
                  {showPromoOnly && <span style={{ width: 16, height: 1, background: 'var(--gold)', flexShrink: 0 }} />}
                  Promoções
                  <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--fg-mute)' }}>
                    ({products.filter(p => p.originalPrice).length})
                  </span>
                </button>
              </div>
            </div>

            <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: 24, marginBottom: 28 }}>
              <div style={{ fontSize: 11, letterSpacing: '.24em', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 500, marginBottom: 16 }}>Preço máximo</div>
              <input type="range" min={50} max={2200} value={maxPrice} onChange={e => setMaxPrice(+e.target.value)} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--fg-mute)', marginTop: 8 }}>
                <span>50€</span><span style={{ color: 'var(--gold)', fontWeight: 500 }}>{fmt(maxPrice)}</span>
              </div>
            </div>

            <div>
              <div style={{ fontSize: 11, letterSpacing: '.24em', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 500, marginBottom: 16 }}>Ordenar por</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[['relevance', 'Relevância'], ['price-asc', 'Preço ↑'], ['price-desc', 'Preço ↓'], ['rating', 'Avaliação']].map(([v, l]) => (
                  <button key={v} onClick={() => setSort(v)} style={{ background: 'none', border: 'none', textAlign: 'left', color: sort === v ? 'var(--gold)' : 'var(--fg-dim)', fontSize: 14, padding: '4px 0', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontWeight: sort === v ? 500 : 300, transition: 'color .2s' }}>
                    {sort === v && <span style={{ width: 16, height: 1, background: 'var(--gold)', flexShrink: 0 }} />}
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main grid */}
          <div>
            {/* Mobile filter chips */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
              {['Todos', 'Portáteis', 'Monitores', 'Periféricos', 'Áudio'].map(cat => (
                <button key={cat} onClick={() => { setActiveCategory(cat); setShowPromoOnly(false) }} className={`kn-filter-chip${activeCategory === cat && !showPromoOnly ? ' active' : ''}`}>{cat}</button>
              ))}
              <button onClick={() => { setShowPromoOnly(v => !v); setActiveCategory('Todos') }} className={`kn-filter-chip${showPromoOnly ? ' active' : ''}`}>Promoções</button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <span style={{ fontSize: 13, color: 'var(--fg-mute)' }}>{filtered.length} produto{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}</span>
            </div>

            {filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--fg-mute)' }}>
                <div style={{ fontFamily: 'var(--f-display)', fontSize: 28, marginBottom: 12 }}>Nenhum produto encontrado</div>
                <div style={{ fontSize: 14 }}>Tente ajustar os filtros ou a pesquisa.</div>
              </div>
            ) : (
              <div className="kn-products-3">
                {filtered.map(p => <ProductCard key={p.id} p={p} onAdd={onAdd} onOpen={onOpen} wishlist={wishlist} toggleWish={toggleWish} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── ProductPage ──────────────────────────────────────────────────────────────

function ProductPage({ product, onAdd, onBack, wishlist, toggleWish, allProducts, onOpen }: {
  product: Product; onAdd: (p: Product) => void; onBack: () => void
  wishlist: Set<number>; toggleWish: (id: number) => void
  allProducts: Product[]; onOpen: (p: Product) => void
}) {
  const [activeImg, setActiveImg] = useState(0)
  const [qty, setQty] = useState(1)
  const [tab, setTab] = useState<'desc' | 'specs' | 'reviews'>('desc')
  const [added, setAdded] = useState(false)
  const related = allProducts.filter(p => p.id !== product.id && p.category === product.category).slice(0, 4)
  const disc = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0

  return (
    <div style={{ minHeight: '80vh' }}>
      {/* Breadcrumb */}
      <div style={{ background: 'var(--bg-1)', borderBottom: '1px solid var(--border)', padding: '14px var(--pad-x)' }}>
        <div style={{ maxWidth: 'var(--maxw)', margin: '0 auto', display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--fg-mute)', letterSpacing: '.12em' }}>
          <span style={{ cursor: 'pointer', color: 'var(--fg-mute)', transition: 'color .2s' }} onClick={onBack}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--fg-mute)')}>← Loja</span>
          <span style={{ color: 'var(--border-2)' }}>/</span>
          <span style={{ color: 'var(--gold)' }}>{product.category}</span>
          <span style={{ color: 'var(--border-2)' }}>/</span>
          <span style={{ color: 'var(--fg-dim)' }}>{product.name}</span>
        </div>
      </div>

      <div className="wrap" style={{ padding: '48px var(--pad-x) 80px' }}>
        <div className="kn-product-detail">
          {/* Gallery */}
          <div>
            <div style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden', background: 'var(--bg-2)', border: '1px solid var(--border)', marginBottom: 12 }}>
              <img src={product.images[activeImg] || product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              {product.badge && (
                <div style={{ position: 'absolute', top: 16, left: 16, padding: '5px 12px', fontSize: 10, fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase' }} className={product.badgeColor === 'bordo' ? 'kn-badge-bordo' : 'kn-badge-gold'}>
                  {product.badge}
                </div>
              )}
            </div>
            {product.images.length > 1 && (
              <div style={{ display: 'flex', gap: 10 }}>
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    style={{ width: 72, aspectRatio: '4/3', overflow: 'hidden', border: `1px solid ${i === activeImg ? 'var(--gold)' : 'var(--border)'}`, background: 'var(--bg-2)', padding: 0, transition: 'border-color .2s' }}>
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
            <div>
              <div style={{ fontSize: 10, letterSpacing: '.24em', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 500, marginBottom: 10 }}>{product.category}</div>
              <h1 style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(28px,3vw,44px)', fontWeight: 500, margin: '0 0 16px', lineHeight: 1.1 }}>{product.name}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <Stars rating={product.rating} size={13} />
                <span style={{ fontSize: 13, color: 'var(--fg-mute)' }}>{product.rating} ({product.reviews} avaliações)</span>
                <span style={{ fontSize: 12, color: product.stock > 5 ? '#4caf50' : 'var(--bordo-3)', marginLeft: 8, fontWeight: 500 }}>
                  {product.stock > 5 ? `✓ Em stock (${product.stock})` : product.stock > 0 ? `⚠ Últimas ${product.stock} unidades` : '✗ Esgotado'}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 8 }}>
                <span style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(32px,3.5vw,48px)', fontWeight: 600 }}>{fmt(product.price)}</span>
                {product.originalPrice && <span style={{ fontSize: 16, color: 'var(--fg-mute)', textDecoration: 'line-through' }}>{fmt(product.originalPrice)}</span>}
                {disc > 0 && <span style={{ padding: '3px 10px', background: 'var(--gold)', color: '#0B0B0C', fontSize: 12, fontWeight: 700 }}>−{disc}%</span>}
              </div>
              {product.originalPrice && (
                <div style={{ fontSize: 13, color: 'var(--fg-mute)' }}>Poupa <span style={{ color: 'var(--gold)', fontWeight: 600 }}>{fmt(product.originalPrice - product.price)}</span></div>
              )}
            </div>

            <div style={{ height: 1, background: 'var(--border)' }} />

            {/* Qty + add */}
            <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
              <div className="kn-qty">
                <button onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                <span>{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))}>+</button>
              </div>
              <button onClick={() => { onAdd({ ...product, qty } as unknown as Product); setAdded(true); setTimeout(() => setAdded(false), 2000) }}
                style={{ flex: 1, padding: '14px 20px', background: added ? '#2e7d32' : 'var(--bordo)', border: 'none', color: '#F5F2ED', fontFamily: 'var(--f-sans)', fontSize: 12, letterSpacing: '.22em', textTransform: 'uppercase', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'background .3s ease' }}>
                {added
                  ? <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg> Adicionado!</>
                  : <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L4 7v13h16V7L18 2Z" /><path d="M8 10c0 2 1.8 4 4 4s4-2 4-4" /></svg> Adicionar ao carrinho</>
                }
              </button>
              <button onClick={() => toggleWish(product.id)}
                style={{ width: 50, height: 50, border: `1px solid ${wishlist.has(product.id) ? 'var(--bordo)' : 'var(--border)'}`, background: wishlist.has(product.id) ? 'rgba(139,30,45,.15)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .2s ease' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" stroke={wishlist.has(product.id) ? 'var(--bordo)' : 'var(--fg-mute)'} strokeWidth="2" fill={wishlist.has(product.id) ? 'var(--bordo)' : 'none'}>
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
            </div>

            {/* Trust mini */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[['🚚', 'Envio 24-48h'], ['↩', 'Devolução 30 dias'], ['🔒', 'Pagamento seguro'], ['📏', 'Troca de tamanho']].map(([icon, label]) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', border: '1px solid var(--border)', background: 'var(--bg-1)' }}>
                  <span style={{ fontSize: 14 }}>{icon}</span>
                  <span style={{ fontSize: 12, color: 'var(--fg-dim)' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs: description / specs / reviews */}
        <div style={{ marginTop: 60, borderTop: '1px solid var(--border)' }}>
          <div className="kn-tabs">
            {(['desc', 'specs', 'reviews'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} className={`kn-tab${tab === t ? ' active' : ''}`}>
                {t === 'desc' ? 'Descrição' : t === 'specs' ? 'Especificações' : 'Avaliações'}
              </button>
            ))}
          </div>

          <div style={{ padding: '36px 0' }}>
            {tab === 'desc' && (
              <div style={{ maxWidth: 760 }}>
                <p style={{ fontSize: 16, color: 'var(--fg-dim)', lineHeight: 1.75 }}>{product.description}</p>
              </div>
            )}
            {tab === 'specs' && (
              <div style={{ maxWidth: 640 }}>
                {product.specs.map((s, i) => (
                  <div key={s.label} style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: 20, padding: '14px 0', borderBottom: i < product.specs.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <span style={{ fontSize: 12, letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 500 }}>{s.label}</span>
                    <span style={{ fontSize: 14, color: 'var(--fg-dim)' }}>{s.value}</span>
                  </div>
                ))}
              </div>
            )}
            {tab === 'reviews' && (
              <div style={{ maxWidth: 680 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 36, padding: '28px', background: 'var(--bg-1)', border: '1px solid var(--border)' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--f-display)', fontSize: 56, fontWeight: 500, lineHeight: 1, color: 'var(--fg)' }}>{product.rating}</div>
                    <Stars rating={product.rating} size={14} />
                    <div style={{ fontSize: 12, color: 'var(--fg-mute)', marginTop: 6 }}>{product.reviews} avaliações</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    {[5, 4, 3, 2, 1].map(s => {
                      const pct = s === 5 ? 72 : s === 4 ? 20 : s === 3 ? 6 : s === 2 ? 1 : 1
                      return (
                        <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                          <span style={{ fontSize: 12, color: 'var(--fg-mute)', width: 12 }}>{s}</span>
                          <div style={{ flex: 1, height: 6, background: 'var(--bg-3)', overflow: 'hidden' }}>
                            <div style={{ width: `${pct}%`, height: '100%', background: 'var(--gold)' }} />
                          </div>
                          <span style={{ fontSize: 11, color: 'var(--fg-mute)', width: 28 }}>{pct}%</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
                <p style={{ color: 'var(--fg-mute)', fontSize: 14, textAlign: 'center' }}>As avaliações verificadas serão exibidas aqui em breve.</p>
              </div>
            )}
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div style={{ marginTop: 60, paddingTop: 48, borderTop: '1px solid var(--border)' }}>
            <SectionHead eyebrow="Relacionados" title={`Mais em <em class='gold-text'>${product.category}</em>.`} />
            <div className="kn-products-4">
              {related.map(p => <ProductCard key={p.id} p={p} onAdd={onAdd} onOpen={onOpen} wishlist={wishlist} toggleWish={toggleWish} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── ContactPage ──────────────────────────────────────────────────────────────

const FORMSPREE_URL = 'https://formspree.io/f/xeeyzlvb'

function ContactPage() {
  const [form, setForm] = useState({ nome: '', email: '', area: 'Roupa & Moda', msg: '' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  return (
    <div style={{ minHeight: '80vh' }}>
      <div style={{ background: 'radial-gradient(700px 400px at 85% 20%, rgba(139,30,45,.18), transparent 60%), var(--bg-1)', borderBottom: '1px solid var(--border)', padding: '80px var(--pad-x) 60px' }}>
        <div style={{ maxWidth: 'var(--maxw)', margin: '0 auto' }}>
          <Eyebrow text="Contacto" />
          <h1 style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(44px,6vw,88px)', fontWeight: 500, margin: '20px 0 24px', lineHeight: 1.05 }}>
            Vamos <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>conversar</em>.
          </h1>
          <p style={{ color: 'var(--fg-dim)', fontSize: 17, maxWidth: '56ch', lineHeight: 1.65 }}>
            Tem dúvidas sobre um produto, precisa de ajuda com trocas ou quer saber mais sobre a nossa coleção? Estamos aqui.
          </p>
        </div>
      </div>

      <div className="wrap" style={{ padding: '60px var(--pad-x) 80px' }}>
        <div className="kn-contact-grid">
          {/* Info */}
          <div>
            {[
              { label: 'Email', value: 'karmicnode@gmail.com', href: 'mailto:karmicnode@gmail.com' },
              { label: 'Localização', value: 'Cartaxo · Portugal', href: null },
              { label: 'Horário', value: 'Seg–Sex · 09h00–19h00', href: null },
              { label: 'Suporte', value: 'Presencial + Remoto', href: null },
            ].map(row => (
              <div key={row.label} style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 20, padding: '20px 0', borderBottom: '1px solid var(--border)', alignItems: 'center' }}>
                <span style={{ fontSize: 10, letterSpacing: '.24em', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 500 }}>{row.label}</span>
                {row.href ? (
                  <a href={row.href} style={{ fontFamily: 'var(--f-display)', fontSize: 18, color: 'var(--fg)', transition: 'color .2s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--fg)')}>{row.value}</a>
                ) : (
                  <span style={{ fontFamily: 'var(--f-display)', fontSize: 18 }}>{row.value}</span>
                )}
              </div>
            ))}

            <div style={{ marginTop: 32 }}>
              <div style={{ fontSize: 11, letterSpacing: '.24em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 16, fontWeight: 500 }}>Redes Sociais</div>
              <div style={{ display: 'flex', gap: 10 }}>
                {['instagram', 'facebook', 'linkedin'].map(s => (
                  <a key={s} href="#" style={{ width: 40, height: 40, border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--fg-mute)', transition: 'all .2s ease' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--gold)'; (e.currentTarget as HTMLElement).style.color = 'var(--gold)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--fg-mute)' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      {s === 'instagram' && <><rect x="3" y="3" width="18" height="18" rx="4" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" /></>}
                      {s === 'facebook' && <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />}
                      {s === 'linkedin' && <><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" /><circle cx="4" cy="4" r="2" /></>}
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <div style={{ background: 'var(--bg-1)', border: '1px solid var(--border)', padding: '40px 36px' }}>
            {sent ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5" style={{ margin: '0 auto 20px' }}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                <h3 style={{ fontFamily: 'var(--f-display)', fontSize: 28, marginBottom: 12 }}>Mensagem enviada!</h3>
                <p style={{ color: 'var(--fg-mute)', fontSize: 15 }}>Responderemos em menos de 24 horas.</p>
              </div>
            ) : (
              <>
                <h3 style={{ fontFamily: 'var(--f-display)', fontSize: 26, margin: '0 0 6px' }}>Peça um <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>orçamento</em></h3>
                <p style={{ color: 'var(--fg-mute)', fontSize: 14, marginBottom: 28 }}>Preencha e responderemos com uma proposta clara.</p>

                {[
                  { id: 'nome', label: 'Nome', type: 'text', ph: 'O seu nome completo' },
                  { id: 'email', label: 'Email', type: 'email', ph: 'email@exemplo.pt' },
                ].map(f => (
                  <div key={f.id} style={{ marginBottom: 20 }}>
                    <label style={{ display: 'block', fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 8, fontWeight: 500 }}>{f.label}</label>
                    <input type={f.type} placeholder={f.ph} value={form[f.id as 'nome' | 'email']} onChange={e => setForm(prev => ({ ...prev, [f.id]: e.target.value }))}
                      style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border)', padding: '10px 0', color: 'var(--fg)', fontSize: 15, outline: 'none', transition: 'border-color .2s' }}
                      onFocus={e => (e.currentTarget.style.borderBottomColor = 'var(--gold)')}
                      onBlur={e => (e.currentTarget.style.borderBottomColor = 'var(--border)')} />
                  </div>
                ))}

                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 8, fontWeight: 500 }}>Área de interesse</label>
                  <select value={form.area} onChange={e => setForm(prev => ({ ...prev, area: e.target.value }))}
                    style={{ width: '100%', background: 'var(--bg-1)', border: 'none', borderBottom: '1px solid var(--border)', padding: '10px 0', color: 'var(--fg)', fontSize: 15, outline: 'none', appearance: 'none' }}>
                    {['Roupa & Moda', 'Loja — Compra', 'Trocas & Devoluções', 'Encomendas', 'Parcerias', 'Outro'].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>

                <div style={{ marginBottom: 28 }}>
                  <label style={{ display: 'block', fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 8, fontWeight: 500 }}>Mensagem</label>
                  <textarea value={form.msg} onChange={e => setForm(prev => ({ ...prev, msg: e.target.value }))} placeholder="Descreva o seu projeto ou necessidade..." rows={4}
                    style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border)', padding: '10px 0', color: 'var(--fg)', fontSize: 15, outline: 'none', resize: 'vertical', transition: 'border-color .2s' }}
                    onFocus={e => (e.currentTarget.style.borderBottomColor = 'var(--gold)')}
                    onBlur={e => (e.currentTarget.style.borderBottomColor = 'var(--border)')} />
                </div>

                <PrimaryBtn full onClick={async () => {
                  if (!form.nome || !form.email || !form.msg) return
                  setLoading(true); setError('')
                  try {
                    const r = await fetch(FORMSPREE_URL, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ Nome: form.nome, Email: form.email, Área: form.area, Mensagem: form.msg }) })
                    if (r.ok) { setSent(true) } else { setError('Erro ao enviar. Tente novamente ou contacte karmicnode@gmail.com') }
                  } catch { setError('Erro de rede. Verifique a ligação e tente novamente.') }
                  setLoading(false)
                }}>{loading ? 'A enviar…' : 'Enviar Pedido'}</PrimaryBtn>
                {error && <p style={{ marginTop: 12, fontSize: 13, color: 'var(--bordo)', lineHeight: 1.5 }}>{error}</p>}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── AboutPage ────────────────────────────────────────────────────────────────

function AboutPage({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <div style={{ minHeight: '80vh' }}>
      <div style={{ background: 'radial-gradient(700px 400px at 85% 20%, rgba(139,30,45,.18), transparent 60%), var(--bg-1)', borderBottom: '1px solid var(--border)', padding: '80px var(--pad-x) 60px' }}>
        <div style={{ maxWidth: 'var(--maxw)', margin: '0 auto' }}>
          <Eyebrow text="Quem Somos" />
          <h1 style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(44px,6vw,88px)', fontWeight: 500, margin: '20px 0 24px', lineHeight: 1.05 }}>
            Uma equipa, uma <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>visão</em>.
          </h1>
          <p style={{ color: 'var(--fg-dim)', fontSize: 17, maxWidth: '60ch', lineHeight: 1.7 }}>
            A Karmic Node nasceu com o objetivo de oferecer moda com identidade — peças atemporais, cuidadosamente selecionadas, que combinam estilo, qualidade e consciência. Uma marca feita para quem valoriza o que veste.
          </p>
        </div>
      </div>

      <div className="wrap" style={{ padding: '60px var(--pad-x) 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24, marginBottom: 60 }}>
          {[['M.', 'Missão', 'Democratizar o acesso a moda de qualidade, oferecendo peças atemporais que transmitem confiança e identidade — com atenção ao detalhe e respeito pelo cliente.'],
            ['V.', 'Visão', 'Ser uma referência portuguesa de moda consciente, reconhecida pela curadoria rigorosa, qualidade dos materiais e proximidade com quem nos escolhe.'],
            ['V.', 'Valores', 'Profissionalismo, Compromisso, Qualidade, Inovação, Proximidade, Rigor e Criatividade — em cada entrega, sem exceções.'],
          ].map(([k, h, p]) => (
            <div key={h} style={{ padding: '36px 28px', border: '1px solid var(--border)', background: 'linear-gradient(180deg,var(--bg-1) 0%,var(--bg) 100%)', position: 'relative' }}>
              <div style={{ position: 'absolute', top: -1, left: 24, right: 24, height: 1, background: 'var(--gold)' }} />
              <div style={{ fontFamily: 'var(--f-display)', fontStyle: 'italic', fontSize: 40, color: 'var(--gold)', marginBottom: 16, lineHeight: 1 }}>{k}</div>
              <h3 style={{ fontFamily: 'var(--f-display)', fontSize: 24, fontWeight: 500, marginBottom: 14 }}>{h}</h3>
              <p style={{ color: 'var(--fg-dim)', fontSize: 15, lineHeight: 1.7 }}>{p}</p>
            </div>
          ))}
        </div>

        <div style={{ background: `radial-gradient(700px 400px at 50% 0%, rgba(139,30,45,.3), transparent 70%), var(--bg-1)`, border: '1px solid var(--border)', padding: 'clamp(48px,6vw,80px)', textAlign: 'center', borderTop: '1px solid var(--border)' }}>
          <Eyebrow text="Juntos" />
          <h2 style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(28px,3vw,44px)', fontWeight: 500, margin: '20px 0 16px' }}>
            Confiança construída em cada <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>detalhe</em>.
          </h2>
          <p style={{ color: 'var(--fg-dim)', fontSize: 16, marginBottom: 34, maxWidth: '44ch', margin: '0 auto 34px' }}>
            Descubra os nossos produtos e serviços — ou fale diretamente connosco.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <PrimaryBtn onClick={() => setPage('shop')}>Visitar a Loja</PrimaryBtn>
            <GhostBtn onClick={() => setPage('contact')}>Contactar</GhostBtn>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── BlogPage ─────────────────────────────────────────────────────────────────

const BLOG_CATS = ['Todos', 'Estilo', 'Tendências', 'Cuidados', 'Sustentabilidade', 'Acessórios']

function BlogCard({ post, onClick }: { post: BlogPost; onClick: () => void }) {
  const [hov, setHov] = useState(false)
  return (
    <article onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: 'var(--bg-1)', border: `1px solid ${hov ? 'var(--gold-3)' : 'var(--border)'}`, cursor: 'pointer', display: 'flex', flexDirection: 'column', transition: 'border-color .3s, transform .3s, box-shadow .3s', transform: hov ? 'translateY(-4px)' : 'none', boxShadow: hov ? '0 16px 48px rgba(0,0,0,.4)' : 'none' }}>
      <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden', background: 'var(--bg-2)' }}>
        <img src={post.image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .7s ease', transform: hov ? 'scale(1.06)' : 'scale(1)' }} />
        <div style={{ position: 'absolute', top: 14, left: 14, padding: '4px 10px', background: 'var(--bordo)', fontSize: 9, fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase', color: '#F5F2ED' }}>{post.category}</div>
      </div>
      <div style={{ padding: '22px 24px 26px', flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 11, color: 'var(--fg-mute)', letterSpacing: '.08em' }}>
          <span>{post.date}</span>
          <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--border-2)', flexShrink: 0 }} />
          <span>{post.readTime} min de leitura</span>
        </div>
        <h3 style={{ fontFamily: 'var(--f-display)', fontSize: 20, fontWeight: 500, lineHeight: 1.25, margin: 0, color: hov ? 'var(--gold-2)' : 'var(--fg)', transition: 'color .2s' }}>{post.title}</h3>
        <p style={{ fontSize: 14, color: 'var(--fg-dim)', lineHeight: 1.65, margin: 0, flex: 1 }}>{post.excerpt}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--gold)', letterSpacing: '.16em', textTransform: 'uppercase', fontWeight: 500, marginTop: 6 }}>
          Ler artigo
          <svg width="10" height="8" viewBox="0 0 14 10" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 5h12M9 1l4 4-4 4" /></svg>
        </div>
      </div>
    </article>
  )
}

function BlogArticle({ post, onBack }: { post: BlogPost; onBack: () => void }) {
  return (
    <div style={{ minHeight: '80vh' }}>
      {/* Hero */}
      <div style={{ position: 'relative', height: 'clamp(320px,45vh,500px)', overflow: 'hidden' }}>
        <img src={post.image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(11,11,12,.3) 0%, rgba(11,11,12,.85) 100%)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 'clamp(24px,4vw,48px) var(--pad-x)' }}>
          <div style={{ maxWidth: 'var(--maxw)', margin: '0 auto' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '4px 12px', background: 'var(--bordo)', fontSize: 9, fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase', marginBottom: 16 }}>{post.category}</div>
            <h1 style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(28px,4vw,56px)', fontWeight: 500, lineHeight: 1.1, margin: '0 0 16px', maxWidth: '18ch' }}>{post.title}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, fontSize: 13, color: 'rgba(245,242,237,.7)' }}>
              <span>{post.author}</span>
              <span>·</span>
              <span>{post.date}</span>
              <span>·</span>
              <span>{post.readTime} min de leitura</span>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div style={{ background: 'var(--bg-1)', borderBottom: '1px solid var(--border)', padding: '14px var(--pad-x)' }}>
        <div style={{ maxWidth: 'var(--maxw)', margin: '0 auto', display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--fg-mute)' }}>
          <span style={{ cursor: 'pointer', transition: 'color .2s' }} onClick={onBack}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--fg-mute)')}>← Blog</span>
          <span style={{ color: 'var(--border-2)' }}>/</span>
          <span style={{ color: 'var(--gold)' }}>{post.category}</span>
          <span style={{ color: 'var(--border-2)' }}>/</span>
          <span style={{ color: 'var(--fg-dim)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.title}</span>
        </div>
      </div>

      {/* Body */}
      <div className="wrap" style={{ padding: '60px var(--pad-x) 100px' }}>
        <div style={{ maxWidth: '72ch', margin: '0 auto' }}>
          <p style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(18px,1.6vw,22px)', fontStyle: 'italic', color: 'var(--fg-dim)', lineHeight: 1.65, marginBottom: 40, paddingBottom: 40, borderBottom: '1px solid var(--border)' }}>
            {post.excerpt}
          </p>
          {post.body.map((para, i) => (
            <p key={i} style={{ fontSize: 16, lineHeight: 1.85, color: 'var(--fg-dim)', marginBottom: 24, fontWeight: 300 }}>{para}</p>
          ))}

          <div style={{ marginTop: 56, paddingTop: 40, borderTop: '1px solid var(--border)', display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--fg-mute)' }}>Categoria:</span>
            <span style={{ padding: '5px 14px', border: '1px solid var(--gold-3)', color: 'var(--gold)', fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase' }}>{post.category}</span>
          </div>

          <div style={{ marginTop: 40, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, background: 'var(--bordo)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg viewBox="0 0 40 40" fill="none" style={{ width: 28, height: 28 }}>
                <path d="M20 4L32 8V19C32 26 26.5 30.5 20 33C13.5 30.5 8 26 8 19V8Z" stroke="#B08D57" strokeWidth="1.2" fill="rgba(139,30,45,0.4)" />
                <line x1="20" y1="10" x2="20" y2="27" stroke="#B08D57" strokeWidth="1.2" />
                <line x1="16" y1="14" x2="24" y2="14" stroke="#B08D57" strokeWidth="1.2" />
              </svg>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--f-display)', fontSize: 17, fontWeight: 500 }}>{post.author}</div>
              <div style={{ fontSize: 12, color: 'var(--fg-mute)', marginTop: 2 }}>Equipa Karmic Node · Moda &amp; Estilo</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function BlogPage() {
  const [activePost, setActivePost] = useState<BlogPost | null>(null)
  const [activeCat, setActiveCat] = useState('Todos')
  const [search, setSearch] = useState('')

  if (activePost) {
    return <BlogArticle post={activePost} onBack={() => { setActivePost(null); window.scrollTo({ top: 0, behavior: 'smooth' }) }} />
  }

  const featured = BLOG_POSTS.find(p => p.featured)
  const filtered = BLOG_POSTS.filter(p => {
    if (activeCat !== 'Todos' && p.category !== activeCat) return false
    if (search && !p.title.toLowerCase().includes(search.toLowerCase()) && !p.excerpt.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })
  const rest = filtered.filter(p => !p.featured || activeCat !== 'Todos' || search)

  return (
    <div style={{ minHeight: '80vh' }}>
      {/* Hero */}
      <div style={{ background: 'radial-gradient(900px 500px at 70% 50%, rgba(139,30,45,.22), transparent 65%), var(--bg-1)', borderBottom: '1px solid var(--border)', padding: 'clamp(64px,8vw,100px) var(--pad-x) clamp(48px,6vw,72px)' }}>
        <div style={{ maxWidth: 'var(--maxw)', margin: '0 auto' }}>
          <Eyebrow text="Blog" />
          <h1 style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(44px,6vw,88px)', fontWeight: 500, margin: '20px 0 20px', lineHeight: 1.05 }}>
            Moda em <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>foco</em>.
          </h1>
          <p style={{ color: 'var(--fg-dim)', fontSize: 17, maxWidth: '52ch', lineHeight: 1.65, marginBottom: 36 }}>
            Tendências, guias de estilo e dicas de moda — escritos pela equipa Karmic Node.
          </p>
          {/* Search */}
          <div style={{ display: 'flex', border: '1px solid var(--border)', background: 'var(--bg-2)', maxWidth: 440 }}
            onFocusCapture={e => (e.currentTarget.style.borderColor = 'var(--gold-3)')}
            onBlurCapture={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--fg-mute)" strokeWidth="1.8" style={{ margin: '0 12px', flexShrink: 0, alignSelf: 'center' }}><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Pesquisar artigos…"
              style={{ flex: 1, background: 'transparent', border: 'none', padding: '13px 0', color: 'var(--fg)', fontFamily: 'var(--f-sans)', fontSize: 14, outline: 'none' }} />
          </div>
        </div>
      </div>

      {/* Category chips */}
      <div style={{ background: 'var(--bg-1)', borderBottom: '1px solid var(--border)', padding: '16px var(--pad-x)', overflowX: 'auto' }}>
        <div style={{ maxWidth: 'var(--maxw)', margin: '0 auto', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {BLOG_CATS.map(cat => (
            <button key={cat} onClick={() => setActiveCat(cat)} className={`kn-filter-chip${activeCat === cat ? ' active' : ''}`}>{cat}</button>
          ))}
        </div>
      </div>

      <div className="wrap" style={{ padding: 'clamp(48px,6vw,80px) var(--pad-x)' }}>
        {/* Featured post */}
        {featured && activeCat === 'Todos' && !search && (
          <div style={{ marginBottom: 64 }}>
            <Eyebrow text="Destaque" />
            <article onClick={() => { setActivePost(featured); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
              style={{ marginTop: 28, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, border: '1px solid var(--border)', background: 'var(--bg-1)', cursor: 'pointer', overflow: 'hidden', transition: 'border-color .3s' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--gold-3)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
              <div style={{ position: 'relative', minHeight: 340, overflow: 'hidden' }}>
                <img src={featured.image} alt={featured.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .7s ease', position: 'absolute', inset: 0 }}
                  onMouseEnter={e => ((e.currentTarget as HTMLImageElement).style.transform = 'scale(1.05)')}
                  onMouseLeave={e => ((e.currentTarget as HTMLImageElement).style.transform = 'scale(1)')} />
              </div>
              <div style={{ padding: 'clamp(32px,4vw,52px)', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 16 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '4px 12px', background: 'var(--bordo)', fontSize: 9, fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase', width: 'fit-content' }}>{featured.category}</div>
                <h2 style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(22px,2.5vw,34px)', fontWeight: 500, lineHeight: 1.2, margin: 0 }}>{featured.title}</h2>
                <p style={{ color: 'var(--fg-dim)', fontSize: 15, lineHeight: 1.7, margin: 0 }}>{featured.excerpt}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 12, color: 'var(--fg-mute)' }}>
                  <span>{featured.date}</span>
                  <span>·</span>
                  <span>{featured.readTime} min de leitura</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--gold)', letterSpacing: '.16em', textTransform: 'uppercase', fontWeight: 500 }}>
                  Ler artigo
                  <svg width="10" height="8" viewBox="0 0 14 10" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 5h12M9 1l4 4-4 4" /></svg>
                </div>
              </div>
            </article>
          </div>
        )}

        {/* Grid */}
        {rest.length > 0 ? (
          <>
            {(activeCat !== 'Todos' || search) ? null : <Eyebrow text="Todos os artigos" />}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24, marginTop: activeCat === 'Todos' && !search ? 28 : 0 }}>
              {rest.map(post => (
                <BlogCard key={post.id} post={post} onClick={() => { setActivePost(post); window.scrollTo({ top: 0, behavior: 'smooth' }) }} />
              ))}
            </div>
          </>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--fg-mute)' }}>
            <div style={{ fontFamily: 'var(--f-display)', fontSize: 24, marginBottom: 12 }}>Nenhum artigo encontrado</div>
            <div style={{ fontSize: 14 }}>Tente outra pesquisa ou categoria.</div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

// ─── CustomPage ───────────────────────────────────────────────────────────────

const CUSTOM_GARMENTS = [
  { id: 'tshirt', label: 'T-Shirt', icon: '👕', desc: 'Corte reto, unissexo ou fit' },
  { id: 'hoodie', label: 'Hoodie', icon: '🧥', desc: 'Com capuz, bolso canguru' },
  { id: 'polo', label: 'Polo', icon: '👔', desc: 'Elegante, com gola' },
  { id: 'sweat', label: 'Sweatshirt', icon: '🥋', desc: 'Sem capuz, clássica' },
  { id: 'cap', label: 'Boné', icon: '🧢', desc: 'Snapback ou strapback' },
  { id: 'bag', label: 'Tote Bag', icon: '👜', desc: 'Algodão 100%, resistente' },
]

const CUSTOM_FABRICS = [
  { id: 'cotton', label: 'Algodão 100%', note: 'Respirável · Durável' },
  { id: 'cotton_poly', label: 'Algodão/Poliéster', note: 'Anti-rugas · Económico' },
  { id: 'organic', label: 'Algodão Orgânico', note: 'Sustentável · Certificado' },
  { id: 'premium', label: 'Premium Pima', note: 'Suave · Luxo' },
]

const CUSTOM_PRINTS = [
  { id: 'embroidery', label: 'Bordado', note: 'Elegante · Alta durabilidade' },
  { id: 'dtg', label: 'Impressão DTG', note: 'Cores vivas · Foto-realismo' },
  { id: 'screen', label: 'Serigrafia', note: 'Ideal ≥ 20 unidades' },
  { id: 'heat', label: 'Vinil Térmico', note: 'Acabamento premium' },
  { id: 'patch', label: 'Patch / Etiqueta', note: 'Look exclusivo' },
]

const CUSTOM_COLORS = [
  '#F5F2ED', '#0B0B0C', '#8B1E2D', '#B08D57',
  '#1a3a5c', '#2d5a27', '#5c3317', '#6b4f7e',
  '#c94b2d', '#e8c84a', '#2a7a8c', '#808080',
]

const GALLERY_ITEMS = [
  { img: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600&h=700&fit=crop', label: 'T-Shirt Bordada', cat: 'Bordado' },
  { img: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&h=700&fit=crop', label: 'Hoodie Personalizado', cat: 'Impressão DTG' },
  { img: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&h=700&fit=crop', label: 'Polo Premium', cat: 'Bordado' },
  { img: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&h=700&fit=crop', label: 'Sweatshirt Equipa', cat: 'Serigrafia' },
  { img: 'https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=600&h=700&fit=crop', label: 'Boné Personalizado', cat: 'Bordado' },
  { img: 'https://images.unsplash.com/photo-1597248374161-426f0d6d2fc9?w=600&h=700&fit=crop', label: 'Tote Bag Exclusiva', cat: 'Impressão DTG' },
]

const CUSTOM_FAQS = [
  { q: 'Qual o mínimo de unidades?', a: 'Para a maioria das técnicas aceitamos a partir de 1 unidade. Para serigrafia, o mínimo são 20 unidades para manter o preço competitivo.' },
  { q: 'Que formatos de ficheiro aceitam?', a: 'Aceitamos ficheiros vetoriais (AI, EPS, SVG, PDF) e raster de alta resolução (PNG/JPG a 300dpi no mínimo). Para bordado, utilizamos os seus ficheiros e fazemos a digitalização incluída no serviço.' },
  { q: 'Qual é o prazo de produção?', a: 'O prazo standard é de 10 a 15 dias úteis após aprovação da prova. Temos serviço urgente (5-7 dias úteis) com acréscimo de 30%.' },
  { q: 'É possível ver uma prova antes da produção?', a: 'Sim. Enviamos sempre uma prova digital para aprovação antes de iniciarmos a produção. Para encomendas ≥ 50 unidades, podemos enviar uma amostra física.' },
  { q: 'Fazem envio para todo o Portugal?', a: 'Sim, enviamos para Portugal Continental e Ilhas. Para encomendas empresariais, disponibilizamos envio para a Europa.' },
]

function CustomPage({ setPage }: { setPage: (p: Page) => void }) {
  const [step, setStep] = useState(1)
  const [garment, setGarment] = useState('')
  const [fabric, setFabric] = useState('')
  const [printType, setPrintType] = useState('')
  const [color, setColor] = useState('#0B0B0C')
  const [qty, setQty] = useState(10)
  const [notes, setNotes] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const canNext1 = !!garment
  const canNext2 = !!fabric
  const canNext3 = !!printType
  const canSubmit = name.trim() && email.trim()

  const estimatePrice = () => {
    if (!garment || !fabric || !printType) return null
    const base: Record<string, number> = { tshirt: 12, hoodie: 28, polo: 18, sweat: 22, cap: 9, bag: 7 }
    const fabricMult: Record<string, number> = { cotton: 1, cotton_poly: 0.9, organic: 1.2, premium: 1.5 }
    const printAdd: Record<string, number> = { embroidery: 6, dtg: 4, screen: qty < 20 ? 8 : 2, heat: 5, patch: 7 }
    const unit = (base[garment] || 15) * (fabricMult[fabric] || 1) + (printAdd[printType] || 0)
    const discount = qty >= 50 ? 0.85 : qty >= 20 ? 0.9 : qty >= 10 ? 0.95 : 1
    return { unit: +(unit * discount).toFixed(2), total: +(unit * discount * qty).toFixed(2) }
  }

  const price = estimatePrice()

  const handleSubmit = async () => {
    if (!canSubmit) return
    setLoading(true); setError('')
    const garmentLabel = CUSTOM_GARMENTS.find(g => g.id === garment)?.label ?? garment
    const fabricLabel = CUSTOM_FABRICS.find(f => f.id === fabric)?.label ?? fabric
    const printLabel = CUSTOM_PRINTS.find(p => p.id === printType)?.label ?? printType
    const p = estimatePrice()
    try {
      const r = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          Nome: name, Email: email, Telefone: phone || '—',
          Artigo: garmentLabel, Material: fabricLabel, Técnica: printLabel,
          'Cor base': color, Quantidade: `${qty} unidades`,
          'Estimativa unitária': p ? `${p.unit}€` : '—',
          'Estimativa total': p ? `${p.total}€` : '—',
          Notas: notes || '—',
          Formulário: 'Roupa Personalizada',
        }),
      })
      if (r.ok) { setSent(true) } else { setError('Erro ao enviar. Tente novamente ou contacte karmicnode@gmail.com') }
    } catch { setError('Erro de rede. Verifique a ligação e tente novamente.') }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh' }}>

      {/* HERO */}
      <div style={{ position: 'relative', overflow: 'hidden', minHeight: 'clamp(420px,55vh,640px)', display: 'flex', alignItems: 'center' }}>
        <img src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1600&h=900&fit=crop&auto=format" alt="Roupa personalizada" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg, rgba(11,11,12,.92) 45%, rgba(11,11,12,.4) 100%)' }} />
        <div className="wrap" style={{ position: 'relative', zIndex: 2, padding: 'clamp(64px,8vw,100px) var(--pad-x)' }}>
          <div style={{ maxWidth: 680 }}>
            <Eyebrow text="Roupa Personalizada" />
            <h1 style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(42px,6vw,84px)', fontWeight: 500, margin: '20px 0 22px', lineHeight: 1.05 }}>
              A tua marca,<br />
              <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>a tua peça.</em>
            </h1>
            <p style={{ color: 'rgba(245,242,237,.75)', fontSize: 17, maxWidth: '48ch', lineHeight: 1.7, marginBottom: 38 }}>
              Criamos roupa personalizada para empresas, eventos, equipas e projetos individuais. Do design à entrega — tratamos de tudo.
            </p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <PrimaryBtn onClick={() => document.getElementById('configurador')?.scrollIntoView({ behavior: 'smooth' })}>
                Configurar agora
              </PrimaryBtn>
              <GhostBtn onClick={() => document.getElementById('galeria')?.scrollIntoView({ behavior: 'smooth' })}>
                Ver exemplos
              </GhostBtn>
            </div>
          </div>
        </div>
      </div>

      {/* COMO FUNCIONA */}
      <section style={{ padding: 'clamp(64px,7vw,96px) 0', background: 'var(--bg-1)', borderBottom: '1px solid var(--border)' }}>
        <div className="wrap">
          <SectionHead eyebrow="Processo" title="Como <em class='gold-text'>funciona</em>." lead="Simples, rápido e sem complicações — da ideia à peça final em 4 passos." />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 0, marginTop: 52, border: '1px solid var(--border)' }}>
            {[
              { n: '01', title: 'Configura', desc: 'Escolhe o artigo, tecido, técnica de personalização e cores no nosso configurador.' },
              { n: '02', title: 'Pede orçamento', desc: 'Submete o pedido com o teu design ou ideia. Respondemos em 24h com proposta.' },
              { n: '03', title: 'Aprova a prova', desc: 'Enviamos uma prova digital (ou física ≥50 unid.) antes de iniciar a produção.' },
              { n: '04', title: 'Recebe', desc: 'Produção em 10-15 dias úteis. Entregamos em qualquer ponto de Portugal.' },
            ].map((s, i) => (
              <div key={s.n} style={{ padding: 'clamp(28px,3vw,44px) clamp(20px,2.5vw,36px)', borderRight: i < 3 ? '1px solid var(--border)' : 'none', position: 'relative' }}>
                <div style={{ fontFamily: 'var(--f-display)', fontStyle: 'italic', fontSize: 56, color: 'rgba(176,141,87,.12)', fontWeight: 600, lineHeight: 1, marginBottom: 16, userSelect: 'none' }}>{s.n}</div>
                <div style={{ position: 'absolute', top: 28, left: 'clamp(20px,2.5vw,36px)', fontFamily: 'var(--f-sans)', fontSize: 10, letterSpacing: '.24em', color: 'var(--gold)', fontWeight: 600, textTransform: 'uppercase' }}>{s.n}</div>
                <h3 style={{ fontFamily: 'var(--f-display)', fontSize: 22, fontWeight: 500, marginBottom: 10, marginTop: -12 }}>{s.title}</h3>
                <p style={{ color: 'var(--fg-dim)', fontSize: 14, lineHeight: 1.7, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONFIGURADOR */}
      <section id="configurador" style={{ padding: 'clamp(64px,7vw,100px) 0', borderBottom: '1px solid var(--border)' }}>
        <div className="wrap">
          <SectionHead eyebrow="Configurador" title="Cria a tua <em class='gold-text'>peça única</em>." lead="Personaliza passo a passo e obtém uma estimativa de preço em tempo real." />

          {sent ? (
            <div style={{ marginTop: 52, maxWidth: 580, margin: '52px auto 0', textAlign: 'center', padding: 'clamp(48px,6vw,72px)', border: '1px solid var(--gold-3)', background: 'var(--bg-1)' }}>
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.2" style={{ margin: '0 auto 24px' }}>
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <h3 style={{ fontFamily: 'var(--f-display)', fontSize: 32, marginBottom: 14 }}>Pedido enviado!</h3>
              <p style={{ color: 'var(--fg-dim)', fontSize: 15, lineHeight: 1.7, marginBottom: 28 }}>Entraremos em contacto em menos de 24 horas com uma proposta personalizada para o seu projeto.</p>
              <PrimaryBtn onClick={() => { setSent(false); setStep(1); setGarment(''); setFabric(''); setPrintType(''); setNotes(''); setName(''); setEmail(''); setPhone('') }}>
                Novo pedido
              </PrimaryBtn>
            </div>
          ) : (
            <div style={{ marginTop: 52, display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32, alignItems: 'start' }}>

              {/* Steps */}
              <div style={{ border: '1px solid var(--border)', background: 'var(--bg-1)' }}>
                {/* Progress bar */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', borderBottom: '1px solid var(--border)' }}>
                  {['Artigo', 'Material', 'Técnica', 'Contacto'].map((label, i) => {
                    const s = i + 1
                    const done = step > s
                    const active = step === s
                    return (
                      <button key={label} onClick={() => { if (done || active) setStep(s) }}
                        style={{ padding: '18px 12px', background: active ? 'rgba(176,141,87,.08)' : 'transparent', border: 'none', borderRight: i < 3 ? '1px solid var(--border)' : 'none', cursor: done ? 'pointer' : active ? 'default' : 'not-allowed', borderBottom: active ? '2px solid var(--gold)' : '2px solid transparent', transition: 'all .2s' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                          <span style={{ width: 20, height: 20, borderRadius: '50%', background: done ? 'var(--gold)' : active ? 'var(--bordo)' : 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: done || active ? '#fff' : 'var(--fg-mute)', flexShrink: 0 }}>
                            {done ? '✓' : s}
                          </span>
                          <span style={{ fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: active ? 'var(--gold)' : done ? 'var(--fg)' : 'var(--fg-mute)', fontWeight: active ? 600 : 400 }}>{label}</span>
                        </div>
                      </button>
                    )
                  })}
                </div>

                <div style={{ padding: 'clamp(28px,3.5vw,44px)' }}>

                  {/* STEP 1 — Artigo */}
                  {step === 1 && (
                    <div>
                      <h3 style={{ fontFamily: 'var(--f-display)', fontSize: 24, marginBottom: 6 }}>Que artigo queres personalizar?</h3>
                      <p style={{ color: 'var(--fg-mute)', fontSize: 14, marginBottom: 28 }}>Escolhe o tipo de peça para o teu projeto.</p>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
                        {CUSTOM_GARMENTS.map(g => (
                          <button key={g.id} onClick={() => setGarment(g.id)}
                            style={{ padding: '20px 14px', border: `1px solid ${garment === g.id ? 'var(--gold)' : 'var(--border)'}`, background: garment === g.id ? 'rgba(176,141,87,.08)' : 'transparent', cursor: 'pointer', textAlign: 'center', transition: 'all .2s ease', position: 'relative' }}>
                            {garment === g.id && <div style={{ position: 'absolute', top: 8, right: 8, width: 16, height: 16, borderRadius: '50%', background: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontSize: 8, color: '#0B0B0C', fontWeight: 800 }}>✓</span></div>}
                            <div style={{ fontSize: 28, marginBottom: 8 }}>{g.icon}</div>
                            <div style={{ fontFamily: 'var(--f-display)', fontSize: 15, fontWeight: 500, marginBottom: 4, color: garment === g.id ? 'var(--gold)' : 'var(--fg)' }}>{g.label}</div>
                            <div style={{ fontSize: 11, color: 'var(--fg-mute)' }}>{g.desc}</div>
                          </button>
                        ))}
                      </div>
                      <div style={{ marginTop: 28, display: 'flex', justifyContent: 'flex-end' }}>
                        <PrimaryBtn onClick={() => { if (canNext1) setStep(2) }}>
                          Continuar →
                        </PrimaryBtn>
                      </div>
                    </div>
                  )}

                  {/* STEP 2 — Material */}
                  {step === 2 && (
                    <div>
                      <h3 style={{ fontFamily: 'var(--f-display)', fontSize: 24, marginBottom: 6 }}>Qual o material?</h3>
                      <p style={{ color: 'var(--fg-mute)', fontSize: 14, marginBottom: 28 }}>O tecido define o conforto, durabilidade e toque da peça.</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {CUSTOM_FABRICS.map(f => (
                          <button key={f.id} onClick={() => setFabric(f.id)}
                            style={{ padding: '18px 20px', border: `1px solid ${fabric === f.id ? 'var(--gold)' : 'var(--border)'}`, background: fabric === f.id ? 'rgba(176,141,87,.08)' : 'transparent', cursor: 'pointer', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all .2s ease' }}>
                            <div>
                              <div style={{ fontFamily: 'var(--f-display)', fontSize: 16, color: fabric === f.id ? 'var(--gold)' : 'var(--fg)', marginBottom: 3 }}>{f.label}</div>
                              <div style={{ fontSize: 12, color: 'var(--fg-mute)' }}>{f.note}</div>
                            </div>
                            <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${fabric === f.id ? 'var(--gold)' : 'var(--border)'}`, background: fabric === f.id ? 'var(--gold)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              {fabric === f.id && <span style={{ fontSize: 8, color: '#0B0B0C', fontWeight: 800 }}>✓</span>}
                            </div>
                          </button>
                        ))}
                      </div>
                      <div style={{ marginTop: 28, display: 'flex', justifyContent: 'space-between' }}>
                        <GhostBtn onClick={() => setStep(1)}>← Voltar</GhostBtn>
                        <PrimaryBtn onClick={() => { if (canNext2) setStep(3) }}>Continuar →</PrimaryBtn>
                      </div>
                    </div>
                  )}

                  {/* STEP 3 — Técnica + cor + quantidade */}
                  {step === 3 && (
                    <div>
                      <h3 style={{ fontFamily: 'var(--f-display)', fontSize: 24, marginBottom: 6 }}>Técnica, cor e quantidade</h3>
                      <p style={{ color: 'var(--fg-mute)', fontSize: 14, marginBottom: 28 }}>Define como fica o teu design e quantas peças precisas.</p>

                      <div style={{ marginBottom: 24 }}>
                        <label style={{ fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 600, display: 'block', marginBottom: 12 }}>Técnica de personalização</label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10 }}>
                          {CUSTOM_PRINTS.map(p => (
                            <button key={p.id} onClick={() => setPrintType(p.id)}
                              style={{ padding: '14px 16px', border: `1px solid ${printType === p.id ? 'var(--gold)' : 'var(--border)'}`, background: printType === p.id ? 'rgba(176,141,87,.08)' : 'transparent', cursor: 'pointer', textAlign: 'left', transition: 'all .2s ease' }}>
                              <div style={{ fontSize: 13, fontWeight: 600, color: printType === p.id ? 'var(--gold)' : 'var(--fg)', marginBottom: 3 }}>{p.label}</div>
                              <div style={{ fontSize: 11, color: 'var(--fg-mute)' }}>{p.note}</div>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div style={{ marginBottom: 24 }}>
                        <label style={{ fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 600, display: 'block', marginBottom: 12 }}>Cor base da peça</label>
                        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                          {CUSTOM_COLORS.map(c => (
                            <button key={c} onClick={() => setColor(c)}
                              style={{ width: 34, height: 34, borderRadius: '50%', background: c, border: `3px solid ${color === c ? 'var(--gold)' : 'transparent'}`, outline: `1px solid ${c === '#F5F2ED' ? 'var(--border)' : 'transparent'}`, cursor: 'pointer', transition: 'border-color .2s', boxShadow: color === c ? '0 0 0 2px var(--bg)' : 'none' }} />
                          ))}
                        </div>
                      </div>

                      <div style={{ marginBottom: 24 }}>
                        <label style={{ fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 600, display: 'block', marginBottom: 12 }}>Quantidade — <span style={{ color: 'var(--fg)' }}>{qty} unidades</span></label>
                        <input type="range" min={1} max={500} value={qty} onChange={e => setQty(Number(e.target.value))}
                          style={{ width: '100%', accentColor: 'var(--gold)', cursor: 'pointer' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--fg-mute)', marginTop: 6 }}>
                          <span>1 un.</span>
                          <span>500 un.</span>
                        </div>
                        <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                          {[10, 25, 50, 100, 250].map(n => (
                            <button key={n} onClick={() => setQty(n)}
                              style={{ padding: '5px 12px', fontSize: 11, border: `1px solid ${qty === n ? 'var(--gold)' : 'var(--border)'}`, background: qty === n ? 'rgba(176,141,87,.1)' : 'transparent', color: qty === n ? 'var(--gold)' : 'var(--fg-mute)', cursor: 'pointer', letterSpacing: '.08em', transition: 'all .2s' }}>
                              {n}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div style={{ marginBottom: 8 }}>
                        <label style={{ fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 600, display: 'block', marginBottom: 10 }}>Notas adicionais <span style={{ color: 'var(--fg-mute)', fontWeight: 400 }}>(opcional)</span></label>
                        <textarea value={notes} onChange={e => setNotes(e.target.value)}
                          placeholder="Descreve o teu design, logo, texto a incluir, referências..."
                          rows={3} style={{ width: '100%', background: 'transparent', border: '1px solid var(--border)', padding: '12px 14px', color: 'var(--fg)', fontSize: 14, outline: 'none', resize: 'vertical', fontFamily: 'var(--f-sans)', transition: 'border-color .2s', boxSizing: 'border-box' }}
                          onFocus={e => (e.currentTarget.style.borderColor = 'var(--gold-3)')}
                          onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')} />
                      </div>

                      <div style={{ marginTop: 28, display: 'flex', justifyContent: 'space-between' }}>
                        <GhostBtn onClick={() => setStep(2)}>← Voltar</GhostBtn>
                        <PrimaryBtn onClick={() => { if (canNext3) setStep(4) }}>Continuar →</PrimaryBtn>
                      </div>
                    </div>
                  )}

                  {/* STEP 4 — Contacto */}
                  {step === 4 && (
                    <div>
                      <h3 style={{ fontFamily: 'var(--f-display)', fontSize: 24, marginBottom: 6 }}>Os teus dados de contacto</h3>
                      <p style={{ color: 'var(--fg-mute)', fontSize: 14, marginBottom: 28 }}>Preenchidos, enviamos-te uma proposta personalizada em 24h.</p>
                      {[
                        { id: 'name', label: 'Nome / Empresa', ph: 'O teu nome ou empresa', val: name, set: setName, type: 'text' },
                        { id: 'email', label: 'Email', ph: 'email@exemplo.pt', val: email, set: setEmail, type: 'email' },
                        { id: 'phone', label: 'Telefone', ph: '+351 9xx xxx xxx', val: phone, set: setPhone, type: 'tel' },
                      ].map(f => (
                        <div key={f.id} style={{ marginBottom: 22 }}>
                          <label style={{ display: 'block', fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 8, fontWeight: 600 }}>{f.label}{f.id !== 'phone' && ' *'}</label>
                          <input type={f.type} placeholder={f.ph} value={f.val} onChange={e => f.set(e.target.value)}
                            style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border)', padding: '10px 0', color: 'var(--fg)', fontSize: 15, outline: 'none', transition: 'border-color .2s', boxSizing: 'border-box' }}
                            onFocus={e => (e.currentTarget.style.borderBottomColor = 'var(--gold)')}
                            onBlur={e => (e.currentTarget.style.borderBottomColor = 'var(--border)')} />
                        </div>
                      ))}
                      <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                          <GhostBtn onClick={() => setStep(3)}>← Voltar</GhostBtn>
                          <PrimaryBtn onClick={handleSubmit}>{loading ? 'A enviar…' : 'Pedir orçamento'}</PrimaryBtn>
                        </div>
                        {error && <p style={{ fontSize: 13, color: 'var(--bordo)', lineHeight: 1.5, margin: 0 }}>{error}</p>}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Resumo / Estimativa */}
              <div style={{ position: 'sticky', top: 90, display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ border: '1px solid var(--border)', background: 'var(--bg-1)', padding: '28px 24px' }}>
                  <div style={{ fontSize: 10, letterSpacing: '.24em', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 600, marginBottom: 20 }}>Resumo da configuração</div>

                  {[
                    { label: 'Artigo', value: garment ? CUSTOM_GARMENTS.find(g => g.id === garment)?.label : '—' },
                    { label: 'Material', value: fabric ? CUSTOM_FABRICS.find(f => f.id === fabric)?.label : '—' },
                    { label: 'Técnica', value: printType ? CUSTOM_PRINTS.find(p => p.id === printType)?.label : '—' },
                    { label: 'Cor base', value: color ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ width: 14, height: 14, borderRadius: '50%', background: color, display: 'inline-block', border: '1px solid var(--border)' }} />{color}</span> : '—' },
                    { label: 'Quantidade', value: qty ? `${qty} un.` : '—' },
                  ].map(row => (
                    <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)', gap: 12 }}>
                      <span style={{ fontSize: 12, color: 'var(--fg-mute)' }}>{row.label}</span>
                      <span style={{ fontSize: 13, color: 'var(--fg)', fontWeight: 500, textAlign: 'right' }}>{row.value}</span>
                    </div>
                  ))}

                  {price ? (
                    <div style={{ marginTop: 20, padding: '16px 0', borderTop: '1px solid var(--gold-3)' }}>
                      <div style={{ fontSize: 10, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--fg-mute)', marginBottom: 10 }}>Estimativa de preço*</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontSize: 13, color: 'var(--fg-dim)' }}>Preço unitário</span>
                        <span style={{ fontSize: 14, fontWeight: 600 }}>{price.unit}€</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 13, color: 'var(--fg-dim)' }}>Total estimado</span>
                        <span style={{ fontSize: 18, fontFamily: 'var(--f-display)', color: 'var(--gold)', fontWeight: 500 }}>{price.total}€</span>
                      </div>
                      {qty >= 10 && (
                        <div style={{ marginTop: 12, padding: '8px 12px', background: 'rgba(176,141,87,.08)', border: '1px solid var(--gold-3)', fontSize: 11, color: 'var(--gold)' }}>
                          ✓ Desconto de quantidade aplicado ({qty >= 50 ? '15%' : qty >= 20 ? '10%' : '5%'} off)
                        </div>
                      )}
                      <p style={{ fontSize: 10, color: 'var(--fg-mute)', marginTop: 12, lineHeight: 1.6, margin: '12px 0 0' }}>*Estimativa indicativa. O preço final é confirmado após análise do pedido.</p>
                    </div>
                  ) : (
                    <div style={{ marginTop: 20, padding: '16px', background: 'rgba(176,141,87,.05)', border: '1px dashed var(--border)', textAlign: 'center', color: 'var(--fg-mute)', fontSize: 13 }}>
                      Complete a configuração para ver a estimativa de preço
                    </div>
                  )}
                </div>

                <div style={{ border: '1px solid var(--border)', background: 'var(--bg-1)', padding: '20px 24px' }}>
                  <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 14, color: 'var(--fg)' }}>Precisa de ajuda?</div>
                  {[
                    ['📞', 'karmicnode@gmail.com'],
                    ['⚡', 'Resposta em menos de 24h'],
                    ['🔒', 'Orçamento sem compromisso'],
                  ].map(([icon, text]) => (
                    <div key={text} style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10, fontSize: 13, color: 'var(--fg-mute)' }}>
                      <span>{icon}</span><span>{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* GALERIA */}
      <section id="galeria" style={{ padding: 'clamp(64px,7vw,100px) 0', background: 'var(--bg-1)', borderBottom: '1px solid var(--border)' }}>
        <div className="wrap">
          <SectionHead eyebrow="Galeria" title="Exemplos do nosso <em class='gold-text'>trabalho</em>." lead="Cada peça é única. Estas são algumas das criações que produzimos para os nossos clientes." />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 2, marginTop: 52 }}>
            {GALLERY_ITEMS.map((item, i) => {
              const [hov, setHov] = useState(false)
              return (
                <div key={item.img} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
                  style={{ position: 'relative', aspectRatio: i === 0 || i === 3 ? '4/5' : '4/5', overflow: 'hidden', background: 'var(--bg-2)', cursor: 'pointer' }}>
                  <img src={item.img} alt={item.label} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .7s ease', transform: hov ? 'scale(1.07)' : 'scale(1)' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(11,11,12,.8) 0%, transparent 50%)', opacity: hov ? 1 : 0, transition: 'opacity .4s ease' }} />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 20px', transform: hov ? 'translateY(0)' : 'translateY(12px)', opacity: hov ? 1 : 0, transition: 'all .4s ease' }}>
                    <div style={{ fontSize: 9, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 4 }}>{item.cat}</div>
                    <div style={{ fontFamily: 'var(--f-display)', fontSize: 17, fontWeight: 500 }}>{item.label}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* VANTAGENS */}
      <section style={{ padding: 'clamp(64px,7vw,96px) 0', borderBottom: '1px solid var(--border)' }}>
        <div className="wrap">
          <SectionHead eyebrow="Porquê nós" title="O que nos <em class='gold-text'>distingue</em>." />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16, marginTop: 52 }}>
            {[
              { icon: '🎨', title: 'Design incluído', desc: 'A nossa equipa ajuda-te a adaptar ou criar o teu design sem custos adicionais na maioria dos projetos.' },
              { icon: '⏱️', title: 'Prazos cumpridos', desc: 'Produção em 10 a 15 dias úteis. Serviço urgente disponível com entrega em 5-7 dias.' },
              { icon: '📦', title: 'Mínimos acessíveis', desc: 'A partir de 1 unidade em bordado e DTG. Para serigrafia, o mínimo são 20 unidades.' },
              { icon: '✅', title: 'Prova antes de produzir', desc: 'Enviamos sempre uma prova digital para aprovação. Sem surpresas na entrega.' },
              { icon: '🌱', title: 'Opções sustentáveis', desc: 'Algodão orgânico certificado GOTS disponível em todos os artigos de vestuário.' },
              { icon: '🤝', title: 'Parcerias empresariais', desc: 'Acordos especiais para empresas com pedidos recorrentes. Fatura simplificada disponível.' },
            ].map(v => (
              <div key={v.title} style={{ display: 'flex', gap: 20, padding: 'clamp(20px,2vw,28px)', border: '1px solid var(--border)', background: 'var(--bg-1)', alignItems: 'flex-start' }}>
                <div style={{ fontSize: 24, flexShrink: 0, marginTop: 2 }}>{v.icon}</div>
                <div>
                  <h4 style={{ fontFamily: 'var(--f-display)', fontSize: 18, fontWeight: 500, marginBottom: 7 }}>{v.title}</h4>
                  <p style={{ color: 'var(--fg-dim)', fontSize: 14, lineHeight: 1.7, margin: 0 }}>{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: 'clamp(64px,7vw,100px) 0', background: 'var(--bg-1)', borderBottom: '1px solid var(--border)' }}>
        <div className="wrap" style={{ maxWidth: 800, margin: '0 auto' }}>
          <SectionHead eyebrow="FAQ" title="Perguntas <em class='gold-text'>frequentes</em>." />
          <div style={{ marginTop: 48, border: '1px solid var(--border)' }}>
            {CUSTOM_FAQS.map((faq, i) => (
              <div key={i} style={{ borderBottom: i < CUSTOM_FAQS.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ width: '100%', padding: '22px 24px', background: openFaq === i ? 'rgba(176,141,87,.05)' : 'transparent', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, textAlign: 'left', transition: 'background .2s' }}>
                  <span style={{ fontFamily: 'var(--f-display)', fontSize: 17, fontWeight: 500, color: openFaq === i ? 'var(--gold)' : 'var(--fg)', transition: 'color .2s' }}>{faq.q}</span>
                  <span style={{ color: 'var(--gold)', fontSize: 18, flexShrink: 0, transition: 'transform .3s ease', transform: openFaq === i ? 'rotate(45deg)' : 'none', display: 'inline-block' }}>+</span>
                </button>
                {openFaq === i && (
                  <div style={{ padding: '0 24px 22px', color: 'var(--fg-dim)', fontSize: 15, lineHeight: 1.75 }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{ padding: 'clamp(64px,7vw,100px) 0', background: `radial-gradient(700px 400px at 50% 0%, rgba(139,30,45,.3), transparent 70%), var(--bg)`, textAlign: 'center' }}>
        <div className="wrap" style={{ maxWidth: 580 }}>
          <Eyebrow text="Pronto para começar?" />
          <h2 style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(30px,3.5vw,52px)', fontWeight: 500, margin: '20px 0 16px', lineHeight: 1.1 }}>
            Transforma a tua <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>ideia em roupa</em>.
          </h2>
          <p style={{ color: 'var(--fg-mute)', fontSize: 15, marginBottom: 36, lineHeight: 1.7 }}>
            Usa o configurador acima ou contacta-nos diretamente. Sem mínimos para começar.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <PrimaryBtn onClick={() => document.getElementById('configurador')?.scrollIntoView({ behavior: 'smooth' })}>
              Configurar agora
            </PrimaryBtn>
            <GhostBtn onClick={() => setPage('contact')}>Falar connosco</GhostBtn>
          </div>
        </div>
      </section>

    </div>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <footer style={{ background: '#08080a', borderTop: '1px solid var(--border)', padding: 'clamp(56px,6vw,80px) var(--pad-x) 36px' }}>
      <div style={{ maxWidth: 'var(--maxw)', margin: '0 auto' }}>
        <div className="kn-footer-grid">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 18 }}>
              <svg viewBox="0 0 40 40" fill="none" style={{ width: 34, height: 34, flexShrink: 0 }}>
                <path d="M20 3L34 8V21C34 29 27.5 34.5 20 37C12.5 34.5 6 29 6 21V8Z" stroke="#B08D57" strokeWidth="1.2" fill="rgba(139,30,45,0.35)" />
                <line x1="20" y1="9" x2="20" y2="30" stroke="#B08D57" strokeWidth="1.2" />
                <line x1="15.5" y1="14" x2="24.5" y2="14" stroke="#B08D57" strokeWidth="1.2" />
              </svg>
              <span style={{ fontFamily: 'var(--f-display)', fontSize: 19, letterSpacing: '.14em', textTransform: 'uppercase', fontWeight: 500 }}>
                Karmic<span style={{ color: 'var(--gold)' }}>·</span>Node
              </span>
            </div>
            <p style={{ color: 'var(--fg-mute)', fontSize: 14, lineHeight: 1.7, maxWidth: '30ch', marginBottom: 22 }}>
              Moda com alma. Peças atemporais, selecionadas com rigor. Cartaxo, Portugal.
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              {['instagram', 'facebook', 'linkedin'].map(s => (
                <a key={s} href="#" style={{ width: 36, height: 36, border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--fg-mute)', transition: 'all .2s ease' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--gold)'; (e.currentTarget as HTMLElement).style.color = 'var(--gold)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--fg-mute)' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    {s === 'instagram' && <><rect x="3" y="3" width="18" height="18" rx="4" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" /></>}
                    {s === 'facebook' && <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />}
                    {s === 'linkedin' && <><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" /><circle cx="4" cy="4" r="2" /></>}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {[
            { title: 'Loja', links: [{ l: 'Tops', p: 'shop' }, { l: 'Calças', p: 'shop' }, { l: 'Vestidos', p: 'shop' }, { l: 'Casacos', p: 'shop' }, { l: 'Acessórios', p: 'shop' }, { l: 'Promoções', p: 'shop' }] as { l: string; p: Page }[] },
            { title: 'Empresa', links: [{ l: 'Quem Somos', p: 'about' }, { l: 'Roupa Personalizada', p: 'custom' }, { l: 'Blog', p: 'blog' }, { l: 'Sustentabilidade', p: 'about' }, { l: 'Parcerias', p: 'contact' }, { l: 'Contacto', p: 'contact' }] as { l: string; p: Page }[] },
            { title: 'Apoio', links: [{ l: 'FAQ', p: 'home' }, { l: 'Política de Envio', p: 'home' }, { l: 'Devoluções', p: 'home' }, { l: 'Garantia', p: 'home' }, { l: 'Privacidade', p: 'home' }, { l: 'Termos', p: 'home' }] as { l: string; p: Page }[] },
          ].map(col => (
            <div key={col.title}>
              <h5 style={{ fontFamily: 'var(--f-sans)', fontSize: 11, letterSpacing: '.24em', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 500, margin: '0 0 18px' }}>{col.title}</h5>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {col.links.map(({ l, p }) => (
                  <li key={l}>
                    <a href="#" onClick={e => { e.preventDefault(); setPage(p) }}
                      style={{ color: 'var(--fg-dim)', fontSize: 14, transition: 'color .2s ease, padding-left .2s ease', display: 'inline-block' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--gold)'; (e.currentTarget as HTMLElement).style.paddingLeft = '6px' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--fg-dim)'; (e.currentTarget as HTMLElement).style.paddingLeft = '0' }}>
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 22, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ fontSize: 12, color: 'var(--fg-mute)', letterSpacing: '.04em' }}>
            © 2026 Karmic Node · Todos os direitos reservados · karmicnode@gmail.com
          </span>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            {['MB', 'VISA', 'MC', 'PayPal', 'MBWay'].map(m => (
              <span key={m} style={{ fontSize: 10, letterSpacing: '.14em', color: 'var(--fg-mute)', border: '1px solid var(--border)', padding: '4px 8px' }}>{m}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

// ─── Misc components ──────────────────────────────────────────────────────────

function Countdown() {
  const [time, setTime] = useState({ h: 11, m: 42, s: 17 })
  useEffect(() => {
    const t = setInterval(() => {
      setTime(prev => {
        let { h, m, s } = prev
        s--; if (s < 0) { s = 59; m-- } if (m < 0) { m = 59; h-- } if (h < 0) { h = 23; m = 59; s = 59 }
        return { h, m, s }
      })
    }, 1000)
    return () => clearInterval(t)
  }, [])
  const pad = (n: number) => String(n).padStart(2, '0')
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 10, letterSpacing: '.28em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 18 }}>Oferta termina em</div>
      <div className="kn-promo-countdown" style={{ display: 'flex', gap: 14 }}>
        {[['h', pad(time.h), 'Horas'], ['m', pad(time.m), 'Minutos'], ['s', pad(time.s), 'Segundos']].map(([, val, label]) => (
          <div key={label} style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(44px,5.5vw,80px)', fontWeight: 500, lineHeight: 1, background: 'rgba(11,11,12,.5)', border: '1px solid var(--border)', padding: '12px 20px', minWidth: 80 }}>{val}</div>
            <div style={{ fontSize: 9, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--fg-mute)', marginTop: 8 }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)
  return done ? (
    <div style={{ padding: '18px 28px', border: '1px solid var(--gold-3)', display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center', color: 'var(--gold)' }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
      <span style={{ fontSize: 14 }}>Subscrito com sucesso! Obrigado.</span>
    </div>
  ) : (
    <form onSubmit={e => { e.preventDefault(); if (email) setDone(true) }} style={{ display: 'flex', border: '1px solid var(--gold-3)' }}>
      <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="O seu endereço de email"
        style={{ flex: 1, background: 'transparent', border: 'none', padding: '14px 18px', color: 'var(--fg)', fontFamily: 'var(--f-sans)', fontSize: 14, outline: 'none' }} />
      <button type="submit" style={{ padding: '14px 22px', background: 'var(--gold)', border: 'none', color: '#0B0B0C', fontFamily: 'var(--f-sans)', fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase', fontWeight: 700, flexShrink: 0 }}>
        Subscrever
      </button>
    </form>
  )
}

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [activePage, setActivePage] = useState<Page>('home')
  const [activeProduct, setActiveProduct] = useState<Product | null>(null)
  const [shopFilter, setShopFilter] = useState('Todos')
  const [cartOpen, setCartOpen] = useState(false)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [wishlist, setWishlist] = useState<Set<number>>(new Set())
  const [toast, setToast] = useState<string | null>(null)
  const [backTop, setBackTop] = useState(false)
  const [liveProducts, setLiveProducts] = useState<Product[]>([...ALL_PRODUCTS])
  const toastTimer = useRef<number | null>(null)

  useEffect(() => {
    fetch('/api/products')
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.products?.length) setLiveProducts(data.products) })
      .catch(() => {})
  }, [])

  useEffect(() => {
    const h = () => setBackTop(window.scrollY > 400)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const status = params.get('pagamento')
    if (status === 'sucesso') {
      setToast('✅ Pagamento concluído! Obrigado pela sua compra.')
      setCartItems([])
      window.history.replaceState({}, '', '/')
    } else if (status === 'cancelado') {
      setToast('Pagamento cancelado. O carrinho foi mantido.')
      window.history.replaceState({}, '', '/')
    }
  }, [])

  const navigate = useCallback((p: Page, filter?: string) => {
    setActivePage(p)
    setActiveProduct(null)
    if (p === 'shop') setShopFilter(filter ?? 'Todos')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const setPage = useCallback((p: Page) => navigate(p), [navigate])

  const openProduct = useCallback((p: Product) => {
    setActiveProduct(p)
    setActivePage('product')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const addToCart = useCallback((p: Product) => {
    setCartItems(prev => {
      const ex = prev.find(i => i.id === p.id)
      return ex ? prev.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i) : [...prev, { ...p, qty: 1 }]
    })
    if (toastTimer.current) clearTimeout(toastTimer.current)
    setToast(p.name)
    toastTimer.current = window.setTimeout(() => setToast(null), 2400)
  }, [])

  const updateQty = useCallback((id: number, qty: number) => {
    setCartItems(prev => prev.map(i => i.id === id ? { ...i, qty } : i))
  }, [])

  const removeFromCart = useCallback((id: number) => {
    setCartItems(prev => prev.filter(i => i.id !== id))
  }, [])

  const toggleWish = useCallback((id: number) => {
    setWishlist(prev => {
      const n = new Set(prev)
      n.has(id) ? n.delete(id) : n.add(id)
      return n
    })
  }, [])

  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0)

  const sharedProps = { onAdd: addToCart, onOpen: openProduct, wishlist, toggleWish, products: liveProducts }

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--fg)', minHeight: '100vh' }}>
      <Header activePage={activePage} shopFilter={shopFilter} navigate={navigate} cartCount={cartCount} openCart={() => setCartOpen(true)} />

      {activePage === 'home' && <HomePage {...sharedProps} setPage={setPage} />}
      {activePage === 'shop' && <ShopPage key={shopFilter} {...sharedProps} initialCategory={shopFilter} />}
      {activePage === 'product' && activeProduct && (
        <ProductPage product={activeProduct} {...sharedProps} onBack={() => setPage('shop')} allProducts={liveProducts} />
      )}
      {activePage === 'contact' && <ContactPage />}
      {activePage === 'about' && <AboutPage setPage={setPage} />}
      {activePage === 'blog' && <BlogPage />}
      {activePage === 'custom' && <CustomPage setPage={setPage} />}

      <Footer setPage={setPage} />

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} items={cartItems} updateQty={updateQty} remove={removeFromCart} />

      {toast && (
        <div className="kn-toast">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
          <span><b style={{ color: 'var(--fg)' }}>{toast.length > 30 ? toast.slice(0, 30) + '…' : toast}</b> adicionado ao carrinho</span>
        </div>
      )}

      <button className={`kn-back-top ${backTop ? 'visible' : ''}`} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 15l-6-6-6 6" /></svg>
      </button>
    </div>
  )
}
