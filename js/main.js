// RIM-FINANCE - JavaScript principal

// Protection contre l'inspection et la copie
document.addEventListener('DOMContentLoaded', function() {
    // Désactiver le clic droit
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    });

    // Désactiver les raccourcis clavier
    document.addEventListener('keydown', function(e) {
        // F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
        if (e.keyCode === 123 || 
            (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74)) ||
            (e.ctrlKey && e.keyCode === 85)) {
            e.preventDefault();
            return false;
        }
    });

    // Désactiver la sélection de texte
    document.onselectstart = function() {
        return false;
    };

    // Désactiver le glisser-déposer
    document.ondragstart = function() {
        return false;
    };
});

// Système de traduction
const translations = {
    ar: {
        // Navigation
        'home': 'الرئيسية',
        'search': 'البحث',
        'contribute': 'المساهمة',
        'notifications': 'الإشعارات',
        'profile': 'الملف الشخصي',
        'login': 'تسجيل الدخول',
        'signup': 'التسجيل',
        'logout': 'تسجيل الخروج',
        
        // Menu
        'my_contributions': 'مساهماتي',
        'manage_projects': 'إدارة المشاريع',
        'savings_offers': 'عروض الادخار',
        'support': 'الدعم',
        'faq': 'الأسئلة الشائعة',
        'contact': 'اتصل بنا',
        'terms': 'الشروط والأحكام',
        'privacy': 'سياسة الخصوصية',
        'news': 'الأخبار',
        
        // Page d'accueil
        'welcome_title': 'مرحباً بك في RIM-FINANCE',
        'welcome_subtitle': 'منصة التمويل الجماعي الرائدة في موريتانيا',
        'get_started': 'ابدأ الآن',
        'featured_projects': 'مشاريع مميزة',
        'how_it_works': 'كيف يعمل',
        'more_projects': 'المزيد من المشاريع',
        
        // Projets
        'project_goal': 'الهدف المالي',
        'funded_amount': 'المبلغ الممول',
        'backers': 'الممولين',
        'days_left': 'أيام متبقية',
        'fund_now': 'مول الآن',
        'view_details': 'عرض التفاصيل',
        
        // Formulaires
        'phone_number': 'رقم الهاتف',
        'password': 'كلمة المرور',
        'confirm_password': 'تأكيد كلمة المرور',
        'full_name': 'الاسم الكامل',
        'investor': 'مستثمر',
        'project_owner': 'صاحب مشروع',
        
        // Monnaie
        'currency': 'أوقية'
    },
    fr: {
        // Navigation
        'home': 'Accueil',
        'search': 'Recherche',
        'contribute': 'Contribuer',
        'notifications': 'Notifications',
        'profile': 'Profil',
        'login': 'Connexion',
        'signup': 'Inscription',
        'logout': 'Déconnexion',
        
        // Menu
        'my_contributions': 'Mes Contributions',
        'manage_projects': 'Gérer les Projets',
        'savings_offers': 'Offres d\'Épargne',
        'support': 'Support',
        'faq': 'FAQ',
        'contact': 'Contact',
        'terms': 'Conditions d\'Utilisation',
        'privacy': 'Politique de Confidentialité',
        'news': 'Actualités',
        
        // Page d'accueil
        'welcome_title': 'Bienvenue sur RIM-FINANCE',
        'welcome_subtitle': 'La plateforme de crowdfunding leader en Mauritanie',
        'get_started': 'Commencer',
        'featured_projects': 'Projets en Vedette',
        'how_it_works': 'Comment ça marche',
        'more_projects': 'Plus de Projets',
        
        // Projets
        'project_goal': 'Objectif',
        'funded_amount': 'Financé',
        'backers': 'Contributeurs',
        'days_left': 'Jours restants',
        'fund_now': 'Financer',
        'view_details': 'Voir Détails',
        
        // Formulaires
        'phone_number': 'Numéro de téléphone',
        'password': 'Mot de passe',
        'confirm_password': 'Confirmer le mot de passe',
        'full_name': 'Nom complet',
        'investor': 'Investisseur',
        'project_owner': 'Propriétaire de projet',
        
        // Monnaie
        'currency': 'MRU'
    },
    en: {
        // Navigation
        'home': 'Home',
        'search': 'Search',
        'contribute': 'Contribute',
        'notifications': 'Notifications',
        'profile': 'Profile',
        'login': 'Login',
        'signup': 'Sign Up',
        'logout': 'Logout',
        
        // Menu
        'my_contributions': 'My Contributions',
        'manage_projects': 'Manage Projects',
        'savings_offers': 'Savings Offers',
        'support': 'Support',
        'faq': 'FAQ',
        'contact': 'Contact',
        'terms': 'Terms & Conditions',
        'privacy': 'Privacy Policy',
        'news': 'News',
        
        // Page d'accueil
        'welcome_title': 'Welcome to RIM-FINANCE',
        'welcome_subtitle': 'The leading crowdfunding platform in Mauritania',
        'get_started': 'Get Started',
        'featured_projects': 'Featured Projects',
        'how_it_works': 'How it Works',
        'more_projects': 'More Projects',
        
        // Projets
        'project_goal': 'Goal',
        'funded_amount': 'Funded',
        'backers': 'Backers',
        'days_left': 'Days Left',
        'fund_now': 'Fund Now',
        'view_details': 'View Details',
        
        // Formulaires
        'phone_number': 'Phone Number',
        'password': 'Password',
        'confirm_password': 'Confirm Password',
        'full_name': 'Full Name',
        'investor': 'Investor',
        'project_owner': 'Project Owner',
        
        // Monnaie
        'currency': 'MRU'
    }
};

