// JavaScript pour la page contribute

// Variables globales
let currentStep = 1;
let totalSteps = 4;
let projectData = {};
let budgetItems = 1;
let rewardItems = 1;

// Initialisation de la page
document.addEventListener('DOMContentLoaded', function() {
    initializeForm();
    setupEventListeners();
    loadDraftData();
});

// Initialiser le formulaire
function initializeForm() {
    updateStepDisplay();
    updateNavigationButtons();
    setupFormValidation();
}

// Configuration des écouteurs d'événements
function setupEventListeners() {
    // Écouteurs pour les options de publication
    const publicationRadios = document.querySelectorAll('input[name="publication-type"]');
    publicationRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            const scheduledDate = document.querySelector('.scheduled-date');
            if (this.value === 'scheduled') {
                scheduledDate.style.display = 'block';
            } else {
                scheduledDate.style.display = 'none';
            }
        });
    });
    
    // Sauvegarde automatique
    const formInputs = document.querySelectorAll('input, textarea, select');
    formInputs.forEach(input => {
        input.addEventListener('change', function() {
            collectFormData();
            saveDraftData();
        });
    });
    
    // Validation en temps réel
    const requiredInputs = document.querySelectorAll('input[required], textarea[required], select[required]');
    requiredInputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
}

// Navigation entre les étapes
function nextStep() {
    if (validateCurrentStep()) {
        if (currentStep < totalSteps) {
            currentStep++;
            updateStepDisplay();
            updateNavigationButtons();
            scrollToTop();
            
            if (currentStep === 4) {
                generateReview();
            }
        }
    }
}

function previousStep() {
    if (currentStep > 1) {
        currentStep--;
        updateStepDisplay();
        updateNavigationButtons();
        scrollToTop();
    }
}

// Mettre à jour l'affichage des étapes
function updateStepDisplay() {
    // Masquer toutes les étapes
    document.querySelectorAll('.form-step').forEach(step => {
        step.classList.remove('active');
    });
    
    // Afficher l'étape actuelle
    const currentStepElement = document.getElementById(`step-${currentStep}`);
    if (currentStepElement) {
        currentStepElement.classList.add('active');
    }
    
    // Mettre à jour l'indicateur de progression
    document.querySelectorAll('.progress-step').forEach((step, index) => {
        const stepNumber = index + 1;
        step.classList.remove('active', 'completed');
        
        if (stepNumber === currentStep) {
            step.classList.add('active');
        } else if (stepNumber < currentStep) {
            step.classList.add('completed');
        }
    });
}

// Mettre à jour les boutons de navigation
function updateNavigationButtons() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const submitBtn = document.getElementById('submit-btn');
    
    // Bouton précédent
    if (currentStep === 1) {
        prevBtn.style.display = 'none';
    } else {
        prevBtn.style.display = 'flex';
    }
    
    // Boutons suivant/soumettre
    if (currentStep === totalSteps) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'flex';
    } else {
        nextBtn.style.display = 'flex';
        submitBtn.style.display = 'none';
    }
}

// Validation des étapes
function validateCurrentStep() {
    const currentStepElement = document.getElementById(`step-${currentStep}`);
    const requiredFields = currentStepElement.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField({ target: field })) {
            isValid = false;
        }
    });
    
    // Validations spécifiques par étape
    switch (currentStep) {
        case 1:
            isValid = validateStep1() && isValid;
            break;
        case 2:
            isValid = validateStep2() && isValid;
            break;
        case 3:
            isValid = validateStep3() && isValid;
            break;
        case 4:
            isValid = validateStep4() && isValid;
            break;
    }
    
    if (!isValid) {
        showNotification('يرجى ملء جميع الحقول المطلوبة بشكل صحيح', 'error');
    }
    
    return isValid;
}

