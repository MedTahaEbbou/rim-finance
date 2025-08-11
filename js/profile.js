// JavaScript pour la page de profil

// Variables globales
let currentUser = null;

// Fonction pour changer d'onglet de profil
function switchProfileTab(tabName) {
    // Masquer tous les onglets
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Désactiver tous les boutons d'onglet
    document.querySelectorAll('.profile-tab').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Activer l'onglet sélectionné
    const targetTab = document.getElementById(`${tabName}-tab`);
    if (targetTab) {
        targetTab.classList.add('active');
    }
    
    // Activer le bouton d'onglet correspondant
    const targetBtn = document.querySelector(`[onclick="switchProfileTab('${tabName}')"]`);
    if (targetBtn) {
        targetBtn.classList.add('active');
    }
    
    // Charger le contenu spécifique à l'onglet
    loadTabContent(tabName);
}

// Fonction pour charger le contenu d'un onglet
function loadTabContent(tabName) {
    switch (tabName) {
        case 'overview':
            loadOverviewContent();
            break;
        case 'investments':
            loadInvestmentsContent();
            break;
        case 'projects':
            loadProjectsContent();
            break;
        case 'activity':
            loadActivityContent();
            break;
        case 'settings':
            loadSettingsContent();
            break;
    }
}

// Fonction pour charger le contenu de l'aperçu
function loadOverviewContent() {
    // Le contenu est déjà statique dans le HTML
    console.log('Aperçu chargé');
}

// Fonction pour charger les investissements
function loadInvestmentsContent() {
    // Simuler le chargement des données d'investissement
    console.log('Investissements chargés');
}

// Fonction pour charger les projets de l'utilisateur
function loadProjectsContent() {
    // Vérifier si l'utilisateur a des projets
    const userType = getCurrentUserType();
    if (userType === 'owner') {
        // Charger les projets de l'utilisateur
        loadUserProjects();
    }
}

// Fonction pour charger l'activité
function loadActivityContent() {
    // Le contenu est déjà statique dans le HTML
    console.log('Activité chargée');
}

// Fonction pour charger les paramètres
function loadSettingsContent() {
    // Charger les paramètres utilisateur
    loadUserSettings();
}

// Fonction pour obtenir le type d'utilisateur actuel
function getCurrentUserType() {
    const user = getCurrentUser();
    return user ? user.userType : 'investor';
}

// Fonction pour obtenir l'utilisateur actuel
function getCurrentUser() {
    if (currentUser) return currentUser;
    
    try {
        const userData = localStorage.getItem('currentUser');
        if (userData) {
            currentUser = JSON.parse(userData);
            return currentUser;
        }
    } catch (error) {
        console.error('Erreur lors du chargement des données utilisateur:', error);
    }
    
    // Utilisateur par défaut pour la démo
    return {
        id: 1,
        fullName: 'محمد طه أبو',
        phone: '44508860',
        userType: 'investor',
        location: 'نواكشوط، موريتانيا',
        joinDate: 'يناير 2024'
    };
}

// Fonction pour charger les projets de l'utilisateur
function loadUserProjects() {
    const projectsList = document.querySelector('.user-projects-list');
    const userType = getCurrentUserType();
    
    if (userType === 'owner') {
        // Simuler des projets pour les propriétaires
        const userProjects = [
            {
                id: 1,
                title: 'مشروع الطاقة المتجددة',
                description: 'تطوير محطة طاقة شمسية',
                status: 'active',
                funded: 250000,
                goal: 500000,
                backers: 45
            }
        ];
        
        if (userProjects.length > 0) {
            projectsList.innerHTML = userProjects.map(project => `
                <div class="user-project-card">
                    <div class="project-header">
                        <h4>${project.title}</h4>
                        <span class="project-status ${project.status}">${getStatusText(project.status)}</span>
                    </div>
                    <p class="project-description">${project.description}</p>
                    <div class="project-progress">
                        <div class="progress-info">
                            <span>${formatCurrency(project.funded)} / ${formatCurrency(project.goal)}</span>
                            <span>${Math.round((project.funded / project.goal) * 100)}%</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${(project.funded / project.goal) * 100}%"></div>
                        </div>
                    </div>
                    <div class="project-actions">
                        <button class="btn btn-primary" onclick="navigateTo('manage-project')">إدارة</button>
                        <button class="btn btn-secondary" onclick="navigateTo('project-detail')">عرض</button>
                    </div>
                </div>
            `).join('');
        }
    }
}

