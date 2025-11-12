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

	let index = 0;

	function render() {
		const {quote, author} = items[index % items.length];
		const html = author
			? `“${quote}”<span class="quote-author">${author}</span>`
			: `“${quote}”`;
		tickerEl.innerHTML = html;
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