// Validation de l'étape 1
function validateStep1() {
    const title = document.getElementById('project-title').value.trim();
    const category = document.getElementById('project-category').value;
    const summary = document.getElementById('project-summary').value.trim();
    const location = document.getElementById('project-location').value;
    const duration = document.getElementById('project-duration').value;
    
    let isValid = true;
    
    if (title.length < 10) {
        showFieldError('project-title', 'يجب أن يكون العنوان 10 أحرف على الأقل');
        isValid = false;
    }
    
    if (!category) {
        showFieldError('project-category', 'يرجى اختيار فئة المشروع');
        isValid = false;
    }
    
    if (summary.length < 50) {
        showFieldError('project-summary', 'يجب أن يكون الوصف 50 حرف على الأقل');
        isValid = false;
    }
    
    if (!location) {
        showFieldError('project-location', 'يرجى اختيار الموقع الجغرافي');
        isValid = false;
    }
    
    if (!duration) {
        showFieldError('project-duration', 'يرجى اختيار مدة المشروع');
        isValid = false;
    }
    
    return isValid;
}

// Validation de l'étape 2
function validateStep2() {
    const description = document.getElementById('project-description').value.trim();
    
    if (description.length < 200) {
        showFieldError('project-description', 'يجب أن يكون الوصف المفصل 200 حرف على الأقل');
        return false;
    }
    
    return true;
}

// Validation de l'étape 3
function validateStep3() {
    const fundingGoal = document.getElementById('funding-goal').value;
    const campaignDuration = document.getElementById('campaign-duration').value;
    
    let isValid = true;
    
    if (!fundingGoal || parseInt(fundingGoal) < 10000) {
        showFieldError('funding-goal', 'الحد الأدنى للتمويل هو 10,000 أوقية موريتانية');
        isValid = false;
    }
    
    if (!campaignDuration) {
        showFieldError('campaign-duration', 'يرجى اختيار مدة الحملة');
        isValid = false;
    }
    
    // Validation du budget
    const budgetItems = document.querySelectorAll('.budget-item');
    let totalBudget = 0;
    
    budgetItems.forEach(item => {
        const amountInput = item.querySelector('input[type="number"]');
        if (amountInput && amountInput.value) {
            totalBudget += parseInt(amountInput.value);
        }
    });
    
    if (totalBudget === 0) {
        showNotification('يرجى إضافة بنود الميزانية', 'error');
        isValid = false;
    }
    
    // Validation des récompenses
    const rewardAmounts = document.querySelectorAll('.reward-amount');
    let hasValidReward = false;
    
    rewardAmounts.forEach(input => {
        if (input.value && parseInt(input.value) >= 100) {
            hasValidReward = true;
        }
    });
    
    if (!hasValidReward) {
        showNotification('يرجى إضافة مكافأة واحدة على الأقل بقيمة 100 أوقية أو أكثر', 'error');
        isValid = false;
    }
    
    return isValid;
}

// Validation de l'étape 4
function validateStep4() {
    const termsAgreement = document.getElementById('terms-agreement').checked;
    const accuracyConfirmation = document.getElementById('accuracy-confirmation').checked;
    const responsibilityAcknowledgment = document.getElementById('responsibility-acknowledgment').checked;
    
    if (!termsAgreement || !accuracyConfirmation || !responsibilityAcknowledgment) {
        showNotification('يجب الموافقة على جميع الشروط والأحكام', 'error');
        return false;
    }
    
    return true;
}