// Fonction pour charger les paramètres utilisateur
function loadUserSettings() {
    const user = getCurrentUser();
    
    // Remplir les champs avec les données utilisateur
    const nameInput = document.querySelector('input[value="محمد طه أبو"]');
    const phoneInput = document.querySelector('input[value="44508860"]');
    const locationInput = document.querySelector('input[value="نواكشوط، موريتانيا"]');
    
    if (nameInput && user.fullName) nameInput.value = user.fullName;
    if (phoneInput && user.phone) phoneInput.value = user.phone;
    if (locationInput && user.location) locationInput.value = user.location;
}

// Fonction pour modifier le profil
function editProfile() {
    showNotification('فتح نافذة تعديل الملف الشخصي...', 'info');
    
    // Simuler l'ouverture d'un modal de modification
    setTimeout(() => {
        showNotification('يمكنك تعديل معلوماتك في قسم الإعدادات', 'info');
        switchProfileTab('settings');
    }, 1000);
}

// Fonction pour modifier la photo de couverture
function editCover() {
    showNotification('فتح نافذة تغيير صورة الغلاف...', 'info');
    
    // Simuler le changement de couverture
    setTimeout(() => {
        showNotification('تم تحديث صورة الغلاف بنجاح!', 'success');
    }, 1500);
}

// Fonction pour modifier l'avatar
function editAvatar() {
    showNotification('فتح نافذة تغيير الصورة الشخصية...', 'info');
    
    // Simuler le changement d'avatar
    setTimeout(() => {
        showNotification('تم تحديث الصورة الشخصية بنجاح!', 'success');
    }, 1500);
}

// Fonction pour partager le profil
function shareProfile() {
    const user = getCurrentUser();
    const profileUrl = `${window.location.origin}/profile/${user.id}`;
    
    if (navigator.share) {
        navigator.share({
            title: `ملف ${user.fullName} الشخصي - RIM-FINANCE`,
            text: `تعرف على ملف ${user.fullName} الشخصي على منصة RIM-FINANCE`,
            url: profileUrl
        }).then(() => {
            showNotification('تم مشاركة الملف الشخصي بنجاح!', 'success');
        }).catch(() => {
            copyToClipboard(profileUrl);
        });
    } else {
        copyToClipboard(profileUrl);
    }
}

// Fonction pour نسخ إلى الحافظة
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('تم نسخ رابط الملف الشخصي!', 'success');
        }).catch(() => {
            fallbackCopyToClipboard(text);
        });
    } else {
        fallbackCopyToClipboard(text);
    }
}

// Fonction de نسخ احتياطية
function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showNotification('تم نسخ رابط الملف الشخصي!', 'success');
    } catch (err) {
        showNotification('فشل في نسخ الرابط', 'error');
    }
    
    document.body.removeChild(textArea);
}

// Fonction pour تسجيل الخروج
function logout() {
    if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('isLoggedIn');
        showNotification('تم تسجيل الخروج بنجاح', 'success');
        
        setTimeout(() => {
            window.location.href = 'signup.html';
        }, 1500);
    }
}

// Fonction pour gérer la soumission du formulaire des paramètres
function handleSettingsSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const updatedUser = {
        ...getCurrentUser(),
        fullName: formData.get('fullName') || document.querySelector('input[value*="محمد"]').value,
        phone: formData.get('phone') || document.querySelector('input[value="44508860"]').value,
        location: formData.get('location') || document.querySelector('input[value*="نواكشوط"]').value
    };
    
    // Sauvegarder les modifications
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    currentUser = updatedUser;
    
    // Mettre à jour l'affichage
    updateProfileDisplay();
    
    showNotification('تم حفظ التغييرات بنجاح!', 'success');
}

