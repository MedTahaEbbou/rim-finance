// JavaScript pour la page notifications

// Variables globales
let notifications = [];
let currentFilter = 'all';
let settingsPanelOpen = false;

// Initialisation de la page
document.addEventListener('DOMContentLoaded', function() {
    initializeNotifications();
    setupEventListeners();
    updateNotificationCounts();
});

// Initialiser les notifications
function initializeNotifications() {
    // Simuler des données de notifications
    notifications = [
        {
            id: 1,
            category: 'projects',
            type: 'success',
            title: 'تم تمويل مشروعك بنجاح!',
            message: 'مبروك! تم الوصول إلى هدف التمويل لمشروع "الطاقة الشمسية للمناطق النائية" بنسبة 100%.',
            time: 'منذ ساعتين',
            timestamp: Date.now() - 2 * 60 * 60 * 1000,
            read: false,
            actions: ['viewProject', 'viewFunding']
        },
        {
            id: 2,
            category: 'projects',
            type: 'info',
            title: 'مساهم جديد في مشروعك',
            message: 'انضم أحمد محمد إلى مشروع "تربية الماشية الحديثة" بمساهمة قدرها 25,000 أوقية موريتانية.',
            time: 'منذ 4 ساعات',
            timestamp: Date.now() - 4 * 60 * 60 * 1000,
            read: false,
            actions: ['viewContributor', 'sendThankYou']
        },
        {
            id: 3,
            category: 'payments',
            type: 'success',
            title: 'تم استلام دفعة جديدة',
            message: 'تم إيداع مبلغ 15,000 أوقية موريتانية في حسابك من مساهمة في مشروع "التجارة الإلكترونية المحلية".',
            time: 'منذ 6 ساعات',
            timestamp: Date.now() - 6 * 60 * 60 * 1000,
            read: false,
            actions: ['viewTransaction', 'viewBalance']
        },
        {
            id: 4,
            category: 'projects',
            type: 'info',
            title: 'تحديث جديد على مشروع تساهم فيه',
            message: 'نشر صاحب مشروع "الزراعة المائية الحديثة" تحديثاً جديداً حول تقدم العمل.',
            time: 'أمس',
            timestamp: Date.now() - 24 * 60 * 60 * 1000,
            read: true,
            actions: ['viewUpdate', 'viewProject']
        },
        {
            id: 5,
            category: 'projects',
            type: 'warning',
            title: 'تذكير: موعد تسليم المكافآت',
            message: 'يقترب موعد تسليم المكافآت لمشروع "الصناعات التقليدية".',
            time: 'أمس',
            timestamp: Date.now() - 24 * 60 * 60 * 1000,
            read: true,
            actions: ['viewRewards', 'updateDelivery']
        },
        {
            id: 6,
            category: 'system',
            type: 'info',
            title: 'صيانة مجدولة للنظام',
            message: 'ستتم صيانة دورية للنظام يوم الجمعة من الساعة 2:00 إلى 4:00 صباحاً.',
            time: 'منذ يومين',
            timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000,
            read: true,
            actions: ['viewMaintenanceDetails']
        },
        {
            id: 7,
            category: 'projects',
            type: 'info',
            title: 'رسالة جديدة من مساهم',
            message: 'أرسل لك فاطمة أحمد رسالة حول مشروع "التعليم الرقمي".',
            time: 'منذ 3 أيام',
            timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000,
            read: true,
            actions: ['viewMessage', 'replyMessage']
        },
        {
            id: 8,
            category: 'payments',
            type: 'success',
            title: 'تم معالجة طلب السحب',
            message: 'تم معالجة طلب سحب بقيمة 50,000 أوقية موريتانية بنجاح.',
            time: 'منذ 4 أيام',
            timestamp: Date.now() - 4 * 24 * 60 * 60 * 1000,
            read: true,
            actions: ['viewWithdrawal']
        },
        {
            id: 9,
            category: 'system',
            type: 'info',
            title: 'متابع جديد',
            message: 'بدأ محمد الأمين في متابعة مشاريعك.',
            time: 'منذ أسبوع',
            timestamp: Date.now() - 7 * 24 * 60 * 60 * 1000,
            read: true,
            actions: ['viewFollower']
        }
    ];
    
    updateNotificationDisplay();
}

