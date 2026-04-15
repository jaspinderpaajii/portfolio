export const DEFAULT_SECTIONS = {
  home: {
    name: "Aryan Verma",
    role: "Developer, editor, and relentless builder.",
    headline: "I craft digital experiences that feel sharp, cinematic, and alive.",
    subheadline:
      "Computer engineering student blending front-end development, storytelling, and visual rhythm into modern portfolio work.",
    intro:
      "Continuous learner with strong analytical skills, eager to contribute to cutting-edge projects and build work that feels premium from the first impression.",
    availability: "Available for freelance work, internships, and creative collaborations.",
    featuredSections: ["projects", "showcase", "skills"],
    heroStats: [
      { label: "First-year GPA", value: "9.3" },
      { label: "DSA problems", value: "50+" },
      { label: "Creative builds", value: "05" }
    ],
    marquee: ["Web Development", "Cinematic Editing", "Frontend Systems", "Problem Solving"]
  },
  about: {
    title: "About",
    body:
      "I am a computer engineering student at Thakur College of Engineering and Technology with a strong interest in web development, creative interfaces, and interactive storytelling. I enjoy turning technical fundamentals into experiences that feel polished, clear, and memorable.",
    highlights: [
      "ISTE Technical Working Committee contributor at TCET.",
      "Coding Shastra problem setter working committee member.",
      "Hands-on with HTML, CSS, JavaScript, Java, C, and C++.",
      "Growing through DSA practice, frontend projects, and production-minded builds."
    ],
    education: [
      "Narayana E-Techno School - 92.6%",
      "Jai Hind College, Science - 71.33%",
      "BE in Computer Engineering, TCET - First-year GPA 9.3"
    ]
  },
  skills: {
    title: "Core Capabilities",
    items: [
      "Frontend Development",
      "Responsive Design",
      "HTML, CSS, JavaScript",
      "Bootstrap and Layout Systems",
      "Object-Oriented Programming",
      "Java",
      "C and C++",
      "Git and GitHub",
      "Data Structures and Algorithms",
      "Problem Setting"
    ]
  },
  contact: {
    title: "Let’s create something that feels unmistakably yours.",
    email: "aryanverma041206@gmail.com",
    phone: "+91 85911 93714",
    location: "Mumbai, India",
    message:
      "Reach out for collaborations, internship opportunities, freelance builds, or editing projects.",
    socials: [
      { label: "GitHub", url: "https://github.com/" },
      { label: "LeetCode", url: "https://leetcode.com/" },
      { label: "HackerRank", url: "https://www.hackerrank.com/" }
    ]
  },
  settings: {
    siteName: "Aryan Verma",
    footerText: "Built with React, Express, MongoDB, and Cloudinary.",
    accent: "#c47b49",
    adminBrand: "Aryan Control",
    resumeLabel: "Download Resume",
    resumeUrl: "",
    seoTitle: "Aryan Verma | Portfolio",
    seoDescription:
      "Personal portfolio and editing showcase for Aryan Verma, featuring projects, visual work, and a private admin CMS."
  }
};

export const DEFAULT_PROJECTS = [
  {
    title: "Spotify Clone",
    slug: "spotify-clone",
    summary: "A sleek static clone focused on layout precision and visual familiarity.",
    description:
      "This project recreates Spotify-inspired interface patterns using HTML and CSS, with an emphasis on clean structure, layering, and familiar music-product styling.",
    category: "Frontend",
    techStack: ["HTML", "CSS"],
    links: {
      live: "",
      github: "",
      caseStudy: ""
    },
    featured: true,
    published: true,
    order: 1
  },
  {
    title: "Tic Tac Toe",
    slug: "tic-tac-toe",
    summary: "A lightweight browser game with fast feedback and simple interaction logic.",
    description:
      "Built with JavaScript, HTML, and CSS to explore event handling, win-state logic, and interactive UI patterns in a compact format.",
    category: "JavaScript",
    techStack: ["JavaScript", "HTML", "CSS"],
    links: {
      live: "",
      github: "",
      caseStudy: ""
    },
    featured: true,
    published: true,
    order: 2
  },
  {
    title: "Rock Paper Scissors",
    slug: "rock-paper-scissors",
    summary: "A playful UI exercise with state-based outcomes and quick round feedback.",
    description:
      "A browser game that uses JavaScript for decision logic and scoring while keeping the visual language clean and immediate.",
    category: "JavaScript",
    techStack: ["JavaScript", "HTML", "CSS"],
    links: {
      live: "",
      github: "",
      caseStudy: ""
    },
    featured: false,
    published: true,
    order: 3
  },
  {
    title: "Valid Parentheses Challenge",
    slug: "valid-parentheses-challenge",
    summary: "A challenge package with solution code, test cases, and input-output generation.",
    description:
      "Created as a HackerRank-style challenge package with complete test cases, generators, and a solution flow that emphasizes problem clarity.",
    category: "DSA",
    techStack: ["Java", "Problem Solving", "Test Cases"],
    links: {
      live: "",
      github: "",
      caseStudy: ""
    },
    featured: true,
    published: true,
    order: 4
  },
  {
    title: "Simon Game",
    slug: "simon-game",
    summary: "A memory game exploring interaction states, sequence logic, and feedback timing.",
    description:
      "This project focuses on timing, pattern recognition, and responsive interaction built with JavaScript, HTML, and CSS.",
    category: "JavaScript",
    techStack: ["JavaScript", "HTML", "CSS"],
    links: {
      live: "",
      github: "",
      caseStudy: ""
    },
    featured: false,
    published: true,
    order: 5
  }
];

export const DEFAULT_VIDEOS = [];
