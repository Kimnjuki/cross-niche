/**
 * Author registry for E-E-A-T (Experience, Expertise, Authoritativeness, Trust).
 * Maps author slug to bio, credentials, and schema data.
 */

export interface AuthorProfile {
  name: string;
  jobTitle: string;
  bio: string;
  expertise: string[];
  imageUrl?: string;
  sameAs?: string[];
}

/** Author profiles keyed by slug (e.g. "sarah-chen") */
export const authorProfiles: Record<string, AuthorProfile> = {
  'sarah-chen': {
    name: 'Sarah Chen',
    jobTitle: 'Senior Tech Reporter',
    bio: 'Sarah Chen covers consumer technology and hardware for The Grid Nexus. With over 8 years in tech journalism, she has reported on major product launches from Apple, Samsung, and emerging startups. Sarah holds a degree in Computer Science from Stanford and previously worked at Wired.',
    expertise: ['Consumer Technology', 'Hardware', 'Apple', 'Spatial Computing'],
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    sameAs: ['https://twitter.com/sarahchen', 'https://linkedin.com/in/sarahchen'],
  },
  'marcus-johnson': {
    name: 'Marcus Johnson',
    jobTitle: 'Hardware & Gaming Editor',
    bio: 'Marcus Johnson specializes in GPU benchmarks, PC hardware, and gaming technology. He has reviewed hundreds of graphics cards and gaming peripherals. Marcus is a former competitive esports player and brings insider perspective to hardware coverage.',
    expertise: ['GPU Technology', 'PC Hardware', 'Gaming', 'Benchmarks'],
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    sameAs: ['https://twitter.com/marcusjohnson', 'https://youtube.com/@marcusjohnson'],
  },
  'dr-emily-watson': {
    name: 'Dr. Emily Watson',
    jobTitle: 'Quantum Computing & AI Correspondent',
    bio: 'Dr. Emily Watson holds a Ph.D. in Quantum Information from MIT. She translates complex research into accessible analysis for The Grid Nexus. Her work has been cited in Nature and Science. Emily previously led quantum algorithms research at a major tech lab.',
    expertise: ['Quantum Computing', 'Artificial Intelligence', 'Research', 'Scientific Analysis'],
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
    sameAs: ['https://linkedin.com/in/emilywatson', 'https://scholar.google.com/emilywatson'],
  },
  'alex-rivera': {
    name: 'Alex Rivera',
    jobTitle: 'Robotics & Automation Reporter',
    bio: 'Alex Rivera covers robotics, automation, and industrial technology. He has interviewed executives at Tesla, Boston Dynamics, and leading robotics startups. Alex has a background in mechanical engineering and previously worked in manufacturing automation.',
    expertise: ['Robotics', 'Automation', 'Manufacturing', 'AI Systems'],
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    sameAs: ['https://twitter.com/alexrivera', 'https://linkedin.com/in/alexrivera'],
  },
  'james-morrison': {
    name: 'James Morrison',
    jobTitle: 'Cybersecurity Correspondent',
    bio: 'James Morrison has covered cybersecurity for over a decade, with a focus on nation-state threats and critical infrastructure. He holds CISSP and CEH certifications and has testified before congressional committees on cyber policy. James is a former incident response lead at a Fortune 500 company.',
    expertise: ['Cybersecurity', 'Threat Intelligence', 'Incident Response', 'Policy'],
    imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400',
    sameAs: ['https://twitter.com/jamesmorrison', 'https://linkedin.com/in/jamesmorrison'],
  },
  'lisa-park': {
    name: 'Lisa Park',
    jobTitle: 'Gaming Industry Analyst',
    bio: 'Lisa Park covers the gaming industry, from AAA releases to indie gems. She has attended every E3 and Gamescom since 2015 and maintains relationships with major publishers and developers. Lisa hosts the weekly Nexus Gaming podcast.',
    expertise: ['Gaming Industry', 'Game Reviews', 'Esports', 'Indie Games'],
    imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
    sameAs: ['https://twitter.com/lisapark', 'https://twitch.tv/lisapark'],
  },
  'dr-robert-kim': {
    name: 'Dr. Robert Kim',
    jobTitle: 'Security Research Lead',
    bio: 'Dr. Robert Kim is a security researcher with a Ph.D. in Computer Science. He has discovered critical vulnerabilities in major software and has spoken at Black Hat and DEF CON. Robert leads The Grid Nexus security research team and advises on threat modeling.',
    expertise: ['Vulnerability Research', 'Penetration Testing', 'Cryptography', 'Secure Development'],
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    sameAs: ['https://github.com/robertkim', 'https://linkedin.com/in/robertkim'],
  },
  'amanda-chen': {
    name: 'Amanda Chen',
    jobTitle: 'Cloud & DevOps Reporter',
    bio: 'Amanda Chen covers cloud infrastructure, DevOps, and enterprise technology. She has deep experience in AWS, Azure, and GCP from her time as a solutions architect. Amanda helps readers understand complex cloud migrations and infrastructure decisions.',
    expertise: ['Cloud Computing', 'DevOps', 'Kubernetes', 'Infrastructure'],
    imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    sameAs: ['https://twitter.com/amandachen', 'https://linkedin.com/in/amandachen'],
  },
  'chris-taylor': {
    name: 'Chris Taylor',
    jobTitle: 'Gaming Hardware Reviewer',
    bio: 'Chris Taylor specializes in gaming peripherals, monitors, and PC builds. He has tested thousands of products and maintains one of the most comprehensive gaming hardware databases. Chris is known for rigorous, repeatable testing methodology.',
    expertise: ['Gaming Hardware', 'Monitors', 'Peripherals', 'PC Building'],
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
    sameAs: ['https://youtube.com/@christaylor', 'https://twitter.com/christaylor'],
  },
  'maya-rodriguez': {
    name: 'Maya Rodriguez',
    jobTitle: 'Privacy & Policy Reporter',
    bio: 'Maya Rodriguez covers privacy, data protection, and tech policy. She has reported on GDPR, CCPA, and emerging privacy regulations. Maya holds a law degree with a focus on technology law and has advised startups on compliance.',
    expertise: ['Privacy', 'Data Protection', 'Tech Policy', 'Compliance'],
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
    sameAs: ['https://twitter.com/mayarodriguez', 'https://linkedin.com/in/mayarodriguez'],
  },
  'kevin-nakamura': {
    name: 'Kevin Nakamura',
    jobTitle: 'AI & Machine Learning Editor',
    bio: 'Kevin Nakamura covers artificial intelligence, machine learning, and their real-world applications. He has a background in ML research and has published papers on neural network optimization. Kevin helps readers separate AI hype from genuine breakthroughs.',
    expertise: ['Artificial Intelligence', 'Machine Learning', 'LLMs', 'AI Ethics'],
    imageUrl: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=400',
    sameAs: ['https://twitter.com/kevinnakamura', 'https://github.com/kevinnakamura'],
  },
  'diana-wong': {
    name: 'Diana Wong',
    jobTitle: 'Editorial Director',
    bio: 'Diana Wong leads editorial strategy at The Grid Nexus. With 15 years in tech journalism, she has held senior roles at major publications. Diana ensures our coverage meets the highest standards for accuracy, fairness, and depth.',
    expertise: ['Editorial Strategy', 'Tech Journalism', 'Content Standards', 'E-E-A-T'],
    imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
    sameAs: ['https://linkedin.com/in/dianawong', 'https://twitter.com/dianawong'],
  },
};

/** Default profile for unknown authors */
export const defaultAuthorProfile: AuthorProfile = {
  name: 'The Grid Nexus Editorial Team',
  jobTitle: 'Editorial Team',
  bio: 'Our editorial team brings together experts in technology, cybersecurity, and gaming to deliver accurate, timely, and insightful coverage. We are committed to journalistic integrity and helping readers stay informed.',
  expertise: ['Technology', 'Cybersecurity', 'Gaming', 'News'],
};

export function getAuthorProfile(slug: string | undefined): AuthorProfile | null {
  if (!slug || slug === 'anonymous') return null;
  const normalized = slug.toLowerCase().trim().replace(/[\s_]+/g, '-');
  return authorProfiles[normalized] ?? null;
}
