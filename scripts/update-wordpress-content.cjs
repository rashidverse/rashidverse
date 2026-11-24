const fs = require('node:fs');
const file = 'data/content.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
const scoped = (type, values) => {
  const id = `wordpress-security-${type}`;
  const base = data[type].find(item => item.id === id) || data[type][0] || {};
  const record = { ...base, ...values, id, sectors: ['wordpress'] };
  data[type] = [...data[type].filter(item => item.id !== id), record];
};
const profile = data.sectorprofiles.find(item => item.id === 'wordpress');
Object.assign(profile, {
  title: 'WordPress Security Specialist & Developer',
  description: 'Abdul Rashid is a WordPress Security Specialist, Designer, Developer, and Plugin Developer providing WordPress security, custom development, performance optimization, and technical solutions.',
  heroTitle: 'I Secure, Build & Extend WordPress.',
  heroDescription: 'WordPress Security Specialist, Designer, Developer & Plugin Developer helping businesses build safer, faster, and more reliable websites.',
  heroLabel: 'WORDPRESS SECURITY • DEVELOPMENT • PLUGINS',
  footerBio: 'WordPress Security Specialist, Designer, Developer & Plugin Developer focused on secure, reliable, and high-performing WordPress solutions.',
  hideFacts: true,
  hideVideo: true,
});
const services = [
  ['WordPress Security', 'Security audits, WordPress hardening, vulnerability reduction, malware cleanup, security headers, firewall configuration, and ongoing protection.', 'fa-shield-alt'],
  ['WordPress Development', 'Responsive and scalable WordPress websites developed for businesses, professionals, eCommerce stores, and service-based companies.', 'fa-code'],
  ['Plugin Development', 'Custom WordPress plugins, features, integrations, and functionality developed around specific website and business requirements.', 'fa-puzzle-piece'],
  ['Performance & Maintenance', 'Speed optimization, troubleshooting, updates, technical maintenance, backups, and ongoing WordPress support.', 'fa-cogs'],
];
delete profile.featuredExpertise;
profile.expertiseJourney = [
  { title: 'WordPress Security Specialist', category: 'Present Focus', description: 'Security, hardening and protection through vulnerability review, malware investigation, security headers, access protection, monitoring, and secure configuration.' },
  { title: 'WordPress Designer & Developer', category: 'Core Expertise', description: 'Building professional WordPress websites with Elementor, WooCommerce, custom development, responsive design, migration, and performance optimization.' },
  { title: 'WordPress Plugin Developer', category: 'Advanced Development', description: 'Developing custom functionality with PHP, WordPress hooks and filters, custom admin features, API integration, and existing plugin customization.' },
];
scoped('about', {
  eyebrow: 'About Me', sectionLabel: 'About Me',
  heading: 'Security-First WordPress\nSolutions That [highlight]Go Beyond Design[/highlight]',
  description: "I'm Abdul Rashid, a WordPress Security Specialist, Designer, Developer, and Plugin Developer focused on building websites that are visually professional, secure, fast, stable, and maintainable. My approach combines WordPress security, development, performance optimization, and custom functionality—helping businesses solve technical problems while reducing website risks.",
  buttonText: 'View My Work', buttonLink: '/wordpress/portfolio/',
  features: services.map(([title, description, icon]) => ({ title, description, icon, customIcon: '', iconifyIcon: '' })),
});
scoped('experiencesettings', {
  sectionLabel: 'My Journey', eyebrow: 'MY JOURNEY',
  heading: 'From WordPress Development\nto [highlight]Security-First Solutions[/highlight]',
  description: 'My WordPress journey started with website design and development. Over time, working with real-world websites exposed me to security vulnerabilities, configuration issues, performance problems, and complex technical challenges. Today, my work combines WordPress security, development, and custom plugin solutions to provide more complete and reliable website services.',
});
const steps = [
  ['Audit & Understand', 'Understand the website and its risks.', 'I begin by understanding the website, business requirements, current setup, security risks, and technical challenges.'],
  ['Secure & Develop', 'Build on a secure foundation.', 'I implement the required security improvements, development work, custom functionality, or performance optimization using a clean and structured approach.'],
  ['Test & Verify', 'Check the details before delivery.', 'The website is tested across security, functionality, responsiveness, compatibility, forms, performance, and critical user flows.'],
  ['Deliver & Support', 'Keep the website reliable over time.', 'After final verification, the website is delivered with recommendations for maintenance, updates, backups, and ongoing security.'],
];
scoped('process', {
  heading: 'My [highlight]Security-First[/highlight]\nWordPress Process',
  eyebrow: 'How I Work', sectionLabel: 'How I Work',
  description: 'A clear four-step process for safer, faster, and more reliable WordPress websites.',
  ctaText: 'Let’s discuss what your website needs.', ctaButtonText: 'Discuss Your Project', ctaButtonLink: 'https://wa.me/8801720498825',
  steps: steps.map(([title, subtitle, description], i) => ({ title, subtitle, description, icon: ['fa-search', 'fa-code', 'fa-check', 'fa-support'][i], morePoints: [], linkText: 'Discuss Your Project', link: 'https://wa.me/8801720498825', linkTarget: 'new' })),
});
scoped('skills', {
  heading: '[highlight]WordPress Expertise[/highlight]\nBuilt Around Security',
  description: 'Security, development, custom plugins, and technical support—the skills behind secure and reliable WordPress solutions.', subtitle: 'EXPERTISE',
});
const groups = [
  ['WordPress Security', 'Practical protection, secure configuration, and risk reduction.', 'WordPress Security Hardening|Malware Investigation & Cleanup|Vulnerability Assessment|Content Security Policy (CSP)|Security Headers|Wordfence Configuration|Login & Access Security|File & Database Security|Spam & Bot Protection|Backup & Recovery'],
  ['WordPress Development', 'Responsive websites built around real business requirements.', 'WordPress|Elementor / Elementor Pro|WooCommerce|PHP|HTML5|CSS3|JavaScript / jQuery|MySQL|Responsive Development|Website Migration'],
  ['Plugin Development', 'Purpose-built functionality and integrations for WordPress.', 'Custom Plugin Development|WordPress Hooks|Actions & Filters|Shortcodes|Custom Post Types|Custom Admin Features|REST API Integration|Third-Party API Integration|Plugin Customization'],
  ['Technical & Performance', 'Stable infrastructure, fast pages, and ongoing support.', 'Website Speed Optimization|Caching|Core Web Vitals|Troubleshooting|DNS / SSL|Hosting Configuration|Cloudflare|Backup & Migration|Technical Maintenance'],
];
data.skillgroups = data.skillgroups.filter(item => !String(item.id).startsWith('wordpress-security-group-'));
groups.forEach(([title, description, skills], i) => data.skillgroups.push({ id: `wordpress-security-group-${i}`, title, description, display: 'list', order: i, sectors: ['wordpress'], items: skills.split('|').map(name => ({ name })) }));
scoped('featured', {
  heading: 'Selected WordPress Projects',
  description: 'Explore my WordPress development work and custom solutions. Each project brings together practical functionality, responsive design, and dependable performance.',
  buttonText: 'View My Work', buttonLink: '/wordpress/portfolio/',
});
scoped('cta', {
  heading: 'Need Help With Your WordPress Website?',
  description: "Whether your WordPress website needs security improvements, development, custom functionality, performance optimization, or technical support, let's discuss the right solution.",
  buttonText: 'Discuss Your Project', buttonLink: 'https://wa.me/8801720498825', buttonTarget: 'new',
  secondaryButtonText: 'Request a Security Review', secondaryButtonLink: 'https://wa.me/8801720498825?text=I%20would%20like%20a%20WordPress%20security%20review.',
});
fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
