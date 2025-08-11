// JavaScript spécifique à la page d'accueil

// Variables du carousel
let currentSlide = 0;
const slidesToShow = 3;

// Fonction pour faire glisser le carousel
function slideCarousel(direction) {
    const track = document.querySelector('.carousel-track');
    const cards = track.querySelectorAll('.project-card');
    const totalSlides = cards.length;
    const maxSlide = Math.max(0, totalSlides - slidesToShow);
    
    if (direction === 'next') {
        currentSlide = Math.min(currentSlide + 1, maxSlide);
    } else {
        currentSlide = Math.max(currentSlide - 1, 0);
    }
    
    const cardWidth = cards[0].offsetWidth + 20; // largeur + gap
    const translateX = currentSlide * cardWidth;
    
    // Inverser la direction pour RTL
    const isRTL = document.body.getAttribute('dir') === 'rtl';
    track.style.transform = `translateX(${isRTL ? translateX : -translateX}px)`;
}

// Auto-play du carousel
function startCarouselAutoplay() {
    setInterval(() => {
        const track = document.querySelector('.carousel-track');
        if (track) {
            const cards = track.querySelectorAll('.project-card');
            const maxSlide = Math.max(0, cards.length - slidesToShow);
            
            if (currentSlide >= maxSlide) {
                currentSlide = 0;
            } else {
                currentSlide++;
            }
            
            const cardWidth = cards[0].offsetWidth + 20;
            const translateX = currentSlide * cardWidth;
            const isRTL = document.body.getAttribute('dir') === 'rtl';
            track.style.transform = `translateX(${isRTL ? translateX : -translateX}px)`;
        }
    }, 5000); // Change toutes les 5 secondes
}

// Créer une carte de projet pour le carousel
function createFeaturedProjectCard(project) {
    const progressPercentage = (project.funded / project.goal) * 100;
    
    return `
        <div class="card project-card fade-in-up" onclick="navigateTo('project-detail')">
            <div class="project-image">
                <img src="${project.image}" alt="${project.title}" class="no-select">
                <div class="project-status ${project.status}">${getStatusText(project.status)}</div>
            </div>
            <div class="project-content">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
                <div class="project-stats mt-2">
                    <div class="stat">
                        <span class="stat-value">${formatCurrency(project.funded)}</span>
                        <span class="stat-label" data-translate="funded_amount">${translate('funded_amount')}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-value">${formatCurrency(project.goal)}</span>
                        <span class="stat-label" data-translate="project_goal">${translate('project_goal')}</span>
                    </div>
                </div>
                <div class="progress-bar mt-2">
                    <div class="progress-fill" style="width: ${progressPercentage}%"></div>
                </div>
                <div class="project-meta mt-2">
                    <span>${project.backers} <span data-translate="backers">${translate('backers')}</span></span>
                    <span>${project.daysLeft} <span data-translate="days_left">${translate('days_left')}</span></span>
                </div>
                <button class="btn btn-primary mt-2" onclick="event.stopPropagation(); navigateTo('payment')">
                    <span data-translate="fund_now">${translate('fund_now')}</span>
                </button>
            </div>
        </div>
    `;
}

// Obtenir le texte du statut
function getStatusText(status) {
    const statusTexts = {
        ar: {
            open: 'مفتوح',
            funded: 'مكتمل',
            closed: 'مغلق'
        },
        fr: {
            open: 'Ouvert',
            funded: 'Financé',
            closed: 'Fermé'
        },
        en: {
            open: 'Open',
            funded: 'Funded',
            closed: 'Closed'
        }
    };
    
    return statusTexts[currentLanguage][status] || status;
}

// Charger les projets en vedette
function loadFeaturedProjects() {
    const container = document.getElementById('featured-projects-container');
    if (container) {
        const featuredProjects = sampleProjects.slice(0, 6); // Prendre les 6 premiers
        container.innerHTML = featuredProjects.map(project => createFeaturedProjectCard(project)).join('');
        
        // Démarrer l'auto-play après le chargement
        setTimeout(startCarouselAutoplay, 1000);
    }
}

// Charger plus de projets
function loadMoreProjects() {
    const container = document.getElementById('more-projects-container');
    if (container) {
        // Créer des projets supplémentaires pour la démonstration
        const moreProjects = [
            ...sampleProjects,
            {
                id: 4,
                title: 'مشروع الصناعات التقليدية',
                description: 'تطوير ورش للصناعات التقليدية الموريتانية',
                image: 'assets/project4.jpg',
                goal: 200000,
                funded: 150000,
                backers: 67,
                daysLeft: 12,
                status: 'open'
            },
            {
                id: 5,
                title: 'مشروع الزراعة المائية',
                description: 'إنشاء مزرعة مائية حديثة لإنتاج الأسماك',
                image: 'assets/project5.jpg',
                goal: 400000,
                funded: 100000,
                backers: 45,
                daysLeft: 25,
                status: 'open'
            },
            {
                id: 6,
                title: 'مشروع التعليم الرقمي',
                description: 'منصة تعليمية رقمية للطلاب الموريتانيين',
                image: 'assets/project6.jpg',
                goal: 600000,
                funded: 450000,
                backers: 234,
                daysLeft: 5,
                status: 'open'
            }
        ];
        
        container.innerHTML = moreProjects.map(project => createProjectCard(project)).join('');
    }
}

