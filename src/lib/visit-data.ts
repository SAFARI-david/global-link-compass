export interface VisitDestination {
  id: string;
  title: string;
  country: string;
  city: string;
  visaType: "Tourist" | "Family Visit" | "Business" | "Medical" | "Transit";
  purpose: string;
  duration: string;
  processingTime: string;
  validity: string;
  multipleEntry: boolean;
  language: string;
  description: string;
  requirements: string[];
  highlights: string[];
}

export const VISIT_COUNTRIES = ["Canada", "United Kingdom", "Australia", "Germany", "United States", "France", "United Arab Emirates", "Schengen Area"];
export const VISIT_TYPES = ["Tourist", "Family Visit", "Business", "Medical", "Transit"] as const;
export const VISIT_PURPOSES = ["Tourism", "Family Visit", "Business Meeting", "Medical Treatment", "Conference / Event", "Short Course"];

export const visitDestinations: VisitDestination[] = [
  {
    id: "canada-tourist",
    title: "Canada Visitor Visa (TRV)",
    country: "Canada",
    city: "Multiple Entry Points",
    visaType: "Tourist",
    purpose: "Tourism",
    duration: "Up to 6 months per visit",
    processingTime: "4–8 weeks",
    validity: "Up to 10 years",
    multipleEntry: true,
    language: "English / French",
    description: "A Temporary Resident Visa (TRV) for tourism, family visits, or short business trips to Canada. Multiple-entry visas are standard and can be valid up to 10 years or until passport expiry.",
    requirements: ["Valid passport (6+ months)", "Proof of financial support", "Travel itinerary", "Ties to home country", "Letter of invitation (if visiting family)"],
    highlights: ["Multiple-entry up to 10 years", "Stay up to 6 months per visit", "Family-friendly process", "eTA available for visa-exempt nationals"],
  },
  {
    id: "uk-standard-visitor",
    title: "UK Standard Visitor Visa",
    country: "United Kingdom",
    city: "London & nationwide",
    visaType: "Tourist",
    purpose: "Tourism",
    duration: "Up to 6 months",
    processingTime: "3 weeks",
    validity: "6 months / 2, 5, 10 years",
    multipleEntry: true,
    language: "English",
    description: "A flexible visitor visa allowing tourism, visiting friends and family, business activities, or short courses up to 6 months. Long-term options available for frequent travellers.",
    requirements: ["Valid passport", "Proof of funds", "Accommodation details", "Return ticket", "Reason for visit documentation"],
    highlights: ["Flexible 6-month stay", "Long-term visas available (2–10 years)", "Includes business & study activities", "Online application"],
  },
  {
    id: "schengen-tourist",
    title: "Schengen Tourist Visa",
    country: "Schengen Area",
    city: "26 European countries",
    visaType: "Tourist",
    purpose: "Tourism",
    duration: "Up to 90 days in 180",
    processingTime: "15 days",
    validity: "Single / Multiple entry",
    multipleEntry: true,
    language: "Multiple",
    description: "One visa, 26 countries. The Schengen visa allows travel across most of Europe for tourism, family visits, or short business stays for up to 90 days within any 180-day period.",
    requirements: ["Valid passport", "Travel insurance (€30,000+)", "Confirmed accommodation", "Flight reservation", "Bank statements (last 3 months)"],
    highlights: ["Access to 26 European countries", "Up to 90 days stay", "Multiple-entry options", "Apply via main destination embassy"],
  },
  {
    id: "us-b2-tourist",
    title: "US B1/B2 Visitor Visa",
    country: "United States",
    city: "All US ports of entry",
    visaType: "Tourist",
    purpose: "Tourism",
    duration: "Up to 6 months per visit",
    processingTime: "Varies by embassy",
    validity: "Up to 10 years",
    multipleEntry: true,
    language: "English",
    description: "A combined business (B1) and tourism (B2) visa for short-term visits to the United States. Includes tourism, family visits, medical treatment, and business meetings.",
    requirements: ["DS-160 form", "Valid passport", "Embassy interview", "Proof of ties to home country", "Financial documentation"],
    highlights: ["Valid up to 10 years", "Multiple entries allowed", "Combined business & tourism", "Available worldwide"],
  },
  {
    id: "australia-visitor-600",
    title: "Australia Visitor Visa (Subclass 600)",
    country: "Australia",
    city: "Multiple entry points",
    visaType: "Tourist",
    purpose: "Tourism",
    duration: "3, 6 or 12 months",
    processingTime: "20–40 days",
    validity: "Up to 12 months",
    multipleEntry: true,
    language: "English",
    description: "The standard visitor visa for travel to Australia for tourism, visiting family, or short business activities. Multiple stay durations and entry options available.",
    requirements: ["Valid passport", "Health insurance (recommended)", "Proof of funds", "Genuine visitor declaration", "Character requirements"],
    highlights: ["Stay up to 12 months", "Online application", "Family stream available", "Business stream included"],
  },
  {
    id: "uae-tourist",
    title: "UAE Tourist Visa",
    country: "United Arab Emirates",
    city: "Dubai, Abu Dhabi & more",
    visaType: "Tourist",
    purpose: "Tourism",
    duration: "30 / 60 / 90 days",
    processingTime: "3–5 days",
    validity: "60 days from issue",
    multipleEntry: true,
    language: "Arabic / English",
    description: "Fast-processed tourist visa for visiting the United Arab Emirates. Multiple duration options and easy online application make this one of the most accessible visit visas.",
    requirements: ["Passport (6+ months valid)", "Recent photo", "Confirmed return ticket", "Hotel booking or host details"],
    highlights: ["Fast 3–5 day processing", "100% online application", "Multiple-entry available", "Visa-on-arrival for many nationalities"],
  },
  {
    id: "germany-family-visit",
    title: "Germany Family Visit Visa",
    country: "Germany",
    city: "Berlin, Munich, Frankfurt",
    visaType: "Family Visit",
    purpose: "Family Visit",
    duration: "Up to 90 days",
    processingTime: "10–15 days",
    validity: "Single / Multiple entry",
    multipleEntry: true,
    language: "German / English",
    description: "A Schengen-category visa specifically for visiting family or friends residing in Germany. Requires a formal invitation letter (Verpflichtungserklärung) from the host.",
    requirements: ["Formal invitation letter", "Host's residence proof", "Travel insurance", "Personal financial proof", "Proof of family relationship"],
    highlights: ["Includes Schengen area access", "Stay up to 90 days", "Host can sponsor financially", "Family-friendly documentation"],
  },
  {
    id: "france-business-visit",
    title: "France Business Visa (Schengen Type C)",
    country: "France",
    city: "Paris & nationwide",
    visaType: "Business",
    purpose: "Business Meeting",
    duration: "Up to 90 days",
    processingTime: "15 days",
    validity: "Up to 5 years",
    multipleEntry: true,
    language: "French / English",
    description: "A short-stay Schengen visa for business activities in France including meetings, conferences, contract negotiations, and trade fairs. Includes access to the entire Schengen area.",
    requirements: ["Letter from your employer", "Invitation from French company", "Business itinerary", "Travel insurance", "Hotel reservations"],
    highlights: ["Schengen-wide access", "Multiple-entry options", "Conference & trade fair friendly", "Long-term validity available"],
  },
];