// Langue actuelle
let currentLanguage = localStorage.getItem('language') || 'ar';

// Fonction de traduction
function translate(key) {
    return translations[currentLanguage][key] || key;
}

// Fonction pour changer la langue
function changeLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    
    // Changer la direction du texte
    document.body.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    
    // Mettre à jour tous les textes traduits
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        element.textContent = translate(key);
    });
    
    // Mettre à jour les placeholders
    document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
        const key = element.getAttribute('data-translate-placeholder');
        element.placeholder = translate(key);
    });
    
    // Fermer le menu de langue
    closeLanguageMenu();
}

// Gestion du drawer
function toggleDrawer() {
    const drawer = document.getElementById('drawer');
    const overlay = document.getElementById('drawer-overlay');
    
    drawer.classList.toggle('open');
    overlay.classList.toggle('active');
}

function closeDrawer() {
    const drawer = document.getElementById('drawer');
    const overlay = document.getElementById('drawer-overlay');
    
    drawer.classList.remove('open');
    overlay.classList.remove('active');
}

// Gestion du menu de langue
function toggleLanguageMenu() {
    const menu = document.getElementById('language-menu');
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

function closeLanguageMenu() {
    const menu = document.getElementById('language-menu');
    if (menu) {
        menu.style.display = 'none';
    }
}

// Navigation
function navigateTo(page) {
    // Supprimer l'extension .html de l'URL
    const cleanPage = page.replace('.html', '');
    window.location.href = cleanPage;
}

// Gestion des notifications
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animation d'entrée
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Suppression automatique après 5 secondes
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Gestion des cartes de projet
function createProjectCard(project) {
    const progressPercentage = (project.funded / project.goal) * 100;
    
    return `
        <div class="card project-card fade-in-up" onclick="navigateTo('project-detail')">
            <div class="project-image">
                <img src="${project.image}" alt="${project.title}" class="no-select">
                <div class="project-status ${project.status}">${project.status}</div>
            </div>
            <div class="project-content p-2">
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

// Formatage de la monnaie
function formatCurrency(amount) {
    return new Intl.NumberFormat('ar-MR', {
        style: 'currency',
        currency: 'MRU',
        minimumFractionDigits: 0
    }).format(amount).replace('MRU', translate('currency'));
}

// Génération de code de paiement aléatoire
function generatePaymentCode() {
    return Math.floor(100000000 + Math.random() * 900000000).toString();
}

// Copier dans le presse-papiers
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Code copié dans le presse-papiers!', 'success');
    }).catch(() => {
        // Fallback pour les navigateurs plus anciens
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('Code copié dans le presse-papiers!', 'success');
    });
}

// Animation de confetti
function showConfetti() {
    // Simple animation de confetti
    for (let i = 0; i < 50; i++) {
        createConfettiPiece();
    }
}

function createConfettiPiece() {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.backgroundColor = ['#2E86FF', '#F4C542', '#0BFFE2'][Math.floor(Math.random() * 3)];
    confetti.style.animationDelay = Math.random() * 3 + 's';
    document.body.appendChild(confetti);
    
    setTimeout(() => {
        confetti.remove();
    }, 3000);
}

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    // Définir la langue et la direction
    document.body.setAttribute('dir', currentLanguage === 'ar' ? 'rtl' : 'ltr');
    
    // Traduire tous les éléments
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        element.textContent = translate(key);
    });
    
    // Traduire les placeholders
    document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
        const key = element.getAttribute('data-translate-placeholder');
        element.placeholder = translate(key);
    });
    
    // Fermer le drawer en cliquant sur l'overlay
    document.getElementById('drawer-overlay')?.addEventListener('click', closeDrawer);
    
    // Fermer le menu de langue en cliquant ailleurs
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.language-selector')) {
            closeLanguageMenu();
        }
    });
    
    // Animation des éléments au scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);
    
    // Observer tous les éléments avec la classe 'animate-on-scroll'
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
});

// Données d'exemple pour les projets
const sampleProjects = [
    {
        id: 1,
        title: 'مشروع الطاقة الشمسية',
        description: 'تركيب ألواح شمسية لتوفير الكهرباء للمناطق النائية',
        image: 'assets/project1.jpg',
        goal: 500000,
        funded: 350000,
        backers: 125,
        daysLeft: 15,
        status: 'open'
    },
    {
        id: 2,
        title: 'مشروع تربية الماشية',
        description: 'تطوير مزرعة حديثة لتربية الماشية وإنتاج الألبان',
        image: 'assets/project2.jpg',
        goal: 750000,
        funded: 600000,
        backers: 89,
        daysLeft: 8,
        status: 'open'
    },
    {
        id: 3,
        title: 'مشروع التجارة الإلكترونية',
        description: 'إنشاء منصة تجارة إلكترونية محلية',
        image: 'assets/project3.jpg',
        goal: 300000,
        funded: 300000,
        backers: 156,
        daysLeft: 0,
        status: 'funded'
    }
];

// Fonction pour charger les projets
function loadProjects(container, projects = sampleProjects) {
    const projectsContainer = document.getElementById(container);
    if (projectsContainer) {
        projectsContainer.innerHTML = projects.map(project => createProjectCard(project)).join('');
    }
}

