// JavaScript pour la page des projets

// Variables globales
let allProjects = [];
let filteredProjects = [];
let currentPage = 1;
const projectsPerPage = 12;
let currentView = 'grid';

// Données d'exemple étendues
const extendedProjects = [
    ...sampleProjects,
    {
        id: 4,
        title: 'مشروع الصناعات التقليدية',
        description: 'تطوير ورش للصناعات التقليدية الموريتانية وتدريب الحرفيين',
        image: 'assets/project4.jpg',
        goal: 200000,
        funded: 150000,
        backers: 67,
        daysLeft: 12,
        status: 'open',
        category: 'crafts',
        region: 'nouakchott',
        createdDate: '2024-01-15'
    },
    {
        id: 5,
        title: 'مشروع الزراعة المائية',
        description: 'إنشاء مزرعة مائية حديثة لإنتاج الأسماك والروبيان',
        image: 'assets/project5.jpg',
        goal: 400000,
        funded: 100000,
        backers: 45,
        daysLeft: 25,
        status: 'open',
        category: 'agriculture',
        region: 'nouadhibou',
        createdDate: '2024-02-01'
    },
    {
        id: 6,
        title: 'مشروع التعليم الرقمي',
        description: 'منصة تعليمية رقمية للطلاب الموريتانيين مع محتوى تفاعلي',
        image: 'assets/project6.jpg',
        goal: 600000,
        funded: 450000,
        backers: 234,
        daysLeft: 5,
        status: 'open',
        category: 'education',
        region: 'nouakchott',
        createdDate: '2024-01-20'
    },
    {
        id: 7,
        title: 'مشروع الطاقة الريحية',
        description: 'تركيب توربينات رياح لتوليد الكهرباء النظيفة',
        image: 'assets/project1.jpg',
        goal: 800000,
        funded: 320000,
        backers: 89,
        daysLeft: 18,
        status: 'open',
        category: 'energy',
        region: 'atar',
        createdDate: '2024-01-10'
    },
    {
        id: 8,
        title: 'مشروع التجارة الإلكترونية المحلية',
        description: 'منصة تجارة إلكترونية لدعم المنتجات المحلية',
        image: 'assets/project3.jpg',
        goal: 350000,
        funded: 280000,
        backers: 156,
        daysLeft: 9,
        status: 'open',
        category: 'commerce',
        region: 'rosso',
        createdDate: '2024-01-25'
    },
    {
        id: 9,
        title: 'مشروع تطبيق النقل الذكي',
        description: 'تطبيق ذكي لحجز وسائل النقل في المدن الكبرى',
        image: 'assets/project3.jpg',
        goal: 450000,
        funded: 450000,
        backers: 198,
        daysLeft: 0,
        status: 'funded',
        category: 'technology',
        region: 'nouakchott',
        createdDate: '2023-12-01'
    },
    {
        id: 10,
        title: 'مشروع مزرعة الألبان العضوية',
        description: 'إنتاج الألبان العضوية عالية الجودة',
        image: 'assets/project2.jpg',
        goal: 300000,
        funded: 180000,
        backers: 78,
        daysLeft: 14,
        status: 'open',
        category: 'agriculture',
        region: 'kaedi',
        createdDate: '2024-02-05'
    }
];

// Fonction pour basculer les filtres avancés
function toggleAdvancedFilters() {
    const advancedFilters = document.getElementById('advanced-filters');
    advancedFilters.classList.toggle('active');
}

