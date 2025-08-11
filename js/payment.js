// JavaScript pour la page de paiement

// Variables globales
let selectedAmount = 0;
let selectedPaymentMethod = 'card';
let selectedWallet = '';
let processingFeeRate = 0.025; // 2.5%

// Fonction pour sélectionner un montant prédéfini
function selectAmount(amount) {
    selectedAmount = amount;
    
    // Mettre à jour l'interface
    document.querySelectorAll('.amount-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const selectedBtn = document.querySelector(`[onclick="selectAmount(${amount})"]`);
    if (selectedBtn) {
        selectedBtn.classList.add('active');
    }
    
    // Mettre à jour le champ de saisie personnalisé
    const amountInput = document.getElementById('amount-input');
    if (amountInput) {
        amountInput.value = amount;
    }
    
    updateOrderSummary();
    updatePaymentButton();
}

// Fonction pour gérer la saisie de montant personnalisé
function handleCustomAmount() {
    const amountInput = document.getElementById('amount-input');
    const amount = parseInt(amountInput.value) || 0;
    
    if (amount >= 1000 && amount <= 1000000) {
        selectedAmount = amount;
        
        // Désélectionner les boutons prédéfinis
        document.querySelectorAll('.amount-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        updateOrderSummary();
        updatePaymentButton();
    } else {
        selectedAmount = 0;
        updateOrderSummary();
        updatePaymentButton();
    }
}

// Fonction pour sélectionner une méthode de paiement
function selectPaymentMethod(method) {
    selectedPaymentMethod = method;
    
    // Mettre à jour l'interface
    document.querySelectorAll('.payment-method').forEach(methodEl => {
        methodEl.classList.remove('active');
    });
    
    const selectedMethodEl = document.querySelector(`[onclick="selectPaymentMethod('${method}')"]`);
    if (selectedMethodEl) {
        selectedMethodEl.classList.add('active');
    }
    
    // Mettre à jour le radio button
    const radioBtn = document.querySelector(`input[value="${method}"]`);
    if (radioBtn) {
        radioBtn.checked = true;
    }
    
    // Afficher/masquer les sections appropriées
    showPaymentDetails(method);
    updatePaymentButton();
}

// Fonction pour afficher les détails de paiement appropriés
function showPaymentDetails(method) {
    // Masquer toutes les sections de détails
    document.getElementById('card-details').style.display = 'none';
    document.getElementById('bank-details').style.display = 'none';
    document.getElementById('mobile-details').style.display = 'none';
    
    // Afficher la section appropriée
    switch (method) {
        case 'card':
            document.getElementById('card-details').style.display = 'block';
            break;
        case 'bank':
            document.getElementById('bank-details').style.display = 'block';
            generateTransferCode();
            break;
        case 'mobile':
            document.getElementById('mobile-details').style.display = 'block';
            break;
    }
}

// Fonction pour sélectionner un portefeuille mobile
function selectWallet(wallet) {
    selectedWallet = wallet;
    
    document.querySelectorAll('.wallet-option').forEach(option => {
        option.classList.remove('active');
    });
    
    const selectedOption = document.querySelector(`[onclick="selectWallet('${wallet}')"]`);
    if (selectedOption) {
        selectedOption.classList.add('active');
    }
}

// Fonction pour générer un code de transfert
function generateTransferCode() {
    const code = 'RF-' + new Date().getFullYear() + '-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    const transferCodeEl = document.getElementById('transfer-code');
    if (transferCodeEl) {
        transferCodeEl.textContent = code;
    }
}

// Fonction pour copier les détails bancaires
function copyBankDetails() {
    const bankDetails = `
البنك الوطني الموريتاني
رقم الحساب: 1234567890123456
اسم المستفيد: RIM-FINANCE SARL
رمز التحويل: ${document.getElementById('transfer-code').textContent}
المبلغ: ${formatCurrency(selectedAmount)}
    `.trim();
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(bankDetails).then(() => {
            showNotification('تم نسخ تفاصيل التحويل البنكي!', 'success');
        }).catch(() => {
            fallbackCopyToClipboard(bankDetails);
        });
    } else {
        fallbackCopyToClipboard(bankDetails);
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
        showNotification('تم نسخ تفاصيل التحويل البنكي!', 'success');
    } catch (err) {
        showNotification('فشل في نسخ التفاصيل', 'error');
    }
    
    document.body.removeChild(textArea);
}

// Fonction pour mettre à jour le résumé de commande
function updateOrderSummary() {
    const processingFee = Math.round(selectedAmount * processingFeeRate);
    const totalAmount = selectedAmount + processingFee;
    
    document.getElementById('investment-amount').textContent = formatCurrency(selectedAmount);
    document.getElementById('processing-fee').textContent = formatCurrency(processingFee);
    document.getElementById('total-amount').textContent = formatCurrency(totalAmount);
}

// Fonction pour mettre à jour le bouton de paiement
function updatePaymentButton() {
    const paymentBtn = document.querySelector('.btn-payment');
    const btnAmount = document.getElementById('btn-amount');
    const termsCheckbox = document.getElementById('terms-checkbox');
    const riskCheckbox = document.getElementById('risk-checkbox');
    
    const totalAmount = selectedAmount + Math.round(selectedAmount * processingFeeRate);
    
    if (btnAmount) {
        btnAmount.textContent = formatCurrency(totalAmount);
    }
    
    // Vérifier si le formulaire est valide
    const isValid = selectedAmount >= 1000 && 
                   termsCheckbox.checked && 
                   riskCheckbox.checked &&
                   isPaymentMethodValid();
    
    paymentBtn.disabled = !isValid;
}

// Fonction pour vérifier si la méthode de paiement est valide
function isPaymentMethodValid() {
    switch (selectedPaymentMethod) {
        case 'card':
            const cardNumber = document.getElementById('card-number').value;
            const expiryDate = document.getElementById('expiry-date').value;
            const cvv = document.getElementById('cvv').value;
            const cardholderName = document.getElementById('cardholder-name').value;
            
            return cardNumber.length >= 16 && 
                   expiryDate.length === 5 && 
                   cvv.length >= 3 && 
                   cardholderName.length >= 2;
                   
        case 'bank':
            return true; // Toujours valide pour le transfert bancaire
            
        case 'mobile':
            const phoneNumber = document.getElementById('phone-number').value;
            return phoneNumber.length >= 8 && selectedWallet !== '';
            
        default:
            return false;
    }
}

// Fonction pour formater le numéro de carte
function formatCardNumber(input) {
    let value = input.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    
    if (formattedValue.length > 19) {
        formattedValue = formattedValue.substr(0, 19);
    }
    
    input.value = formattedValue;
    
    // Détecter le type de carte
    detectCardType(value);
}

// Fonction pour formater la date d'expiration
function formatExpiryDate(input) {
    let value = input.value.replace(/\D/g, '');
    
    if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    
    input.value = value;
}

// Fonction pour détecter le type de carte
function detectCardType(cardNumber) {
    const cardIcons = document.querySelectorAll('.card-icon');
    
    cardIcons.forEach(icon => {
        icon.style.opacity = '0.3';
    });
    
    if (cardNumber.startsWith('4')) {
        // Visa
        const visaIcon = document.querySelector('.card-icon.visa');
        if (visaIcon) visaIcon.style.opacity = '1';
    } else if (cardNumber.startsWith('5') || cardNumber.startsWith('2')) {
        // Mastercard
        const mastercardIcon = document.querySelector('.card-icon.mastercard');
        if (mastercardIcon) mastercardIcon.style.opacity = '1';
    }
}

// Fonction pour traiter le paiement
function processPayment(event) {
    event.preventDefault();
    
    if (!isPaymentMethodValid() || selectedAmount < 1000) {
        showNotification('يرجى التحقق من جميع البيانات المطلوبة', 'error');
        return;
    }
    
    // Afficher un indicateur de chargement
    const paymentBtn = document.querySelector('.btn-payment');
    const originalText = paymentBtn.innerHTML;
    paymentBtn.innerHTML = '<span>⏳</span> جاري المعالجة...';
    paymentBtn.disabled = true;
    
    // Simuler le traitement du paiement
    setTimeout(() => {
        // Réinitialiser le bouton
        paymentBtn.innerHTML = originalText;
        paymentBtn.disabled = false;
        
        // Afficher le modal de confirmation
        showPaymentConfirmation();
        
        // Enregistrer la transaction
        saveTransaction();
        
    }, 3000);
}

// Fonction pour afficher la confirmation de paiement
function showPaymentConfirmation() {
    const modal = document.getElementById('payment-modal');
    const totalAmount = selectedAmount + Math.round(selectedAmount * processingFeeRate);
    
    // Mettre à jour les détails dans le modal
    document.getElementById('confirmed-amount').textContent = formatCurrency(totalAmount);
    document.getElementById('transaction-id').textContent = 'TXN-' + new Date().getFullYear() + '-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    document.getElementById('payment-date').textContent = new Date().toLocaleDateString('ar-EG');
    
    modal.classList.add('active');
    
    // Afficher une notification de succès
    showNotification('تم الدفع بنجاح! شكراً لاستثمارك', 'success');
}

// Fonction pour fermer le modal de paiement
function closePaymentModal() {
    const modal = document.getElementById('payment-modal');
    modal.classList.remove('active');
}

// Fonction pour aller au profil
function goToProfile() {
    closePaymentModal();
    navigateTo('profile');
}

// Fonction pour retourner au projet
function goToProject() {
    closePaymentModal();
    navigateTo('project-detail');
}

// Fonction pour enregistrer la transaction
function saveTransaction() {
    const transaction = {
        id: 'TXN-' + new Date().getFullYear() + '-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
        projectId: 1, // ID du projet (à récupérer dynamiquement)
        amount: selectedAmount,
        processingFee: Math.round(selectedAmount * processingFeeRate),
        totalAmount: selectedAmount + Math.round(selectedAmount * processingFeeRate),
        paymentMethod: selectedPaymentMethod,
        status: 'completed',
        date: new Date().toISOString(),
        userId: getCurrentUserId()
    };
    
    // Sauvegarder dans le localStorage
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    transactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    
    // Mettre à jour les statistiques utilisateur
    updateUserStats(transaction);
}

// Fonction pour obtenir l'ID utilisateur actuel
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
    return 1; // ID par défaut
}

