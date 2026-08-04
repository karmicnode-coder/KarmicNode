import React, { useState, useEffect, useRef, useCallback, type ReactNode } from 'react'

// ─── Types ───────────────────────────────────────────────────────────────────

type Page = 'home' | 'shop' | 'product' | 'contact' | 'about' | 'blog'

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
    title: 'Os melhores portáteis para trabalho remoto em 2026',
    slug: 'melhores-portateis-trabalho-remoto-2026',
    category: 'Portáteis',
    excerpt: 'Trabalhar a partir de casa tornou-se a norma para milhões de profissionais. Analisámos os melhores portáteis do mercado para ajudar na sua escolha.',
    body: [
      'O trabalho remoto veio para ficar e escolher o portátil certo faz toda a diferença na produtividade diária. Em 2026, o mercado oferece opções extraordinárias para todos os perfis e orçamentos.',
      'Para profissionais de criação de conteúdo, o Apple MacBook Pro 14" com chip M3 continua a ser a referência absoluta. A sua autonomia de 18 horas, o ecrã Liquid Retina XDR e o desempenho consistente em tarefas pesadas como edição de vídeo 4K colocam-no num patamar diferente.',
      'Para quem trabalha em Windows e valoriza a versatilidade, os portáteis com processadores Intel Core Ultra de 13ª geração oferecem uma excelente relação desempenho/autonomia. O Dell XPS 15 e o ASUS ZenBook Pro são escolhas sólidas neste segmento.',
      'A conectividade é outro fator crítico. Certifique-se que o portátil escolhido inclui Thunderbolt 4, Wi-Fi 6E e, idealmente, porta SD card para fotógrafos e videógrafos. A qualidade da webcam integrada também ganha importância para videochamadas diárias.',
      'O nosso conselho: invista num portátil com pelo menos 16 GB de RAM e SSD NVMe de 512 GB. Estes são os requisitos mínimos para um fluxo de trabalho fluido em 2026, especialmente com as exigências crescentes das ferramentas de IA generativa.',
    ],
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200&q=85',
    author: 'Karmic Node',
    date: '18 Jul 2026',
    readTime: 6,
    featured: true,
  },
  {
    id: 2,
    title: 'Como escolher o monitor perfeito para o seu setup',
    slug: 'como-escolher-monitor-setup',
    category: 'Monitores',
    excerpt: 'Tamanho, resolução, taxa de atualização, tipo de painel — há muitos fatores a considerar. Este guia simplifica a decisão.',
    body: [
      'Escolher um monitor pode parecer simples, mas há nuances importantes que determinam se o ecrã que comprou é realmente adequado ao seu uso.',
      'O primeiro fator é o tamanho e a resolução. Para trabalho de escritório, um monitor de 24" Full HD (1920×1080) é suficiente. Para edição de imagem ou design gráfico, prefira 27" com resolução QHD (2560×1440) ou superior. Para edição de vídeo profissional, considere 4K a partir de 27".',
      'O tipo de painel é determinante para a qualidade de imagem. Os painéis IPS oferecem ângulos de visão amplos e reprodução de cores precisa — ideais para design e fotografia. Os painéis VA têm maior contraste e são bons para consumo de conteúdo. Os painéis TN são mais rápidos mas com pior reprodução de cor — eram populares para gaming mas estão a ser substituídos por IPS de alta taxa de atualização.',
      'Para gaming, a taxa de atualização é crítica. 144Hz é hoje o mínimo recomendado, com 165Hz e 240Hz a tornarem-se cada vez mais acessíveis. Combine com G-Sync (NVIDIA) ou FreeSync (AMD) para eliminar o screen tearing.',
      'Não negligencie a ergonomia: um monitor com ajuste de altura, inclinação e rotação poupa imensos problemas de postura ao longo do tempo. A certificação flicker-free e o filtro de luz azul são também importantes para quem passa muitas horas em frente ao ecrã.',
    ],
    image: 'https://images.unsplash.com/photo-1527443224154-c4a573d5aa47?w=1200&q=85',
    author: 'Karmic Node',
    date: '12 Jul 2026',
    readTime: 5,
  },
  {
    id: 3,
    title: 'SSD NVMe vs SATA: a diferença real no dia a dia',
    slug: 'ssd-nvme-vs-sata-diferenca-real',
    category: 'Armazenamento',
    excerpt: 'Os números de velocidade impressionam, mas o que significa isso na prática? Testámos ambos em cenários reais de uso.',
    body: [
      'A diferença entre um SSD NVMe e um SSD SATA é frequentemente apresentada através de números que chegam a ser vertiginosos: 7.000 MB/s vs 550 MB/s de leitura sequencial. Mas o que isso significa no uso quotidiano?',
      'Para tarefas de escritório — abrir documentos, navegar na web, enviar emails — a diferença é quase imperceptível. O que ambos os tipos de SSD partilham é a enorme vantagem sobre os HDD tradicionais, que mal chegam aos 150 MB/s.',
      'As diferenças começam a tornar-se tangíveis em cenários específicos: transferência de ficheiros grandes (edição de vídeo, backup de ficheiros RAW), compilação de código em projetos grandes, e importação de assets em software criativo. Nestes casos, o NVMe pode ser 5 a 10 vezes mais rápido.',
      'Para um utilizador que edita vídeo 4K ou trabalha com ficheiros de projeto muito grandes, o Samsung 980 Pro ou o WD Black SN850X fazem uma diferença real e justificam o investimento adicional. Para uso geral, um bom SSD SATA é mais do que suficiente.',
      'A nossa recomendação: se está a montar um PC novo ou a fazer upgrade, opte sempre por NVMe — as diferenças de preço são hoje mínimas e a margem de futuro é maior. Se está a adicionar armazenamento secundário para guardar ficheiros, SATA é uma opção económica perfeitamente válida.',
    ],
    image: 'https://images.unsplash.com/photo-1601737487795-dab272f52420?w=1200&q=85',
    author: 'Karmic Node',
    date: '5 Jul 2026',
    readTime: 4,
  },
  {
    id: 4,
    title: 'Setup de streaming profissional: guia para iniciantes',
    slug: 'setup-streaming-profissional-iniciantes',
    category: 'Streaming',
    excerpt: 'Quer começar a fazer streaming mas não sabe por onde começar? Criámos um guia completo com o equipamento essencial.',
    body: [
      'O streaming tornou-se uma forma legítima de criar conteúdo e construir comunidade. Mas começar pode ser intimidante com tantas opções de equipamento disponíveis. Este guia foca-se no essencial.',
      'O primeiro investimento deve ser um bom microfone. O áudio de qualidade é mais importante que o vídeo para reter espectadores. O Rode NT-USB Mini é uma excelente opção de entrada — plug and play, qualidade de estúdio, preço acessível.',
      'A webcam vem a seguir. A Logitech C920s Pro é o standard da indústria por uma razão: 1080p fluido, boa performance em baixa luminosidade e obturador de privacidade integrado. Para ambientes com iluminação controlada, é difícil bater esta câmara pelo preço.',
      'O Elgato Stream Deck transforma radicalmente o workflow de um streamer. Ter ações de OBS, clips de áudio, transições de cena e outros atalhos num toque físico elimina distrações e permite focar no conteúdo. Parece luxo mas rapidamente se torna indispensável.',
      'Não esqueça a iluminação — frequentemente o item mais negligenciado. Um anel de luz ou dois painéis LED (key light + fill light) fazem uma diferença dramática na qualidade visual. O Elgato Key Light Air é a escolha dos profissionais mas há opções mais económicas que funcionam muito bem.',
    ],
    image: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=1200&q=85',
    author: 'Karmic Node',
    date: '28 Jun 2026',
    readTime: 7,
  },
  {
    id: 5,
    title: 'Wi-Fi 6E: vale mesmo a pena fazer o upgrade?',
    slug: 'wifi-6e-vale-a-pena-upgrade',
    category: 'Networking',
    excerpt: 'O Wi-Fi 6E prometeu revolucionar as redes domésticas. Passado algum tempo, analisamos se as promessas se concretizaram.',
    body: [
      'O Wi-Fi 6E trouxe a banda dos 6 GHz para redes sem fios domésticas, aumentando drasticamente a capacidade disponível. Mas para a maioria dos utilizadores, o upgrade justifica-se?',
      'A banda de 6 GHz é nova e praticamente sem interferência — ao contrário das bandas de 2.4 GHz e 5 GHz, que em ambientes urbanos estão congestionadas com dezenas de redes sobrepostas. Isto traduz-se em menor latência e maior estabilidade de ligação.',
      'Para utilizadores com muitos dispositivos conectados simultaneamente — smart TVs, consolas, smartphones, laptops, dispositivos IoT — o Wi-Fi 6E com um sistema mesh como o TP-Link Deco XE75 Pro faz uma diferença notável. O agendamento OFDMA distribui a capacidade de forma muito mais eficiente entre dispositivos.',
      'A limitação principal é o alcance: a banda de 6 GHz tem menor penetração em paredes do que 5 GHz. Para casas grandes ou com muitas divisórias, um sistema mesh com dois ou três nós é essencial.',
      'Veredicto: se tem um router Wi-Fi 5 ou inferior e a sua rede tem mais de 10 dispositivos, o upgrade para Wi-Fi 6E compensa claramente. Se já tem Wi-Fi 6 e menos de 10 dispositivos, pode esperar pelo Wi-Fi 7.',
    ],
    image: 'https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=1200&q=85',
    author: 'Karmic Node',
    date: '20 Jun 2026',
    readTime: 5,
  },
  {
    id: 6,
    title: 'Os melhores auriculares com cancelamento de ruído em 2026',
    slug: 'melhores-auriculares-anc-2026',
    category: 'Áudio',
    excerpt: 'Testámos os principais modelos do mercado em escritórios, transportes públicos e em casa. Os resultados surpreenderam-nos.',
    body: [
      'O cancelamento ativo de ruído (ANC) democratizou-se nos últimos anos. Hoje é possível encontrar auriculares com ANC competente a menos de 50€. Mas os modelos premium ainda justificam o preço?',
      'Os Sony WH-1000XM5 continuam a ser o benchmark do segmento. O ANC adaptativo com 8 microfones é simplesmente o melhor disponível em auriculares consumer — capaz de eliminar vozes humanas, motor de avião e ruído de escritório em aberto de forma impressionante.',
      'A qualidade sonora dos XM5 também evoluiu em relação à geração anterior. Os drivers de 30mm com dome de carbono oferecem uma resposta em frequência equilibrada, com graves controlados e médios detalhados — e o suporte a LDAC permite qualidade de áudio Hi-Res via Bluetooth.',
      'Para quem tem orçamento mais limitado, os Nothing Ear (2) e os Anker Soundcore Q45 oferecem ANC surpreendentemente eficaz a um terço do preço dos Sony. Não chegam ao nível dos XM5 mas são escolhas inteligentes.',
      'Ponto frequentemente ignorado: o conforto para uso prolongado. Os Sony XM5 são dos mais confortáveis do mercado para sessões de 4+ horas. A qualidade dos almofadas e a pressão lateral moderada fazem diferença em dias longos de trabalho.',
    ],
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&q=85',
    author: 'Karmic Node',
    date: '10 Jun 2026',
    readTime: 6,
  },
  {
    id: 7,
    title: 'Memória RAM DDR5: tudo o que precisa de saber',
    slug: 'memoria-ram-ddr5-guia-completo',
    category: 'Hardware',
    excerpt: 'A DDR5 tornou-se mainstream mas ainda gera muitas dúvidas. Explicamos as diferenças, os benefícios reais e quando vale a pena investir.',
    body: [
      'A DDR5 chegou ao mercado mainstream em 2022 e em 2026 é o padrão em todas as plataformas Intel e AMD de última geração. Mas as dúvidas persistem: a DDR5 é realmente melhor que a DDR4?',
      'A resposta honesta: depende do uso. Para gaming, a diferença entre DDR4 e DDR5 é frequentemente inferior a 5% nos framerates — abaixo da margem de erro de muitos testes. O bottleneck na maioria dos jogos é a GPU, não a RAM.',
      'Onde a DDR5 brilha é em cargas de trabalho com grande largura de banda: renderização 3D, edição de vídeo em resolução elevada, machine learning e compilação de código em projetos grandes. Nestes cenários, a diferença pode chegar a 20-30%.',
      'A velocidade importa mais que o volume para a maioria dos utilizadores. 16 GB de DDR5 a 6.000 MHz supera 32 GB a 4.800 MHz em praticamente todas as tarefas single-threaded. Invista primeiro na velocidade, depois no volume.',
      'Para overclockers: o XMP 3.0 (Intel) e EXPO (AMD) tornaram o processo simples — basta ativar no BIOS e a memória configura-se automaticamente para os perfis otimizados pelo fabricante. A Corsair Vengeance DDR5 e a Kingston Fury Beast são das opções mais fiáveis neste campo.',
    ],
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=1200&q=85',
    author: 'Karmic Node',
    date: '1 Jun 2026',
    readTime: 5,
  },
  {
    id: 8,
    title: 'Segurança digital em 2026: proteja os seus dados',
    slug: 'seguranca-digital-proteja-dados-2026',
    category: 'Segurança',
    excerpt: 'As ameaças digitais evoluem a cada ano. Partilhamos as práticas essenciais que qualquer utilizador deve adotar para proteger os seus dados.',
    body: [
      'A segurança digital deixou de ser um assunto apenas para técnicos de IT. Com a crescente sofisticação dos ataques, qualquer utilizador pode ser alvo — e as consequências de uma conta comprometida podem ser devastadoras.',
      'A primeira linha de defesa é um gestor de palavras-passe. Usar a mesma palavra-passe em múltiplos serviços é o erro mais comum e perigoso. Ferramentas como Bitwarden (gratuito e open-source), 1Password ou Dashlane eliminam este problema ao gerar e armazenar palavras-passe únicas e complexas para cada serviço.',
      'A autenticação de dois fatores (2FA) deve ser ativada em todas as contas críticas — email, banco, redes sociais. Prefira aplicações de autenticação (Google Authenticator, Aegis) a SMS, que podem ser intercetados por SIM swapping.',
      'O backup regular é frequentemente negligenciado mas é a última linha de defesa contra ransomware e falhas de hardware. A regra 3-2-1 é simples: 3 cópias dos dados, em 2 suportes diferentes, com 1 cópia offsite (cloud ou disco externo num local separado).',
      'Por último: mantenha o software atualizado. A maioria dos ataques bem-sucedidos exploram vulnerabilidades conhecidas para as quais já existem patches. Ativar atualizações automáticas no sistema operativo e aplicações é uma das medidas mais simples e eficazes de segurança.',
    ],
    image: 'https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=1200&q=85',
    author: 'Karmic Node',
    date: '22 Mai 2026',
    readTime: 7,
  },
]

