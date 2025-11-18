const TICKER_DATA = {
	testimonials: [
		{quote: 'An amazing opportunity!..', author: '@iamkatiebrinkley, 8k+ Followers'},
		{quote: 'Amazing, worth more than the $$...', author: '@chill_mindset, Motivational Brand'},
		{quote: 'Learn from the best!..', author: '@hustleadmins, Pro DayTrader'}
	],
	intervalMs: 2500 // Change the speed here (in milliseconds)
};

(function initTestimonialsTicker() {
	const tickerEl = document.getElementById('testimonials-ticker');
	const items = (TICKER_DATA && Array.isArray(TICKER_DATA.testimonials)) ? TICKER_DATA.testimonials : [];
	const speed = (TICKER_DATA && Number(TICKER_DATA.intervalMs)) || 3500;

	if (!tickerEl || items.length === 0) return;

	// Increase minHeight to accommodate quote + author on a new line
	tickerEl.style.minHeight = '3.6em';
	tickerEl.style.display = 'block';
	tickerEl.style.border = '1px solid #ccc';
	tickerEl.style.borderRadius = '10px';
	tickerEl.style.padding = '1em';

	// Build indicators (dashes) below the ticker
	const indicatorsWrap = document.createElement('div');
	indicatorsWrap.className = 'quotes-indicators';
	indicatorsWrap.setAttribute('role', 'tablist');

	const indicators = items.map((item, i) => {
		const span = document.createElement('span');
		span.className = 'quote-indicator';
		span.textContent = '—';
		span.setAttribute('role', 'tab');
		span.setAttribute('aria-label', `Testimonial ${i + 1}${item.author ? `, ${item.author}` : ''}`);
		span.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
		indicatorsWrap.appendChild(span);
		return span;
	});

	// Insert indicators after the ticker element
	tickerEl.insertAdjacentElement('afterend', indicatorsWrap);

	let index = 0;

	function render() {
		const current = index % items.length;
		const {quote, author} = items[current];
		tickerEl.innerHTML = author
			? `“${quote}”<span class="quote-author">${author}</span>`
			: `“${quote}”`;

		// Update indicators highlighting
		indicators.forEach((el, i) => {
			if (i === current) {
				el.classList.add('active');
				el.setAttribute('aria-selected', 'true');
			} else {
				el.classList.remove('active');
				el.setAttribute('aria-selected', 'false');
			}
		});

		index++;
	}

	render();
	setInterval(render, speed);
})();

(function initPackagesSlider() {
	const slider = document.querySelector('.packages-slider');
	if (!slider) return;

	const track = slider.querySelector('.slides');
	const slides = Array.from(slider.querySelectorAll('.slides > .package'));
	const prevBtn = slider.querySelector('.slider-arrow.prev');
	const nextBtn = slider.querySelector('.slider-arrow.next');
	if (!track || slides.length === 0 || !prevBtn || !nextBtn) return;

	let index = 0;

	function update() {
		track.style.transform = `translateX(-${index * 100}%)`;

		slides.forEach((slide, i) => {
			const hidden = i !== index;
			slide.setAttribute('aria-hidden', String(hidden));
			if (hidden) {
				slide.setAttribute('tabindex', '-1');
			} else {
				slide.removeAttribute('tabindex');
			}
		});

		prevBtn.disabled = index === 0;
		nextBtn.disabled = index === slides.length - 1;
	}

	function go(delta) {
		index = Math.max(0, Math.min(slides.length - 1, index + delta));
		update();
	}

	prevBtn.addEventListener('click', () => go(-1));
	nextBtn.addEventListener('click', () => go(1));

	// Keyboard navigation when slider is focused
	slider.addEventListener('keydown', (e) => {
		if (e.key === 'ArrowLeft') {
			e.preventDefault();
			go(-1);
		}
		if (e.key === 'ArrowRight') {
			e.preventDefault();
			go(1);
		}
	});

	// Initialize
	update();
})();