// Configuration des écouteurs d'événements
function setupEventListeners() {
    // Écouteurs pour les paramètres de notifications
    const settingsToggles = document.querySelectorAll('.switch input[type="checkbox"]');
    settingsToggles.forEach(toggle => {
        toggle.addEventListener('change', function() {
            saveNotificationSettings();
        });
    });
    
    // Écouteurs pour les options de livraison
    const deliveryOptions = document.querySelectorAll('input[name="delivery"]');
    deliveryOptions.forEach(option => {
        option.addEventListener('change', function() {
            saveNotificationSettings();
        });
    });
    
    // Mise à jour automatique des notifications
    setInterval(checkForNewNotifications, 30000); // Vérifier toutes les 30 secondes
}

// Filtrer les notifications
function filterNotifications(category) {
    currentFilter = category;
    
    // Mettre à jour les boutons de filtre
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    event.target.classList.add('active');
    
    updateNotificationDisplay();
}

// Mettre à jour l'affichage des notifications
function updateNotificationDisplay() {
    const notificationsList = document.querySelector('.notifications-list');
    const emptyState = document.getElementById('empty-notifications');
    
    let filteredNotifications = notifications;
    
    // Appliquer le filtre
    if (currentFilter !== 'all') {
        if (currentFilter === 'unread') {
            filteredNotifications = notifications.filter(n => !n.read);
        } else {
            filteredNotifications = notifications.filter(n => n.category === currentFilter);
        }
    }
    
    // Trier par timestamp (plus récent en premier)
    filteredNotifications.sort((a, b) => b.timestamp - a.timestamp);
    
    if (filteredNotifications.length === 0) {
        notificationsList.style.display = 'none';
        emptyState.style.display = 'block';
    } else {
        notificationsList.style.display = 'flex';
        emptyState.style.display = 'none';
        
        // Générer le HTML des notifications
        notificationsList.innerHTML = filteredNotifications.map(notification => 
            generateNotificationHTML(notification)
        ).join('');
    }
    
    updateNotificationCounts();
}

// Générer le HTML d'une notification
function generateNotificationHTML(notification) {
    const readClass = notification.read ? 'read' : 'unread';
    const iconClass = notification.type;
    const unreadIndicator = notification.read ? '' : '<div class="notification-status unread-indicator"></div>';
    
    const actionsHTML = notification.actions.map(action => {
        const actionText = getActionText(action);
        return `<button class="btn-link" onclick="${action}(${notification.id})">${actionText}</button>`;
    }).join('');
    
    const readButton = notification.read ? '' : `
        <button class="control-btn" onclick="markAsRead(${notification.id})" title="تحديد كمقروء">
            <span>✓</span>
        </button>
    `;
    
    return `
        <div class="notification-item ${readClass}" data-category="${notification.category}" data-id="${notification.id}">
            <div class="notification-icon ${iconClass}">
                <span>${getIconForType(notification.type)}</span>
            </div>
            <div class="notification-content">
                <div class="notification-header">
                    <h3 class="notification-title">${notification.title}</h3>
                    <div class="notification-meta">
                        <span class="notification-time">${notification.time}</span>
                        ${unreadIndicator}
                    </div>
                </div>
                <p class="notification-message">${notification.message}</p>
                <div class="notification-actions">
                    ${actionsHTML}
                </div>
            </div>
            <div class="notification-controls">
                ${readButton}
                <button class="control-btn" onclick="deleteNotification(${notification.id})" title="حذف">
                    <span>🗑️</span>
                </button>
            </div>
        </div>
    `;
}