// Fonction pour changer la vue (grille/liste)
function setView(view) {
    currentView = view;
    
    const viewBtns = document.querySelectorAll('.view-btn');
    viewBtns.forEach(btn => btn.classList.remove('active'));
    
    const activeBtn = document.querySelector(`[onclick="setView('${view}')"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
    
    const container = document.getElementById('projects-container');
    if (view === 'list') {
        container.className = 'projects-list';
    } else {
        container.className = 'projects-grid';
    }
    
    renderProjects();
}

// Fonction pour filtrer les projets
function filterProjects() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const category = document.getElementById('category-filter').value;
    const status = document.getElementById('status-filter').value;
    const region = document.getElementById('region-filter').value;
    const minAmount = parseInt(document.getElementById('min-amount').value) || 0;
    const maxAmount = parseInt(document.getElementById('max-amount').value) || Infinity;
    
    filteredProjects = allProjects.filter(project => {
        const matchesSearch = project.title.toLowerCase().includes(searchTerm) ||
                            project.description.toLowerCase().includes(searchTerm);
        const matchesCategory = !category || project.category === category;
        const matchesStatus = !status || project.status === status;
        const matchesRegion = !region || project.region === region;
        const matchesAmount = project.goal >= minAmount && project.goal <= maxAmount;
        
        return matchesSearch && matchesCategory && matchesStatus && matchesRegion && matchesAmount;
    });
    
    // Trier les projets
    sortProjects();
    
    // Réinitialiser la pagination
    currentPage = 1;
    
    // Mettre à jour l'affichage
    updateResultsCount();
    renderProjects();
    updatePagination();
}

// Fonction pour trier les projets
function sortProjects() {
    const sortBy = document.getElementById('sort-filter').value;
    
    filteredProjects.sort((a, b) => {
        switch (sortBy) {
            case 'newest':
                return new Date(b.createdDate) - new Date(a.createdDate);
            case 'oldest':
                return new Date(a.createdDate) - new Date(b.createdDate);
            case 'most-funded':
                return b.funded - a.funded;
            case 'ending-soon':
                return a.daysLeft - b.daysLeft;
            default:
                return 0;
        }
    });
}

// Fonction pour mettre à jour le nombre de résultats
function updateResultsCount() {
    const resultsCount = document.getElementById('results-count');
    const start = (currentPage - 1) * projectsPerPage + 1;
    const end = Math.min(currentPage * projectsPerPage, filteredProjects.length);
    
    if (filteredProjects.length === 0) {
        resultsCount.textContent = 'لا توجد نتائج';
    } else {
        resultsCount.textContent = `عرض ${start}-${end} من ${filteredProjects.length} مشروع`;
    }
}

// Fonction pour créer une carte de projet
function createProjectCard(project, viewType = 'grid') {
    const progressPercentage = (project.funded / project.goal) * 100;
    const isListView = viewType === 'list';
    
    return `
        <div class="card project-card ${isListView ? 'list-view' : ''} fade-in-up" onclick="navigateTo('project-detail')">
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
            </div>
            ${isListView ? `
                <div class="project-actions">
                    <button class="btn btn-primary" onclick="event.stopPropagation(); navigateTo('payment')">
                        <span data-translate="fund_now">${translate('fund_now')}</span>
                    </button>
                    <button class="btn btn-secondary" onclick="event.stopPropagation(); navigateTo('project-detail')">
                        <span data-translate="view_details">${translate('view_details')}</span>
                    </button>
                </div>
            ` : `
                <div class="project-content">
                    <button class="btn btn-primary mt-2" onclick="event.stopPropagation(); navigateTo('payment')">
                        <span data-translate="fund_now">${translate('fund_now')}</span>
                    </button>
                </div>
            `}
        </div>
    `;
}

// Fonction pour afficher les projets
function renderProjects() {
    const container = document.getElementById('projects-container');
    const start = (currentPage - 1) * projectsPerPage;
    const end = start + projectsPerPage;
    const projectsToShow = filteredProjects.slice(start, end);
    
    if (projectsToShow.length === 0) {
        container.innerHTML = `
            <div class="no-results">
                <div class="no-results-icon">🔍</div>
                <h3>لا توجد مشاريع</h3>
                <p>لم نجد أي مشاريع تطابق معايير البحث الخاصة بك</p>
                <button class="btn btn-primary" onclick="clearFilters()">مسح الفلاتر</button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = projectsToShow.map(project => 
        createProjectCard(project, currentView)
    ).join('');
    
    // Animer les cartes
    setTimeout(() => {
        container.querySelectorAll('.project-card').forEach((card, index) => {
            card.style.animationDelay = `${index * 100}ms`;
            card.classList.add('fade-in-up');
        });
    }, 100);
}

// Fonction pour effacer les filtres
function clearFilters() {
    document.getElementById('search-input').value = '';
    document.getElementById('category-filter').value = '';
    document.getElementById('status-filter').value = '';
    document.getElementById('region-filter').value = '';
    document.getElementById('min-amount').value = '';
    document.getElementById('max-amount').value = '';
    document.getElementById('sort-filter').value = 'newest';
    
    filterProjects();
}

// Fonction pour changer de page
function changePage(direction) {
    const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
    
    if (direction === 'prev' && currentPage > 1) {
        currentPage--;
    } else if (direction === 'next' && currentPage < totalPages) {
        currentPage++;
    }
    
    updateResultsCount();
    renderProjects();
    updatePagination();
    
    // Faire défiler vers le haut
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Fonction pour aller à une page spécifique
function goToPage(page) {
    const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
    
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        updateResultsCount();
        renderProjects();
        updatePagination();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Fonction pour mettre à jour la pagination
function updatePagination() {
    const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
    const prevBtn = document.querySelector('[onclick="changePage(\'prev\')"]');
    const nextBtn = document.querySelector('[onclick="changePage(\'next\')"]');
    const numbersContainer = document.querySelector('.pagination-numbers');
    
    // Mettre à jour les boutons précédent/suivant
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
    
    // Générer les numéros de page
    let paginationHTML = '';
    
    if (totalPages <= 7) {
        // Afficher toutes les pages si moins de 7
        for (let i = 1; i <= totalPages; i++) {
            paginationHTML += `
                <button class="pagination-number ${i === currentPage ? 'active' : ''}" 
                        onclick="goToPage(${i})">${i}</button>
            `;
        }
    } else {
        // Logique de pagination complexe
        if (currentPage <= 3) {
            for (let i = 1; i <= 4; i++) {
                paginationHTML += `
                    <button class="pagination-number ${i === currentPage ? 'active' : ''}" 
                            onclick="goToPage(${i})">${i}</button>
                `;
            }
            paginationHTML += '<span class="pagination-dots">...</span>';
            paginationHTML += `
                <button class="pagination-number" onclick="goToPage(${totalPages})">${totalPages}</button>
            `;
        } else if (currentPage >= totalPages - 2) {
            paginationHTML += `
                <button class="pagination-number" onclick="goToPage(1)">1</button>
            `;
            paginationHTML += '<span class="pagination-dots">...</span>';
            for (let i = totalPages - 3; i <= totalPages; i++) {
                paginationHTML += `
                    <button class="pagination-number ${i === currentPage ? 'active' : ''}" 
                            onclick="goToPage(${i})">${i}</button>
                `;
            }
        } else {
            paginationHTML += `
                <button class="pagination-number" onclick="goToPage(1)">1</button>
            `;
            paginationHTML += '<span class="pagination-dots">...</span>';
            for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                paginationHTML += `
                    <button class="pagination-number ${i === currentPage ? 'active' : ''}" 
                            onclick="goToPage(${i})">${i}</button>
                `;
            }
            paginationHTML += '<span class="pagination-dots">...</span>';
            paginationHTML += `
                <button class="pagination-number" onclick="goToPage(${totalPages})">${totalPages}</button>
            `;
        }
    }
    
    numbersContainer.innerHTML = paginationHTML;
}

// Fonction pour mettre à jour les statistiques
function updateStats() {
    const totalProjects = allProjects.length;
    const totalFunded = allProjects.reduce((sum, project) => sum + project.funded, 0);
    const totalInvestors = allProjects.reduce((sum, project) => sum + project.backers, 0);
    const fundedProjects = allProjects.filter(p => p.status === 'funded').length;
    const successRate = Math.round((fundedProjects / totalProjects) * 100);
    
    document.getElementById('total-projects').textContent = totalProjects;
    document.getElementById('total-funded').textContent = formatCurrency(totalFunded).replace(/أ\.م\./g, 'M');
    document.getElementById('total-investors').textContent = totalInvestors.toLocaleString();
    document.getElementById('success-rate').textContent = successRate + '%';
}

// Initialisation de la page
document.addEventListener('DOMContentLoaded', function() {
    // Initialiser les données
    allProjects = extendedProjects;
    filteredProjects = [...allProjects];
    
    // Mettre à jour les statistiques
    updateStats();
    
    // Filtrer et afficher les projets
    filterProjects();
    
    // Ajouter les écouteurs d'événements
    document.getElementById('search-input').addEventListener('input', filterProjects);
    document.getElementById('category-filter').addEventListener('change', filterProjects);
    document.getElementById('status-filter').addEventListener('change', filterProjects);
    document.getElementById('sort-filter').addEventListener('change', filterProjects);
    document.getElementById('region-filter').addEventListener('change', filterProjects);
    document.getElementById('min-amount').addEventListener('input', filterProjects);
    document.getElementById('max-amount').addEventListener('input', filterProjects);
    
    // Débounce pour les champs de saisie
    let searchTimeout;
    document.getElementById('search-input').addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(filterProjects, 300);
    });
    
    let amountTimeout;
    document.getElementById('min-amount').addEventListener('input', function() {
        clearTimeout(amountTimeout);
        amountTimeout = setTimeout(filterProjects, 500);
    });
    
    document.getElementById('max-amount').addEventListener('input', function() {
        clearTimeout(amountTimeout);
        amountTimeout = setTimeout(filterProjects, 500);
    });
});

// Fonction pour mettre à jour les traductions spécifiques aux projets
function updateProjectsTranslations() {
    // Mettre à jour les labels des filtres
    const filterLabels = {
        ar: {
            'category': 'الفئة',
            'status': 'الحالة',
            'sort': 'ترتيب حسب',
            'region': 'المنطقة',
            'min_amount': 'الحد الأدنى للمبلغ',
            'max_amount': 'الحد الأقصى للمبلغ'
        },
        fr: {
            'category': 'Catégorie',
            'status': 'Statut',
            'sort': 'Trier par',
            'region': 'Région',
            'min_amount': 'Montant minimum',
            'max_amount': 'Montant maximum'
        },
        en: {
            'category': 'Category',
            'status': 'Status',
            'sort': 'Sort by',
            'region': 'Region',
            'min_amount': 'Minimum amount',
            'max_amount': 'Maximum amount'
        }
    };
    
    // Mettre à jour les statuts des projets
    document.querySelectorAll('.project-status').forEach(status => {
        const statusClass = status.classList[1];
        status.textContent = getStatusText(statusClass);
    });
}

// Écouter les changements de langue
document.addEventListener('languageChanged', updateProjectsTranslations);