// Lightbox for package slides (image expand + text details)
(function initPackageLightbox() {
	const slider = document.querySelector('.packages-slider');
	if (!slider) return;

	// Build modal once and reuse
	const modal = document.createElement('div');
	modal.className = 'modal';
	modal.setAttribute('aria-hidden', 'true');
	modal.innerHTML = `
        <div class="modal-backdrop" data-close="true"></div>
        <div class="modal-content" role="dialog" aria-modal="true" aria-label="Package preview">
            <button class="modal-close" aria-label="Close preview" title="Close">×</button>
            <div class="modal-body"></div>
        </div>
    `;
	document.body.appendChild(modal);

	const bodyEl = document.body;
	const content = modal.querySelector('.modal-body');
	const closeBtn = modal.querySelector('.modal-close');
	const backdrop = modal.querySelector('.modal-backdrop');
	let lastFocused = null;

	function openModal(inner) {
		lastFocused = document.activeElement;
		content.innerHTML = '';
		if (inner) content.appendChild(inner);
		modal.classList.add('open');
		modal.setAttribute('aria-hidden', 'false');
		bodyEl.classList.add('modal-open');
		closeBtn.focus();
	}

	function closeModal() {
		modal.classList.remove('open');
		modal.setAttribute('aria-hidden', 'true');
		bodyEl.classList.remove('modal-open');
		// return focus
		if (lastFocused && typeof lastFocused.focus === 'function') {
			lastFocused.focus();
		}
	}

	closeBtn.addEventListener('click', closeModal);
	backdrop.addEventListener('click', (e) => {
		if (e.target === backdrop || e.target.getAttribute('data-close') === 'true') {
			closeModal();
		}
	});
	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape' && modal.classList.contains('open')) {
			closeModal();
		}
	});

	// Delegate clicks from slides
	slider.addEventListener('click', (e) => {
		const slide = e.target.closest('.slides > .package');
		if (!slide) return;

		// If slide contains an image, show it larger
		const img = slide.querySelector('img');
		if (img) {
			const big = document.createElement('img');
			big.src = img.currentSrc || img.src;
			big.alt = img.alt || 'Package image';
			big.className = 'modal-img';
			openModal(big);
			return;
		}

		// Otherwise, render the text package content similarly
		const clone = slide.cloneNode(true);
		// Remove layout-related classes/attributes that don't matter in modal
		clone.id = '';
		clone.className = 'package-text-modal';
		openModal(clone);
	});
})();

// Sign Up modal with embedded Google Form
(function initSignupModal() {
	const FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSc9Vmn0sMtgHmpjqMRKOXrbCo3p8jcpQ9QbiQ589zLhLuWyHg/viewform?embedded=true';

	const modal = document.getElementById('signup-modal');
	const iframe = document.getElementById('signup-form-frame');
	const closeBtn = modal ? modal.querySelector('.modal-close') : null;
	const backdrop = modal ? modal.querySelector('.modal-backdrop') : null;
	const signUpButtons = Array.from(document.querySelectorAll('.career-sign-up'));

	if (!modal || !iframe || signUpButtons.length === 0) return;

	function openModal() {
		if (FORM_URL && !iframe.src) {
			iframe.src = FORM_URL;
		}
		modal.classList.add('open');
		modal.setAttribute('aria-hidden', 'false');
		document.body.classList.add('modal-open');
		// Focus close button for accessibility
		if (closeBtn) closeBtn.focus();
	}

	function closeModal() {
		modal.classList.remove('open');
		modal.setAttribute('aria-hidden', 'true');
		document.body.classList.remove('modal-open');
		// Optional: clear src to stop background network/audio if desired
		// iframe.src = '';
	}

	signUpButtons.forEach(btn => btn.addEventListener('click', (e) => {
		e.preventDefault();
		openModal();
	}));

	if (closeBtn) closeBtn.addEventListener('click', closeModal);
	if (backdrop) backdrop.addEventListener('click', (e) => {
		// Only close if clicking on backdrop area
		if (e.target === backdrop || e.target.getAttribute('data-close') === 'true') {
			closeModal();
		}
	});

	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape' && modal.classList.contains('open')) {
			closeModal();
		}
	});
})();


// H1 ticker: type/delete effect cycling specific texts
(function initH1Ticker() {
	const el = document.getElementById('h1-ticker');
	if (!el) return;

	const config = {
		texts: [
			'Catch-On',
			'Get Hooked',
			'Anchor'
		],
		typeSpeed: 90,       // ms per character while typing
		deleteSpeed: 60,     // ms per character while deleting
		pauseAfterType: 1200, // pause when a word is fully typed
		pauseAfterDelete: 350 // pause after deletion before next word
	};

	let wordIndex = 0;
	let charIndex = 0;
	let isDeleting = false;

	function applyStyleForCurrentWord(fullWord) {
		// Toggle glowing gold only for "Catch-On"; others stay white (inherited)
		if (fullWord === 'Catch-On') {
			el.classList.add('glow-gold');
		} else {
			el.classList.remove('glow-gold');
		}
	}

	function tick() {
		const fullWord = config.texts[wordIndex % config.texts.length];
		applyStyleForCurrentWord(fullWord);

		if (isDeleting) {
			charIndex = Math.max(0, charIndex - 1);
		} else {
			charIndex = Math.min(fullWord.length, charIndex + 1);
		}

		el.textContent = fullWord.substring(0, charIndex);

		// Determine next delay
		let delay = isDeleting ? config.deleteSpeed : config.typeSpeed;

		// Word completed
		if (!isDeleting && charIndex === fullWord.length) {
			delay = config.pauseAfterType;
			isDeleting = true;
		}
		// Word fully deleted
		else if (isDeleting && charIndex === 0) {
			delay = config.pauseAfterDelete;
			isDeleting = false;
			wordIndex = (wordIndex + 1) % config.texts.length;
		}

		setTimeout(tick, delay);
	}

	// Start after DOM is ready to avoid flashes
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', tick);
	} else {
		tick();
	}
})();