// Obtenir l'icône pour le type de notification
function getIconForType(type) {
    const icons = {
        'success': '🎉',
        'info': '📝',
        'warning': '⏰',
        'error': '❌'
    };
    return icons[type] || '📝';
}

// Obtenir le texte de l'action
function getActionText(action) {
    const actionTexts = {
        'viewProject': 'عرض المشروع',
        'viewFunding': 'تفاصيل التمويل',
        'viewContributor': 'عرض المساهم',
        'sendThankYou': 'إرسال شكر',
        'viewTransaction': 'عرض المعاملة',
        'viewBalance': 'عرض الرصيد',
        'viewUpdate': 'قراءة التحديث',
        'viewRewards': 'عرض المكافآت',
        'updateDelivery': 'تحديث التسليم',
        'viewMaintenanceDetails': 'تفاصيل الصيانة',
        'viewMessage': 'قراءة الرسالة',
        'replyMessage': 'الرد',
        'viewWithdrawal': 'تفاصيل السحب',
        'viewFollower': 'عرض الملف الشخصي'
    };
    return actionTexts[action] || action;
}

// Marquer une notification comme lue
function markAsRead(notificationId) {
    const notification = notifications.find(n => n.id === notificationId);
    if (notification) {
        notification.read = true;
        updateNotificationDisplay();
        updateNavbarBadge();
        showNotification('تم تحديد الإشعار كمقروء', 'success');
    }
}

// Marquer toutes les notifications comme lues
function markAllAsRead() {
    notifications.forEach(n => n.read = true);
    updateNotificationDisplay();
    updateNavbarBadge();
    showNotification('تم تحديد جميع الإشعارات كمقروءة', 'success');
}

// Supprimer une notification
function deleteNotification(notificationId) {
    if (confirm('هل أنت متأكد من حذف هذا الإشعار؟')) {
        notifications = notifications.filter(n => n.id !== notificationId);
        updateNotificationDisplay();
        updateNavbarBadge();
        showNotification('تم حذف الإشعار', 'info');
    }
}

// Mettre à jour les compteurs de notifications
function updateNotificationCounts() {
    const counts = {
        all: notifications.length,
        unread: notifications.filter(n => !n.read).length,
        projects: notifications.filter(n => n.category === 'projects').length,
        payments: notifications.filter(n => n.category === 'payments').length,
        system: notifications.filter(n => n.category === 'system').length
    };
    
    Object.keys(counts).forEach(category => {
        const countElement = document.getElementById(`count-${category}`);
        if (countElement) {
            countElement.textContent = counts[category];
        }
    });
}

// Mettre à jour le badge de la navbar
function updateNavbarBadge() {
    const badge = document.querySelector('.notification-badge');
    const unreadCount = notifications.filter(n => !n.read).length;
    
    if (badge) {
        if (unreadCount > 0) {
            badge.textContent = unreadCount;
            badge.style.display = 'block';
        } else {
            badge.style.display = 'none';
        }
    }
}

