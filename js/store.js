/**
 * BHB FAMILY SUPPORT AND DEVELOPMENT FOUNDATION
 * CENTRAL DATA STORE & LOCALSTORAGE PERSISTENCE ENGINE
 * (WITH BLOG CMS, LIKES, COMMENTS, ENGAGEMENT & ADMIN MODERATION)
 */

const BHB_STORAGE_KEY = 'BHB_FOUNDATION_STORE_V5';

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
      label: "",
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
      details: "Delivering preventative screening, maternal support kits, and hygiene education to rural settlements."
      summary: "Delivering mobile prenatal checkups, preventative health education, hygiene outreach, and routine medical referrals in rural settlements.",
      icon: "heart-pulse",
      image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "fa-4",
      title: "Youth Empowerment & Livelihoods",
      summary: "Hands-on vocational apprenticeships, financial literacy circles, and trade entrepreneurship grants for young adults across Kano.",
      icon: "award",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80"
    }
  ],

  projects: [
    {
      id: "proj-1",
      title: "Holiday Digital Skills Boot Camp for Girls with Disabilities",
      category: "Digital Inclusion",
      location: "Kano Metropolitan Hub",
      beneficiaries: "10 Girls (Adolescents with visual & physical disabilities)",
      timeline: "July 2026 – Present (Cohort 1 Graduated / Cohort 2 Active)",
      goal: 3500000,
      raised: 3500000,
      image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80",
      description: "Directly funded by BHB Foundation in collaboration with The Ability First Tech Hub. A flagship intensive holiday digital literacy boot camp equipping adolescent girls with disabilities with foundational computer operations, screen-reader fluency, accessible digital tools, and web design fundamentals.",
      milestones: [
        "Delivered 120 hours of specialized assistive tech coaching",
        "Provided custom screen-reader laptops to all 10 participants",
        "100% capstone project completion rate with web portfolio exhibitions"
      ],
      featured: true,
      status: "Ongoing"
    },
    {
      id: "proj-2",
      title: "Mobile Primary & Maternal Care Access Initiative",
      category: "Community Health",
      location: "Nasarawa & Dala LGAs, Kano",
      beneficiaries: "1,450+ Mothers & Infants",
      timeline: "May 2026 – Ongoing Field Rounds",
      goal: 6000000,
      raised: 4800000,
      image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80",
      description: "Equipping mobile medical vans with portable ultrasound and primary diagnostic kits to provide preventative prenatal checkups, immunization tracking, and maternal nutrition packs.",
      milestones: [
        "Conducted 24 mobile clinical visits in 6 hard-to-reach settlements",
        "Distributed 1,200 maternal delivery hygiene kits",
        "Trained 18 volunteer community healthcare mobilizers"
      ],
      featured: false,
      status: "Ongoing"
    },
    {
      id: "proj-3",
      title: "Widows & Vulnerable Women Agro-Business Seed Fund",
      category: "Women Livelihoods",
      location: "Fagge & Bichi LGAs, Kano",
      beneficiaries: "220 Female-Headed Households",
      timeline: "Jan 2026 – June 2026 (Completed)",
      goal: 5000000,
      raised: 5000000,
      image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80",
      description: "Empowering widowed mothers through micro-enterprise seed capital, grain processing machinery, cooperative savings training, and direct market access linkages.",
      milestones: [
        "Disbursed ₦5M in direct micro-grants across 220 female traders",
        "Organized 4 cooperative processing clusters",
        "Achieved 94% business sustainability rate after 6 months"
      ],
      featured: false,
      status: "Completed"
    },
    {
      id: "proj-4",
      title: "Kano Youth Technical & Apprenticeship Hub",
      category: "Youth Mentorship",
      location: "Kano Municipal Center",
      beneficiaries: "350 Young Persons",
      timeline: "February 2026 – July 2026 (Completed)",
      goal: 4500000,
      raised: 4500000,
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
      description: "Structured technical apprenticeships in solar installation, IT hardware diagnostics, tailoring, and electrical repairs paired with professional mentorship and soft skills.",
      milestones: [
        "Graduated cohort 1 with 120 certified vocational trainees",
        "78% direct employment and independent apprenticeship rate",
        "Equipped each graduate with a startup toolkit"
      ],
      featured: false,
      status: "Completed"
    },
    {
      id: "proj-5",
      title: "Solar-Powered Community Borehole & WASH Hygiene Post",
      category: "WASH & Hygiene",
      location: "Gwale & Kumbotso LGAs",
      beneficiaries: "2,500+ Community Residents",
      timeline: "Pipeline · Target Q4 2026",
      goal: 6000000,
      raised: 1800000,
      image: "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80",
      description: "Construction of deep solar-powered industrial boreholes, overhead storage reservoirs, and community sanitation filtration points providing potable water to underserved settlements.",
      milestones: [
        "Hydrogeological geophysical surveying completed",
        "Community Water Management Committee established",
        "Procurement underway for solar pumps and filtration arrays"
      ],
      featured: false,
      status: "Upcoming"
    },
    {
      id: "proj-6",
      title: "Inclusive Assistive Tech Center of Excellence",
      category: "Digital Inclusion",
      location: "Kano Central Innovation Campus",
      beneficiaries: "300+ Persons with Disabilities Annually",
      timeline: "Pipeline · Target 2027",
      goal: 15000000,
      raised: 4500000,
      image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80",
      description: "Establishing a permanent accessible computing and digital media academy equipped with braille display terminals, tactile graphics printers, and specialized software workstations.",
      milestones: [
        "Curriculum alignment with national assistive tech standards",
        "Facility partnership secured with metropolitan vocational board",
        "Initial hardware donation pledged by CSR partners"
      ],
      featured: false,
      status: "Upcoming"
    }
  ],

  posts: [
    {
      id: "post-1",
      title: "Breaking Barriers: How 10 Young Girls with Disabilities Mastered Coding in Kano",
      category: "Digital Inclusion",
      author: "Malam Ibrahim Al-Hassan",
      authorRole: "Director of Programs & Inclusive Tech",
      date: "August 18, 2026",
      readTime: "4 min read",
      tags: ["InclusiveTech", "DisabilityAdvocacy", "YouthEmpowerment", "Kano"],
      image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80",
      excerpt: "Inside the landmark Holiday Digital Skills Boot Camp funded directly by BHB in collaboration with The Ability First Tech Hub.",
      content: `In a world increasingly shaped by digital technology, persons with disabilities in Northern Nigeria face disproportionate barriers in education and economic participation.

To bridge this critical divide, BHB Family Support and Development Foundation partnered with The Ability First Tech Hub to deliver an intensive, high-impact Holiday Digital Skills Boot Camp for adolescent girls in Kano Metropolitan.

Over several weeks of intensive hands-on instruction, 10 young participants—living with visual impairments, hearing difficulties, and physical mobility challenges—mastered computer architecture fundamentals, accessible screen-reader navigation (NVDA and JAWS), HTML/CSS coding logic, and assistive tools.

"Before this boot camp, I believed computer coding was something closed off to someone who is blind," shared 15-year-old Halima, one of the cohort participants. "Today, I built my own digital profile and learned how software can be made accessible to everyone."

Every graduate received a specialized assistive laptop and ongoing mentorship from our technical team. BHB Foundation is currently finalizing plans to expand this program to 50 additional girls across neighboring Local Government Areas in early 2027.`,
      likes: 42,
      likedByUser: false,
      featured: true,
      status: "published"
    },
    {
      id: "post-2",
      title: "Closing the Maternal Health Gap: Expanding Mobile Primary Care in Nasarawa",
      category: "Health & Maternal Care",
      author: "Dr. Aisha Kwaku",
      authorRole: "Lead Strategic Health Advisor",
      date: "August 12, 2026",
      readTime: "5 min read",
      tags: ["MaternalHealth", "CommunityOutreach", "PreventativeCare"],
      image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80",
      excerpt: "How mobile healthcare vehicles and community midwives are preventing complications and delivering maternal care to hard-to-reach settlements.",
      content: `Geographic isolation and transport costs frequently turn manageable pregnancy complications into critical emergencies for families living in rural communities.

BHB Foundation's Mobile Primary & Maternal Health Intervention addresses this challenge directly by deploying certified midwives, mobile ultrasound diagnostics, and essential prenatal micronutrients straight into village squares.

Over the past three months, our medical teams have completed over 1,450 free clinical consultations across six rural settlements in Nasarawa LGA, identifying high-risk pregnancies early and coordinating safe clinic deliveries.

In addition to diagnostics, our teams conduct bi-weekly hygiene and nutrition workshops for young mothers and distribute delivery preparation kits containing sterile clinical essentials.`,
      likes: 28,
      likedByUser: false,
      featured: false,
      status: "published"
    },
    {
      id: "post-3",
      title: "Fatima’s Story: Turning a Small Seed Grant into a Sustainable Tailoring Enterprise",
      category: "Community Stories",
      author: "Zainab S. Umar",
      authorRole: "Head of Youth & Gender Initiatives",
      date: "August 05, 2026",
      readTime: "3 min read",
      tags: ["WomenEnterprise", "Livelihoods", "GrassrootsImpact"],
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80",
      excerpt: "Fatima, a widowed mother of four in Fagge LGA, transformed her family's future through business training and seed capital.",
      content: `When Fatima lost her husband four years ago, she faced the daunting challenge of providing for four young children with only informal tailoring work on a rented sewing machine.

Through BHB Foundation's Women & Vulnerable Groups Livelihoods program, Fatima completed a 6-week business management, cooperative savings, and financial bookkeeping course before receiving a direct seed grant.

With the capital, Fatima purchased a heavy-duty industrial sewing machine and bulk fabrics at wholesale prices. Within five months, her monthly revenue tripled, enabling her to comfortably pay school fees for all four children and take on two young neighborhood apprentices.

"Dignity is when you can feed your children and plan for tomorrow without depending on handouts," Fatima says with pride.`,
      likes: 35,
      likedByUser: false,
      featured: false,
      status: "published"
    },
    {
      id: "post-4",
      title: "Community-Led Infrastructure: How One Settlement Restored Its Clean Water Source",
      category: "Community Stories",
      author: "Engr. Usman Farouk",
      authorRole: "Head of Field Operations",
      date: "July 30, 2026",
      readTime: "4 min read",
      tags: ["Resilience", "CleanWater", "CommunityOwnership"],
      image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80",
      excerpt: "Rather than providing temporary external fixes, BHB helped establish a local Water Committee that manages borehole maintenance independently.",
      content: `When a primary borehole pump broke down in a suburban settlement outside Kano, over 800 households faced severe shortages, forcing women and children to walk miles for water.

Rejecting top-down charitable fixes that fail once funding ends, BHB Foundation facilitated an open town hall uniting neighborhood elders, youth leaders, and local mechanics.

Together, residents formed a 7-member Water Management Committee, established a community maintenance fund with modest monthly contributions, and repaired the solar-powered pump. Today, the borehole operates continuously, managed entirely by the neighborhood.`,
      likes: 19,
      likedByUser: false,
      featured: false,
      status: "published"
    },
    {
      id: "post-5",
      title: "BHB Foundation Receives Official CAC Incorporation (Reg. No. 9670692)",
      category: "Press Releases",
      author: "BHB Communications",
      authorRole: "Institutional Governance Office",
      date: "July 24, 2026",
      readTime: "2 min read",
      tags: ["CorporateGovernance", "CAC", "InstitutionalMilestone"],
      image: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80",
      excerpt: "Official registration with the Corporate Affairs Commission cements BHB's legal foundation and governance transparency.",
      content: `The Trustees of BHB Family Support and Development Foundation are pleased to announce the formal incorporation and issuance of CAC Registration No. 9670692 under the Companies and Allied Matters Act.

This milestone reinforces our dedication to transparent non-profit management, rigorous fiscal auditing, and alignment with Nigerian and international civil society development standards.

All institutional programs and financial disbursements remain open to annual public reporting and independent audit.`,
      likes: 54,
      likedByUser: false,
      featured: false,
      status: "published"
    }
  ],

  comments: [
    {
      id: "comm-1",
      postId: "post-1",
      postTitle: "Breaking Barriers: How 10 Young Girls with Disabilities Mastered Coding in Kano",
      authorName: "Dr. Fatima Al-Mansoor",
      authorEmail: "f.almansoor@education.org",
      content: "This is a truly transformative initiative for Kano State. Digital literacy for adolescent girls with disabilities addresses one of the most overlooked sectors of inclusive development.",
      date: "August 19, 2026",
      status: "Approved"
    },
    {
      id: "comm-2",
      postId: "post-1",
      postTitle: "Breaking Barriers: How 10 Young Girls with Disabilities Mastered Coding in Kano",
      authorName: "Kabiru Suleiman",
      authorEmail: "kabiru.s@yahoo.com",
      content: "Proud to see grassroots organizations in Kano partnering with Ability First. Looking forward to cohort 2 expansion across other LGAs.",
      date: "August 20, 2026",
      status: "Approved"
    },
    {
      id: "comm-3",
      postId: "post-2",
      postTitle: "Closing the Maternal Health Gap: Expanding Mobile Primary Care in Nasarawa",
      authorName: "Nurse Maryam Bello",
      authorEmail: "maryam.b@nasarawaclinic.ng",
      content: "The mobile diagnostic clinics have dramatically reduced prenatal referral delays in rural settlements. Commendable work by the medical volunteers!",
      date: "August 14, 2026",
      status: "Approved"
    },
    {
      id: "comm-4",
      postId: "post-3",
      postTitle: "Fatima’s Story: Turning a Small Seed Grant into a Sustainable Tailoring Enterprise",
      authorName: "Hauwa Mustapha",
      authorEmail: "hauwa.mustapha@gmail.com",
      content: "Stories like Fatima's show that real empowerment comes from giving people dignity and tools, not handouts. Well done BHB Foundation!",
      date: "August 07, 2026",
      status: "Approved"
    }
  ],

  team: [
    {
      id: "team-1",
      name: "Dr. Bashir H. Bello",
      position: "Founder & Chairman, Board of Trustees",
      department: "Board of Trustees",
      bio: "Dr. Bashir established BHB Foundation to advance human dignity, social resilience, and structured opportunity across Northern Nigeria.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "team-2",
      name: "Hajiya Fatima A. Yusuf",
      position: "Executive Director",
      department: "Executive Management",
      bio: "Fatima leads the foundation's strategic direction, partner alignment, and program execution across participating local governments.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "team-3",
      name: "Malam Ibrahim Al-Hassan",
      position: "Director of Programs & Inclusive Tech",
      department: "Program Implementation",
      bio: "Ibrahim oversees BHB's digital inclusion and educational programs, including our disability tech boot camps.",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "team-4",
      name: "Dr. Aisha Kwaku",
      position: "Lead Strategic Health Advisor",
      department: "Healthcare & Advisory",
      bio: "Dr. Aisha guides BHB's maternal health outreach strategy and primary care partnerships across Kano State.",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "team-5",
      name: "Engr. Usman Farouk",
      position: "Head of Field Operations",
      department: "Operations & Logistics",
      bio: "Usman coordinates ground logistics, community liaison town halls, and resource delivery across all target LGAs.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "team-6",
      name: "Zainab S. Umar",
      position: "Head of Youth & Gender Initiatives",
      department: "Gender & Safeguarding",
      bio: "Zainab oversees women's enterprise incubation, girl-child mentorship networks, and safeguarding protocols.",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"
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
      if (stored) {
        const parsed = JSON.parse(stored);
        if (!parsed.comments) parsed.comments = DEFAULT_STORE_DATA.comments;
        if (!parsed.posts) parsed.posts = DEFAULT_STORE_DATA.posts;
        return parsed;
      }
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
  getPosts() { return this.data.posts || DEFAULT_STORE_DATA.posts; }
  getPostById(id) { return (this.data.posts || []).find(p => p.id === id); }
  getPartners() { return this.data.partners; }
  getDonations() { return this.data.donations; }
  getVolunteers() { return this.data.volunteers; }
  getInquiries() { return this.data.inquiries; }
  getAllComments() { return this.data.comments || []; }

  getCommentsByPost(postId) {
    return (this.data.comments || []).filter(c => c.postId === postId && c.status === 'Approved');
  }

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
      this.data.projects.push(project);
    } else {
      const idx = this.data.projects.findIndex(p => p.id === project.id);
      if (idx >= 0) this.data.projects[idx] = project;
      else this.data.projects.push(project);
    }
    this.notify();
    return project;
  }

  deleteProject(id) {
    this.data.projects = this.data.projects.filter(p => p.id !== id);
    this.notify();
  }

  // Blog Posts CRUD & Engagement
  savePost(post) {
    if (!this.data.posts) this.data.posts = [...DEFAULT_STORE_DATA.posts];
    if (!post.id) {
      post.id = 'post-' + Date.now();
      post.date = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      post.likes = 0;
      post.likedByUser = false;
      this.data.posts.unshift(post);
    } else {
      const idx = this.data.posts.findIndex(p => p.id === post.id);
      if (idx >= 0) {
        post.likes = this.data.posts[idx].likes || 0;
        post.likedByUser = this.data.posts[idx].likedByUser || false;
        this.data.posts[idx] = { ...this.data.posts[idx], ...post };
      } else {
        this.data.posts.push(post);
      }
    }
    this.notify();
    return post;
  }

  deletePost(id) {
    if (!this.data.posts) this.data.posts = [...DEFAULT_STORE_DATA.posts];
    this.data.posts = this.data.posts.filter(p => p.id !== id);
    // Also delete associated comments
    if (this.data.comments) {
      this.data.comments = this.data.comments.filter(c => c.postId !== id);
    }
    this.notify();
  }

  likePost(id) {
    if (!this.data.posts) this.data.posts = [...DEFAULT_STORE_DATA.posts];
    const post = this.data.posts.find(p => p.id === id);
    if (!post) return 0;

    if (!post.likedByUser) {
      post.likes = (post.likes || 0) + 1;
      post.likedByUser = true;
    } else {
      post.likes = Math.max(0, (post.likes || 1) - 1);
      post.likedByUser = false;
    }
    this.notify();
    return post.likes;
  }

  // Comments System
  addComment(commentData) {
    if (!this.data.comments) this.data.comments = [];
    const post = this.getPostById(commentData.postId);
    const newComment = {
      id: 'comm-' + Date.now(),
      postId: commentData.postId,
      postTitle: post ? post.title : 'Article',
      authorName: commentData.authorName || 'Community Member',
      authorEmail: commentData.authorEmail || '',
      content: commentData.content || '',
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      status: 'Approved' // auto-approved for instant engagement
    };
    this.data.comments.unshift(newComment);
    this.notify();
    return newComment;
  }

  updateCommentStatus(commentId, status) {
    if (!this.data.comments) return;
    const comment = this.data.comments.find(c => c.id === commentId);
    if (comment) {
      comment.status = status;
      this.notify();
    }
  }

  deleteComment(commentId) {
    if (!this.data.comments) return;
    this.data.comments = this.data.comments.filter(c => c.id !== commentId);
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
    if (!donation.id) donation.id = 'tx-' + Date.now().toString().slice(-4);
    if (!donation.date) donation.date = new Date().toISOString().replace('T', ' ').substring(0, 16);
    this.data.donations.unshift(donation);
    this.notify();
    return donation;
  }

  // Volunteers
  addVolunteer(volunteer) {
    if (!volunteer.id) volunteer.id = 'vol-' + Date.now().toString().slice(-4);
    if (!volunteer.appliedDate) volunteer.appliedDate = new Date().toISOString().substring(0, 10);
    if (!volunteer.status) volunteer.status = 'Pending';
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
    if (!inquiry.id) inquiry.id = 'inq-' + Date.now().toString().slice(-4);
    if (!inquiry.date) inquiry.date = new Date().toISOString().substring(0, 10);
    if (!inquiry.status) inquiry.status = 'Unread';
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
  saveSettings(newSettings) {
    this.data.settings = { ...this.data.settings, ...newSettings };
    this.notify();
    return this.data.settings;
  }

  // Export / Import
  exportJSON() {
    return JSON.stringify(this.data, null, 2);
  }

  importJSON(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.settings && parsed.projects && parsed.posts) {
        this.data = parsed;
        this.notify();
        return true;
      }
    } catch (e) {
      console.error("JSON import error", e);
    }
    return false;
  }

  resetToDefault() {
    localStorage.removeItem(BHB_STORAGE_KEY);
    this.data = JSON.parse(JSON.stringify(DEFAULT_STORE_DATA));
    this.notify();
  }
}

// Global Singleton Instance
window.BHBStore = new StoreEngine();