// Section Tabs Navigation with Swipe Support (for tech-services.html)
(function initSectionTabs() {
	const tabsNav = document.querySelector('.section-tabs');
	if (!tabsNav) return;

	// Map tab IDs to their corresponding section IDs
	const tabToSectionMap = {
		'services-tab': 'services',
		'inclusions-tab': 'inclusions',
		'process-tab': 'process',
		'ownership-tab': 'ownership',
		'pricing-tab': 'pricing'
	};

	const tabs = Array.from(tabsNav.querySelectorAll('.tab-link'));
	const sections = Object.values(tabToSectionMap)
		.map(id => document.getElementById(id))
		.filter(Boolean);

	if (tabs.length === 0 || sections.length === 0) return;

	let currentIndex = 0;

	// Find initial active tab or default to first
	const initialActiveTab = tabs.findIndex(tab => tab.classList.contains('active'));
	if (initialActiveTab !== -1) {
		currentIndex = initialActiveTab;
	}

	function showSection(index) {
		// Clamp index
		index = Math.max(0, Math.min(sections.length - 1, index));
		currentIndex = index;

		// Update tab states
		tabs.forEach((tab, i) => {
			if (i === index) {
				tab.classList.add('active');
				tab.setAttribute('aria-selected', 'true');
			} else {
				tab.classList.remove('active');
				tab.setAttribute('aria-selected', 'false');
			}
		});

		// Show/hide sections with smooth transition
		sections.forEach((section, i) => {
			if (i === index) {
				section.style.display = 'block';
				section.setAttribute('aria-hidden', 'false');
				// Smooth scroll to section
				section.scrollIntoView({ behavior: 'smooth', block: 'start' });
			} else {
				section.style.display = 'none';
				section.setAttribute('aria-hidden', 'true');
			}
		});
	}

	// Tab click handlers
	tabs.forEach((tab, index) => {
		tab.style.cursor = 'pointer';
		tab.addEventListener('click', (e) => {
			e.preventDefault();
			showSection(index);
		});
	});

	// Keyboard navigation
	tabsNav.addEventListener('keydown', (e) => {
		if (e.key === 'ArrowLeft') {
			e.preventDefault();
			showSection(currentIndex - 1);
		}
		if (e.key === 'ArrowRight') {
			e.preventDefault();
			showSection(currentIndex + 1);
		}
	});

	// Touch/swipe support
	let touchStartX = 0;
	let touchEndX = 0;

	sections.forEach(section => {
		section.addEventListener('touchstart', (e) => {
			touchStartX = e.changedTouches[0].screenX;
		}, { passive: true });

		section.addEventListener('touchend', (e) => {
			touchEndX = e.changedTouches[0].screenX;
			handleSwipe();
		}, { passive: true });
	});

	function handleSwipe() {
		const swipeThreshold = 50; // minimum distance for swipe
		const diff = touchStartX - touchEndX;

		if (Math.abs(diff) > swipeThreshold) {
			if (diff > 0) {
				// Swiped left - go to next section
				showSection(currentIndex + 1);
			} else {
				// Swiped right - go to previous section
				showSection(currentIndex - 1);
			}
		}
	}

	// Initialize: show only the current section
	showSection(currentIndex);
})();

// Submenu toggle functionality for Services dropdown
(function initSubmenuToggle() {
	const submenuToggle = document.querySelector('.submenu-toggle');
	const hasSubmenuParent = document.querySelector('.has-submenu');
	
	if (!submenuToggle || !hasSubmenuParent) return;
	
	submenuToggle.addEventListener('click', (e) => {
		e.preventDefault();
		const isExpanded = submenuToggle.getAttribute('aria-expanded') === 'true';
		
		if (isExpanded) {
			submenuToggle.setAttribute('aria-expanded', 'false');
			hasSubmenuParent.classList.remove('open');
		} else {
			submenuToggle.setAttribute('aria-expanded', 'true');
			hasSubmenuParent.classList.add('open');
		}
	});
	
	// Close submenu when clicking outside
	document.addEventListener('click', (e) => {
		if (!e.target.closest('.has-submenu')) {
			submenuToggle.setAttribute('aria-expanded', 'false');
			hasSubmenuParent.classList.remove('open');
		}
	});
})();


