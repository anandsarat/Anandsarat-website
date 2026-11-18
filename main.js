/**
 * Anand Sarat — Executive Leadership Facilitator & Business Transformation Consultant
 * Interactive Portfolio Scripts (Accessible, Modern ES6+)
 */

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initProgramFilters();
    initContactForm();
    initCalendarModal();
});

function initMobileMenu() {
    const menuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    if (!menuBtn || !mobileMenu) return;

    menuBtn.addEventListener('click', () => {
        const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
        menuBtn.setAttribute('aria-expanded', String(!isExpanded));
        mobileMenu.classList.toggle('hidden');
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menuBtn.setAttribute('aria-expanded', 'false');
            mobileMenu.classList.add('hidden');
        });
    });
}

function initProgramFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const programCards = document.querySelectorAll('.program-card');

    if (!filterButtons.length || !programCards.length) return;

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const selectedCategory = btn.getAttribute('data-filter');

            filterButtons.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-pressed', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');

            programCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                if (selectedCategory === 'all' || cardCategory === selectedCategory) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
}

async function copyInfo(textValue, successMessage) {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(textValue);
        } else {
            const textArea = document.createElement('textarea');
            textArea.value = textValue;
            textArea.style.position = 'fixed';
            textArea.style.left = '-9999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
        }
        showToast(successMessage || 'Copied to clipboard!');
    } catch (err) {
        showToast('Unable to copy automatically. Please copy manually.');
    }
}

let toastTimeout;
function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMessage');
    if (!toast || !toastMsg) return;

    toastMsg.textContent = message;
    toast.classList.add('show');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 3200);
}

function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = document.getElementById('submitBtn');
        const btnText = document.getElementById('submitBtnText');
        const statusBox = document.getElementById('formStatus');
        const errorBox = document.getElementById('formError');

        statusBox.classList.add('hidden');
        errorBox.classList.add('hidden');

        const fullName = form.querySelector('#fullName').value.trim();
        const orgName = form.querySelector('#orgName').value.trim();
        const workEmail = form.querySelector('#workEmail').value.trim();
        const track = form.querySelector('#trackSelect').value;
        const notes = form.querySelector('#notes').value.trim();

        if (!fullName || !orgName || !workEmail) {
            errorBox.textContent = 'Please fill in your name, organization, and work email.';
            errorBox.classList.remove('hidden');
            return;
        }

        submitBtn.disabled = true;
        btnText.textContent = 'Preparing Request...';

        const endpoint = form.getAttribute('data-endpoint');

        if (endpoint && endpoint.startsWith('https://')) {
            try {
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                    body: JSON.stringify({ fullName, orgName, workEmail, track, notes })
                });
                if (response.ok) {
                    form.reset();
                    statusBox.classList.remove('hidden');
                    showToast('Strategy call inquiry submitted!');
                } else {
                    throw new Error('Submission failed');
                }
            } catch (err) {
                errorBox.textContent = 'Network issue submitting form. Launching direct email client instead.';
                errorBox.classList.remove('hidden');
                launchMailto(fullName, orgName, workEmail, track, notes);
            } finally {
                submitBtn.disabled = false;
                btnText.textContent = 'Request 20-Min Strategy Call';
            }
        } else {
            setTimeout(() => {
                launchMailto(fullName, orgName, workEmail, track, notes);
                submitBtn.disabled = false;
                btnText.textContent = 'Request 20-Min Strategy Call';
                statusBox.classList.remove('hidden');
                showToast('Opening your email client to send inquiry to Anand...');
            }, 450);
        }
    });
}

function launchMailto(fullName, orgName, workEmail, track, notes) {
    const subject = encodeURIComponent(`Leadership Facilitation Strategy Call — ${orgName}`);
    const body = encodeURIComponent(
        `Hi Anand,\n\nI would like to schedule a 20-minute strategy call regarding leadership facilitation.\n\n` +
        `Name: ${fullName}\n` +
        `Organization: ${orgName}\n` +
        `Work Email: ${workEmail}\n` +
        `Focus Area: ${track}\n` +
        `Context / Priorities:\n${notes || 'N/A'}\n\nBest regards,\n${fullName}`
    );
    window.location.href = `mailto:anand.s@zolio.ai?subject=${subject}&body=${body}`;
}

function initCalendarModal() {
    const modal = document.getElementById('calendarModal');
    const openBtns = document.querySelectorAll('[data-open-calendar]');
    const closeBtn = document.getElementById('closeCalendarModal');

    if (!modal) return;

    openBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            document.body.style.overflow = 'hidden';
        });
    });

    const closeModal = () => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.body.style.overflow = '';
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });
}