// Fonction pour mettre à jour les statistiques utilisateur
function updateUserStats(transaction) {
    try {
        const userData = localStorage.getItem('currentUser');
        if (userData) {
            const user = JSON.parse(userData);
            
            // Mettre à jour les statistiques
            user.totalInvestments = (user.totalInvestments || 0) + transaction.amount;
            user.projectsSupported = (user.projectsSupported || 0) + 1;
            user.lastInvestmentDate = transaction.date;
            
            localStorage.setItem('currentUser', JSON.stringify(user));
        }
    } catch (error) {
        console.error('Erreur lors de la mise à jour des statistiques:', error);
    }
}

// Fonction pour valider les champs en temps réel
function setupRealTimeValidation() {
    // Validation du montant
    const amountInput = document.getElementById('amount-input');
    if (amountInput) {
        amountInput.addEventListener('input', handleCustomAmount);
    }
    
    // Validation de la carte
    const cardNumber = document.getElementById('card-number');
    if (cardNumber) {
        cardNumber.addEventListener('input', function() {
            formatCardNumber(this);
            updatePaymentButton();
        });
    }
    
    const expiryDate = document.getElementById('expiry-date');
    if (expiryDate) {
        expiryDate.addEventListener('input', function() {
            formatExpiryDate(this);
            updatePaymentButton();
        });
    }
    
    const cvv = document.getElementById('cvv');
    if (cvv) {
        cvv.addEventListener('input', function() {
            this.value = this.value.replace(/\D/g, '');
            updatePaymentButton();
        });
    }
    
    const cardholderName = document.getElementById('cardholder-name');
    if (cardholderName) {
        cardholderName.addEventListener('input', updatePaymentButton);
    }
    
    // Validation du téléphone pour les portefeuilles mobiles
    const phoneNumber = document.getElementById('phone-number');
    if (phoneNumber) {
        phoneNumber.addEventListener('input', function() {
            this.value = this.value.replace(/\D/g, '');
            updatePaymentButton();
        });
    }
    
    // Validation des cases à cocher
    const termsCheckbox = document.getElementById('terms-checkbox');
    const riskCheckbox = document.getElementById('risk-checkbox');
    
    if (termsCheckbox) {
        termsCheckbox.addEventListener('change', updatePaymentButton);
    }
    
    if (riskCheckbox) {
        riskCheckbox.addEventListener('change', updatePaymentButton);
    }
}

