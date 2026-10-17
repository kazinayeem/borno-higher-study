export interface SubjectItem {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  iconName: string;
}

export const SUBJECTS_DATA: SubjectItem[] = [
  // Computing and Technology
  {
    id: "sub-cs",
    name: "Computer Science",
    slug: "computer-science",
    category: "Computing and Technology",
    description: "Algorithmic foundations, programming languages, operating systems, distributed computing, and formal theory.",
    iconName: "Code"
  },
  {
    id: "sub-se",
    name: "Software Engineering",
    slug: "software-engineering",
    category: "Computing and Technology",
    description: "System architecture, full-stack software development, software quality assurance, Agile methodologies, and enterprise systems.",
    iconName: "Layers"
  },
  {
    id: "sub-ai",
    name: "Artificial Intelligence",
    slug: "artificial-intelligence",
    category: "Computing and Technology",
    description: "Deep learning, natural language processing, computer vision, reinforcement learning, and autonomous systems.",
    iconName: "Cpu"
  },
  {
    id: "sub-ds",
    name: "Data Science",
    slug: "data-science",
    category: "Computing and Technology",
    description: "Statistical modeling, big data analytics, data engineering, visualization, and predictive machine learning.",
    iconName: "Database"
  },
  {
    id: "sub-cyber",
    name: "Cybersecurity",
    slug: "cybersecurity",
    category: "Computing and Technology",
    description: "Network security, cryptography, penetration testing, threat intelligence, cloud security, and security governance.",
    iconName: "ShieldCheck"
  },
  {
    id: "sub-it",
    name: "Information Technology",
    slug: "information-technology",
    category: "Computing and Technology",
    description: "IT infrastructure, systems administration, network protocols, cloud computing, and enterprise service management.",
    iconName: "Server"
  },
  {
    id: "sub-cloud",
    name: "Cloud Computing & DevOps",
    slug: "cloud-computing-devops",
    category: "Computing and Technology",
    description: "Cloud-native architectures, containerization, microservices, CI/CD pipelines, and site reliability engineering.",
    iconName: "Cloud"
  },
  {
    id: "sub-robotics",
    name: "Robotics & Autonomous Systems",
    slug: "robotics",
    category: "Computing and Technology",
    description: "Control theory, kinematics, sensor fusion, computer vision, and robotic manipulation.",
    iconName: "Bot"
  },

  // Engineering
  {
    id: "sub-eee",
    name: "Electrical and Electronic Engineering",
    slug: "electrical-engineering",
    category: "Engineering",
    description: "Power systems, microelectronics, signal processing, embedded systems, and telecommunications.",
    iconName: "Zap"
  },
  {
    id: "sub-mech",
    name: "Mechanical Engineering",
    slug: "mechanical-engineering",
    category: "Engineering",
    description: "Thermodynamics, fluid mechanics, CAD/CAM, structural mechanics, and advanced materials.",
    iconName: "Wrench"
  },
  {
    id: "sub-civil",
    name: "Civil and Structural Engineering",
    slug: "civil-engineering",
    category: "Engineering",
    description: "Sustainable infrastructure, smart city design, structural analysis, and geotechnical engineering.",
    iconName: "Building2"
  },
  {
    id: "sub-aero",
    name: "Aerospace Engineering",
    slug: "aerospace-engineering",
    category: "Engineering",
    description: "Aerodynamics, flight propulsion, satellite systems, and space technologies.",
    iconName: "Plane"
  },
  {
    id: "sub-biomed",
    name: "Biomedical Engineering",
    slug: "biomedical-engineering",
    category: "Engineering",
    description: "Medical devices, biomechanics, biomaterials, and clinical technology.",
    iconName: "Activity"
  },

  // Business and Economics
  {
    id: "sub-mba",
    name: "Business Administration (MBA)",
    slug: "business-administration",
    category: "Business and Economics",
    description: "Strategic leadership, organizational management, innovation, and global marketing.",
    iconName: "Briefcase"
  },
  {
    id: "sub-fin",
    name: "Finance & Quantitative Economics",
    slug: "finance",
    category: "Business and Economics",
    description: "Financial markets, asset pricing, quantitative risk modeling, and corporate valuation.",
    iconName: "TrendingUp"
  },
  {
    id: "sub-ba",
    name: "Business Analytics",
    slug: "business-analytics",
    category: "Business and Economics",
    description: "Business intelligence, decision analysis, econometrics, and data-driven strategy.",
    iconName: "BarChart"
  },

  // Science and Mathematics
  {
    id: "sub-biotech",
    name: "Biotechnology & Bioinformatics",
    slug: "biotechnology",
    category: "Science and Mathematics",
    description: "Molecular biology, genomic data analysis, drug design, and bioprocessing.",
    iconName: "Dna"
  },
  {
    id: "sub-env",
    name: "Environmental Science & Sustainability",
    slug: "environmental-science",
    category: "Science and Mathematics",
    description: "Climate change dynamics, renewable resources, circular economy, and ecological conservation.",
    iconName: "Leaf"
  }
];