// ─── Products ────────────────────────────────────────────────────────────────

const ALL_PRODUCTS: Product[] = [
  {
    id: 1, name: 'Apple MacBook Pro 14" M3', category: 'Portáteis', tags: ['portáteis', 'apple', 'laptop'],
    price: 1899, originalPrice: 2199, badge: 'Mais Vendido', badgeColor: 'bordo',
    rating: 4.9, reviews: 128, stock: 8,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=85',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=85',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=85',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=85',
    ],
    description: 'O MacBook Pro 14" com chip M3 redefine o que um portátil profissional pode ser. Com desempenho extraordinário, bateria de longa duração e o ecrã Liquid Retina XDR mais brilhante até à data, está pronto para o trabalho mais exigente.',
    specs: [
      { label: 'Processador', value: 'Apple M3 (8 núcleos CPU, 10 núcleos GPU)' },
      { label: 'Memória', value: '16 GB unificada' },
      { label: 'Armazenamento', value: 'SSD de 512 GB' },
      { label: 'Ecrã', value: '14.2" Liquid Retina XDR, 3024×1964, 120Hz' },
      { label: 'Bateria', value: 'Até 18 horas' },
      { label: 'Peso', value: '1.55 kg' },
    ],
  },
  {
    id: 2, name: 'LG UltraWide 34" IPS', category: 'Monitores', tags: ['monitores', 'lg', 'ultrawide'],
    price: 649, originalPrice: 799, badge: '−19%', badgeColor: 'gold',
    rating: 4.7, reviews: 64, stock: 14,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a573d5aa47?w=800&q=85',
    images: [
      'https://images.unsplash.com/photo-1527443224154-c4a573d5aa47?w=800&q=85',
      'https://images.unsplash.com/photo-1593640408182-31c228b78f92?w=800&q=85',
    ],
    description: 'Monitor curvo UltraWide 34" IPS com resolução WQHD, AMD FreeSync Premium e painel nano IPS para cores vibrantes e consistentes.',
    specs: [
      { label: 'Tamanho', value: '34 polegadas curvo' },
      { label: 'Resolução', value: '3440×1440 WQHD' },
      { label: 'Taxa de atualização', value: '144Hz' },
      { label: 'Painel', value: 'Nano IPS' },
      { label: 'Tempo de resposta', value: '1ms GtG' },
      { label: 'Conectividade', value: 'HDMI 2.0 ×2, DisplayPort 1.4 ×1, USB-C' },
    ],
  },
  {
    id: 3, name: 'Samsung 980 Pro SSD 2TB', category: 'Armazenamento', tags: ['armazenamento', 'ssd', 'samsung'],
    price: 149, originalPrice: 189, badge: 'Novo', badgeColor: 'bordo',
    rating: 4.8, reviews: 212, stock: 32,
    image: 'https://images.unsplash.com/photo-1601737487795-dab272f52420?w=800&q=85',
    images: [
      'https://images.unsplash.com/photo-1601737487795-dab272f52420?w=800&q=85',
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=85',
      'https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=800&q=85',
    ],
    description: 'O Samsung 980 Pro é um SSD NVMe PCIe 4.0 de alto desempenho, ideal para jogos, edição de vídeo e cargas de trabalho exigentes.',
    specs: [
      { label: 'Capacidade', value: '2 TB' },
      { label: 'Interface', value: 'NVMe PCIe 4.0 ×4 M.2' },
      { label: 'Leitura sequencial', value: '7.000 MB/s' },
      { label: 'Escrita sequencial', value: '6.900 MB/s' },
      { label: 'NAND', value: 'Samsung V-NAND 3-bit MLC' },
      { label: 'Garantia', value: '5 anos' },
    ],
  },
  {
    id: 4, name: 'Corsair Vengeance 32GB DDR5', category: 'Memória RAM', tags: ['memória', 'ram', 'corsair'],
    price: 119, originalPrice: 149, badge: '−20%', badgeColor: 'gold',
    rating: 4.6, reviews: 89, stock: 25,
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&q=85',
    images: [
      'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&q=85',
      'https://images.unsplash.com/photo-1562976540-1502c2145851?w=800&q=85',
    ],
    description: 'Memória DDR5 de alta velocidade com dissipador térmico de alumínio para overclock seguro e desempenho consistente.',
    specs: [
      { label: 'Capacidade', value: '32 GB (2×16 GB)' },
      { label: 'Tipo', value: 'DDR5' },
      { label: 'Velocidade', value: '6.000 MHz' },
      { label: 'Latência', value: 'CL36-36-36-76' },
      { label: 'Voltagem', value: '1.35V' },
      { label: 'Compatibilidade', value: 'Intel XMP 3.0, AMD EXPO' },
    ],
  },
  {
    id: 5, name: 'Keychron Q1 Pro Mecânico', category: 'Periféricos', tags: ['periféricos', 'teclado', 'keychron'],
    price: 159, originalPrice: 189, badge: '−16%', badgeColor: 'gold',
    rating: 4.9, reviews: 47, stock: 11,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=85',
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=85',
      'https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=800&q=85',
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&q=85',
    ],
    description: 'Teclado mecânico premium com caixa de alumínio, switch hot-swap e conectividade Bluetooth multi-dispositivo. A escolha dos profissionais.',
    specs: [
      { label: 'Layout', value: '75% (84 teclas)' },
      { label: 'Switch', value: 'Gateron G Pro 3.0 (substituível)' },
      { label: 'Conectividade', value: 'Bluetooth 5.1 / USB-C' },
      { label: 'Bateria', value: '4.000 mAh' },
      { label: 'Caixa', value: 'Alumínio anodizado CNC' },
      { label: 'SO', value: 'Windows / macOS / iOS / Android' },
    ],
  },
  {
    id: 6, name: 'Logitech MX Master 3S', category: 'Periféricos', tags: ['periféricos', 'rato', 'logitech'],
    price: 99, originalPrice: 119, badge: '−17%', badgeColor: 'gold',
    rating: 4.8, reviews: 183, stock: 29,
    image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=800&q=85',
    images: [
      'https://images.unsplash.com/photo-1527814050087-3793815479db?w=800&q=85',
      'https://images.unsplash.com/photo-1615750173630-9a1d7ced0be9?w=800&q=85',
    ],
    description: 'O rato de topo para profissionais que exigem precisão e conforto. Com roda de deslocamento eletromagnética e 8.000 DPI de precisão.',
    specs: [
      { label: 'Sensor', value: 'Darkfield, 200–8.000 DPI' },
      { label: 'Botões', value: '7 (programáveis)' },
      { label: 'Conectividade', value: 'Bluetooth / USB Logi Bolt' },
      { label: 'Bateria', value: 'Recarregável USB-C, até 70 dias' },
      { label: 'Compatibilidade', value: 'Windows, macOS, Linux, iPadOS' },
      { label: 'Peso', value: '141 g' },
    ],
  },
  {
    id: 7, name: 'Sony WH-1000XM5', category: 'Áudio', tags: ['áudio', 'headphones', 'sony'],
    price: 329, originalPrice: 399, badge: '−18%', badgeColor: 'gold',
    rating: 4.9, reviews: 341, stock: 17,
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&q=85',
    images: [
      'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&q=85',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=85',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=85',
    ],
    description: 'Os melhores auscultadores com cancelamento de ruído do mundo. Com 30 horas de autonomia e qualidade de som Hi-Res certificada.',
    specs: [
      { label: 'Cancelamento de ruído', value: 'Sim, adaptativo (8 microfones)' },
      { label: 'Autonomia', value: '30 horas (ANC on)' },
      { label: 'Drivers', value: '30 mm, dome de carbono' },
      { label: 'Conectividade', value: 'Bluetooth 5.2 / jack 3.5mm' },
      { label: 'Codec', value: 'SBC, AAC, LDAC' },
      { label: 'Carga', value: '3 min → 3h reprodução' },
    ],
  },
  {
    id: 8, name: 'TP-Link Deco XE75 Pro', category: 'Networking', tags: ['networking', 'wifi', 'tp-link'],
    price: 229, originalPrice: 279, badge: '−18%', badgeColor: 'gold',
    rating: 4.5, reviews: 76, stock: 19,
    image: 'https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=800&q=85',
    images: [
      'https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=800&q=85',
      'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&q=85',
    ],
    description: 'Sistema Wi-Fi 6E Mesh tri-banda para cobertura total em casas grandes. Velocidades até 5.400 Mbps e latência ultra-baixa.',
    specs: [
      { label: 'Padrão', value: 'Wi-Fi 6E (802.11ax)' },
      { label: 'Velocidade', value: 'AX5400 (574+2402+2402 Mbps)' },
      { label: 'Bandas', value: '2.4 GHz + 5 GHz + 6 GHz' },
      { label: 'Cobertura', value: 'Até 560 m² (pacote 2 unid.)' },
      { label: 'Portas', value: '2.5G WAN, 1G LAN ×2' },
      { label: 'Antenas', value: '8 internas OFDMA + MU-MIMO' },
    ],
  },
  {
    id: 9, name: 'iPad Pro 12.9" M4', category: 'Tablets', tags: ['tablets', 'apple', 'ipad'],
    price: 1099, originalPrice: 1249, badge: '−12%', badgeColor: 'gold',
    rating: 4.8, reviews: 95, stock: 6,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=85',
    images: [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=85',
      'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&q=85',
      'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=85',
    ],
    description: 'O iPad Pro mais avançado de sempre. Ecrã Tandem OLED Ultra Retina XDR com brilho de 1.000 nits e chip M4 para desempenho extraordinário.',
    specs: [
      { label: 'Ecrã', value: '12.9" Tandem OLED, 2732×2048' },
      { label: 'Processador', value: 'Apple M4 (10 núcleos)' },
      { label: 'Memória', value: '8 GB' },
      { label: 'Armazenamento', value: '256 GB SSD' },
      { label: 'Câmara', value: '12MP Wide + 10MP Ultra Wide' },
      { label: 'Conectividade', value: 'Wi-Fi 6E, Bluetooth 5.3, USB-C (Thunderbolt 4)' },
    ],
  },
  {
    id: 10, name: 'Elgato Stream Deck MK.2', category: 'Streaming', tags: ['streaming', 'elgato', 'periféricos'],
    price: 149, originalPrice: 179, badge: 'Popular', badgeColor: 'bordo',
    rating: 4.7, reviews: 134, stock: 22,
    image: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=800&q=85',
    images: [
      'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=800&q=85',
      'https://images.unsplash.com/photo-1593640408182-31c228b78f92?w=800&q=85',
    ],
    description: 'Controlo total do seu estúdio com 15 teclas LCD programáveis. Automatize ações, lance clipes e gerencie as suas transmissões.',
    specs: [
      { label: 'Teclas', value: '15 LCD personalizáveis' },
      { label: 'Resolução', value: '72×72 px por tecla' },
      { label: 'Conectividade', value: 'USB-A' },
      { label: 'SO', value: 'Windows 10+, macOS 10.15+' },
      { label: 'Software', value: 'Elgato Stream Deck (gratuito)' },
      { label: 'Dimensões', value: '118×84×46 mm' },
    ],
  },
  {
    id: 11, name: 'WD My Passport 5TB', category: 'Armazenamento', tags: ['armazenamento', 'hdd', 'wd'],
    price: 129, originalPrice: 159, badge: '−19%', badgeColor: 'gold',
    rating: 4.5, reviews: 88, stock: 40,
    image: 'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=800&q=85',
    images: [
      'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=800&q=85',
      'https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=800&q=85',
    ],
    description: 'Disco externo portátil de 5TB com encriptação por hardware AES de 256 bits. Backup automático e proteção de dados de forma simples.',
    specs: [
      { label: 'Capacidade', value: '5 TB' },
      { label: 'Interface', value: 'USB 3.0 / USB-A' },
      { label: 'Velocidade', value: 'Até 480 MB/s' },
      { label: 'Segurança', value: 'AES 256-bit hardware encryption' },
      { label: 'Compatibilidade', value: 'Windows, macOS, Chromebook' },
      { label: 'Garantia', value: '3 anos' },
    ],
  },
  {
    id: 12, name: 'Rode NT-USB Mini', category: 'Áudio', tags: ['áudio', 'microfone', 'rode'],
    price: 99, originalPrice: 119, badge: 'Novo', badgeColor: 'bordo',
    rating: 4.6, reviews: 61, stock: 18,
    image: 'https://images.unsplash.com/photo-1589903308904-1010c2294adc?w=800&q=85',
    images: [
      'https://images.unsplash.com/photo-1589903308904-1010c2294adc?w=800&q=85',
      'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&q=85',
    ],
    description: 'Microfone condensador USB compacto com qualidade de estúdio. Perfeito para podcasts, streaming e reuniões remotas.',
    specs: [
      { label: 'Tipo', value: 'Condensador cardioide' },
      { label: 'Resposta em frequência', value: '20 Hz – 20 kHz' },
      { label: 'Interface', value: 'USB-C' },
      { label: 'Compatibilidade', value: 'Windows, macOS, iOS, Android' },
      { label: 'Monitorização', value: 'Saída de auscultadores integrada' },
      { label: 'Dimensões', value: '98×52 mm' },
    ],
  },
  {
    id: 13, name: 'ASUS ROG Swift 27" 165Hz', category: 'Monitores', tags: ['monitores', 'asus', 'gaming'],
    price: 349, originalPrice: 499, badge: '−30%', badgeColor: 'gold',
    rating: 4.8, reviews: 114, stock: 7,
    image: 'https://images.unsplash.com/photo-1547119957-637f8679db1e?w=800&q=85',
    images: [
      'https://images.unsplash.com/photo-1547119957-637f8679db1e?w=800&q=85',
      'https://images.unsplash.com/photo-1527443224154-c4a573d5aa47?w=800&q=85',
    ],
    description: 'Monitor gaming IPS 27" com taxa de atualização de 165Hz e tempo de resposta de 1ms. Certificação NVIDIA G-Sync Compatible para gameplay ultra-fluido.',
    specs: [
      { label: 'Tamanho', value: '27 polegadas' },
      { label: 'Resolução', value: '2560×1440 QHD' },
      { label: 'Taxa de atualização', value: '165Hz' },
      { label: 'Painel', value: 'IPS' },
      { label: 'Tempo de resposta', value: '1ms GTG' },
      { label: 'HDR', value: 'HDR400' },
    ],
  },
  {
    id: 14, name: 'Logitech C920s Pro HD', category: 'Periféricos', tags: ['periféricos', 'webcam', 'logitech'],
    price: 59, originalPrice: 99, badge: '−40%', badgeColor: 'gold',
    rating: 4.7, reviews: 298, stock: 34,
    image: 'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=800&q=85',
    images: [
      'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=800&q=85',
    ],
    description: 'Webcam Full HD 1080p com obturador de privacidade integrado, autoajuste de luz e som estéreo. Ideal para videochamadas e streaming profissional.',
    specs: [
      { label: 'Resolução', value: '1080p Full HD / 720p 60fps' },
      { label: 'Campo de visão', value: '78°' },
      { label: 'Áudio', value: 'Microfone duplo estéreo' },
      { label: 'Conectividade', value: 'USB-A' },
      { label: 'Privacidade', value: 'Obturador físico integrado' },
      { label: 'Compatibilidade', value: 'Windows, macOS, ChromeOS' },
    ],
  },
  {
    id: 15, name: 'Kingston Fury Beast 16GB DDR5', category: 'Memória RAM', tags: ['memória', 'ram', 'kingston'],
    price: 69, originalPrice: 109, badge: '−37%', badgeColor: 'gold',
    rating: 4.5, reviews: 73, stock: 21,
    image: 'https://images.unsplash.com/photo-1562976540-1502c2145851?w=800&q=85',
    images: [
      'https://images.unsplash.com/photo-1562976540-1502c2145851?w=800&q=85',
      'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&q=85',
    ],
    description: 'Memória DDR5 de alto desempenho com dissipador de calor em alumínio. Plug and Play — sem necessidade de configuração manual de XMP.',
    specs: [
      { label: 'Capacidade', value: '16 GB (1×16 GB)' },
      { label: 'Tipo', value: 'DDR5' },
      { label: 'Velocidade', value: '5.200 MHz' },
      { label: 'Latência', value: 'CL40' },
      { label: 'Voltagem', value: '1.25V' },
      { label: 'Compatibilidade', value: 'Intel XMP 3.0, AMD EXPO' },
    ],
  },
]

