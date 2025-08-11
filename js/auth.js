// JavaScript pour les pages d'authentification

let selectedUserType = 'investor';

// Fonction pour changer d'onglet
function switchTab(tab) {
    const signupForm = document.getElementById('signup-form');
    const loginForm = document.getElementById('login-form');
    const tabs = document.querySelectorAll('.auth-tab');
    const authSwitchText = document.getElementById('auth-switch-text');
    const authSwitchLink = document.getElementById('auth-switch-link');
    
    // Réinitialiser les onglets
    tabs.forEach(t => t.classList.remove('active'));
    
    if (tab === 'signup') {
        document.querySelector('[onclick="switchTab(\'signup\')"]').classList.add('active');
        signupForm.style.display = 'block';
        loginForm.style.display = 'none';
        
        // Mettre à jour le texte de commutation
        if (authSwitchText && authSwitchLink) {
            authSwitchText.textContent = getTranslatedText('already_have_account', 'لديك حساب بالفعل؟');
            authSwitchLink.textContent = translate('login');
            authSwitchLink.onclick = () => switchTab('login');
        }
    } else {
        document.querySelector('[onclick="switchTab(\'login\')"]').classList.add('active');
        signupForm.style.display = 'none';
        loginForm.style.display = 'block';
        
        // Mettre à jour le texte de commutation
        if (authSwitchText && authSwitchLink) {
            authSwitchText.textContent = getTranslatedText('no_account', 'ليس لديك حساب؟');
            authSwitchLink.textContent = translate('signup');
            authSwitchLink.onclick = () => switchTab('signup');
        }
    }
}

// Fonction pour sélectionner le type d'utilisateur
function selectUserType(type) {
    selectedUserType = type;
    
    const options = document.querySelectorAll('.user-type-option');
    options.forEach(option => option.classList.remove('active'));
    
    const selectedOption = document.querySelector(`[onclick="selectUserType('${type}')"]`);
    if (selectedOption) {
        selectedOption.classList.add('active');
    }
}

// Fonction pour obtenir le texte traduit
function getTranslatedText(key, defaultText) {
    const texts = {
        ar: {
            'already_have_account': 'لديك حساب بالفعل؟',
            'no_account': 'ليس لديك حساب؟',
            'registration_success': 'تم التسجيل بنجاح!',
            'login_success': 'تم تسجيل الدخول بنجاح!',
            'passwords_not_match': 'كلمات المرور غير متطابقة',
            'phone_invalid': 'رقم الهاتف غير صحيح',
            'fill_all_fields': 'يرجى ملء جميع الحقول',
            'welcome_back': 'مرحباً بعودتك',
            'welcome_new_user': 'مرحباً بك في RIM-FINANCE'
        },
        fr: {
            'already_have_account': 'Vous avez déjà un compte ?',
            'no_account': 'Vous n\'avez pas de compte ?',
            'registration_success': 'Inscription réussie !',
            'login_success': 'Connexion réussie !',
            'passwords_not_match': 'Les mots de passe ne correspondent pas',
            'phone_invalid': 'Numéro de téléphone invalide',
            'fill_all_fields': 'Veuillez remplir tous les champs',
            'welcome_back': 'Bon retour',
            'welcome_new_user': 'Bienvenue sur RIM-FINANCE'
        },
        en: {
            'already_have_account': 'Already have an account?',
            'no_account': 'Don\'t have an account?',
            'registration_success': 'Registration successful!',
            'login_success': 'Login successful!',
            'passwords_not_match': 'Passwords do not match',
            'phone_invalid': 'Invalid phone number',
            'fill_all_fields': 'Please fill all fields',
            'welcome_back': 'Welcome back',
            'welcome_new_user': 'Welcome to RIM-FINANCE'
        }
    };
    
    return texts[currentLanguage] && texts[currentLanguage][key] ? texts[currentLanguage][key] : defaultText;
}

// Validation du formulaire d'inscription
function validateSignupForm(formData) {
    const errors = [];
    
    // Vérifier que tous les champs sont remplis
    if (!formData.fullName || !formData.phone || !formData.password || !formData.confirmPassword) {
        errors.push(getTranslatedText('fill_all_fields', 'يرجى ملء جميع الحقول'));
    }
    
    // Vérifier que les mots de passe correspondent
    if (formData.password !== formData.confirmPassword) {
        errors.push(getTranslatedText('passwords_not_match', 'كلمات المرور غير متطابقة'));
    }
    
    // Vérifier le format du numéro de téléphone (simple validation)
    const phoneRegex = /^[0-9]{8,}$/;
    if (!phoneRegex.test(formData.phone)) {
        errors.push(getTranslatedText('phone_invalid', 'رقم الهاتف غير صحيح'));
    }
    
    return errors;
}

// Validation du formulaire de connexion
function validateLoginForm(formData) {
    const errors = [];
    
    // Vérifier que tous les champs sont remplis
    if (!formData.phone || !formData.password) {
        errors.push(getTranslatedText('fill_all_fields', 'يرجى ملء جميع الحقول'));
    }
    
    return errors;
}