// Validation des champs individuels
function validateField(event) {
    const field = event.target;
    const value = field.value.trim();
    let isValid = true;
    
    // Effacer les erreurs précédentes
    clearFieldError(event);
    
    // Validation des champs requis
    if (field.hasAttribute('required') && !value) {
        showFieldError(field.id, 'هذا الحقل مطلوب');
        isValid = false;
    }
    
    // Validations spécifiques par type
    switch (field.type) {
        case 'email':
            if (value && !isValidEmail(value)) {
                showFieldError(field.id, 'يرجى إدخال بريد إلكتروني صحيح');
                isValid = false;
            }
            break;
        case 'url':
            if (value && !isValidURL(value)) {
                showFieldError(field.id, 'يرجى إدخال رابط صحيح');
                isValid = false;
            }
            break;
        case 'number':
            const min = field.getAttribute('min');
            const max = field.getAttribute('max');
            const numValue = parseFloat(value);
            
            if (value && isNaN(numValue)) {
                showFieldError(field.id, 'يرجى إدخال رقم صحيح');
                isValid = false;
            } else if (min && numValue < parseFloat(min)) {
                showFieldError(field.id, `القيمة يجب أن تكون ${min} أو أكثر`);
                isValid = false;
            } else if (max && numValue > parseFloat(max)) {
                showFieldError(field.id, `القيمة يجب أن تكون ${max} أو أقل`);
                isValid = false;
            }
            break;
    }
    
    // Validation de la longueur
    const maxLength = field.getAttribute('maxlength');
    if (maxLength && value.length > parseInt(maxLength)) {
        showFieldError(field.id, `الحد الأقصى ${maxLength} حرف`);
        isValid = false;
    }
    
    return isValid;
}

// Afficher erreur de champ
function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    
    field.classList.add('error');
    
    // Supprimer l'erreur précédente
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Ajouter la nouvelle erreur
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
}

