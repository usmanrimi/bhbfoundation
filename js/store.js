/**
 * BHB FAMILY SUPPORT AND DEVELOPMENT FOUNDATION
 * CENTRAL DATA STORE & LOCALSTORAGE PERSISTENCE ENGINE
 */

const BHB_STORAGE_KEY = 'BHB_FOUNDATION_STORE_V3';

const DEFAULT_STORE_DATA = {
  settings: {
    foundationName: "BHB Family Support and Development Foundation",
    shortName: "BHB Foundation",
    cacNumber: "9670692",
    establishedYear: "2026",
    officeAddress: "66/77 Sulaiman Crescent, Nasarawa, Kano State, Nigeria",
    phone: "+234 201 454 5878",
    email: "info@bhbfoundation.com",
    contactEmail: "contact@bhborganization.org",
    tagline: "Empowering Families. Strengthening Communities. Creating Sustainable Futures.",
    primaryCurrency: "NGN",
    usdRate: 1550,
    zenithBank: {
      bankName: "Zenith Bank Plc",
      accountName: "BHB Family Support & Dev Foundation",
      accountNumber: "1224906781",
      sortCode: "057150013"
    }
  },

  heroSlides: [
    {
      id: "slide-1",
      label: "Non-Governmental Organization · Kano State",
      title: "Empowering Families. Building Resilient Communities.",
      lead: "We walk alongside individuals, families, and underserved communities to overcome barriers, restore dignity, and create sustainable futures across Northern Nigeria.",
      image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1600&q=80",
      primaryCtaText: "Explore Our Work →",
      primaryCtaLink: "work.html"
    },
    {
      id: "slide-2",
      label: "Inclusive Technology & Education",
      title: "Turning Vulnerability into Lasting Opportunity.",
      lead: "Equipping adolescent girls with disabilities with foundational digital literacy, screen reader fluency, and technological self-reliance in partnership with The Ability First Tech Hub.",
      image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1600&q=80",
      primaryCtaText: "View Flagship Project →",
      primaryCtaLink: "projects.html"
    },
    {
      id: "slide-3",
      label: "Community Healthcare Outreach",
      title: "Safe Healthcare & Maternal Care Within Reach.",
      lead: "Deploying mobile diagnostic clinics and community healthcare mobilizers to deliver preventative prenatal checkups and nutritional support directly to rural settlements.",
      image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1600&q=80",
      primaryCtaText: "Our Health Initiatives →",
      primaryCtaLink: "work.html"
    },
    {
      id: "slide-4",
      label: "Sustainable Livelihoods",
      title: "Fostering Economic Independence for Women & Youth.",
      lead: "Providing seed grants, agricultural processing machinery, and financial literacy workshops that empower female-headed households with viable income streams.",
      image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1600&q=80",
      primaryCtaText: "Explore Livelihoods →",
      primaryCtaLink: "projects.html"
    }
  ],

  focusAreas: [
    {
      id: "focus-1",
      title: "Family Support & Welfare",
      summary: "Direct household interventions, emergency relief, and social protection safety nets for vulnerable and female-headed households.",
      image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80",
      details: "Strengthening household stability through emergency support packages, nutritional assistance, and direct links to municipal social protection schemes."
    },
    {
      id: "focus-2",
      title: "Youth Empowerment & Livelihoods",
      summary: "Market-aligned vocational apprenticeships, digital skills incubation, and mentorship programs for young people seeking self-reliance.",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
      details: "Providing structured pathways into formal and informal economic opportunities through technical coaching and mentorship."
    },
    {
      id: "focus-3",
      title: "Women & Vulnerable Groups",
      summary: "Micro-enterprise seed grants, financial literacy, and protective safe spaces for widows, young mothers, and caregivers.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
      details: "Equipping women with business management tools, cooperative savings literacy, and capital linkages."
    },
    {
      id: "focus-4",
      title: "Digital Skills & Inclusive Education",
      summary: "Foundational digital literacy, assistive tools, and inclusive learning environments for girls and persons with disabilities.",
      image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80",
      details: "Breaking technological exclusion by delivering adapted computer training and screen reader literacy."
    },
    {
      id: "focus-5",
      title: "Community Health & Well-being",
      summary: "Mobile prenatal diagnostics, primary healthcare awareness, and hygiene education in underserved settlements.",
      image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80",
      details: "Deploying medical teams directly into remote settlements to provide preventive screenings and maternal support."
    },
    {
      id: "focus-6",
      title: "Community Resilience & Sustainability",
      summary: "Grassroots leadership committees, water and sanitation maintenance, and climate-resilient agricultural methods.",
      image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80",
      details: "Building local committee ownership to maintain community infrastructure and manage crisis recovery."
    }
  ],

  projects: [
    {
      id: "proj-1",
      title: "Holiday Digital Skills Boot Camp for Girls with Disabilities",
      category: "Digital Skills & Education",
      status: "Active",
      location: "Kano Metropolitan",
      goal: 12500000,
      raised: 9800000,
      beneficiaries: "10 Girls",
      featured: true,
      image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80",
      description: "Directly funded by BHB Foundation in collaboration with The Ability First Tech Hub. An intensive digital literacy and assistive technology program empowering adolescent girls with visual, hearing, and physical disabilities with foundational computing, screen-reader fluency, and web design skills.",
      milestones: [
        "10 young girls with disabilities fully trained and certified in foundational computing.",
        "Assistive technology packages distributed including screen reading toolkits.",
        "Mentorship sessions conducted with regional female tech leaders."
      ]
    },
    {
      id: "proj-2",
      title: "Mobile Primary & Maternal Care Access Initiative",
      category: "Community Health",
      status: "Active",
      location: "Nasarawa & Dala LGAs",
      goal: 24000000,
      raised: 18500000,
      beneficiaries: "1,450 Mothers & Children",
      featured: false,
      image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80",
      description: "Providing rural and underserved settlements across Kano with routine mobile health clinics, basic prenatal screenings, nutritional packages, and maternal health literacy sessions.",
      milestones: [
        "Connected over 1,200 expectant mothers to accredited primary healthcare centers.",
        "Trained 45 community healthcare mobilizers in preventative maternal education.",
        "Delivered free diagnostic checkups across 8 rural settlements."
      ]
    },
    {
      id: "proj-3",
      title: "Widows & Vulnerable Women Agro-Business Seed Fund",
      category: "Livelihoods",
      status: "Completed",
      location: "Fagge & Gwale LGAs",
      goal: 15000000,
      raised: 15000000,
      beneficiaries: "320 Women",
      featured: false,
      image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80",
      description: "Seed grants, agricultural processing machinery, and financial literacy workshops empowering female-headed households with sustainable income streams and business self-reliance.",
      milestones: [
        "Distributed seed capital and grain processing kits to 320 widowed mothers.",
        "Formed 12 cooperative savings circles with ongoing bookkeeping mentorship.",
        "100% of beneficiary enterprises operating profitably at 6-month evaluation."
      ]
    },
    {
      id: "proj-4",
      title: "Kano Youth Technical & Apprenticeship Hub",
      category: "Youth Empowerment",
      status: "Active",
      location: "Kano Municipal",
      goal: 30000000,
      raised: 16400000,
      beneficiaries: "480 Youth",
      featured: false,
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
      description: "6-month practical vocational and IT hardware repair apprenticeship connecting underprivileged youth to market opportunities and local business placements.",
      milestones: [
        "240 youth graduated from initial technical cohorts.",
        "Partnered with local artisan associations for direct trade placements.",
        "85% employment or freelance transition rate."
      ]
    }
  ],

  team: [
    {
      id: "team-1",
      name: "Dr. Bashir H. Bello",
      position: "Founder & Chairman, Board of Trustees",
      department: "Board of Trustees",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
      bio: "Dr. Bashir H. Bello established BHB Family Support and Development Foundation to advance human dignity, social resilience, and structured opportunity across Northern Nigeria. He brings extensive leadership experience in community governance and sustainable development."
    },
    {
      id: "team-2",
      name: "Hajiya Fatima A. Yusuf",
      position: "Executive Director",
      department: "Executive Leadership",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
      bio: "Fatima leads the foundation's strategic direction, partner alignment, and program execution. She has directed multi-stakeholder community initiatives with non-governmental organizations across West Africa."
    },
    {
      id: "team-3",
      name: "Malam Ibrahim Al-Hassan",
      position: "Director of Programs & Inclusive Tech",
      department: "Executive Leadership",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
      bio: "Ibrahim oversees BHB's digital inclusion and educational programs, including our disability tech boot camps. He specializes in curriculum accessibility and assistive learning technology."
    },
    {
      id: "team-4",
      name: "Dr. Aisha Kwaku",
      position: "Lead Strategic Health Advisor",
      department: "Advisory Board",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80",
      bio: "Dr. Aisha is the principal partner at Aisha Kwaku & Associates. She guides BHB's maternal health outreach strategy and primary care partnerships across Kano State."
    },
    {
      id: "team-5",
      name: "Engr. Usman Farouk",
      position: "Head of Field Operations",
      department: "Field Operations",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80",
      bio: "Usman coordinates ground logistics, community liaison town halls, and resource delivery across all participating local government areas."
    },
    {
      id: "team-6",
      name: "Zainab S. Umar",
      position: "Head of Youth & Gender Initiatives",
      department: "Field Operations",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
      bio: "Zainab oversees women's enterprise incubation, girl-child mentorship networks, and safeguarding protocols across all foundation community hubs."
    }
  ],

  gallery: [
    {
      id: "gal-1",
      title: "Digital Boot Camp for Girls with Disabilities",
      category: "Inclusive Tech",
      location: "Kano Metropolitan Hub",
      image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=900&q=80",
      caption: "Young students mastering assistive computing and screen readers in our flagship boot camp."
    },
    {
      id: "gal-2",
      title: "Mobile Primary Healthcare Outreach",
      category: "Health Outreach",
      location: "Nasarawa LGA",
      image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=900&q=80",
      caption: "Community health workers conducting prenatal checkups and diagnostic consultations."
    },
    {
      id: "gal-3",
      title: "Women Agro-Enterprise Seed Distribution",
      category: "Livelihoods",
      location: "Fagge Community Center",
      image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=900&q=80",
      caption: "Widowed mothers and female entrepreneurs receiving equipment and business starter kits."
    },
    {
      id: "gal-4",
      title: "Youth Technical & Mentorship Workshop",
      category: "Youth Empowerment",
      location: "Kano Municipal Center",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80",
      caption: "Practical vocational training session in IT repair and digital freelancing."
    },
    {
      id: "gal-5",
      title: "Community Stakeholder Town Hall",
      category: "Resilience",
      location: "Dala Outreach Post",
      image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=900&q=80",
      caption: "Elders, youth, and local women leaders planning community-led water system management."
    },
    {
      id: "gal-6",
      title: "Inclusive Classroom Learning Drive",
      category: "Education",
      location: "Tarauni LGA School",
      image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=900&q=80",
      caption: "Distribution of adapted learning materials and Braille educational resources."
    }
  ],

  stories: [
    {
      id: "story-1",
      title: "Amina’s Story: Safe Care Within Reach",
      category: "Maternal Health",
      image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80",
      summary: "Expecting her third child, Amina delayed critical health checks because the nearest hospital was too far. When BHB’s mobile health team visited her community, she received vital prenatal care and delivered a healthy baby boy.",
      content: `Expecting her third child, Amina delayed critical health checks because the nearest hospital was too far and expensive to reach. When BHB’s mobile health team visited her community in Nasarawa LGA, she received vital prenatal care, free nutritional supplements, and was connected to a local health clinic. She delivered a healthy baby boy and now encourages other expectant mothers in her neighborhood to seek early care.`
    },
    {
      id: "story-2",
      title: "Ibrahim’s Story: From Searching to Leading",
      category: "Youth Empowerment",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
      summary: "After two years of job hunting, Ibrahim felt discouraged. Joining BHB’s Youth Skills Development program gave him practical digital training, confidence, and career guidance. Today, he works as an IT assistant and mentors younger boys.",
      content: `After two years of job hunting without clear direction, Ibrahim joined BHB’s Youth Skills Development & Mentorship program. Over six months, he gained practical computing literacy, web fundamentals, and professional communication skills. Today, he works as an IT assistant in Kano and volunteers weekly to mentor young boys in his neighborhood.`
    },
    {
      id: "story-3",
      title: "Fatima’s Story: A Sustainable Business",
      category: "Women's Livelihoods",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
      summary: "Fatima, a widowed mother of four, struggled to cover basic expenses through informal tailoring. Through BHB’s training and seed grant, she expanded her shop, purchased a second sewing machine, and now comfortably pays her children’s school fees.",
      content: `Fatima, a widowed mother of four living in Fagge LGA, struggled to cover basic household expenses through informal tailoring. Through BHB’s entrepreneurship and financial literacy training, she learned bookkeeping and received a small seed grant. She expanded her workshop, bought a second sewing machine, and now comfortably pays her children’s school fees.`
    },
    {
      id: "story-4",
      title: "The Neighborhood Water Committee: Community-Led Action",
      category: "Community Resilience",
      image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80",
      summary: "When a critical borehole pump broke down, BHB brought together elders, youth, and tradespeople to form a Water Management Committee that raised maintenance funds and now manages the system independently.",
      content: `When a critical borehole pump broke down in a local settlement, residents faced severe clean water shortages. Rather than providing a temporary external fix, BHB facilitated a community meeting bringing together elders, youth, and tradespeople. Together, they established a Water Management Committee, raised local maintenance funds, repaired the borehole, and continue to manage it independently.`
    },
    {
      id: "story-5",
      title: "The Usman Family: Restoring Hope and Education",
      category: "Family Welfare",
      image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80",
      summary: "When flooding destroyed their farm yield, the Usman family faced severe hardship. BHB stepped in with short-term support and resilient farming methods, enabling 14-year-old Zainab to return to school.",
      content: `When seasonal flooding wiped out their annual farm yield, the Usman family faced acute hardship, forcing 14-year-old Zainab to withdraw from secondary school. BHB provided targeted social support, connected her father to resilient agricultural techniques, and re-enrolled Zainab in school. Today, the family's livelihood is restored and Zainab is back in the classroom.`
    }
  ],

  posts: [
    {
      id: "post-1",
      title: "Breaking Barriers: How 10 Young Girls with Disabilities Mastered Coding in Kano",
      category: "Program Highlights",
      author: "Malam Ibrahim Al-Hassan",
      date: "August 18, 2026",
      readTime: "4 min read",
      image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80",
      excerpt: "Inside the landmark Holiday Digital Skills Boot Camp funded directly by BHB in collaboration with The Ability First Tech Hub.",
      content: `In a world increasingly driven by digital literacy, people living with disabilities in developing regions face disproportionate barriers. BHB Foundation partnered with The Ability First Tech Hub to deliver an intensive, hands-on boot camp for 10 adolescent girls in Kano Metropolitan.\n\nFrom learning accessible screen-reader navigation to writing computational logic and designing web interfaces, these young students demonstrated remarkable talent and commitment.\n\n"Before this camp, I believed computers were not accessible to someone with visual impairment like me," shares 15-year-old Halima. "Today, I built my own digital portfolio page."\n\nBHB is currently preparing the next cohort expansion to reach 50 additional girls across neighboring LGAs.`,
      status: "published"
    },
    {
      id: "post-2",
      title: "Closing the Maternal Health Gap: Expanding Mobile Outreach in Nasarawa",
      category: "Community Updates",
      author: "Dr. Aisha Kwaku",
      date: "August 12, 2026",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80",
      excerpt: "How mobile healthcare vehicles and community midwives are preventing complications in hard-to-reach settlements.",
      content: `Distance and transport costs frequently turn manageable pregnancy complications into critical emergencies. BHB's Mobile Health Intervention brings certified midwives, portable ultrasound diagnostics, and prenatal nutritional supplements directly into village squares.\n\nOver the past three months, our medical team has completed over 1,450 free consultations, ensuring safe outcomes for mothers and infants.`
    },
    {
      id: "post-3",
      title: "BHB Foundation Receives Official CAC Accreditation (Reg. No. 9670692)",
      category: "News",
      author: "BHB Communications",
      date: "July 24, 2026",
      readTime: "3 min read",
      image: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80",
      excerpt: "Official registration with the Corporate Affairs Commission cements BHB's institutional foundation and governance standards.",
      content: `The Trustees of BHB Family Support and Development Foundation are pleased to announce the successful incorporation and issuance of official CAC Registration No. 9670692 under the Companies and Allied Matters Act.\n\nThis legal milestone reinforces our dedication to international non-profit transparency, rigorous fiscal accountability, and institutional governance.`
    }
  ],

  partners: [
    {
      id: "part-1",
      name: "The Ability First Tech Hub",
      tier: "Programme Partner",
      category: "Tech & Inclusion",
      website: "https://abilityfirst.org"
    },
    {
      id: "part-2",
      name: "Aisha Kwaku and Associates",
      tier: "Strategic Advisory",
      category: "Health Consulting",
      website: "https://aishakwaku.com"
    },
    {
      id: "part-3",
      name: "Kano State Ministry of Women Affairs",
      tier: "Institutional Partner",
      category: "Government Policy",
      website: "https://kanostate.gov.ng"
    },
    {
      id: "part-4",
      name: "Sahel Health Initiative",
      tier: "Delivery Partner",
      category: "Community Health",
      website: "https://sahelhealth.org"
    }
  ],

  donations: [
    {
      id: "tx-1001",
      donorName: "Alhaji Garba Danladi",
      email: "g.danladi@kanoagric.ng",
      amount: 500000,
      currency: "NGN",
      method: "Bank Transfer",
      project: "Holiday Digital Skills Boot Camp for Girls with Disabilities",
      date: "2026-08-20 11:30",
      status: "Completed"
    },
    {
      id: "tx-1002",
      donorName: "Sarah Jenkins",
      email: "s.jenkins@philanthropy.org",
      amount: 500,
      currency: "USD",
      method: "Stripe",
      project: "Mobile Primary & Maternal Care Access Initiative",
      date: "2026-08-19 16:45",
      status: "Completed"
    }
  ],

  volunteers: [
    {
      id: "vol-1",
      name: "Amina Lawan",
      email: "amina.lawan@gmail.com",
      phone: "+234 803 219 0041",
      rolePreference: "Assistive Tech Trainer",
      lga: "Nasarawa LGA",
      status: "Approved",
      appliedDate: "2026-08-15"
    }
  ],

  inquiries: [
    {
      id: "inq-1",
      name: "Bello Tukur",
      email: "bello.tukur@statecsr.gov.ng",
      orgType: "Government institution",
      subject: "Partnership inquiry",
      message: "We would like to explore state-level collaboration for maternal clinic deployment across rural LGAs.",
      date: "2026-08-18 10:15",
      status: "Replied"
    }
  ]
};

