import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  CheckCircle2,
  Menu,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';
import './styles.css';

const phoneLabel = '+91 99099 36896';
const phoneNumber = '+919909936896';
const whatsappUrl = 'https://wa.me/919909936896';
const instagramUrl = 'https://www.instagram.com/nuxo.india?igsh=MXBjM2FtbHNib2Y5ZQ%3D%3D&utm_source=qr';

const services = [
  {
    title: 'Daily Tasks',
    items: ['Grocery ordering', 'Medicine delivery', 'Food ordering', 'Milk, vegetables & essentials'],
  },
  {
    title: 'Travel & Transport',
    items: ['Cab booking', 'Train, bus & flight tickets', 'Hospital & clinic rides', 'Pick-up / drop coordination'],
  },
  {
    title: 'Errands & Help',
    items: ['Parcel sending & receiving', 'Doctor appointments', 'Bill payments & reminders', 'Paperwork assistance'],
  },
  {
    title: 'Custom Requests',
    items: ['Birthday gifts & flowers', 'Home repair coordination', 'Travel planning help', 'Anything else, just ask'],
  },
];

const trustPoints = [
  {
    icon: MessageCircle,
    title: 'Human, not a bot',
    text: 'A real person picks up. Patient, respectful, calm.',
  },
  {
    icon: Sparkles,
    title: 'Local & trained',
    text: 'City-wise assistants who understand shops, routes, routines, and follow-ups.',
  },
  {
    icon: ShieldCheck,
    title: 'Discreet & safe',
    text: 'We only ask for what is needed to complete the task, then confirm back clearly.',
  },
];