// Animation des éléments au scroll
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                
                // Animation spéciale pour les cartes de projet
                if (entry.target.classList.contains('project-card')) {
                    const delay = Array.from(entry.target.parentNode.children).indexOf(entry.target) * 100;
                    entry.target.style.animationDelay = `${delay}ms`;
                }
            }
        });
    }, observerOptions);
    
    // Observer tous les éléments avec la classe 'animate-on-scroll'
    document.querySelectorAll('.animate-on-scroll, .project-card, .step-card').forEach(el => {
        observer.observe(el);
    });
}

// Gestion responsive du carousel
function handleCarouselResize() {
    const track = document.querySelector('.carousel-track');
    if (track) {
        const cards = track.querySelectorAll('.project-card');
        if (cards.length > 0) {
            // Réinitialiser la position
            currentSlide = 0;
            track.style.transform = 'translateX(0)';
        }
    }
}

// Effet parallax pour l'image héro
function initParallaxEffect() {
    const heroImage = document.querySelector('.hero-image img');
    if (heroImage) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            heroImage.style.transform = `translateY(${rate}px)`;
        });
    }
}

// Initialisation de la page d'accueil
document.addEventListener('DOMContentLoaded', function() {
    // Charger les projets
    loadFeaturedProjects();
    loadMoreProjects();
    
    // Initialiser les animations
    initScrollAnimations();
    initParallaxEffect();
    
    // Gestion du redimensionnement
    window.addEventListener('resize', handleCarouselResize);
    
    // Animation d'entrée pour les éléments héro
    setTimeout(() => {
        document.querySelectorAll('.hero .fade-in-up').forEach((el, index) => {
            el.style.animationDelay = `${index * 200}ms`;
            el.classList.add('fade-in-up');
        });
    }, 500);
    
    // Effet de typing pour le titre
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        let i = 0;
        
        function typeWriter() {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        }
        
        setTimeout(typeWriter, 1000);
    }
});

// Gestion des événements tactiles pour le carousel
let startX = 0;
let currentX = 0;
let isDragging = false;

document.addEventListener('touchstart', function(e) {
    if (e.target.closest('.carousel-track')) {
        startX = e.touches[0].clientX;
        isDragging = true;
    }
});

document.addEventListener('touchmove', function(e) {
    if (!isDragging) return;
    e.preventDefault();
    currentX = e.touches[0].clientX;
});

document.addEventListener('touchend', function(e) {
    if (!isDragging) return;
    isDragging = false;
    
    const diffX = startX - currentX;
    const threshold = 50;
    
    if (Math.abs(diffX) > threshold) {
        if (diffX > 0) {
            slideCarousel('next');
        } else {
            slideCarousel('prev');
        }
    }
});

// Fonction pour mettre à jour les traductions spécifiques à la page
function updateHomeTranslations() {
    // Mettre à jour les statuts des projets
    document.querySelectorAll('.project-status').forEach(status => {
        const statusClass = status.classList[1];
        status.textContent = getStatusText(statusClass);
    });
    
    // Mettre à jour les étapes
    const steps = document.querySelectorAll('.step-card');
    const stepTexts = {
        ar: [
            { title: 'سجل حسابك', desc: 'أنشئ حساباً جديداً كمستثمر أو صاحب مشروع' },
            { title: 'اختر مشروعك', desc: 'تصفح المشاريع المتاحة واختر ما يناسبك' },
            { title: 'ساهم بأمان', desc: 'ادفع بطريقة آمنة وتابع تقدم مشروعك' }
        ],
        fr: [
            { title: 'Créez votre compte', desc: 'Inscrivez-vous en tant qu\'investisseur ou porteur de projet' },
            { title: 'Choisissez votre projet', desc: 'Parcourez les projets disponibles et choisissez celui qui vous convient' },
            { title: 'Contribuez en sécurité', desc: 'Payez de manière sécurisée et suivez l\'évolution de votre projet' }
        ],
        en: [
            { title: 'Create your account', desc: 'Sign up as an investor or project owner' },
            { title: 'Choose your project', desc: 'Browse available projects and choose what suits you' },
            { title: 'Contribute safely', desc: 'Pay securely and track your project progress' }
        ]
    };
    
    steps.forEach((step, index) => {
        const title = step.querySelector('h3');
        const desc = step.querySelector('p');
        if (title && desc && stepTexts[currentLanguage] && stepTexts[currentLanguage][index]) {
            title.textContent = stepTexts[currentLanguage][index].title;
            desc.textContent = stepTexts[currentLanguage][index].desc;
        }
    });
}

// Écouter les changements de langue
document.addEventListener('languageChanged', updateHomeTranslations);

