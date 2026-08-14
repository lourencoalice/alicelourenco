const header = document.querySelector('.site-header');
const progress = document.querySelector('.scroll-progress span');
const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav-links');
let currentLanguage = 'pt';

const closeMenu = () => {
  menu.classList.remove('active');
  menu.setAttribute('aria-expanded', 'false');
  menu.setAttribute('aria-label', currentLanguage === 'en' ? 'Open menu' : 'Abrir menu');
  nav.classList.remove('open');
  document.body.classList.remove('menu-open');
};

menu.addEventListener('click', () => {
  const open = !nav.classList.contains('open');
  menu.classList.toggle('active', open);
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', currentLanguage === 'en' ? (open ? 'Close menu' : 'Open menu') : (open ? 'Fechar menu' : 'Abrir menu'));
  nav.classList.toggle('open', open);
  document.body.classList.toggle('menu-open', open);
});

nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
window.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', scrollY > 24);
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.width = `${max > 0 ? (scrollY / max) * 100 : 0}%`;
}, { passive: true });

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
document.querySelector('#year').textContent = new Date().getFullYear();

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(pointer: fine)').matches;

if (!reduceMotion && finePointer) {
  const cursorGlow = document.querySelector('.cursor-glow');
  let pointerX = innerWidth / 2, pointerY = innerHeight / 2;
  let glowX = pointerX, glowY = pointerY;

  addEventListener('pointermove', event => {
    pointerX = event.clientX; pointerY = event.clientY;
    cursorGlow.classList.add('active');
    const hero = document.querySelector('.hero-art');
    const bounds = hero?.getBoundingClientRect();
    if (bounds) {
      hero.style.setProperty('--pointer-x', `${((event.clientX - bounds.left) / bounds.width - .5) * 18}px`);
      hero.style.setProperty('--pointer-y', `${((event.clientY - bounds.top) / bounds.height - .5) * 18}px`);
    }
  }, { passive: true });

  const animateGlow = () => {
    glowX += (pointerX - glowX) * .14; glowY += (pointerY - glowY) * .14;
    cursorGlow.style.transform = `translate3d(${glowX}px,${glowY}px,0) translate(-50%,-50%)`;
    requestAnimationFrame(animateGlow);
  };
  animateGlow();

  document.querySelectorAll('.timeline-card, .project-card, .skill-group, .personal-card').forEach(card => {
    card.classList.add('interactive-card');
    card.addEventListener('pointermove', event => {
      const bounds = card.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - .5;
      const y = (event.clientY - bounds.top) / bounds.height - .5;
      card.style.setProperty('--rotate-x', `${y * -5}deg`);
      card.style.setProperty('--rotate-y', `${x * 5}deg`);
      card.style.setProperty('--shine-x', `${(x + .5) * 100}%`);
      card.style.setProperty('--shine-y', `${(y + .5) * 100}%`);
    });
    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--rotate-x', '0deg'); card.style.setProperty('--rotate-y', '0deg');
    });
  });
}

const sections = [...document.querySelectorAll('main section[id]')];
const menuLinks = [...nav.querySelectorAll('a[href^="#"]')];
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) menuLinks.forEach(link => link.classList.toggle('current', link.getAttribute('href') === `#${entry.target.id}`));
  });
}, { rootMargin: '-35% 0px -55%', threshold: 0 });
sections.forEach(section => sectionObserver.observe(section));

const translatableSelectors = [
  '.brand small', '.nav-links > a', '.availability', '.intro', '.hero-role', '.hero-text',
  '.hero-actions .button', '.skill-float', '.about-copy h2', '.about-columns p', '.personal-card div span',
  '.experience .section-label', '.experience .section-top h2', '.timeline-date', '.timeline-card h3',
  '.timeline-card p', '.timeline-card .tags span', '.projects .section-label', '.projects .section-top h2',
  '.project-info small', '.project-info h3', '.project-info p', '.project-info .tags span',
  '.project-coming small', '.project-coming h3', '.project-coming p', '.skills .section-label',
  '.skills .section-top h2', '.skill-group h3', '.skill-list span', '.education .section-label',
  '.education-heading h2', '.education-heading > p', '.education-list small', '.education-list h3',
  '.education-list article > p', '.education-year', '.contact-message h2', '.contact-line small',
  '.footer-inner > p', '.footer-inner > a:last-child'
];

const originalPortuguese = Object.fromEntries(translatableSelectors.map(selector => [
  selector, [...document.querySelectorAll(selector)].map(element => element.innerHTML)
]));