class StoreEngine {
  constructor() {
    this.subscribers = [];
    this.data = this.load();
  }

  load() {
    try {
      const stored = localStorage.getItem(BHB_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn("Storage load fallback", e);
    }
    this.persist(DEFAULT_STORE_DATA);
    return JSON.parse(JSON.stringify(DEFAULT_STORE_DATA));
  }

  persist(dataToSave) {
    try {
      localStorage.setItem(BHB_STORAGE_KEY, JSON.stringify(dataToSave || this.data));
    } catch (e) {
      console.error("Storage persist error", e);
    }
  }

  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  notify() {
    this.persist();
    this.subscribers.forEach(cb => {
      try { cb(this.data); } catch(err) { console.error(err); }
    });
  }

  // Getters
  getData() { return this.data; }
  getSettings() { return this.data.settings; }
  getHeroSlides() { return this.data.heroSlides || DEFAULT_STORE_DATA.heroSlides; }
  getFocusAreas() { return this.data.focusAreas; }
  getProjects() { return this.data.projects; }
  getTeam() { return this.data.team; }
  getGallery() { return this.data.gallery; }
  getStories() { return this.data.stories; }
  getPosts() { return this.data.posts; }
  getPartners() { return this.data.partners; }
  getDonations() { return this.data.donations; }
  getVolunteers() { return this.data.volunteers; }
  getInquiries() { return this.data.inquiries; }

  // Hero Slides CRUD
  saveHeroSlide(slide) {
    if (!this.data.heroSlides) this.data.heroSlides = [...DEFAULT_STORE_DATA.heroSlides];
    if (!slide.id) {
      slide.id = 'slide-' + Date.now();
      this.data.heroSlides.push(slide);
    } else {
      const idx = this.data.heroSlides.findIndex(s => s.id === slide.id);
      if (idx >= 0) this.data.heroSlides[idx] = slide;
      else this.data.heroSlides.push(slide);
    }
    this.notify();
    return slide;
  }

  deleteHeroSlide(id) {
    if (!this.data.heroSlides) this.data.heroSlides = [...DEFAULT_STORE_DATA.heroSlides];
    this.data.heroSlides = this.data.heroSlides.filter(s => s.id !== id);
    this.notify();
  }

  // Focus Areas CRUD
  saveFocusArea(area) {
    if (!area.id) {
      area.id = 'focus-' + Date.now();
      this.data.focusAreas.push(area);
    } else {
      const idx = this.data.focusAreas.findIndex(a => a.id === area.id);
      if (idx >= 0) this.data.focusAreas[idx] = area;
      else this.data.focusAreas.push(area);
    }
    this.notify();
    return area;
  }

  deleteFocusArea(id) {
    this.data.focusAreas = this.data.focusAreas.filter(a => a.id !== id);
    this.notify();
  }

  // Projects CRUD
  saveProject(project) {
    if (!project.id) {
      project.id = 'proj-' + Date.now();
      this.data.projects.unshift(project);
    } else {
      const idx = this.data.projects.findIndex(p => p.id === project.id);
      if (idx >= 0) this.data.projects[idx] = project;
      else this.data.projects.unshift(project);
    }
    this.notify();
    return project;
  }

  deleteProject(id) {
    this.data.projects = this.data.projects.filter(p => p.id !== id);
    this.notify();
  }

  // Team CRUD
  saveTeamMember(member) {
    if (!member.id) {
      member.id = 'team-' + Date.now();
      this.data.team.push(member);
    } else {
      const idx = this.data.team.findIndex(t => t.id === member.id);
      if (idx >= 0) this.data.team[idx] = member;
      else this.data.team.push(member);
    }
    this.notify();
    return member;
  }

  deleteTeamMember(id) {
    this.data.team = this.data.team.filter(t => t.id !== id);
    this.notify();
  }

  // Gallery CRUD
  saveGalleryItem(item) {
    if (!item.id) {
      item.id = 'gal-' + Date.now();
      this.data.gallery.unshift(item);
    } else {
      const idx = this.data.gallery.findIndex(g => g.id === item.id);
      if (idx >= 0) this.data.gallery[idx] = item;
      else this.data.gallery.unshift(item);
    }
    this.notify();
    return item;
  }

  deleteGalleryItem(id) {
    this.data.gallery = this.data.gallery.filter(g => g.id !== id);
    this.notify();
  }

  // Posts CRUD
  savePost(post) {
    if (!post.id) {
      post.id = 'post-' + Date.now();
      post.date = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      this.data.posts.unshift(post);
    } else {
      const idx = this.data.posts.findIndex(p => p.id === post.id);
      if (idx >= 0) this.data.posts[idx] = post;
      else this.data.posts.unshift(post);
    }
    this.notify();
    return post;
  }

  deletePost(id) {
    this.data.posts = this.data.posts.filter(p => p.id !== id);
    this.notify();
  }

  // Partners CRUD
  savePartner(partner) {
    if (!partner.id) {
      partner.id = 'part-' + Date.now();
      this.data.partners.push(partner);
    } else {
      const idx = this.data.partners.findIndex(p => p.id === partner.id);
      if (idx >= 0) this.data.partners[idx] = partner;
      else this.data.partners.push(partner);
    }
    this.notify();
    return partner;
  }

  deletePartner(id) {
    this.data.partners = this.data.partners.filter(p => p.id !== id);
    this.notify();
  }

  // Donations
  addDonation(donation) {
    donation.id = 'tx-' + Math.floor(1000 + Math.random() * 9000);
    donation.date = new Date().toISOString().replace('T', ' ').substring(0, 16);
    this.data.donations.unshift(donation);
    this.notify();
    return donation;
  }

  // Volunteers
  addVolunteer(volunteer) {
    volunteer.id = 'vol-' + Date.now();
    volunteer.appliedDate = new Date().toISOString().substring(0, 10);
    volunteer.status = 'Pending';
    this.data.volunteers.unshift(volunteer);
    this.notify();
    return volunteer;
  }

  updateVolunteerStatus(id, status) {
    const vol = this.data.volunteers.find(v => v.id === id);
    if (vol) {
      vol.status = status;
      this.notify();
    }
  }

  // Inquiries
  addInquiry(inquiry) {
    inquiry.id = 'inq-' + Date.now();
    inquiry.date = new Date().toISOString().replace('T', ' ').substring(0, 16);
    inquiry.status = 'Unread';
    this.data.inquiries.unshift(inquiry);
    this.notify();
    return inquiry;
  }

  updateInquiryStatus(id, status) {
    const inq = this.data.inquiries.find(i => i.id === id);
    if (inq) {
      inq.status = status;
      this.notify();
    }
  }

  // Settings
  saveSettings(settings) {
    this.data.settings = { ...this.data.settings, ...settings };
    this.notify();
  }

  exportJSON() {
    return JSON.stringify(this.data, null, 2);
  }

  importJSON(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && parsed.settings && parsed.projects) {
        this.data = parsed;
        this.notify();
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  }

  resetToDefault() {
    this.data = JSON.parse(JSON.stringify(DEFAULT_STORE_DATA));
    this.notify();
  }
}

window.BHBStore = new StoreEngine();
