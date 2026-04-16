import { Link } from "@tanstack/react-router";
import { Globe, Mail, Phone, MapPin } from "lucide-react";

const footerLinks = {
  Services: [
    { label: "Work Visas", to: "/work-visas" },
    { label: "Study Visas", to: "/study-visas" },
    { label: "Visit Visas", to: "/visit-visas" },
    { label: "Jobs", to: "/jobs" },
    { label: "Study Opportunities", to: "/study" },
  ],
  Company: [
    { label: "About Us", to: "/about" },
    { label: "For Agents", to: "/agents" },
    { label: "Testimonials", to: "/testimonials" },
    { label: "FAQ", to: "/faq" },
    { label: "Contact", to: "/contact" },
  ],
  Legal: [
    { label: "Privacy Policy", to: "/privacy" },
    { label: "Terms and Conditions", to: "/terms" },
    { label: "Refund Policy", to: "/refund-policy" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-navy-gradient text-primary-foreground">
      <div className="container-narrow section-padding">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold">
                <Globe className="h-5 w-5 text-gold-foreground" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-sm font-bold">Global Link</span>
                <span className="text-[10px] font-medium tracking-widest uppercase opacity-70">Migration Services</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed opacity-70">
              Professional visa application support and international opportunity management services.
            </p>
            <div className="flex flex-col gap-2.5 text-sm opacity-70">
              <a href="mailto:info@globallinkms.com" className="flex items-center gap-2 hover:opacity-100 transition-opacity">
                <Mail className="h-4 w-4" />
                <span>info@globallinkms.com</span>
              </a>
              <a href="tel:+1234567890" className="flex items-center gap-2 hover:opacity-100 transition-opacity">
                <Phone className="h-4 w-4" /><span>+1 (234) 567-890</span>
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider opacity-90">{title}</h4>
              <ul className="flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="text-sm opacity-60 transition-opacity hover:opacity-100">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="mt-12 border-t border-primary-foreground/10 pt-8">
          <p className="text-xs leading-relaxed opacity-50">
            We provide professional visa application support and application management services. Final decisions are made by embassies, consulates, institutions, employers, and immigration authorities. We do not guarantee visa approval or job placement outcomes.
          </p>
          <p className="mt-4 text-xs opacity-40">
            © 2026 Global Link Migration Services. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