const english = {
  '.brand small': ['Management & Technology', 'Management & Technology'],
  '.nav-links > a': ['About', 'Experience', 'Projects', 'Skills', 'Education', 'Contact'],
  '.availability': ['<i></i> Transitioning into Information Technology', '<i></i> Open to internship opportunities'],
  '.intro': ["Hello, I'm"],
  '.hero-role': ['Information Technology Management'],
  '.hero-text': ['Transitioning into technology, combining experience with <strong>processes, people, and systems</strong> with my knowledge of <strong>IT Management</strong>. I am seeking an internship or Junior position to turn learning into practice.'],
  '.hero-actions .button': ['Download résumé <span class="download-icon" aria-hidden="true"></span>', 'Get in touch <span class="arrow-icon" aria-hidden="true"></span>'],
  '.skill-float': ['<i></i> Organization', '<i></i> Processes', '<i></i> Technology', '<i></i> Communication'],
  '.about-copy h2': ['About me'],
  '.about-columns p': [
    'I am an <strong>Information Technology Management student at FATEC Guaratinguetá</strong>, transitioning into the technology field. My experience in HR, Administration, Sales, and Logistics has given me a broad perspective on <strong>processes, people, and business</strong>.',
    'Throughout my career, I have worked with <strong>digital systems and tools</strong>, information organization, reports, and process monitoring, while strengthening skills such as communication, organization, and problem-solving.',
    'I am currently seeking an <strong>internship or Junior position in IT</strong> to apply what I learn in college, face real challenges, and continue growing. I want to combine my professional experience with technology and <strong>learn by doing, contributing as I evolve</strong>.'
  ],
  '.personal-card div span': ['IT Management student · Guaratinguetá, Brazil'],
  '.experience .section-label': ['Experience'],
  '.experience .section-top h2': ['Professional experience'],
  '.timeline-date': ['2026 — Present', '2025 — 2026', '2021 — 2024'],
  '.timeline-card h3': ['HR Assistant', 'Administration, Sales & Logistics', 'Sales & Marketing'],
  '.timeline-card p': [
    'Support for administrative and operational Human Resources routines, organization of employee documents and data, vacations, hiring, terminations, and labor processes.',
    'Order management in Bling, sales support, online customer service, inventory control, logistics, process monitoring, and support for production and marketing.',
    'In-person and online sales, customer service, inventory control, management reports, purchasing support, marketing planning, content, and social media management.'
  ],
  '.timeline-card .tags span': ['Human Resources','Systems','Organization','Customer service','Bling','Logistics','Sales','Marketing','Customer service','Reports','Social media','Goals'],
  '.projects .section-label': ['Portfolio'], '.projects .section-top h2': ['Projects'],
  '.project-info small': ['Future project','Future project'],
  '.project-info h3': ['Lorem ipsum dolor','Sit amet consectetur'],
  '.project-info p': ['Lorem ipsum dolor sit amet, consectetur adipiscing elit. This space will soon feature a project developed by Alice.','Lorem ipsum dolor sit amet, consectetur adipiscing elit. A new management and technology case study will be presented here.'],
  '.project-info .tags span': ['Lorem','Ipsum','Dolor','Lorem','Processes','Data'],
  '.project-coming small': ['Next project'], '.project-coming h3': ['Coming soon.'],
  '.project-coming p': ['This section will grow alongside her academic and professional journey.'],
  '.skills .section-label': ['Skills'], '.skills .section-top h2': ['Skills and knowledge'],
  '.skill-group h3': ['Tools','Management','Personal skills'],
  '.skill-list span': ['Microsoft Office','Bling','Praticx','Computer skills','Digital systems','Process management','Reports','Inventory control','Administrative routines','HR','Communication','Organization','Teamwork','Problem-solving','Strategic thinking'],
  '.education .section-label': ['Education'], '.education-heading h2': ['Academic background'],
  '.education-heading > p': ["Alice's education connects her administrative background with the Information Technology field."],
  '.education-list small': ['Degree in progress','Technical education','Certifications'],
  '.education-list h3': ['Information Technology Management','Technical Program in Administration','Lorem ipsum dolor sit amet'],
  '.education-list article > p': ['FATEC Guaratinguetá','SENAC Guaratinguetá','New certificates and courses will be added here.'],
  '.education-year': ['2026 — 2028','2021 — 2022','Coming soon'],
  '.contact-message h2': ['Send me a message.'], '.contact-line small': ['Email','LinkedIn'],
  '.footer-inner > p': ['Developed for Alice Lourenço · <span id="year"></span>'],
  '.footer-inner > a:last-child': ['Back to top <span class="up-icon" aria-hidden="true"></span>']
};

const languageButtons = [...document.querySelectorAll('[data-lang]')];
const setLanguage = language => {
  currentLanguage = language;
  const source = language === 'en' ? english : originalPortuguese;
  translatableSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach((element, index) => {
      if (source[selector]?.[index] !== undefined) element.innerHTML = source[selector][index];
    });
  });
  document.documentElement.lang = language === 'en' ? 'en' : 'pt-BR';
  document.title = language === 'en' ? 'Alice Lourenço | Management & Technology' : 'Alice Lourenço | Gestão & Tecnologia';
  document.querySelector('meta[name="description"]').content = language === 'en'
    ? 'Portfolio of Alice de Oliveira Lourenço — an Information Technology Management student with experience in HR, administration, sales, and logistics.'
    : 'Portfólio de Alice de Oliveira Lourenço — estudante de Gestão da Tecnologia da Informação com experiência em RH, administração, vendas e logística.';
  document.querySelector('.skip-link').textContent = language === 'en' ? 'Skip to content' : 'Pular para o conteúdo';
  document.querySelector('.nav').setAttribute('aria-label', language === 'en' ? 'Main navigation' : 'Navegação principal');
  document.querySelector('.language-switch').setAttribute('aria-label', language === 'en' ? 'Select language' : 'Selecionar idioma');
  languageButtons.forEach(button => button.setAttribute('aria-label', button.dataset.lang === 'en' ? (language === 'en' ? 'English' : 'Inglês') : (language === 'en' ? 'Portuguese' : 'Português')));
  document.querySelector('.hero-art').setAttribute('aria-label', language === 'en' ? 'Photo of Alice Lourenço' : 'Foto de Alice Lourenço');
  document.querySelector('.portrait-placeholder img').alt = language === 'en' ? 'Portrait of Alice Lourenço' : 'Retrato de Alice Lourenço';
  languageButtons.forEach(button => button.classList.toggle('active', button.dataset.lang === language));
  localStorage.setItem('alicePortfolio.language', language);
  document.querySelector('#year').textContent = new Date().getFullYear();
  closeMenu();
};

languageButtons.forEach(button => button.addEventListener('click', () => setLanguage(button.dataset.lang)));
setLanguage(localStorage.getItem('alicePortfolio.language') === 'en' ? 'en' : 'pt');
