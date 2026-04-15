export const sectionDefaults = {
  home: {
    name: "",
    role: "",
    headline: "",
    subheadline: "",
    intro: "",
    availability: "",
    featuredSections: ["projects", "showcase", "skills"],
    heroStats: [],
    marquee: []
  },
  about: {
    title: "",
    body: "",
    highlights: [],
    education: []
  },
  skills: {
    title: "",
    items: []
  },
  contact: {
    title: "",
    email: "",
    phone: "",
    location: "",
    message: "",
    socials: []
  },
  settings: {
    siteName: "",
    footerText: "",
    accent: "#c47b49",
    adminBrand: "",
    resumeLabel: "Download Resume",
    resumeUrl: "",
    seoTitle: "",
    seoDescription: ""
  }
};

export const blankProject = {
  title: "",
  summary: "",
  description: "",
  category: "Frontend",
  techStackText: "",
  links: {
    live: "",
    github: "",
    caseStudy: ""
  },
  featured: true,
  published: true,
  coverImage: null,
  gallery: []
};

export const blankVideo = {
  title: "",
  category: "Creative",
  description: "",
  assetType: "video",
  featured: true,
  published: true,
  video: null,
  image: null,
  thumbnail: null
};