// Initialisation de la page
document.addEventListener('DOMContentLoaded', function() {
    // Sélectionner le montant par défaut
    selectAmount(50000);
    
    // Sélectionner la méthode de paiement par défaut
    selectPaymentMethod('card');
    
    // Configurer la validation en temps réel
    setupRealTimeValidation();
    
    // Ajouter l'écouteur d'événement pour le formulaire
    const paymentForm = document.getElementById('payment-form');
    if (paymentForm) {
        paymentForm.addEventListener('submit', processPayment);
    }
    
    // Fermer le modal en cliquant à l'extérieur
    const modal = document.getElementById('payment-modal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closePaymentModal();
            }
        });
    }
    
    // Vérifier si l'utilisateur est connecté
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        showNotification('يرجى تسجيل الدخول لإتمام عملية الدفع', 'warning');
        setTimeout(() => {
            window.location.href = 'signup.html';
        }, 2000);
    }
});

// Fonction pour mettre à jour les traductions spécifiques au paiement
function updatePaymentTranslations() {
    // Mettre à jour les textes des méthodes de paiement
    const paymentMethodTexts = {
        ar: {
            'card_payment': 'بطاقة ائتمان/خصم',
            'bank_transfer': 'تحويل بنكي',
            'mobile_wallet': 'محفظة إلكترونية',
            'confirm_payment': 'تأكيد الدفع',
            'processing': 'جاري المعالجة...'
        },
        fr: {
            'card_payment': 'Carte de crédit/débit',
            'bank_transfer': 'Virement bancaire',
            'mobile_wallet': 'Portefeuille mobile',
            'confirm_payment': 'Confirmer le paiement',
            'processing': 'Traitement en cours...'
        },
        en: {
            'card_payment': 'Credit/Debit Card',
            'bank_transfer': 'Bank Transfer',
            'mobile_wallet': 'Mobile Wallet',
            'confirm_payment': 'Confirm Payment',
            'processing': 'Processing...'
        }
    };
    
    // Mettre à jour le bouton de paiement
    const paymentBtn = document.querySelector('.btn-payment .btn-text');
    if (paymentBtn) {
        paymentBtn.textContent = paymentMethodTexts[currentLanguage]?.confirm_payment || paymentMethodTexts.ar.confirm_payment;
    }
}

// Écouter les changements de langue
document.addEventListener('languageChanged', updatePaymentTranslations);