// Basculer le panneau des paramètres
function toggleNotificationSettings() {
    const panel = document.getElementById('settings-panel');
    const overlay = document.getElementById('settings-overlay');
    
    settingsPanelOpen = !settingsPanelOpen;
    
    if (settingsPanelOpen) {
        panel.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    } else {
        panel.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Sauvegarder les paramètres de notifications
function saveNotificationSettings() {
    const settings = {
        projects: {
            newContributions: document.querySelector('input[type="checkbox"]').checked,
            projectUpdates: document.querySelectorAll('input[type="checkbox"]')[1].checked,
            fundingComplete: document.querySelectorAll('input[type="checkbox"]')[2].checked
        },
        payments: {
            incomingPayments: document.querySelectorAll('input[type="checkbox"]')[3].checked,
            withdrawals: document.querySelectorAll('input[type="checkbox"]')[4].checked
        },
        system: {
            systemUpdates: document.querySelectorAll('input[type="checkbox"]')[5].checked,
            newsletter: document.querySelectorAll('input[type="checkbox"]')[6].checked
        },
        delivery: document.querySelector('input[name="delivery"]:checked').value
    };
    
    // Sauvegarder dans le localStorage
    localStorage.setItem('notification_settings', JSON.stringify(settings));
    
    showNotification('تم حفظ إعدادات الإشعارات', 'success');
    
    // Fermer le panneau après sauvegarde
    setTimeout(() => {
        toggleNotificationSettings();
    }, 1000);
}

// Charger les paramètres de notifications
function loadNotificationSettings() {
    try {
        const settings = JSON.parse(localStorage.getItem('notification_settings'));
        if (settings) {
            // Appliquer les paramètres aux éléments de l'interface
            const checkboxes = document.querySelectorAll('input[type="checkbox"]');
            const settingsArray = [
                settings.projects.newContributions,
                settings.projects.projectUpdates,
                settings.projects.fundingComplete,
                settings.payments.incomingPayments,
                settings.payments.withdrawals,
                settings.system.systemUpdates,
                settings.system.newsletter
            ];
            
            checkboxes.forEach((checkbox, index) => {
                if (settingsArray[index] !== undefined) {
                    checkbox.checked = settingsArray[index];
                }
            });
            
            // Appliquer le paramètre de livraison
            const deliveryRadio = document.querySelector(`input[name="delivery"][value="${settings.delivery}"]`);
            if (deliveryRadio) {
                deliveryRadio.checked = true;
            }
        }
    } catch (error) {
        console.error('خطأ في تحميل إعدادات الإشعارات:', error);
    }
}

// Charger plus de notifications
function loadMoreNotifications() {
    // Simuler le chargement de notifications supplémentaires
    showNotification('جاري تحميل المزيد من الإشعارات...', 'info');
    
    setTimeout(() => {
        // Ajouter des notifications simulées
        const newNotifications = [
            {
                id: notifications.length + 1,
                category: 'projects',
                type: 'info',
                title: 'مشروع جديد في فئتك المفضلة',
                message: 'تم نشر مشروع جديد في فئة "التكنولوجيا والابتكار" قد يهمك.',
                time: 'منذ أسبوعين',
                timestamp: Date.now() - 14 * 24 * 60 * 60 * 1000,
                read: true,
                actions: ['viewProject']
            },
            {
                id: notifications.length + 2,
                category: 'system',
                type: 'info',
                title: 'تحديث في الشروط والأحكام',
                message: 'تم تحديث الشروط والأحكام. يرجى مراجعة التغييرات الجديدة.',
                time: 'منذ أسبوعين',
                timestamp: Date.now() - 14 * 24 * 60 * 60 * 1000,
                read: true,
                actions: ['viewTerms']
            }
        ];
        
        notifications.push(...newNotifications);
        updateNotificationDisplay();
        showNotification('تم تحميل إشعارات إضافية', 'success');
    }, 1500);
}

// Vérifier les nouvelles notifications
function checkForNewNotifications() {
    // Simuler la vérification de nouvelles notifications
    const random = Math.random();
    
    if (random < 0.1) { // 10% de chance d'avoir une nouvelle notification
        const newNotification = {
            id: Date.now(),
            category: 'projects',
            type: 'info',
            title: 'إشعار جديد',
            message: 'لديك إشعار جديد من النظام.',
            time: 'الآن',
            timestamp: Date.now(),
            read: false,
            actions: ['viewProject']
        };
        
        notifications.unshift(newNotification);
        updateNotificationDisplay();
        updateNavbarBadge();
        
        // Afficher une notification toast
        showNotification('لديك إشعار جديد!', 'info');
    }
}

// Fonctions d'action pour les notifications
function viewProject(notificationId) {
    showNotification('جاري فتح المشروع...', 'info');
    setTimeout(() => {
        navigateTo('projects');
    }, 1000);
}

function viewFunding(notificationId) {
    showNotification('جاري عرض تفاصيل التمويل...', 'info');
}

function viewContributor(notificationId) {
    showNotification('جاري عرض ملف المساهم...', 'info');
}

function sendThankYou(notificationId) {
    showNotification('تم إرسال رسالة شكر للمساهم', 'success');
}

function viewTransaction(notificationId) {
    showNotification('جاري عرض تفاصيل المعاملة...', 'info');
}

function viewBalance() {
    showNotification('جاري عرض الرصيد...', 'info');
    setTimeout(() => {
        navigateTo('profile');
    }, 1000);
}

function viewUpdate(notificationId) {
    showNotification('جاري فتح التحديث...', 'info');
}

function viewRewards(notificationId) {
    showNotification('جاري عرض المكافآت...', 'info');
}

function updateDelivery(notificationId) {
    showNotification('جاري فتح صفحة تحديث التسليم...', 'info');
}

function viewMaintenanceDetails(notificationId) {
    showNotification('جاري عرض تفاصيل الصيانة...', 'info');
}

function viewMessage(notificationId) {
    showNotification('جاري فتح الرسالة...', 'info');
}

function replyMessage(notificationId) {
    showNotification('جاري فتح نافذة الرد...', 'info');
}

function viewWithdrawal(notificationId) {
    showNotification('جاري عرض تفاصيل السحب...', 'info');
}

function viewFollower(notificationId) {
    showNotification('جاري عرض الملف الشخصي...', 'info');
}

function viewTerms(notificationId) {
    showNotification('جاري فتح الشروط والأحكام...', 'info');
}

// Basculer le panneau de notifications (pour la navbar)
function toggleNotificationPanel() {
    // Cette fonction peut être utilisée pour afficher un panneau rapide de notifications
    showNotification('عرض جميع الإشعارات', 'info');
}

// Initialiser les paramètres au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    loadNotificationSettings();
    updateNavbarBadge();
});