// Afficher les erreurs
function showErrors(errors) {
    // Supprimer les anciens messages d'erreur
    document.querySelectorAll('.error-message').forEach(el => el.remove());
    
    if (errors.length > 0) {
        const errorContainer = document.createElement('div');
        errorContainer.className = 'error-message';
        errorContainer.style.marginBottom = '16px';
        errorContainer.style.padding = '12px';
        errorContainer.style.backgroundColor = 'rgba(244, 67, 54, 0.1)';
        errorContainer.style.borderRadius = 'var(--border-radius)';
        errorContainer.style.border = '1px solid #f44336';
        
        errorContainer.innerHTML = errors.map(error => `<div>${error}</div>`).join('');
        
        const form = document.querySelector('.auth-form:not([style*="display: none"])');
        form.insertBefore(errorContainer, form.firstChild);
    }
}

// Simuler l'inscription
function simulateSignup(formData) {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Simuler une inscription réussie
            const userData = {
                id: Date.now(),
                fullName: formData.fullName,
                phone: formData.phone,
                userType: selectedUserType,
                registrationDate: new Date().toISOString()
            };
            
            // Sauvegarder dans le localStorage
            localStorage.setItem('currentUser', JSON.stringify(userData));
            localStorage.setItem('isLoggedIn', 'true');
            
            resolve(userData);
        }, 1500);
    });
}

// Simuler la connexion
function simulateLogin(formData) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Vérifier les identifiants (utilisateur de test)
            if (formData.phone === '44508860' && formData.password === '123456') {
                const userData = {
                    id: 1,
                    fullName: 'محمد طه أبو',
                    phone: '44508860',
                    userType: 'investor',
                    loginDate: new Date().toISOString()
                };
                
                // Sauvegarder dans le localStorage
                localStorage.setItem('currentUser', JSON.stringify(userData));
                localStorage.setItem('isLoggedIn', 'true');
                
                resolve(userData);
            } else {
                reject(new Error('بيانات الدخول غير صحيحة'));
            }
        }, 1000);
    });
}

// Gestion de la soumission du formulaire d'inscription
document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signup-form');
    const loginForm = document.getElementById('login-form');
    
    if (signupForm) {
        signupForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = {
                fullName: document.getElementById('full-name').value,
                phone: document.getElementById('phone').value,
                password: document.getElementById('password').value,
                confirmPassword: document.getElementById('confirm-password').value,
                userType: selectedUserType
            };
            
            const errors = validateSignupForm(formData);
            
            if (errors.length > 0) {
                showErrors(errors);
                return;
            }
            
            // Afficher un indicateur de chargement
            const submitBtn = signupForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span>⏳</span> جاري التسجيل...';
            submitBtn.disabled = true;
            
            try {
                const userData = await simulateSignup(formData);
                
                // Afficher un message de succès
                showNotification(getTranslatedText('registration_success', 'تم التسجيل بنجاح!'), 'success');
                showNotification(getTranslatedText('welcome_new_user', 'مرحباً بك في RIM-FINANCE'), 'info');
                
                // Rediriger vers le profil après un délai
                setTimeout(() => {
                    window.location.href = 'profile';
                }, 2000);
                
            } catch (error) {
                showErrors([error.message]);
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
    
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = {
                phone: document.getElementById('login-phone').value,
                password: document.getElementById('login-password').value
            };
            
            const errors = validateLoginForm(formData);
            
            if (errors.length > 0) {
                showErrors(errors);
                return;
            }
            
            // Afficher un indicateur de chargement
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span>⏳</span> جاري تسجيل الدخول...';
            submitBtn.disabled = true;
            
            try {
                const userData = await simulateLogin(formData);
                
                // Afficher un message de succès
                showNotification(getTranslatedText('login_success', 'تم تسجيل الدخول بنجاح!'), 'success');
                showNotification(getTranslatedText('welcome_back', 'مرحباً بعودتك') + ' ' + userData.fullName, 'info');
                
                // Rediriger vers le profil après un délai
                setTimeout(() => {
                    window.location.href = 'profile';
                }, 2000);
                
            } catch (error) {
                showErrors([error.message]);
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
});

// Fonction pour mettre à jour les traductions spécifiques à l'authentification
function updateAuthTranslations() {
    // Mettre à jour le texte de commutation
    const authSwitchText = document.getElementById('auth-switch-text');
    const authSwitchLink = document.getElementById('auth-switch-link');
    
    if (authSwitchText && authSwitchLink) {
        const isSignupVisible = document.getElementById('signup-form').style.display !== 'none';
        
        if (isSignupVisible) {
            authSwitchText.textContent = getTranslatedText('already_have_account', 'لديك حساب بالفعل؟');
            authSwitchLink.textContent = translate('login');
        } else {
            authSwitchText.textContent = getTranslatedText('no_account', 'ليس لديك حساب؟');
            authSwitchLink.textContent = translate('signup');
        }
    }
    
    // Mettre à jour les textes des types d'utilisateur
    const investorText = document.querySelector('.user-type-option h3[data-translate="investor"]');
    const ownerText = document.querySelector('.user-type-option h3[data-translate="project_owner"]');
    
    if (investorText) investorText.textContent = translate('investor');
    if (ownerText) ownerText.textContent = translate('project_owner');
}

// Écouter les changements de langue
document.addEventListener('languageChanged', updateAuthTranslations);