// Effacer erreur de champ
function clearFieldError(event) {
    const field = event.target;
    field.classList.remove('error');
    
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// Fonctions utilitaires de validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidURL(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

// Gestion des uploads d'images
function triggerImageUpload(inputId) {
    document.getElementById(inputId).click();
}

function handleImageUpload(input, previewId) {
    const file = input.files[0];
    if (!file) return;
    
    // Validation du fichier
    if (!file.type.startsWith('image/')) {
        showNotification('يرجى اختيار ملف صورة صحيح', 'error');
        return;
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB
        showNotification('حجم الصورة يجب أن يكون أقل من 5MB', 'error');
        return;
    }
    
    // Prévisualisation
    const reader = new FileReader();
    reader.onload = function(e) {
        const preview = document.getElementById(previewId);
        preview.innerHTML = `<img src="${e.target.result}" alt="Preview" class="image-preview">`;
        preview.parentNode.classList.add('image-uploaded');
    };
    reader.readAsDataURL(file);
}

// Gestion du budget
function addBudgetItem() {
    budgetItems++;
    const budgetBreakdown = document.querySelector('.budget-breakdown');
    
    const budgetItem = document.createElement('div');
    budgetItem.className = 'budget-item';
    budgetItem.innerHTML = `
        <input type="text" class="form-input" placeholder="بند الإنفاق (مثل: معدات، مواد خام، تسويق)">
        <input type="number" class="form-input" placeholder="المبلغ (أ.م.)" min="0">
        <button type="button" class="btn-remove" onclick="removeBudgetItem(this)">×</button>
    `;
    
    budgetBreakdown.appendChild(budgetItem);
}

function removeBudgetItem(button) {
    if (document.querySelectorAll('.budget-item').length > 1) {
        button.parentNode.remove();
        budgetItems--;
    } else {
        showNotification('يجب أن يكون هناك بند واحد على الأقل', 'warning');
    }
}

// Gestion des récompenses
function addReward() {
    rewardItems++;
    const rewardsContainer = document.querySelector('.rewards-container');
    
    const rewardItem = document.createElement('div');
    rewardItem.className = 'reward-item';
    rewardItem.innerHTML = `
        <div class="reward-header">
            <h4>مكافأة ${rewardItems}</h4>
            <button type="button" class="btn-remove" onclick="removeReward(this)">×</button>
        </div>
        
        <div class="form-grid">
            <div class="form-group">
                <label class="form-label">مبلغ المساهمة (أ.م.)</label>
                <input type="number" class="form-input reward-amount" placeholder="1000" min="100">
            </div>
            
            <div class="form-group">
                <label class="form-label">عدد المكافآت المتاحة</label>
                <input type="number" class="form-input" placeholder="غير محدود" min="1">
            </div>
        </div>
        
        <div class="form-group">
            <label class="form-label">عنوان المكافأة</label>
            <input type="text" class="form-input" placeholder="شكر خاص + تحديثات المشروع">
        </div>
        
        <div class="form-group">
            <label class="form-label">وصف المكافأة</label>
            <textarea class="form-textarea" placeholder="اشرح ما سيحصل عليه المساهم مقابل هذا المبلغ" rows="3"></textarea>
        </div>
        
        <div class="form-group">
            <label class="form-label">تاريخ التسليم المتوقع</label>
            <input type="date" class="form-input">
        </div>
    `;
    
    rewardsContainer.appendChild(rewardItem);
}

function removeReward(button) {
    if (document.querySelectorAll('.reward-item').length > 1) {
        button.closest('.reward-item').remove();
        rewardItems--;
        updateRewardTitles();
    } else {
        showNotification('يجب أن تكون هناك مكافأة واحدة على الأقل', 'warning');
    }
}

function updateRewardTitles() {
    const rewardItems = document.querySelectorAll('.reward-item');
    rewardItems.forEach((item, index) => {
        const title = item.querySelector('.reward-header h4');
        if (index === 0) {
            title.textContent = 'مكافأة أساسية';
        } else {
            title.textContent = `مكافأة ${index + 1}`;
        }
    });
}

// Éditeur de texte riche
function formatText(command) {
    document.execCommand(command, false, null);
}

function insertList(type) {
    if (type === 'ul') {
        document.execCommand('insertUnorderedList', false, null);
    } else {
        document.execCommand('insertOrderedList', false, null);
    }
}

// Génération de la révision
function generateReview() {
    collectFormData();
    
    const reviewContent = document.getElementById('project-review');
    
    const reviewHTML = `
        <div class="review-item">
            <strong>عنوان المشروع:</strong> ${projectData.title || 'غير محدد'}
        </div>
        <div class="review-item">
            <strong>الفئة:</strong> ${getCategoryName(projectData.category) || 'غير محدد'}
        </div>
        <div class="review-item">
            <strong>الموقع:</strong> ${getLocationName(projectData.location) || 'غير محدد'}
        </div>
        <div class="review-item">
            <strong>هدف التمويل:</strong> ${formatCurrency(projectData.fundingGoal) || 'غير محدد'}
        </div>
        <div class="review-item">
            <strong>مدة الحملة:</strong> ${projectData.campaignDuration || 'غير محدد'} يوم
        </div>
        <div class="review-item">
            <strong>الوصف المختصر:</strong><br>
            ${projectData.summary || 'غير محدد'}
        </div>
    `;
    
    reviewContent.innerHTML = reviewHTML;
}

// Collecte des données du formulaire
function collectFormData() {
    projectData = {
        // Étape 1
        title: document.getElementById('project-title').value,
        category: document.getElementById('project-category').value,
        summary: document.getElementById('project-summary').value,
        location: document.getElementById('project-location').value,
        duration: document.getElementById('project-duration').value,
        
        // Étape 2
        description: document.getElementById('project-description').value,
        problems: document.getElementById('project-problems').value,
        solutions: document.getElementById('project-solutions').value,
        video: document.getElementById('project-video').value,
        
        // Étape 3
        fundingGoal: document.getElementById('funding-goal').value,
        campaignDuration: document.getElementById('campaign-duration').value,
        
        // Collecte du budget
        budget: [],
        rewards: []
    };
    
    // Collecte des éléments de budget
    document.querySelectorAll('.budget-item').forEach(item => {
        const description = item.querySelector('input[type="text"]').value;
        const amount = item.querySelector('input[type="number"]').value;
        if (description && amount) {
            projectData.budget.push({ description, amount: parseInt(amount) });
        }
    });
    
    // Collecte des récompenses
    document.querySelectorAll('.reward-item').forEach(item => {
        const amount = item.querySelector('.reward-amount').value;
        const title = item.querySelector('input[placeholder*="شكر"]').value;
        const description = item.querySelector('textarea').value;
        
        if (amount && title) {
            projectData.rewards.push({
                amount: parseInt(amount),
                title,
                description
            });
        }
    });
}

// Sauvegarde et chargement des brouillons
function saveDraft() {
    collectFormData();
    saveDraftData();
    showNotification('تم حفظ المسودة بنجاح', 'success');
}

function saveDraftData() {
    try {
        localStorage.setItem('project_draft', JSON.stringify({
            data: projectData,
            step: currentStep,
            timestamp: new Date().toISOString()
        }));
    } catch (error) {
        console.error('خطأ في حفظ المسودة:', error);
    }
}

function loadDraftData() {
    try {
        const draft = localStorage.getItem('project_draft');
        if (draft) {
            const draftData = JSON.parse(draft);
            
            // Demander à l'utilisateur s'il veut charger le brouillon
            if (confirm('تم العثور على مسودة محفوظة. هل تريد استكمال العمل عليها؟')) {
                projectData = draftData.data || {};
                currentStep = draftData.step || 1;
                
                populateFormWithData();
                updateStepDisplay();
                updateNavigationButtons();
                
                showNotification('تم تحميل المسودة بنجاح', 'info');
            }
        }
    } catch (error) {
        console.error('خطأ في تحميل المسودة:', error);
    }
}

function populateFormWithData() {
    // Remplir les champs avec les données sauvegardées
    Object.keys(projectData).forEach(key => {
        const element = document.getElementById(`project-${key}`) || document.getElementById(key);
        if (element && projectData[key]) {
            element.value = projectData[key];
        }
    });
}

// Soumission du projet
function submitProject() {
    if (!validateCurrentStep()) {
        return;
    }
    
    collectFormData();
    
    // Simulation de soumission
    showNotification('جاري إرسال المشروع...', 'info');
    
    setTimeout(() => {
        // Supprimer le brouillon
        localStorage.removeItem('project_draft');
        
        showNotification('تم إرسال مشروعك بنجاح! سيتم مراجعته خلال 24-48 ساعة.', 'success');
        
        // Redirection après 3 secondes
        setTimeout(() => {
            navigateTo('profile');
        }, 3000);
    }, 2000);
}

// Fonctions utilitaires
function getLocationName(value) {
    const locations = {
        'nouakchott': 'نواكشوط',
        'nouadhibou': 'نواذيبو',
        'rosso': 'روصو',
        'kaedi': 'كيهيدي',
        'zouerate': 'ازويرات',
        'atar': 'أطار',
        'kiffa': 'كيفة',
        'nema': 'النعمة',
        'aioun': 'العيون',
        'tidjikja': 'تيجكجة',
        'other': 'أخرى'
    };
    return locations[value] || value;
}

function getCategoryName(value) {
    const categories = {
        'technology': 'التكنولوجيا والابتكار',
        'renewable-energy': 'الطاقة المتجددة',
        'agriculture': 'الزراعة والثروة الحيوانية',
        'education': 'التعليم والتدريب',
        'healthcare': 'الصحة والرعاية الطبية',
        'crafts': 'الصناعات التقليدية',
        'commerce': 'التجارة والخدمات',
        'tourism': 'السياحة والضيافة',
        'environment': 'البيئة والاستدامة',
        'social': 'المشاريع الاجتماعية'
    };
    return categories[value] || value;
}

function formatCurrency(amount) {
    if (!amount) return '';
    return parseInt(amount).toLocaleString('ar-MR') + ' أ.م.';
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Configuration de la validation du formulaire
function setupFormValidation() {
    // Ajouter des styles CSS pour les erreurs
    const style = document.createElement('style');
    style.textContent = `
        .form-input.error,
        .form-select.error,
        .form-textarea.error {
            border-color: #e74c3c;
            box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
        }
        
        .field-error {
            color: #e74c3c;
            font-size: 12px;
            margin-top: 4px;
            font-weight: 500;
        }
        
        .review-item {
            margin-bottom: 12px;
            padding: 8px 0;
            border-bottom: 1px solid rgba(46, 134, 255, 0.1);
        }
        
        .review-item:last-child {
            border-bottom: none;
        }
    `;
    document.head.appendChild(style);
}