// Gestion des raccourcis clavier
document.addEventListener('keydown', function(event) {
    // Échap pour fermer le panneau des paramètres
    if (event.key === 'Escape' && settingsPanelOpen) {
        toggleNotificationSettings();
    }
    
    // Ctrl/Cmd + A pour marquer tout comme lu
    if ((event.ctrlKey || event.metaKey) && event.key === 'a') {
        event.preventDefault();
        markAllAsRead();
    }
});

// Gestion du scroll infini
let isLoading = false;

window.addEventListener('scroll', function() {
    if (isLoading) return;
    
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    // Charger plus de contenu quand on arrive à 80% du scroll
    if (scrollTop + windowHeight >= documentHeight * 0.8) {
        isLoading = true;
        
        setTimeout(() => {
            loadMoreNotifications();
            isLoading = false;
        }, 1000);
    }
});

// Fonction utilitaire pour formater les dates
function formatNotificationTime(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(diff / (1000 * 60 * 60 * 24 * 7));
    
    if (minutes < 1) return 'الآن';
    if (minutes < 60) return `منذ ${minutes} دقيقة`;
    if (hours < 24) return `منذ ${hours} ساعة`;
    if (days < 7) return `منذ ${days} يوم`;
    if (weeks < 4) return `منذ ${weeks} أسبوع`;
    
    return new Date(timestamp).toLocaleDateString('ar-MR');
}

// Mettre à jour les temps des notifications périodiquement
setInterval(() => {
    notifications.forEach(notification => {
        notification.time = formatNotificationTime(notification.timestamp);
    });
    
    if (currentFilter === 'all' || 
        (currentFilter === 'unread' && notifications.some(n => !n.read)) ||
        (currentFilter !== 'all' && currentFilter !== 'unread')) {
        updateNotificationDisplay();
    }
}, 60000); // Mettre à jour chaque minute

