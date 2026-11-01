/* =========================================================
   ABDU'LLAH BOOK MARKETING - JAVASCRIPT
   Hybrid Routing: Continuous Hub + Separate Detail Pages
========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ================= LOADER ================= */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => { loader.classList.add('hidden'); }, 500);
  });
  setTimeout(() => {
    if(!loader.classList.contains('hidden')) loader.classList.add('hidden');
  }, 3000);


  /* ================= HYBRID ROUTING LOGIC ================= */
  const sections = document.querySelectorAll('.page-section');
  const navLinks = document.querySelectorAll('a[href^="#"]');
  const navMenu = document.getElementById('navMenu');
  const hamburger = document.getElementById('hamburger');

  // These are the sections that stack together to form the "Continuous Homepage"
  const hubSections = ['home', 'about', 'services', 'portfolio', 'genres', 'blog', 'faq', 'contact'];

  function navigateTo(hash) {
    if (!hash || hash === '#') hash = '#home';
    const targetId = hash.substring(1);
    const targetSection = document.getElementById(targetId);
    
    if (!targetSection) return;

    const isHubTarget = hubSections.includes(targetId);

    if (isHubTarget) {
      // 1. WE ARE ON THE MAIN HUB: Show all hub sections stacked together
      sections.forEach(sec => {
        if (hubSections.includes(sec.id)) {
          sec.style.display = 'block';
          setTimeout(() => sec.classList.add('active-section'), 50);
        } else {
          sec.style.display = 'none';
          sec.classList.remove('active-section');
        }
      });

      // Smoothly scroll down to the clicked section (accounting for the sticky navbar height)
      setTimeout(() => {
        const navHeight = document.getElementById('navbar').offsetHeight || 80;
        const elementPosition = targetSection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - navHeight;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }, 100);

    } else {
      // 2. WE CLICKED A SPECIFIC DETAIL PAGE (like #service-launch)
      // Hide the big scrolling homepage and show ONLY the selected detail page
      sections.forEach(sec => {
        if (sec.id === targetId) {
          sec.style.display = 'block';
          setTimeout(() => sec.classList.add('active-section'), 50);
        } else {
          sec.style.display = 'none';
          sec.classList.remove('active-section');
        }
      });
      
      // Scroll to the very top for a fresh new page feel
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Update active color on Navbar links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === hash) {
        link.classList.add('active');
      }
    });
  }

  // Listen for all clicks on links
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const hash = link.getAttribute('href');
      if (hash.startsWith('#')) {
        e.preventDefault();
        
        // Close mobile menu if it's open
        if (navMenu.classList.contains('active')) {
          navMenu.classList.remove('active');
        }

        history.pushState(null, '', hash);
        navigateTo(hash);
      }
    });
  });

  // Handle the browser's back/forward arrows
  window.addEventListener('popstate', () => {
    navigateTo(window.location.hash);
  });

  // Handle the first load
  navigateTo(window.location.hash || '#home');


  /* ================= ANNOUNCEMENT BAR ================= */
  const announce = document.getElementById('announce');
  const announceClose = document.getElementById('announceClose');
  if (localStorage.getItem('abdullah_announce_closed') === 'true') {
    announce.classList.add('hidden');
  }
  if(announceClose) {
    announceClose.addEventListener('click', () => {
      announce.classList.add('hidden');
      localStorage.setItem('abdullah_announce_closed', 'true');
    });
  }


  /* ================= NAVBAR SCROLL & MOBILE MENU ================= */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  });

  if(hamburger) {
    hamburger.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
  }

  const dropdownToggle = document.querySelector('.dropdown-toggle');
  const dropdownMenu = document.querySelector('.dropdown-menu');
  if(dropdownToggle && dropdownMenu) {
    dropdownToggle.addEventListener('click', (e) => {
      if (window.innerWidth <= 1024) {
        e.preventDefault();
        dropdownMenu.classList.toggle('show');
      }
    });
  }


  /* ================= TYPING EFFECT ================= */
  const typingText = document.getElementById('typingText');
  const phrases = ["Launch Bestsellers", "Grow Readership", "Build Author Brands", "Dominate Rankings"];
  let phraseIndex = 0, letterIndex = 0, isDeleting = false;

  function type() {
    if(!typingText) return;
    const currentPhrase = phrases[phraseIndex];
    if (isDeleting) {
      typingText.textContent = currentPhrase.substring(0, letterIndex - 1);
      letterIndex--;
    } else {
      typingText.textContent = currentPhrase.substring(0, letterIndex + 1);
      letterIndex++;
    }
    let typeSpeed = isDeleting ? 50 : 100;
    if (!isDeleting && letterIndex === currentPhrase.length) {
      typeSpeed = 2000; isDeleting = true;
    } else if (isDeleting && letterIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typeSpeed = 500;
    }
    setTimeout(type, typeSpeed);
  }
  if(typingText) setTimeout(type, 1000);


  /* ================= STATS COUNTER ANIMATION ================= */
  const counters = document.querySelectorAll('.counter');
  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = +counter.getAttribute('data-target');
        const increment = target / (2000 / 16); 
        let current = 0;
        const updateCounter = () => {
          current += increment;
          if (current < target) {
            counter.innerText = Math.ceil(current);
            requestAnimationFrame(updateCounter);
          } else {
            counter.innerText = target;
          }
        };
        updateCounter();
        observer.unobserve(counter);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(counter => counterObserver.observe(counter));


  /* ================= FAQ ACCORDION ================= */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          otherItem.querySelector('.faq-answer').style.maxHeight = null;
        }
      });
      item.classList.toggle('active');
      const answer = item.querySelector('.faq-answer');
      if (item.classList.contains('active')) {
        answer.style.maxHeight = answer.scrollHeight + "px";
      } else {
        answer.style.maxHeight = null;
      }
    });
  });


  /* ================= PARALLAX MOUSE EFFECT ================= */
  document.addEventListener('mousemove', (e) => {
    const shapes = document.querySelectorAll('.shape');
    shapes.forEach((shape, index) => {
      const speed = (index + 1) * 20;
      const xOffset = (window.innerWidth / 2 - e.pageX) / speed;
      const yOffset = (window.innerHeight / 2 - e.pageY) / speed;
      shape.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
    });
  });


  /* ================= BACK TO TOP BUTTON ================= */
  const backTop = document.getElementById('backTop');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) backTop.classList.add('visible');
    else backTop.classList.remove('visible');
  });
  if(backTop) {
    backTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

});