const CATEGORIES_LIST = ['Todos', 'Portáteis', 'Monitores', 'Periféricos', 'Armazenamento', 'Áudio', 'Networking', 'Tablets', 'Memória RAM', 'Streaming']

const NAV_LINKS: { label: string; page: Page; filter?: string }[] = [
  { label: 'Início', page: 'home' },
  { label: 'Loja', page: 'shop' },
  { label: 'Promoções', page: 'shop', filter: 'promo' },
  { label: 'Blog', page: 'blog' },
  { label: 'Assistência', page: 'contact' },
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
    { name: 'Portáteis', count: 24, icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><rect x="3" y="4" width="18" height="12" rx="1" /><path d="M2 20h20M9 16v4M15 16v4" /></svg> },
    { name: 'Monitores', count: 18, icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><rect x="2" y="3" width="20" height="14" rx="1" /><path d="M8 21h8M12 17v4" /></svg> },
    { name: 'Periféricos', count: 45, icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M6 9h12l2 9H4L6 9z" /><circle cx="9" cy="9" r="3" /><circle cx="15" cy="9" r="3" /></svg> },
    { name: 'Áudio', count: 20, icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M3 18v-6a9 9 0 0 1 18 0v6" /><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3v5zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3v5z" /></svg> },
    { name: 'Networking', count: 12, icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0" /><circle cx="12" cy="20" r="1" fill="currentColor" /></svg> },
    { name: 'Armazenamento', count: 31, icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><rect x="2" y="3" width="20" height="7" rx="1" /><rect x="2" y="14" width="20" height="7" rx="1" /><line x1="6" y1="7" x2="6.01" y2="7" strokeWidth="2" /><line x1="6" y1="18" x2="6.01" y2="18" strokeWidth="2" /></svg> },
  ]

  const TESTIMONIALS = [
    { q: 'Serviço impecável. O laptop chegou em perfeitas condições, bem embalado e na data prometida. Recomendo a 100%.', name: 'Pedro Almeida', role: 'Engenheiro de Software', rating: 5 },
    { q: 'Ótima seleção de produtos a preços competitivos. O suporte técnico ajudou-me a escolher o monitor certo para o meu trabalho.', name: 'Ana Rodrigues', role: 'Designer Gráfica', rating: 5 },
    { q: 'Comprei os Sony WH-1000XM5 e estou rendido. Entrega rápida, produto autêntico e com fatura. Voltarei a comprar.', name: 'Miguel Costa', role: 'Produtor Musical', rating: 5 },
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
                Tecnologia<br />
                com <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>visão</em>.<br />
                <span style={{ color: 'transparent', WebkitTextStroke: '1px rgba(245,242,237,.3)' }}>Qualidade</span><br />
                <em style={{ color: 'var(--bordo-3)', fontStyle: 'italic' }}>premium</em>.
              </h1>

              <p style={{ fontFamily: 'var(--f-sans)', fontSize: 'clamp(15px,1.2vw,19px)', color: 'var(--fg-dim)', maxWidth: '44ch', marginTop: 26, lineHeight: 1.65 }}>
                Hardware, periféricos e soluções de informática selecionadas com rigor — entregues no seu domicílio.
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
                <img src="https://images.unsplash.com/photo-1593640408182-31c228b78f92?w=960&q=85" alt="Gaming setup" style={{ width: '100%', display: 'block', filter: 'brightness(.82) saturate(.9)', border: '1px solid var(--border)' }} />
                <div style={{ position: 'absolute', bottom: 22, left: 22, right: 22, background: 'rgba(11,11,12,.88)', backdropFilter: 'blur(12px)', border: '1px solid var(--border)', padding: '15px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 4 }}>Em Destaque</div>
                    <div style={{ fontFamily: 'var(--f-display)', fontSize: 16, fontWeight: 500 }}>MacBook Pro 14" M3</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                      <Stars rating={4.9} />
                      <span style={{ fontSize: 10, color: 'var(--fg-mute)' }}>(128 avaliações)</span>
                    </div>
                  </div>
                  <button onClick={() => products[0] && onAdd(products[0])}
                    style={{ padding: '9px 14px', background: 'var(--bordo)', border: 'none', color: '#F5F2ED', fontSize: 10, letterSpacing: '.16em', textTransform: 'uppercase', fontWeight: 500, flexShrink: 0, whiteSpace: 'nowrap' }}>
                    {fmt(1899)}
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
            lead="Do hardware essencial ao acessório premium — temos tudo para o seu setup."
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
                Até <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>30% OFF</em><br />em portáteis<br />selecionados.
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
            lead="Os produtos mais recentes, selecionados para o seu setup."
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
            ['Apple', 'Samsung', 'LG', 'Corsair', 'Logitech', 'Sony', 'TP-Link', 'Keychron', 'WD', 'Elgato', 'Rode', 'ASUS', 'Razer', 'Intel', 'AMD'].map(brand => (
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
            Promoções exclusivas, novidades e dicas de tecnologia direto no seu email.
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
              {[['🚚', 'Envio 24-48h'], ['↩', 'Devolução 30 dias'], ['🔒', 'Pagamento seguro'], ['💬', 'Suporte técnico']].map(([icon, label]) => (
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

function ContactPage() {
  const [form, setForm] = useState({ nome: '', email: '', area: 'Informática', msg: '' })
  const [sent, setSent] = useState(false)

  return (
    <div style={{ minHeight: '80vh' }}>
      <div style={{ background: 'radial-gradient(700px 400px at 85% 20%, rgba(139,30,45,.18), transparent 60%), var(--bg-1)', borderBottom: '1px solid var(--border)', padding: '80px var(--pad-x) 60px' }}>
        <div style={{ maxWidth: 'var(--maxw)', margin: '0 auto' }}>
          <Eyebrow text="Contacto" />
          <h1 style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(44px,6vw,88px)', fontWeight: 500, margin: '20px 0 24px', lineHeight: 1.05 }}>
            Vamos <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>conversar</em>.
          </h1>
          <p style={{ color: 'var(--fg-dim)', fontSize: 17, maxWidth: '56ch', lineHeight: 1.65 }}>
            Tem dúvidas sobre um produto, precisa de assistência técnica ou quer pedir um orçamento? Estamos aqui.
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
                    {['Informática', 'Multimédia', 'Loja — Compra', 'Suporte Técnico', 'Outro'].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>

                <div style={{ marginBottom: 28 }}>
                  <label style={{ display: 'block', fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 8, fontWeight: 500 }}>Mensagem</label>
                  <textarea value={form.msg} onChange={e => setForm(prev => ({ ...prev, msg: e.target.value }))} placeholder="Descreva o seu projeto ou necessidade..." rows={4}
                    style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border)', padding: '10px 0', color: 'var(--fg)', fontSize: 15, outline: 'none', resize: 'vertical', transition: 'border-color .2s' }}
                    onFocus={e => (e.currentTarget.style.borderBottomColor = 'var(--gold)')}
                    onBlur={e => (e.currentTarget.style.borderBottomColor = 'var(--border)')} />
                </div>

                <PrimaryBtn full onClick={() => { if (form.nome && form.email && form.msg) setSent(true) }}>Enviar Pedido</PrimaryBtn>
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
            A Karmic Node nasceu com o objetivo de oferecer soluções profissionais nas áreas de Informática e Multimédia, reunindo competência técnica, criatividade e foco nas necessidades reais de cada cliente.
          </p>
        </div>
      </div>

      <div className="wrap" style={{ padding: '60px var(--pad-x) 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24, marginBottom: 60 }}>
          {[['M.', 'Missão', 'Prestar serviços de informática e multimédia com qualidade, profissionalismo e proximidade, criando soluções úteis, modernas e adaptadas a cada cliente.'],
            ['V.', 'Visão', 'Ser uma referência de confiança nas áreas de tecnologia e multimédia, destacando-nos pela qualidade, inovação e compromisso com os resultados.'],
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

const BLOG_CATS = ['Todos', 'Portáteis', 'Monitores', 'Armazenamento', 'Streaming', 'Networking', 'Áudio', 'Hardware', 'Segurança']

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
              <div style={{ fontSize: 12, color: 'var(--fg-mute)', marginTop: 2 }}>Equipa Karmic Node · Tecnologia &amp; Multimédia</div>
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
            Tecnologia em <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>foco</em>.
          </h1>
          <p style={{ color: 'var(--fg-dim)', fontSize: 17, maxWidth: '52ch', lineHeight: 1.65, marginBottom: 36 }}>
            Guias, análises e novidades sobre informática, periféricos e multimédia — escritos pela equipa Karmic Node.
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
              Informática e Multimédia com qualidade, estratégia e profissionalismo. Cartaxo, Portugal.
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
            { title: 'Loja', links: [{ l: 'Portáteis', p: 'shop' }, { l: 'Monitores', p: 'shop' }, { l: 'Periféricos', p: 'shop' }, { l: 'Áudio', p: 'shop' }, { l: 'Networking', p: 'shop' }, { l: 'Promoções', p: 'shop' }] as { l: string; p: Page }[] },
            { title: 'Empresa', links: [{ l: 'Quem Somos', p: 'about' }, { l: 'Portfólio', p: 'about' }, { l: 'Blog', p: 'blog' }, { l: 'Assistência', p: 'contact' }, { l: 'Parcerias', p: 'contact' }, { l: 'Contacto', p: 'contact' }] as { l: string; p: Page }[] },
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
  const [liveProducts, setLiveProducts] = useState<Product[]>(ALL_PRODUCTS)
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