function App() {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="site-shell">
      <header className={`site-header ${scrolled ? 'site-header--solid' : ''}`}>
        <a href="#home" className="logo-link" aria-label="NUXO home" onClick={closeMenu}>
          <img src="/nuxo-logo.jpg" alt="NUXO" className="logo" />
        </a>

        <nav className="desktop-nav" aria-label="Primary navigation">
          <a href="#services">Services</a>
          <a href="#how">How it works</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>

        <a className="nav-cta" href={whatsappUrl} target="_blank" rel="noreferrer">
          <MessageCircle size={18} />
          WhatsApp Us
        </a>

        <button className="menu-button" type="button" onClick={() => setMenuOpen((value) => !value)} aria-label="Toggle menu">
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {menuOpen && (
        <div className="mobile-menu">
          <a href="#services" onClick={closeMenu}>Services</a>
          <a href="#how" onClick={closeMenu}>How it works</a>
          <a href="#about" onClick={closeMenu}>About</a>
          <a href="#contact" onClick={closeMenu}>Contact</a>
          <a href={whatsappUrl} target="_blank" rel="noreferrer" onClick={closeMenu}>WhatsApp Us</a>
        </div>
      )}

      <main id="home">
        <section className="hero section-pad">
          <div className="hero-copy reveal-up">
            <p className="eyebrow">Concierge for families</p>
            <h1>
              <span className="italic">Just call.</span>
              <span> We handle </span>
              <strong>the rest.</strong>
            </h1>
            <p className="hero-subtitle">No apps. No confusion. One call and everything gets done by a real person who cares.</p>
            <div className="hero-actions">
              <a className="button button-primary" href={whatsappUrl} target="_blank" rel="noreferrer">
                <MessageCircle size={19} />
                Call / WhatsApp Now
              </a>
              <a className="button button-outline" href={`tel:${phoneNumber}`}>
                <Phone size={18} />
                Call Now
              </a>
            </div>
            <p className="availability">Available every day &middot; 8 AM to 9 PM</p>
          </div>

          <div className="hero-card reveal-up reveal-delay-1">
            <div className="image-frame">
              <img
                src="https://images.unsplash.com/photo-1739932900241-4d3362b5ed8e?auto=format&fit=crop&w=1100&q=82"
                alt="A calm elderly couple enjoying a moment at home"
              />
              <div className="live-card">
                <span className="pulse-dot" />
                <div>
                  <p>Live now</p>
                  <strong>A real person is on the line.</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="problem band" aria-labelledby="problem-title">
          <div>
            <p className="eyebrow">The problem</p>
            <h2 id="problem-title">Apps were not built for your parents.</h2>
          </div>
          <div className="problem-copy">
            <p>Groceries, medicines, cabs, bills: every task is trapped inside a new app. Logins, OTPs, confusing screens. Children are busy. Parents feel stuck.</p>
            <ul className="line-list">
              <li>Too many apps, too many passwords</li>
              <li>Long waits on customer care</li>
              <li>Children cannot always pick up</li>
            </ul>
          </div>
        </section>

        <section className="nuxo-way section-pad narrow" aria-labelledby="way-title">
          <p className="eyebrow">The NUXO way</p>
          <h2 id="way-title">A trusted assistant, one call away.</h2>
          <p>NUXO is a human concierge for elderly parents. You call or WhatsApp us. We do it: groceries, medicine, cabs, bookings, errands. Quietly, reliably, daily.</p>
        </section>

        <section id="how" className="how section-dark" aria-labelledby="how-title">
          <p className="eyebrow eyebrow-gold">How it works</p>
          <h2 id="how-title">Three small steps. Everything handled.</h2>
          <div className="step-grid">
            <article>
              <span>01</span>
              <h3>Call or WhatsApp</h3>
              <p>Just one number. No app to install. No account to create.</p>
            </article>
            <article>
              <span>02</span>
              <h3>Tell us the need</h3>
              <p>In English, Hindi, or whatever feels easy. A short message is enough.</p>
            </article>
            <article>
              <span>03</span>
              <h3>We handle it</h3>
              <p>We order, book, follow up, and confirm back with you.</p>
            </article>
          </div>
        </section>

        <section id="services" className="services section-pad" aria-labelledby="services-title">
          <div className="section-heading">
            <p className="eyebrow">What we do</p>
            <h2 id="services-title">Everyday tasks, handled with care.</h2>
            <p>A short list of what we help with most. If it is not here, ask anyway. We most likely can.</p>
          </div>
          <div className="service-grid">
            {services.map((service, index) => (
              <article className="service-card" key={service.title}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h3>{service.title}</h3>
                <ul>
                  {service.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="trust section-pad" aria-labelledby="trust-title">
          <div className="trust-intro">
            <p className="eyebrow">Why families trust NUXO</p>
            <h2 id="trust-title">Like a family member. Only, always available.</h2>
          </div>
          <div className="trust-list">
            {trustPoints.map(({ icon: Icon, title, text }) => (
              <article className="trust-item" key={title}>
                <div className="trust-icon"><Icon size={22} /></div>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="about" className="about band" aria-labelledby="about-title">
          <div>
            <p className="eyebrow">About NUXO</p>
            <h2 id="about-title">Built for families. Run by people.</h2>
          </div>
          <div className="problem-copy">
            <p>We built NUXO to make life easier for parents and lighter for their children. One number, a real voice on the other end, and the quiet confidence that it will get done.</p>
            <div className="value-row">
              <CheckCircle2 size={20} />
              <span>One call. Nothing to learn.</span>
            </div>
            <div className="value-row">
              <CheckCircle2 size={20} />
              <span>We treat every home like our own.</span>
            </div>
          </div>
        </section>

        <section id="contact" className="final-cta" aria-labelledby="contact-title">
          <div className="dot-pattern" aria-hidden="true" />
          <div className="final-inner">
            <p className="eyebrow eyebrow-gold">Ready when you are</p>
            <h2 id="contact-title"><span>No apps.</span> No stress. <strong>Just call.</strong></h2>
            <p>Whether it is a grocery list or a cab to the hospital, start here.</p>
            <div className="hero-actions center-actions">
              <a className="button button-gold" href={whatsappUrl} target="_blank" rel="noreferrer">
                <MessageCircle size={19} />
                Message on WhatsApp
              </a>
              <a className="button button-light-outline" href={`tel:${phoneNumber}`}>
                <Phone size={18} />
                {phoneLabel}
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div>
          <img src="/nuxo-logo.jpg" alt="NUXO" className="footer-logo" />
          <p>Human concierge for families.</p>
        </div>
        <div className="footer-links">
          <a href="#services">Services</a>
          <a href={`tel:${phoneNumber}`}>{phoneLabel}</a>
          <a href={whatsappUrl} target="_blank" rel="noreferrer">WhatsApp</a>
          <a href={instagramUrl} target="_blank" rel="noreferrer" aria-label="Instagram"><span className="ig-mark">IG</span></a>
        </div>
        <p className="legal">&copy; {new Date().getFullYear()} NUXO. Made with care in India.</p>
      </footer>

      <a className="floating-whatsapp" href={whatsappUrl} target="_blank" rel="noreferrer" aria-label="Message NUXO on WhatsApp">
        <MessageCircle size={21} />
        <span>WhatsApp</span>
      </a>
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