// Fonction pour mettre à jour l'affichage du profil
function updateProfileDisplay() {
    const user = getCurrentUser();
    
    // Mettre à jour le nom dans l'en-tête
    const profileName = document.getElementById('profile-name');
    if (profileName) {
        profileName.textContent = user.fullName;
    }
    
    // Mettre à jour le type d'utilisateur
    const profileType = document.getElementById('profile-type');
    if (profileType) {
        profileType.textContent = user.userType === 'investor' ? 'مستثمر' : 'صاحب مشروع';
    }
}

// Fonction pour animer les statistiques
function animateStats() {
    const statNumbers = document.querySelectorAll('.profile-stats .stat-number');
    
    statNumbers.forEach(stat => {
        const finalValue = stat.textContent;
        const numericValue = parseFloat(finalValue.replace(/[^\d.]/g, ''));
        
        if (!isNaN(numericValue)) {
            let currentValue = 0;
            const increment = numericValue / 50;
            const timer = setInterval(() => {
                currentValue += increment;
                if (currentValue >= numericValue) {
                    currentValue = numericValue;
                    clearInterval(timer);
                }
                
                if (finalValue.includes('%')) {
                    stat.textContent = Math.round(currentValue) + '%';
                } else if (finalValue.includes(',')) {
                    stat.textContent = Math.round(currentValue).toLocaleString();
                } else {
                    stat.textContent = Math.round(currentValue);
                }
            }, 20);
        }
    });
}

// Initialisation de la page
document.addEventListener('DOMContentLoaded', function() {
    // Charger les données utilisateur
    currentUser = getCurrentUser();
    updateProfileDisplay();
    
    // Animer les statistiques
    setTimeout(animateStats, 500);
    
    // Ajouter les écouteurs d'événements pour les formulaires
    const settingsForm = document.querySelector('.settings-form');
    if (settingsForm) {
        settingsForm.addEventListener('submit', handleSettingsSubmit);
    }
    
    // Vérifier si l'utilisateur est connecté
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        showNotification('يرجى تسجيل الدخول للوصول إلى الملف الشخصي', 'warning');
        setTimeout(() => {
            window.location.href = 'signup.html';
        }, 2000);
    }
    
    // Charger le contenu de l'onglet par défaut
    loadTabContent('overview');
});

// Fonction pour mettre à jour les traductions spécifiques au profil
function updateProfileTranslations() {
    // Mettre à jour les textes des onglets
    const tabTexts = {
        ar: {
            'overview': 'نظرة عامة',
            'investments': 'الاستثمارات',
            'my_projects': 'مشاريعي',
            'activity': 'النشاط',
            'settings': 'الإعدادات'
        },
        fr: {
            'overview': 'Aperçu',
            'investments': 'Investissements',
            'my_projects': 'Mes Projets',
            'activity': 'Activité',
            'settings': 'Paramètres'
        },
        en: {
            'overview': 'Overview',
            'investments': 'Investments',
            'my_projects': 'My Projects',
            'activity': 'Activity',
            'settings': 'Settings'
        }
    };
    
    // Mettre à jour le type d'utilisateur
    const user = getCurrentUser();
    const profileType = document.getElementById('profile-type');
    if (profileType && user) {
        const userTypeTexts = {
            ar: { 'investor': 'مستثمر', 'owner': 'صاحب مشروع' },
            fr: { 'investor': 'Investisseur', 'owner': 'Propriétaire de projet' },
            en: { 'investor': 'Investor', 'owner': 'Project Owner' }
        };
        
        profileType.textContent = userTypeTexts[currentLanguage][user.userType] || userTypeTexts.ar[user.userType];
    }
}

// Écouter les changements de langue
document.addEventListener('languageChanged', updateProfileTranslations);

