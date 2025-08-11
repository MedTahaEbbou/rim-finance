// JavaScript pour la page FAQ

// Variables globales
let currentFilter = 'all';
let searchTerm = '';

// Fonction pour basculer l'affichage d'une question FAQ
function toggleFAQ(questionElement) {
    const faqItem = questionElement.parentElement;
    const isActive = faqItem.classList.contains('active');
    
    // Fermer toutes les autres questions
    document.querySelectorAll('.faq-item.active').forEach(item => {
        if (item !== faqItem) {
            item.classList.remove('active');
        }
    });
    
    // Basculer la question actuelle
    if (isActive) {
        faqItem.classList.remove('active');
    } else {
        faqItem.classList.add('active');
        
        // Faire défiler vers la question si nécessaire
        setTimeout(() => {
            const rect = faqItem.getBoundingClientRect();
            const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
            
            if (!isVisible) {
                faqItem.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        }, 300);
    }
}

// Fonction pour filtrer les FAQ par catégorie
function filterFAQ(category) {
    currentFilter = category;
    
    // Mettre à jour les boutons de catégorie
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const activeBtn = document.querySelector(`[onclick="filterFAQ('${category}')"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
    
    // Filtrer les éléments FAQ
    const faqItems = document.querySelectorAll('.faq-item');
    let visibleCount = 0;
    
    faqItems.forEach((item, index) => {
        const itemCategory = item.getAttribute('data-category');
        const shouldShow = category === 'all' || itemCategory === category;
        
        if (shouldShow && (searchTerm === '' || matchesSearch(item, searchTerm))) {
            item.classList.remove('hidden');
            item.style.animationDelay = `${visibleCount * 0.1}s`;
            visibleCount++;
        } else {
            item.classList.add('hidden');
            item.classList.remove('active'); // Fermer si ouvert
        }
    });
    
    // Afficher message si aucun résultat
    showNoResultsMessage(visibleCount === 0);
}

// Fonction pour rechercher dans les FAQ
function searchFAQ() {
    const searchInput = document.getElementById('faq-search');
    searchTerm = searchInput.value.toLowerCase().trim();
    
    const faqItems = document.querySelectorAll('.faq-item');
    let visibleCount = 0;
    
    faqItems.forEach((item, index) => {
        const itemCategory = item.getAttribute('data-category');
        const categoryMatch = currentFilter === 'all' || itemCategory === currentFilter;
        const searchMatch = searchTerm === '' || matchesSearch(item, searchTerm);
        
        if (categoryMatch && searchMatch) {
            item.classList.remove('hidden');
            highlightSearchTerm(item, searchTerm);
            item.style.animationDelay = `${visibleCount * 0.1}s`;
            visibleCount++;
        } else {
            item.classList.add('hidden');
            item.classList.remove('active'); // Fermer si ouvert
            removeHighlight(item);
        }
    });
    
    // Afficher message si aucun résultat
    showNoResultsMessage(visibleCount === 0);
}

// Fonction pour vérifier si un élément FAQ correspond à la recherche
function matchesSearch(faqItem, term) {
    if (term === '') return true;
    
    const question = faqItem.querySelector('.faq-question h3').textContent.toLowerCase();
    const answer = faqItem.querySelector('.faq-answer').textContent.toLowerCase();
    
    return question.includes(term) || answer.includes(term);
}

// Fonction pour surligner les termes de recherche
function highlightSearchTerm(faqItem, term) {
    if (term === '') return;
    
    const question = faqItem.querySelector('.faq-question h3');
    const answer = faqItem.querySelector('.faq-answer');
    
    highlightInElement(question, term);
    highlightInElement(answer, term);
}

// Fonction pour surligner dans un élément
function highlightInElement(element, term) {
    const walker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );
    
    const textNodes = [];
    let node;
    
    while (node = walker.nextNode()) {
        textNodes.push(node);
    }
    
    textNodes.forEach(textNode => {
        const text = textNode.textContent;
        const regex = new RegExp(`(${term})`, 'gi');
        
        if (regex.test(text)) {
            const highlightedText = text.replace(regex, '<span class="search-highlight">$1</span>');
            const wrapper = document.createElement('div');
            wrapper.innerHTML = highlightedText;
            
            while (wrapper.firstChild) {
                textNode.parentNode.insertBefore(wrapper.firstChild, textNode);
            }
            textNode.remove();
        }
    });
}

// Fonction pour supprimer le surlignage
function removeHighlight(faqItem) {
    const highlights = faqItem.querySelectorAll('.search-highlight');
    highlights.forEach(highlight => {
        const parent = highlight.parentNode;
        parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
        parent.normalize();
    });
}

// Fonction pour afficher le message "aucun résultat"
function showNoResultsMessage(show) {
    let noResultsDiv = document.querySelector('.no-results');
    
    if (show && !noResultsDiv) {
        noResultsDiv = document.createElement('div');
        noResultsDiv.className = 'no-results';
        noResultsDiv.innerHTML = `
            <div class="no-results-icon">🔍</div>
            <h3>لم نجد أي نتائج</h3>
            <p>جرب البحث بكلمات مختلفة أو تصفح الفئات المختلفة</p>
        `;
        
        const faqContent = document.querySelector('.faq-content');
        faqContent.appendChild(noResultsDiv);
    } else if (!show && noResultsDiv) {
        noResultsDiv.remove();
    }
}

// Fonction pour ouvrir الدردشة المباشرة
function openLiveChat() {
    showNotification('سيتم توصيلك بأحد ممثلي خدمة العملاء قريباً...', 'info');
    
    // Simuler l'ouverture d'une fenêtre de chat
    setTimeout(() => {
        const chatWindow = window.open('', 'chat', 'width=400,height=600,scrollbars=yes,resizable=yes');
        if (chatWindow) {
            chatWindow.document.write(`
                <html dir="rtl">
                <head>
                    <title>الدردشة المباشرة - RIM-FINANCE</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5; }
                        .chat-header { background: #2E86FF; color: white; padding: 15px; margin: -20px -20px 20px; }
                        .chat-message { background: white; padding: 10px; margin: 10px 0; border-radius: 8px; }
                        .agent { background: #e3f2fd; }
                        .user { background: #f3e5f5; text-align: left; }
                        input { width: 100%; padding: 10px; margin-top: 20px; }
                    </style>
                </head>
                <body>
                    <div class="chat-header">
                        <h3>الدردشة المباشرة</h3>
                        <p>مرحباً! كيف يمكنني مساعدتك؟</p>
                    </div>
                    <div class="chat-message agent">
                        مرحباً بك في خدمة العملاء لمنصة RIM-FINANCE. كيف يمكنني مساعدتك اليوم؟
                    </div>
                    <input type="text" placeholder="اكتب رسالتك هنا..." onkeypress="if(event.key==='Enter') sendMessage(this)">
                    <script>
                        function sendMessage(input) {
                            if(input.value.trim()) {
                                const chatDiv = document.createElement('div');
                                chatDiv.className = 'chat-message user';
                                chatDiv.textContent = input.value;
                                input.parentNode.insertBefore(chatDiv, input);
                                
                                setTimeout(() => {
                                    const responseDiv = document.createElement('div');
                                    responseDiv.className = 'chat-message agent';
                                    responseDiv.textContent = 'شكراً لرسالتك. سيقوم أحد ممثلينا بالرد عليك قريباً.';
                                    input.parentNode.insertBefore(responseDiv, input);
                                }, 1000);
                                
                                input.value = '';
                            }
                        }
                    </script>
                </body>
                </html>
            `);
        } else {
            showNotification('يرجى السماح بفتح النوافذ المنبثقة لاستخدام الدردشة المباشرة', 'warning');
        }
    }, 1000);
}

// Fonction pour configurer la recherche en temps réel
function setupRealTimeSearch() {
    const searchInput = document.getElementById('faq-search');
    let searchTimeout;
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                searchFAQ();
            }, 300); // Délai de 300ms pour éviter trop de recherches
        });
        
        // Recherche en appuyant sur Entrée
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                clearTimeout(searchTimeout);
                searchFAQ();
            }
        });
    }
}

// Fonction pour animer l'apparition des éléments FAQ
function animateFAQItems() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    faqItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        item.style.transitionDelay = `${index * 0.1}s`;
        
        observer.observe(item);
    });
}

// Fonction pour obtenir les statistiques FAQ
function getFAQStats() {
    const totalQuestions = document.querySelectorAll('.faq-item').length;
    const categories = {};
    
    document.querySelectorAll('.faq-item').forEach(item => {
        const category = item.getAttribute('data-category');
        categories[category] = (categories[category] || 0) + 1;
    });
    
    return {
        total: totalQuestions,
        categories: categories
    };
}

// Fonction pour enregistrer les interactions utilisateur
function trackFAQInteraction(action, data) {
    try {
        const interactions = JSON.parse(localStorage.getItem('faq_interactions') || '[]');
        interactions.push({
            action: action,
            data: data,
            timestamp: new Date().toISOString(),
            userId: getCurrentUserId()
        });
        
        // Garder seulement les 100 dernières interactions
        if (interactions.length > 100) {
            interactions.splice(0, interactions.length - 100);
        }
        
        localStorage.setItem('faq_interactions', JSON.stringify(interactions));
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement de l\'interaction FAQ:', error);
    }
}

// Fonction pour obtenir l'ID utilisateur
function getCurrentUserId() {
    try {
        const userData = localStorage.getItem('currentUser');
        if (userData) {
            const user = JSON.parse(userData);
            return user.id;
        }
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'ID utilisateur:', error);
    }
    return 'anonymous';
}

// Initialisation de la page
document.addEventListener('DOMContentLoaded', function() {
    // Configurer la recherche en temps réel
    setupRealTimeSearch();
    
    // Animer les éléments FAQ
    animateFAQItems();
    
    // Ajouter des écouteurs d'événements pour le suivi
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', function() {
            const questionText = this.querySelector('h3').textContent;
            trackFAQInteraction('question_clicked', { question: questionText });
        });
    });
    
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.textContent;
            trackFAQInteraction('category_filtered', { category: category });
        });
    });
    
    // Afficher les statistiques dans la console (pour le développement)
    const stats = getFAQStats();
    console.log('FAQ Statistics:', stats);
    
    // Ouvrir automatiquement la première question si aucun filtre n'est appliqué
    const urlParams = new URLSearchParams(window.location.search);
    const openFirst = urlParams.get('open');
    
    if (openFirst === 'first') {
        const firstQuestion = document.querySelector('.faq-question');
        if (firstQuestion) {
            setTimeout(() => {
                toggleFAQ(firstQuestion);
            }, 500);
        }
    }
    
    // Gérer les liens directs vers des questions spécifiques
    const hash = window.location.hash;
    if (hash) {
        const targetElement = document.querySelector(hash);
        if (targetElement && targetElement.classList.contains('faq-item')) {
            setTimeout(() => {
                const question = targetElement.querySelector('.faq-question');
                if (question) {
                    toggleFAQ(question);
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }, 500);
        }
    }
});

// Fonction pour mettre à jour les traductions spécifiques à la FAQ
function updateFAQTranslations() {
    const faqTexts = {
        ar: {
            'all': 'الكل',
            'platform': 'المنصة',
            'investment': 'الاستثمار',
            'payment': 'الدفع',
            'security': 'الأمان',
            'legal': 'القانونية',
            'search_placeholder': 'ابحث في الأسئلة الشائعة...',
            'no_results': 'لم نجد أي نتائج',
            'contact_us': 'اتصل بنا',
            'live_chat': 'دردشة مباشرة'
        },
        fr: {
            'all': 'Tout',
            'platform': 'Plateforme',
            'investment': 'Investissement',
            'payment': 'Paiement',
            'security': 'Sécurité',
            'legal': 'Légal',
            'search_placeholder': 'Rechercher dans la FAQ...',
            'no_results': 'Aucun résultat trouvé',
            'contact_us': 'Nous contacter',
            'live_chat': 'Chat en direct'
        },
        en: {
            'all': 'All',
            'platform': 'Platform',
            'investment': 'Investment',
            'payment': 'Payment',
            'security': 'Security',
            'legal': 'Legal',
            'search_placeholder': 'Search FAQ...',
            'no_results': 'No results found',
            'contact_us': 'Contact Us',
            'live_chat': 'Live Chat'
        }
    };
    
    // Mettre à jour le placeholder de recherche
    const searchInput = document.getElementById('faq-search');
    if (searchInput) {
        searchInput.placeholder = faqTexts[currentLanguage]?.search_placeholder || faqTexts.ar.search_placeholder;
    }
}

// Écouter les changements de langue
document.addEventListener('languageChanged', updateFAQTranslations);

