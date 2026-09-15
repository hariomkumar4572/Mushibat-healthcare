// app.js - Mushibat Healthcare Interactive JavaScript (Bihar / Mithila Region)

document.addEventListener('DOMContentLoaded', () => {
  // Re-initialize Lucide Icons helper
  const refreshIcons = () => {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  };

  // 1. Loading Screen Controller
  const loader = document.getElementById('loading-screen');
  if (loader) {
    setTimeout(() => {
      loader.style.opacity = '0';
      loader.style.visibility = 'hidden';
    }, 700);
  }

  // 2. Scroll-driven Reveals (Intersection Observer)
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // 3. Sticky Navigation & Back to Top Button Manager
  const navbar = document.getElementById('navbar');
  const backToTopBtn = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    // Navbar styling
    if (window.scrollY > 20) {
      navbar.classList.add('shadow-md');
      navbar.classList.remove('border-transparent');
    } else {
      navbar.classList.remove('shadow-md');
      navbar.classList.add('border-transparent');
    }

    // Back to top button visibility
    if (backToTopBtn) {
      if (window.scrollY > 300) {
        backToTopBtn.classList.remove('opacity-0', 'pointer-events-none');
        backToTopBtn.classList.add('opacity-100', 'pointer-events-auto');
      } else {
        backToTopBtn.classList.add('opacity-0', 'pointer-events-none');
        backToTopBtn.classList.remove('opacity-100', 'pointer-events-auto');
      }
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 4. Mobile Navigation Menu Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
      mobileMenu.classList.toggle('flex');
    });

    const mobileLinks = mobileMenu.querySelectorAll('a, button');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        mobileMenu.classList.remove('flex');
      });
    });
  }

  // 5. Dark / Light Mode Manager
  const darkToggleBtn = document.getElementById('dark-mode-toggle');
  const lightIcon = document.getElementById('light-icon');
  const darkIcon = document.getElementById('dark-icon');

  const isDarkMode = localStorage.getItem('theme') === 'dark' || 
    (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);

  if (isDarkMode) {
    document.documentElement.classList.add('dark');
    if (lightIcon) lightIcon.classList.remove('hidden');
    if (darkIcon) darkIcon.classList.add('hidden');
  } else {
    document.documentElement.classList.remove('dark');
    if (lightIcon) lightIcon.classList.add('hidden');
    if (darkIcon) darkIcon.classList.remove('hidden');
  }

  if (darkToggleBtn) {
    darkToggleBtn.addEventListener('click', () => {
      document.documentElement.classList.toggle('dark');
      const currentlyDark = document.documentElement.classList.contains('dark');
      localStorage.setItem('theme', currentlyDark ? 'dark' : 'light');
      
      if (currentlyDark) {
        if (lightIcon) lightIcon.classList.remove('hidden');
        if (darkIcon) darkIcon.classList.add('hidden');
        showToast('Dark Mode Enabled 🌙');
      } else {
        if (lightIcon) lightIcon.classList.add('hidden');
        if (darkIcon) darkIcon.classList.remove('hidden');
        showToast('Light Mode Enabled ☀️');
      }
    });
  }

  // 6. District Filter Tabs & Buttons Logic
  const hospTabs = document.querySelectorAll('.hosp-district-tab');
  const hospitalCards = document.querySelectorAll('.hospital-card');
  const doctorCards = document.querySelectorAll('.doctor-card');

  const filterByDistrict = (districtName) => {
    // Filter Hospitals
    hospitalCards.forEach(card => {
      const cardDist = card.getAttribute('data-district');
      if (districtName === 'All' || cardDist === districtName) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });

    // Filter Doctors
    doctorCards.forEach(card => {
      const cardDist = card.getAttribute('data-district');
      if (districtName === 'All' || cardDist === districtName) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });

    // Update active tab UI if present
    hospTabs.forEach(tab => {
      const target = tab.getAttribute('data-target');
      if (target === districtName) {
        tab.classList.add('bg-sky-600', 'text-white', 'active');
        tab.classList.remove('bg-white', 'dark:bg-slate-800', 'text-slate-700', 'dark:text-slate-300');
      } else {
        tab.classList.remove('bg-sky-600', 'text-white', 'active');
        tab.classList.add('bg-white', 'dark:bg-slate-800', 'text-slate-700', 'dark:text-slate-300');
      }
    });
  };

  hospTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-target');
      filterByDistrict(target);
      showToast(`Filtered hospitals for ${target} district 📍`);
    });
  });

  // District Cards Explore Button triggers
  const districtFilterBtns = document.querySelectorAll('.district-filter-btn');
  districtFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const district = btn.getAttribute('data-district');
      filterByDistrict(district);
      const searchSelect = document.getElementById('search-city');
      if (searchSelect) searchSelect.value = district;

      // Smooth scroll to popular hospitals
      const hospSection = document.getElementById('hospitals');
      if (hospSection) {
        hospSection.scrollIntoView({ behavior: 'smooth' });
      }
      showToast(`Showing verified healthcare options in ${district} 📍`);
    });
  });

  // 7. Search by Speciality Click Handler
  const specialtyCards = document.querySelectorAll('.specialty-card');
  specialtyCards.forEach(card => {
    card.addEventListener('click', () => {
      const spec = card.getAttribute('data-specialty');
      
      // Filter doctor cards by specialty
      doctorCards.forEach(dCard => {
        const dDept = dCard.getAttribute('data-department');
        if (!spec || dDept === spec || dDept.toLowerCase().includes(spec.toLowerCase())) {
          dCard.style.display = 'flex';
        } else {
          dCard.style.display = 'none';
        }
      });

      const doctorSection = document.getElementById('doctors');
      if (doctorSection) {
        doctorSection.scrollIntoView({ behavior: 'smooth' });
      }
      showToast(`Filtered doctors for ${spec} specialty 🩺`);
    });
  });

  // 8. Search Bar Form Submission
  const mainSearchForm = document.getElementById('main-search-form');
  if (mainSearchForm) {
    mainSearchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const city = document.getElementById('search-city').value;
      const hosp = document.getElementById('search-hospital').value.trim().toLowerCase();
      const doc = document.getElementById('search-doctor').value.trim().toLowerCase();

      filterByDistrict(city);

      // Further filter hospitals by search term
      if (hosp) {
        hospitalCards.forEach(card => {
          const cardText = card.textContent.toLowerCase();
          if (!cardText.includes(hosp)) {
            card.style.display = 'none';
          }
        });
      }

      // Further filter doctors by search term
      if (doc) {
        doctorCards.forEach(card => {
          const cardText = card.textContent.toLowerCase();
          if (!cardText.includes(doc)) {
            card.style.display = 'none';
          }
        });
      }

      showToast(`Searched healthcare in ${city === 'All' ? 'Bihar' : city} 🔍`);
      const hospSection = document.getElementById('hospitals');
      if (hospSection) hospSection.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // 9. Testimonials Slider Logic
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.slider-dot');
  const prevBtn = document.getElementById('prev-testimonial');
  const nextBtn = document.getElementById('next-testimonial');
  let currentSlide = 0;
  let testimonialInterval;

  const showSlide = (index) => {
    slides.forEach((slide, idx) => {
      if (idx === index) {
        slide.classList.remove('hidden');
        slide.classList.add('block');
      } else {
        slide.classList.remove('block');
        slide.classList.add('hidden');
      }
    });

    dots.forEach((dot, idx) => {
      if (idx === index) {
        dot.classList.add('active', 'bg-sky-600');
        dot.classList.remove('bg-slate-300', 'dark:bg-slate-700');
      } else {
        dot.classList.remove('active', 'bg-sky-600');
        dot.classList.add('bg-slate-300', 'dark:bg-slate-700');
      }
    });
    currentSlide = index;
  };

  const nextSlide = () => {
    let nextIdx = (currentSlide + 1) % slides.length;
    showSlide(nextIdx);
  };

  const prevSlide = () => {
    let prevIdx = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(prevIdx);
  };

  if (slides.length > 0) {
    showSlide(0);

    if (nextBtn) nextBtn.addEventListener('click', () => {
      nextSlide();
      resetAutoplay();
    });

    if (prevBtn) prevBtn.addEventListener('click', () => {
      prevSlide();
      resetAutoplay();
    });

    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        showSlide(idx);
        resetAutoplay();
      });
    });

    const startAutoplay = () => {
      testimonialInterval = setInterval(nextSlide, 5000);
    };

    const resetAutoplay = () => {
      clearInterval(testimonialInterval);
      startAutoplay();
    };

    startAutoplay();
  }

  // 10. FAQ Accordion Logic
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answerPanel = item.querySelector('.faq-answer');
    const toggleIcon = item.querySelector('.faq-icon');

    if (questionBtn && answerPanel) {
      questionBtn.addEventListener('click', () => {
        const isOpen = !answerPanel.classList.contains('hidden');
        
        faqItems.forEach(otherItem => {
          const otherAnswer = otherItem.querySelector('.faq-answer');
          const otherIcon = otherItem.querySelector('.faq-icon');
          if (otherAnswer) otherAnswer.classList.add('hidden');
          if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
        });

        if (!isOpen) {
          answerPanel.classList.remove('hidden');
          if (toggleIcon) toggleIcon.style.transform = 'rotate(180deg)';
        }
      });
    }
  });

  // 11. Live Chat Widget with Mithila Context
  const chatToggle = document.getElementById('chat-toggle');
  const chatWindow = document.getElementById('chat-window');
  const closeChat = document.getElementById('close-chat');
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const chatMessages = document.getElementById('chat-messages');

  if (chatToggle && chatWindow) {
    chatToggle.addEventListener('click', () => {
      chatWindow.classList.toggle('open');
    });

    if (closeChat) {
      closeChat.addEventListener('click', () => {
        chatWindow.classList.remove('open');
      });
    }

    if (chatForm && chatInput && chatMessages) {
      chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = chatInput.value.trim();
        if (text === '') return;

        // User Message
        const userMsg = document.createElement('div');
        userMsg.className = 'self-end bg-sky-600 text-white rounded-2xl p-3 max-w-[85%] text-left shadow-sm';
        userMsg.textContent = text;
        chatMessages.appendChild(userMsg);
        
        chatInput.value = '';
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Auto Bot Reply with regional context
        setTimeout(() => {
          let botResponse = "Thank you for reaching Mushibat Healthcare. We serve Darbhanga (DMCH & AIIMS), Samastipur, Madhubani & Sitamarhi. A medical executive will connect with you shorty!";
          
          const lower = text.toLowerCase();
          if (lower.includes('darbhanga') || lower.includes('dmch') || lower.includes('aiims')) {
            botResponse = "DMCH and AIIMS Darbhanga OPD bookings are open! You can select Darbhanga in our search bar or click 'Book Appointment'.";
          } else if (lower.includes('samastipur')) {
            botResponse = "We have top cardiologists and orthopedic doctors available in Samastipur (Mohanpur Road care center).";
          } else if (lower.includes('madhubani')) {
            botResponse = "In Madhubani, we offer OPD bookings at Madhubani Central Hospital along with door-step blood lab collection!";
          } else if (lower.includes('sitamarhi')) {
            botResponse = "Sitamarhi City Care Hospital & Eye/ENT specialists are live for online slot booking.";
          } else if (lower.includes('price') || lower.includes('fee')) {
            botResponse = "Doctor consultation fees range from ₹300 to ₹600 INR across Mithila region hospitals.";
          }

          const botMsg = document.createElement('div');
          botMsg.className = 'self-start bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-2xl p-3 max-w-[85%] text-left border border-slate-200 dark:border-slate-700';
          botMsg.textContent = botResponse;
          chatMessages.appendChild(botMsg);
          chatMessages.scrollTop = chatMessages.scrollHeight;
          showToast('New message from Mushibat Support 💬');
        }, 1200);
      });
    }
  }

  // 12. Floating WhatsApp Tooltip Handler
  const whatsappBtn = document.getElementById('whatsapp-btn');
  if (whatsappBtn) {
    whatsappBtn.addEventListener('click', () => {
      showToast('Opening WhatsApp Chat for Bihar care... 🟢');
      setTimeout(() => {
        window.open('https://wa.me/919876543210?text=Namaste!%20I%20want%20to%20book%20a%20doctor%20appointment%20in%20Bihar%20(Darbhanga/Samastipur/Madhubani/Sitamarhi).', '_blank');
      }, 500);
    });
  }

  // 13. Interactive Appointment Booking Multi-Step Modal
  const bookingModal = document.getElementById('booking-modal');
  const closeModalBtn = document.getElementById('close-modal');

  // Modal Panels
  const detailsPanel = document.getElementById('booking-details-panel');
  const paymentPanel = document.getElementById('booking-payment-panel');
  const loaderPanel = document.getElementById('booking-loader-panel');
  const confirmationPanel = document.getElementById('booking-confirmation-panel');

  // Action Buttons
  const btnContinue = document.getElementById('btn-continue-to-payment');
  const btnBack = document.getElementById('btn-back-to-details');
  const btnPayConfirm = document.getElementById('btn-pay-and-confirm');
  const btnDownloadPdf = document.getElementById('btn-download-pdf');
  const btnCloseSuccess = document.getElementById('btn-close-success');

  // District to Hospitals Mapping
  const districtHospitals = {
    Darbhanga: [
      "Jeevan Hospital (Benipur, Darbhanga)",
      "DMCH (Darbhanga Medical College & Hospital)",
      "Mithila Heritage Hospital",
      "Apex Heart & Diagnostic Clinic"
    ],
    Samastipur: [
      "Samastipur Heart & Critical Care Hospital",
      "Sadar Hospital Samastipur",
      "City Health Clinic"
    ],
    Madhubani: [
      "Madhubani Central Multispecialty Hospital",
      "Sadar Medical Center Madhubani",
      "Mithila Care Clinic"
    ],
    Sitamarhi: [
      "Sitamarhi City Care Hospital",
      "District Hospital Sitamarhi",
      "Sunrise Clinic"
    ]
  };

  // Update Hospital Selector based on District
  const updateHospitalList = (district) => {
    const hospSelect = document.getElementById('booking-hospital');
    if (!hospSelect) return;
    hospSelect.innerHTML = '';
    const hospitals = districtHospitals[district] || [];
    hospitals.forEach(h => {
      const opt = document.createElement('option');
      opt.value = h;
      opt.textContent = h;
      hospSelect.appendChild(opt);
    });
  };

  // Bind change listener on district dropdown
  const distSelect = document.getElementById('booking-district');
  if (distSelect) {
    distSelect.addEventListener('change', (e) => {
      updateHospitalList(e.target.value);
    });
  }

  // Reset Booking modal to Step 1
  const resetBookingModal = () => {
    const nameInput = document.getElementById('patient-fullname');
    const dobInput = document.getElementById('patient-dob');
    if (nameInput) nameInput.value = '';
    if (dobInput) dobInput.value = '';
    
    // Show step 1 details, hide others
    if (detailsPanel) detailsPanel.classList.remove('hidden');
    if (paymentPanel) paymentPanel.classList.add('hidden');
    if (loaderPanel) loaderPanel.classList.add('hidden');
    if (confirmationPanel) confirmationPanel.classList.add('hidden');
  };

  window.triggerBookingModal = (entityName) => {
    if (bookingModal) {
      resetBookingModal();
      
      const modalTitle = document.getElementById('modal-title');
      if (modalTitle) {
        modalTitle.textContent = `Book Appointment - ${entityName}`;
      }

      // Pre-fill hospital list
      const dSelect = document.getElementById('booking-district');
      if (dSelect) {
        updateHospitalList(dSelect.value);
      }

      bookingModal.classList.remove('hidden');
      bookingModal.classList.add('flex');
    }
  };

  if (closeModalBtn && bookingModal) {
    closeModalBtn.addEventListener('click', () => {
      bookingModal.classList.add('hidden');
      bookingModal.classList.remove('flex');
    });
  }

  // Continue to Payment Panel
  if (btnContinue) {
    btnContinue.addEventListener('click', () => {
      const nameInput = document.getElementById('patient-fullname');
      const dobInput = document.getElementById('patient-dob');
      const distInput = document.getElementById('booking-district');
      const hospInput = document.getElementById('booking-hospital');
      const typeInput = document.querySelector('input[name="appointment-type"]:checked');

      if (!nameInput || !dobInput || !distInput || !hospInput || !typeInput) return;

      const name = nameInput.value.trim();
      const dob = dobInput.value;
      const district = distInput.value;
      const hospital = hospInput.value;
      const type = typeInput.value;

      if (!name) {
        showToast('Please enter patient full name! ⚠️');
        return;
      }
      if (!dob) {
        showToast('Please select patient date of birth! ⚠️');
        return;
      }

      // Populate summary
      document.getElementById('summary-name').textContent = name;
      document.getElementById('summary-type').textContent = type;
      document.getElementById('summary-hospital').textContent = hospital;
      document.getElementById('summary-district').textContent = district;

      const price = type === 'Emergency' ? '₹1,500' : '₹500';
      document.getElementById('summary-price').textContent = price;

      // Transitions
      if (detailsPanel) detailsPanel.classList.add('hidden');
      if (paymentPanel) paymentPanel.classList.remove('hidden');
      showToast('Review summary and choose payment option 💳');
    });
  }

  // Back to step 1
  if (btnBack) {
    btnBack.addEventListener('click', () => {
      if (paymentPanel) paymentPanel.classList.add('hidden');
      if (detailsPanel) detailsPanel.classList.remove('hidden');
    });
  }

  // UPI Input Conditional Show/Hide
  const payMethodRadios = document.querySelectorAll('input[name="payment-method"]');
  const upiContainer = document.getElementById('upi-input-container');
  payMethodRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      if (upiContainer) {
        if (radio.value === 'UPI ID') {
          upiContainer.classList.remove('hidden');
        } else {
          upiContainer.classList.add('hidden');
        }
      }
    });
  });

  // Pay and Confirm Booking
  if (btnPayConfirm) {
    btnPayConfirm.addEventListener('click', () => {
      const selectedPay = document.querySelector('input[name="payment-method"]:checked');
      if (selectedPay && selectedPay.value === 'UPI ID') {
        const upiVal = document.getElementById('upi-id').value.trim();
        if (!upiVal || !upiVal.includes('@')) {
          showToast('Please enter a valid UPI ID! ⚠️');
          return;
        }
      }

      // Show loader
      if (paymentPanel) paymentPanel.classList.add('hidden');
      if (loaderPanel) loaderPanel.classList.remove('hidden');

      setTimeout(() => {
        // Generate mock booking details
        const randId = "MUSH-" + new Date().getFullYear() + "-" + Math.random().toString(36).substring(2, 6).toUpperCase();
        const name = document.getElementById('patient-fullname').value.trim();
        const dob = document.getElementById('patient-dob').value;
        const district = document.getElementById('booking-district').value;
        const hospital = document.getElementById('booking-hospital').value;
        const type = document.querySelector('input[name="appointment-type"]:checked').value;

        // Populate success summary
        document.getElementById('conf-id').textContent = randId;
        document.getElementById('conf-name').textContent = name;
        document.getElementById('conf-dob').textContent = dob;
        document.getElementById('conf-type').textContent = type;
        document.getElementById('conf-hospital').textContent = hospital;
        document.getElementById('conf-district').textContent = district;

        // Show confirmation panel
        if (loaderPanel) loaderPanel.classList.add('hidden');
        if (confirmationPanel) confirmationPanel.classList.remove('hidden');

        showToast('Appointment booked successfully! 🎉');
        refreshIcons();
      }, 1500);
    });
  }

  // Download PDF Receipt
  if (btnDownloadPdf) {
    btnDownloadPdf.addEventListener('click', () => {
      const { jsPDF } = window.jspdf;
      if (!jsPDF) {
        showToast('PDF generator library not loaded! ⚠️');
        return;
      }

      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      const bId = document.getElementById('conf-id').textContent;
      const name = document.getElementById('conf-name').textContent;
      const dob = document.getElementById('conf-dob').textContent;
      const type = document.getElementById('conf-type').textContent;
      const hospital = document.getElementById('conf-hospital').textContent;
      const district = document.getElementById('conf-district').textContent;
      const dateVal = new Date().toLocaleDateString('en-IN');
      const timeVal = new Date().toLocaleTimeString('en-IN');
      const payMethod = document.querySelector('input[name="payment-method"]:checked').value;
      const finalPrice = type === 'Emergency' ? '₹1,500' : '₹500';

      // Title & Header Banner
      doc.setFillColor(2, 132, 199);
      doc.rect(0, 0, 210, 38, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.setTextColor(255, 255, 255);
      doc.text("MUSHIBAT HEALTHCARE BIHAR", 15, 20);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text("Bihar's Premier Digital OPD Appointment Network", 15, 27);

      // Invoice labels
      doc.setFontSize(13);
      doc.setTextColor(51, 65, 85);
      doc.setFont("helvetica", "bold");
      doc.text("OFFICIAL APPOINTMENT BOOKING SLIP", 15, 52);

      // Slate divider line
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.5);
      doc.line(15, 56, 195, 56);

      // Patient details blocks
      doc.setFontSize(10);
      
      const drawRow = (label, value, y, isAccent = false) => {
        doc.setFont("helvetica", "bold");
        doc.text(label, 15, y);
        doc.setFont("helvetica", isAccent ? "bold" : "normal");
        if (isAccent) {
          if (value === 'Emergency') doc.setTextColor(220, 38, 38);
          else doc.setTextColor(5, 150, 105);
        } else {
          doc.setTextColor(71, 85, 105);
        }
        doc.text(value, 75, y);
        doc.setTextColor(51, 65, 85);
      };

      drawRow("Booking Reference ID:", bId, 68);
      drawRow("Patient Name:", name, 78);
      drawRow("Date of Birth:", dob, 88);
      drawRow("District Hub:", district, 98);
      drawRow("Hospital Assigned:", hospital, 108);
      drawRow("Appointment Type:", type, 118, true);
      drawRow("Payment Channel:", payMethod, 128);
      drawRow("Amount Paid:", finalPrice + " (Net Paid)", 138);
      drawRow("Date of Transaction:", dateVal + " " + timeVal, 148);

      // Separator
      doc.line(15, 156, 195, 156);

      // Guidelines Box
      doc.setFillColor(248, 250, 252);
      doc.rect(15, 166, 180, 28, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(2, 132, 199);
      doc.text("Advisory Instructions:", 20, 173);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(100, 116, 139);
      doc.text("1. Please present this electronic receipt at the assigned hospital registration desk.", 20, 180);
      doc.text("2. For emergency cases, report directly to the Trauma/Emergency Wing immediately.", 20, 187);

      // Stamp and Signature Mock
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text("Mushibat Healthcare Pvt Ltd, Tower Chowk, Darbhanga, Bihar. Helpline: 1800-MUSHIBAT", 15, 275);
      doc.text("This receipt is verified digitally and complies with standard medical portal guidelines.", 15, 281);

      doc.save(`mushibat_receipt_${bId}.pdf`);
      showToast('PDF Receipt downloaded successfully! 📄');
    });
  }

  // Done Success modal action
  if (btnCloseSuccess) {
    btnCloseSuccess.addEventListener('click', () => {
      if (bookingModal) {
        bookingModal.classList.add('hidden');
        bookingModal.classList.remove('flex');
      }
      resetBookingModal();
    });
  }

  // 14. Interactive Login Modal Controllers
  const loginModal = document.getElementById('login-modal');
  const closeLoginBtn = document.getElementById('close-login-modal');
  const loginBtns = document.querySelectorAll('.login-modal-btn');
  const registerBtns = document.querySelectorAll('.register-modal-btn');

  // Tabs
  const tabMobileBtn = document.getElementById('tab-mobile-btn');
  const tabEmailBtn = document.getElementById('tab-email-btn');
  const mobileForm = document.getElementById('mobile-login-form');
  const emailForm = document.getElementById('email-login-form');

  // Steps mobile
  const mobileInputStep = document.getElementById('mobile-input-step');
  const mobileOtpStep = document.getElementById('mobile-otp-step');
  const sendMobileOtpBtn = document.getElementById('send-mobile-otp');
  const resendMobileOtpBtn = document.getElementById('resend-mobile-otp');

  // Steps email
  const emailInputStep = document.getElementById('email-input-step');
  const emailOtpStep = document.getElementById('email-otp-step');
  const sendEmailOtpBtn = document.getElementById('send-email-otp');
  const resendEmailOtpBtn = document.getElementById('resend-email-otp');

  // Open modal
  const openLoginModal = () => {
    if (loginModal) {
      loginModal.classList.remove('hidden');
      loginModal.classList.add('flex');
      resetLoginModal();
    }
  };

  loginBtns.forEach(btn => btn.addEventListener('click', openLoginModal));
  registerBtns.forEach(btn => btn.addEventListener('click', () => {
    showToast('Open Patient Registration Form 📝');
    openLoginModal();
  }));

  // Close modal
  const closeLoginModal = () => {
    if (loginModal) {
      loginModal.classList.add('hidden');
      loginModal.classList.remove('flex');
    }
  };
  if (closeLoginBtn) closeLoginBtn.addEventListener('click', closeLoginModal);
  const resetLoginModal = () => {
    // Reset forms
    if (mobileForm) mobileForm.reset();
    if (emailForm) emailForm.reset();
    
    // Default Tab
    switchTab('mobile');

    // Default steps
    if (mobileInputStep) mobileInputStep.classList.remove('hidden');
    if (mobileOtpStep) mobileOtpStep.classList.add('hidden');
    if (emailInputStep) emailInputStep.classList.remove('hidden');
    if (emailOtpStep) emailOtpStep.classList.add('hidden');
  };

  const switchTab = (tab) => {
    if (tab === 'mobile') {
      if (tabMobileBtn) {
        tabMobileBtn.classList.add('border-sky-600', 'text-sky-600');
        tabMobileBtn.classList.remove('border-transparent', 'text-slate-400');
      }
      if (tabEmailBtn) {
        tabEmailBtn.classList.add('border-transparent', 'text-slate-400');
        tabEmailBtn.classList.remove('border-sky-600', 'text-sky-600');
      }
      if (mobileForm) mobileForm.classList.remove('hidden');
      if (emailForm) emailForm.classList.add('hidden');
    } else {
      if (tabEmailBtn) {
        tabEmailBtn.classList.add('border-sky-600', 'text-sky-600');
        tabEmailBtn.classList.remove('border-transparent', 'text-slate-400');
      }
      if (tabMobileBtn) {
        tabMobileBtn.classList.add('border-transparent', 'text-slate-400');
        tabMobileBtn.classList.remove('border-sky-600', 'text-sky-600');
      }
      if (emailForm) emailForm.classList.remove('hidden');
      if (mobileForm) mobileForm.classList.add('hidden');
    }
    refreshIcons();
  };

  if (tabMobileBtn) tabMobileBtn.addEventListener('click', () => switchTab('mobile'));
  if (tabEmailBtn) tabEmailBtn.addEventListener('click', () => switchTab('email'));

  // Mobile OTP Workflow
  if (sendMobileOtpBtn) {
    sendMobileOtpBtn.addEventListener('click', () => {
      const mobileVal = document.getElementById('login-mobile').value.trim();
      if (mobileVal.length !== 10 || isNaN(mobileVal)) {
        showToast('Please enter a valid 10-digit mobile number! ⚠️');
        return;
      }
      mobileInputStep.classList.add('hidden');
      mobileOtpStep.classList.remove('hidden');
      showToast('OTP code sent successfully to +91 ' + mobileVal + ' 💬');
    });
  }

  if (resendMobileOtpBtn) {
    resendMobileOtpBtn.addEventListener('click', () => {
      showToast('New OTP Code sent! 🔄');
    });
  }

  // Email OTP Workflow
  if (sendEmailOtpBtn) {
    sendEmailOtpBtn.addEventListener('click', () => {
      const emailVal = document.getElementById('login-email').value.trim();
      if (!emailVal.includes('@') || !emailVal.includes('.')) {
        showToast('Please enter a valid email address! ⚠️');
        return;
      }
      emailInputStep.classList.add('hidden');
      emailOtpStep.classList.remove('hidden');
      showToast('OTP code sent successfully to ' + emailVal + ' ✉️');
    });
  }

  if (resendEmailOtpBtn) {
    resendEmailOtpBtn.addEventListener('click', () => {
      showToast('New verification code sent to email! 🔄');
    });
  }

  // 15. Hero Search Form Handler
  const heroSearchForm = document.getElementById('appointment-search-form') || document.getElementById('main-search-form');
  if (heroSearchForm) {
    heroSearchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const cityVal = document.getElementById('search-city')?.value || 'All';
      const hospVal = document.getElementById('search-hospital')?.value.trim().toLowerCase() || '';
      const docVal = document.getElementById('search-doctor')?.value.trim().toLowerCase() || '';

      // Apply district filter
      filterByDistrict(cityVal);

      let hospMatchCount = 0;
      let docMatchCount = 0;

      // Further filter by text queries if provided
      hospitalCards.forEach(card => {
        const cardText = card.textContent.toLowerCase();
        const cardDist = card.getAttribute('data-district');
        const matchesDistrict = (cityVal === 'All' || cardDist === cityVal);
        const matchesQuery = (!hospVal || cardText.includes(hospVal));

        if (matchesDistrict && matchesQuery) {
          card.style.display = 'flex';
          hospMatchCount++;
        } else {
          card.style.display = 'none';
        }
      });

      doctorCards.forEach(card => {
        const cardText = card.textContent.toLowerCase();
        const cardDist = card.getAttribute('data-district');
        const matchesDistrict = (cityVal === 'All' || cardDist === cityVal);
        const matchesQuery = (!docVal || cardText.includes(docVal));

        if (matchesDistrict && matchesQuery) {
          card.style.display = 'flex';
          docMatchCount++;
        } else {
          card.style.display = 'none';
        }
      });

      // Smooth scroll to hospitals
      const targetSec = document.getElementById('hospitals');
      if (targetSec) {
        targetSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      showToast(`Found ${hospMatchCount} verified medical centers & ${docMatchCount} doctors in ${cityVal}! 🔍`);
    });
  }

  // 16. Footer Newsletter Form Handler
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = document.getElementById('newsletter-email');
      const submitBtn = document.getElementById('newsletter-submit-btn');
      if (!emailInput) return;

      const email = emailInput.value.trim();
      if (!email.includes('@') || !email.includes('.')) {
        showToast('Please enter a valid email address for health alerts! ⚠️');
        emailInput.focus();
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="animate-spin inline-block">↻</span> Joining...';
      }

      setTimeout(() => {
        // Save to localStorage
        try {
          const subscribers = JSON.parse(localStorage.getItem('mushibat_subscribers') || '[]');
          if (!subscribers.includes(email)) {
            subscribers.push(email);
            localStorage.setItem('mushibat_subscribers', JSON.stringify(subscribers));
          }
        } catch (err) {
          console.error('Local storage error', err);
        }

        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<span>Subscribed</span> <i data-lucide="check" class="w-3.5 h-3.5"></i>';
          refreshIcons();
        }

        emailInput.value = '';
        showToast('Subscribed! You will receive daily OPD schedule alerts 🔔');
      }, 700);
    });
  }

  // 17. App-Style Welcome & Login Gatekeeper Controller
  const appWelcomeScreen = document.getElementById('app-welcome-screen');
  const gateTabMobile = document.getElementById('gate-tab-mobile');
  const gateTabEmail = document.getElementById('gate-tab-email');
  const gateMobileWrapper = document.getElementById('gate-mobile-wrapper');
  const gateEmailWrapper = document.getElementById('gate-email-wrapper');
  const gateMobileInput = document.getElementById('gate-mobile-input');
  const gateEmailInput = document.getElementById('gate-email-input');
  const gateSendOtpBtn = document.getElementById('gate-send-otp-btn');

  const gateInputStep = document.getElementById('gate-input-step');
  const gateOtpStep = document.getElementById('gate-otp-step');
  const gateTargetDisplay = document.getElementById('gate-target-display');
  const gateChangeTargetBtn = document.getElementById('gate-change-target-btn');
  const gateDemoOtpCode = document.getElementById('gate-demo-otp-code');
  const gateAutofillOtpBtn = document.getElementById('gate-autofill-otp-btn');
  const gateDigitInputs = document.querySelectorAll('.otp-digit-input');
  const gateResendBtn = document.getElementById('gate-resend-btn');
  const gateTimerSec = document.getElementById('gate-timer-sec');
  const gateVerifyOtpBtn = document.getElementById('gate-verify-otp-btn');

  let currentGateTab = 'mobile';
  let generatedOtp = '1234';
  let countdownTimer = null;
  let currentIdentifier = '';

  const initAppGatekeeper = () => {
    const savedSession = localStorage.getItem('mushibat_user_session');
    if (savedSession) {
      try {
        const sessionData = JSON.parse(savedSession);
        if (sessionData && sessionData.name) {
          if (appWelcomeScreen) {
            appWelcomeScreen.classList.add('unlocked');
            appWelcomeScreen.classList.remove('flex');
            appWelcomeScreen.classList.add('hidden');
          }
          document.body.style.overflow = '';
          updateNavbarLoggedIn(sessionData.name);
          return;
        }
      } catch (e) {
        localStorage.removeItem('mushibat_user_session');
      }
    }

    // Show Gatekeeper screen
    if (appWelcomeScreen) {
      appWelcomeScreen.classList.remove('hidden');
      appWelcomeScreen.classList.remove('unlocked');
      appWelcomeScreen.classList.add('flex');
      document.body.style.overflow = 'hidden';
      resetGatekeeperState();
    }
  };

  const resetGatekeeperState = () => {
    currentGateTab = 'mobile';
    if (gateTabMobile && gateTabEmail) {
      gateTabMobile.classList.add('bg-white', 'dark:bg-slate-700', 'text-sky-600', 'dark:text-sky-400', 'shadow-sm');
      gateTabMobile.classList.remove('text-slate-500', 'dark:text-slate-400');
      gateTabEmail.classList.add('text-slate-500', 'dark:text-slate-400');
      gateTabEmail.classList.remove('bg-white', 'dark:bg-slate-700', 'text-sky-600', 'dark:text-sky-400', 'shadow-sm');
    }
    if (gateMobileWrapper) gateMobileWrapper.classList.remove('hidden');
    if (gateEmailWrapper) gateEmailWrapper.classList.add('hidden');
    if (gateInputStep) gateInputStep.classList.remove('hidden');
    if (gateOtpStep) gateOtpStep.classList.add('hidden');
    if (gateMobileInput) gateMobileInput.value = '';
    if (gateEmailInput) gateEmailInput.value = '';
    gateDigitInputs.forEach(i => i.value = '');
    if (countdownTimer) clearInterval(countdownTimer);
  };

  if (gateTabMobile) {
    gateTabMobile.addEventListener('click', () => {
      currentGateTab = 'mobile';
      gateTabMobile.classList.add('bg-white', 'dark:bg-slate-700', 'text-sky-600', 'dark:text-sky-400', 'shadow-sm');
      gateTabMobile.classList.remove('text-slate-500', 'dark:text-slate-400');
      gateTabEmail.classList.add('text-slate-500', 'dark:text-slate-400');
      gateTabEmail.classList.remove('bg-white', 'dark:bg-slate-700', 'text-sky-600', 'dark:text-sky-400', 'shadow-sm');
      if (gateMobileWrapper) gateMobileWrapper.classList.remove('hidden');
      if (gateEmailWrapper) gateEmailWrapper.classList.add('hidden');
    });
  }

  if (gateTabEmail) {
    gateTabEmail.addEventListener('click', () => {
      currentGateTab = 'email';
      gateTabEmail.classList.add('bg-white', 'dark:bg-slate-700', 'text-sky-600', 'dark:text-sky-400', 'shadow-sm');
      gateTabEmail.classList.remove('text-slate-500', 'dark:text-slate-400');
      gateTabMobile.classList.add('text-slate-500', 'dark:text-slate-400');
      gateTabMobile.classList.remove('bg-white', 'dark:bg-slate-700', 'text-sky-600', 'dark:text-sky-400', 'shadow-sm');
      if (gateEmailWrapper) gateEmailWrapper.classList.remove('hidden');
      if (gateMobileWrapper) gateMobileWrapper.classList.add('hidden');
    });
  }

  const startGateOtpTimer = () => {
    if (countdownTimer) clearInterval(countdownTimer);
    let timeLeft = 30;
    if (gateResendBtn) {
      gateResendBtn.disabled = true;
      gateResendBtn.textContent = `Resend (${timeLeft}s)`;
    }
    if (gateTimerSec) gateTimerSec.textContent = timeLeft;

    countdownTimer = setInterval(() => {
      timeLeft--;
      if (gateTimerSec) gateTimerSec.textContent = timeLeft;
      if (gateResendBtn && gateResendBtn.disabled) {
        gateResendBtn.textContent = `Resend (${timeLeft}s)`;
      }
      if (timeLeft <= 0) {
        clearInterval(countdownTimer);
        if (gateResendBtn) {
          gateResendBtn.disabled = false;
          gateResendBtn.innerHTML = 'Resend Code <i data-lucide="rotate-cw" class="w-3 h-3 inline"></i>';
          refreshIcons();
        }
      }
    }, 1000);
  };

  if (gateSendOtpBtn) {
    gateSendOtpBtn.addEventListener('click', () => {
      if (currentGateTab === 'mobile') {
        const phone = gateMobileInput?.value.trim() || '';
        if (phone.length !== 10 || isNaN(phone)) {
          showToast('Please enter a valid 10-digit mobile number! ⚠️');
          if (gateMobileInput) gateMobileInput.focus();
          return;
        }
        currentIdentifier = '+91 ' + phone;
      } else {
        const email = gateEmailInput?.value.trim() || '';
        if (!email.includes('@') || !email.includes('.')) {
          showToast('Please enter a valid email address! ⚠️');
          if (gateEmailInput) gateEmailInput.focus();
          return;
        }
        currentIdentifier = email;
      }

      // Generate demo OTP for development
      generatedOtp = '1234';
      if (gateDemoOtpCode) gateDemoOtpCode.textContent = generatedOtp;
      if (gateTargetDisplay) gateTargetDisplay.textContent = currentIdentifier;

      // Switch to Step 2
      if (gateInputStep) gateInputStep.classList.add('hidden');
      if (gateOtpStep) gateOtpStep.classList.remove('hidden');

      startGateOtpTimer();
      showToast(`OTP Code sent to ${currentIdentifier} (Demo OTP: ${generatedOtp}) 💬`);
      if (gateDigitInputs[0]) gateDigitInputs[0].focus();
      refreshIcons();
    });
  }

  if (gateChangeTargetBtn) {
    gateChangeTargetBtn.addEventListener('click', () => {
      if (gateOtpStep) gateOtpStep.classList.add('hidden');
      if (gateInputStep) gateInputStep.classList.remove('hidden');
      if (countdownTimer) clearInterval(countdownTimer);
    });
  }

  if (gateResendBtn) {
    gateResendBtn.addEventListener('click', () => {
      generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
      if (gateDemoOtpCode) gateDemoOtpCode.textContent = generatedOtp;
      startGateOtpTimer();
      showToast(`New OTP Code sent to ${currentIdentifier} (Code: ${generatedOtp}) 🔄`);
    });
  }

  // Handle digit box inputs
  gateDigitInputs.forEach((input, index) => {
    input.addEventListener('input', (e) => {
      const val = e.target.value.replace(/\D/g, '');
      e.target.value = val ? val[val.length - 1] : '';
      if (val && index < gateDigitInputs.length - 1) {
        gateDigitInputs[index + 1].focus();
      }
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !input.value && index > 0) {
        gateDigitInputs[index - 1].focus();
      }
    });

    input.addEventListener('paste', (e) => {
      e.preventDefault();
      const pasteData = (e.clipboardData || window.clipboardData).getData('text').trim().replace(/\D/g, '');
      if (pasteData) {
        for (let i = 0; i < Math.min(pasteData.length, gateDigitInputs.length); i++) {
          gateDigitInputs[i].value = pasteData[i];
        }
        if (pasteData.length >= gateDigitInputs.length) {
          gateDigitInputs[gateDigitInputs.length - 1].focus();
        }
      }
    });
  });

  if (gateAutofillOtpBtn) {
    gateAutofillOtpBtn.addEventListener('click', () => {
      for (let i = 0; i < generatedOtp.length; i++) {
        if (gateDigitInputs[i]) gateDigitInputs[i].value = generatedOtp[i];
      }
      showToast('Demo OTP auto-filled! Click Verify to enter 🚀');
    });
  }

  if (gateVerifyOtpBtn) {
    gateVerifyOtpBtn.addEventListener('click', () => {
      let enteredOtp = '';
      gateDigitInputs.forEach(i => enteredOtp += i.value.trim());

      if (enteredOtp.length !== 4) {
        showToast('Please enter all 4 digits of the OTP! ⚠️');
        return;
      }

      if (enteredOtp !== generatedOtp && enteredOtp !== '1234') {
        showToast('Invalid OTP! Please check and enter 1234 ⚠️');
        return;
      }

      // Success Login
      const displayName = currentIdentifier.includes('@') 
        ? currentIdentifier.split('@')[0] 
        : currentIdentifier;

      const sessionObj = {
        name: displayName,
        identifier: currentIdentifier,
        loggedInAt: new Date().toISOString()
      };

      localStorage.setItem('mushibat_user_session', JSON.stringify(sessionObj));

      // Unlock website
      if (appWelcomeScreen) {
        appWelcomeScreen.classList.add('unlocked');
        setTimeout(() => {
          appWelcomeScreen.classList.add('hidden');
          appWelcomeScreen.classList.remove('flex');
        }, 500);
      }

      document.body.style.overflow = '';
      updateNavbarLoggedIn(displayName);
      showToast(`Welcome to Mushibat Healthcare, ${displayName}! 🎉`);
    });
  }

  // Handle Logged In Navbar status
  const updateNavbarLoggedIn = (username) => {
    // Find nav containers
    const desktopActions = document.querySelector('.hidden.md\\:flex.items-center.gap-3');
    const mobileActions = document.querySelector('#mobile-menu .flex.items-center.gap-3');

    if (desktopActions) {
      if (!window.originalDesktopHtml) {
        window.originalDesktopHtml = desktopActions.innerHTML;
      }
      desktopActions.innerHTML = `
        <button id="dark-mode-toggle-active" class="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-sm cursor-pointer">
          <i data-lucide="sun" class="w-5 h-5 text-amber-500 hidden dark:block"></i>
          <i data-lucide="moon" class="w-5 h-5 text-sky-600 dark:hidden"></i>
        </button>
        <span class="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5"><i data-lucide="user" class="w-4 h-4 text-sky-600"></i> ${username}</span>
        <button id="logout-btn" class="bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer">Logout</button>
      `;
      // Reattach toggle listeners
      const dToggle = document.getElementById('dark-mode-toggle-active');
      if (dToggle) {
        dToggle.addEventListener('click', () => {
          document.documentElement.classList.toggle('dark');
          const currentlyDark = document.documentElement.classList.contains('dark');
          localStorage.setItem('theme', currentlyDark ? 'dark' : 'light');
          showToast(currentlyDark ? 'Dark Mode Enabled 🌙' : 'Light Mode Enabled ☀️');
        });
      }
      // Reattach logout listener
      const logoutBtn = document.getElementById('logout-btn');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
      }
    }

    if (mobileActions) {
      if (!window.originalMobileHtml) {
        window.originalMobileHtml = mobileActions.innerHTML;
      }
      mobileActions.innerHTML = `
        <span class="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 py-2"><i data-lucide="user" class="w-4 h-4 text-sky-600"></i> ${username}</span>
        <button id="logout-btn-mobile" class="w-full text-center text-sm font-semibold bg-red-500 text-white py-2.5 rounded-xl cursor-pointer">Logout</button>
      `;
      const logoutBtnMobile = document.getElementById('logout-btn-mobile');
      if (logoutBtnMobile) {
        logoutBtnMobile.addEventListener('click', handleLogout);
      }
    }
    refreshIcons();
  };

  const handleLogout = () => {
    localStorage.removeItem('mushibat_user_session');

    const desktopActions = document.querySelector('.hidden.md\\:flex.items-center.gap-3');
    const mobileActions = document.querySelector('#mobile-menu .flex.items-center.gap-3');

    if (desktopActions && window.originalDesktopHtml) {
      desktopActions.innerHTML = window.originalDesktopHtml;
      desktopActions.querySelectorAll('.login-modal-btn').forEach(btn => btn.addEventListener('click', openLoginModal));
      desktopActions.querySelectorAll('.register-modal-btn').forEach(btn => btn.addEventListener('click', openLoginModal));
      
      const dt = document.getElementById('dark-mode-toggle');
      if (dt) {
        dt.addEventListener('click', () => {
          document.documentElement.classList.toggle('dark');
          const currentlyDark = document.documentElement.classList.contains('dark');
          localStorage.setItem('theme', currentlyDark ? 'dark' : 'light');
          showToast(currentlyDark ? 'Dark Mode Enabled 🌙' : 'Light Mode Enabled ☀️');
        });
      }
    }

    if (mobileActions && window.originalMobileHtml) {
      mobileActions.innerHTML = window.originalMobileHtml;
      mobileActions.querySelectorAll('.login-modal-btn').forEach(btn => btn.addEventListener('click', openLoginModal));
      mobileActions.querySelectorAll('.register-modal-btn').forEach(btn => btn.addEventListener('click', openLoginModal));
    }

    // Display App Gatekeeper screen on logout
    if (appWelcomeScreen) {
      appWelcomeScreen.classList.remove('hidden');
      appWelcomeScreen.classList.remove('unlocked');
      appWelcomeScreen.classList.add('flex');
      document.body.style.overflow = 'hidden';
      resetGatekeeperState();
    }

    showToast('Logged out successfully! 👋');
    refreshIcons();
  };

  // Submit modal forms if triggered from inside
  if (mobileForm) {
    mobileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const otpInput = document.getElementById('login-mobile-otp');
      const mobileInput = document.getElementById('login-mobile');
      if (!otpInput || !mobileInput) return;

      const otpVal = otpInput.value.trim();
      const mobileVal = mobileInput.value.trim();

      if (otpVal.length !== 4 || isNaN(otpVal)) {
        showToast('Please enter a valid 4-digit OTP! ⚠️');
        return;
      }

      closeLoginModal();
      showToast('Logged in successfully! Welcome to Mushibat Healthcare 🎉');
      updateNavbarLoggedIn('+91 ' + mobileVal);
    });
  }

  if (emailForm) {
    emailForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const otpInput = document.getElementById('login-email-otp');
      const emailInput = document.getElementById('login-email');
      if (!otpInput || !emailInput) return;

      const otpVal = otpInput.value.trim();
      const emailVal = emailInput.value.trim();

      if (otpVal.length !== 4 || isNaN(otpVal)) {
        showToast('Please enter a valid 4-digit OTP! ⚠️');
        return;
      }

      closeLoginModal();
      showToast('Logged in successfully! Welcome to Mushibat Healthcare 🎉');
      updateNavbarLoggedIn(emailVal.split('@')[0]);
    });
  }

  // Initialize App Gatekeeper
  initAppGatekeeper();

  refreshIcons();
});

// Toast notification helper function
function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'glass-panel text-slate-900 dark:text-slate-100 px-5 py-3.5 rounded-2xl shadow-xl border border-white/40 dark:border-slate-800 flex items-center gap-3 transition-all duration-300 transform translate-y-10 opacity-0 text-xs sm:text-sm font-semibold';
  
  let emoji = '🔔';
  if (message.includes('Success') || message.includes('Enabled') || message.includes('confirmed')) emoji = '✅';
  else if (message.includes('📍') || message.includes('Filtered')) emoji = '📍';
  else if (message.includes('💬')) emoji = '💬';
  else if (message.includes('📅') || message.includes('Appointment')) emoji = '📅';
  else if (message.includes('WhatsApp')) emoji = '🟢';
  else if (message.includes('🔍')) emoji = '🔍';
  
  toast.innerHTML = `<span class="text-base">${emoji}</span><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.remove('translate-y-10', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');
  }, 10);

  setTimeout(() => {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('-translate-y-5', 'opacity-0');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3800);
}

window.showToast = showToast;
