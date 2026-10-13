import capitalOneLogo from '../assets/capital-one-logo.png'
import northropGrummanLogo from '../assets/northrop-grumman-logo.png'
import realityRanking from '../assets/reality-ranking.png'
import homeVideos from '../assets/home-videos.png'

// All site copy lives here. Add an `image` path (e.g. publicUrl('images/brown.jpg')
// for a file in public/) to replace any grey placeholder box.

// Files in public/ are served under the site's base path (/portfolio/ on
// GitHub Pages), so build their URLs from it rather than from the root.
const publicUrl = (path: string) => `${import.meta.env.BASE_URL}${path}`

export type SectionId = 'about' | 'education' | 'experience' | 'projects' | 'resume'

export const sections: { id: SectionId; label: string }[] = [
  { id: 'about', label: 'About' },
  { id: 'education', label: 'Education' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'resume', label: 'Resume' },
]

export interface Course {
  code: string
  name: string
  description: string
}

export interface School {
  name: string
  degree: string
  year: string
  courses: Course[]
  image?: string
}

export interface Job {
  company: string
  title: string
  dates: string
  location: string
  bullets: string[]
  technologies: string[]
  /** Drawn as a dot logo; logos sit on a white background. */
  logo?: string
  image?: string
}

export interface ResumeVersion {
  label: string
  file: string
}

export interface Project {
  name: string
  techStack: string[]
  description: string[]
  image?: string
  link?: string
}

export const profile = {
  name: 'Henry Rayner',
  taglines: ['Technical Professional', '2+ Years of Software Engineering Experience'],
  // Shown under the taglines on the About page; each entry is its own line.
  blurb: ['Welcome to my digital portfolio.', 'I am a problem-solver at heart who thrives on tackling complex challenges.', 'Take a look at my experience and projects to learn more about my work.'],
  // Drop your signature at public/signature.png; it is hidden until the file exists.
  signature: publicUrl('signature.png'),
  image: undefined as string | undefined,
  // PDFs live in public/; the first one is shown by default.
  resumes: [
    { label: 'Engineering', file: publicUrl('resume-engineering.pdf') },
    { label: 'Product', file: publicUrl('resume-product.pdf') },
  ] as ResumeVersion[],
}

export const education: School = {
  name: 'Brown University',
  degree: 'B.A. in Computer Science',
  year: '2022',
  // Descriptions adapted from https://cs.brown.edu/courses/
  courses: [
    {
      code: 'CSCI 0150',
      name: 'Object-Oriented Programming',
      description:
        'Object-oriented design in Java through a series of increasingly complex interactive graphics programs, including Doodle Jump and Tetris, ending in a substantial final project.',
    },
    {
      code: 'CSCI 0160',
      name: 'Data Structures and Algorithms',
      description:
        'Core problem-solving techniques used across computer science: sorting, searching, and graph and geometric algorithms, with the data structures behind them.',
    },
    {
      code: 'CSCI 0330',
      name: 'Computer Systems',
      description:
        'How software meets hardware: computer architecture, memory and caches, assembly and C, Unix systems programming, multithreading with POSIX threads, and operating system fundamentals.',
    },
    {
      code: 'CSCI 1470',
      name: 'Deep Learning',
      description:
        'Hands-on implementation of neural networks in Python, including convolutional and recurrent networks and autoencoders, applied to problems in vision and language.',
    },
    {
      code: 'CSCI 1430',
      name: 'Computer Vision',
      description:
        'How computers interpret images: image formation, feature detection and matching, camera geometry, depth reconstruction, and deep-learning approaches to recognition.',
    },
    {
      code: 'CSCI 1230',
      name: 'Computer Graphics',
      description:
        '2D and 3D graphics fundamentals, including geometric transformations, modeling, viewing, and rendering, through a sequence of C++ assignments that culminates in a ray tracer.',
    },
    {
      code: 'CSCI 1950-N',
      name: '2D Game Engines',
      description:
        'Built 2D game engines from the ground up, covering engine architecture, vector and raster graphics, animation, collision detection, physics, and game AI, then built games on top of them.',
    },
  ],
}

export const jobs: Job[] = [
  {
    company: 'Capital One',
    logo: capitalOneLogo,
    title: 'Associate Software Engineer',
    dates: 'Aug 2022 – Oct 2024',
    location: 'Cambridge, MA',
    bullets: [
      'Built and shipped full-stack features for internal applications using React, TypeScript, and Python on AWS, owning work from requirements through testing, deployment, and production support.',
      'Modernized legacy Java and Angular applications into React and TypeScript microservices, improving scalability, maintainability, and performance.',
      'Designed, documented, and implemented RESTful APIs and backend services to support enterprise applications and reliable data exchange.',
      'Partnered with Product, Design, UX, and QA to turn business requirements and Figma designs into prioritized user stories, acceptance criteria, and accessible, responsive features.',
      'Developed reusable React component libraries that streamlined recurring workflows and improved development speed and consistency across applications.',
      'Optimized SQL queries across PostgreSQL and Snowflake, significantly reducing execution times for both application performance and business analysis.',
      'Debugged and resolved production issues across frontend and backend systems, improving reliability and the user experience.',
      'Implemented Docker-based development workflows and Jenkins CI/CD pipelines to streamline deployments.',
      'Took part in code reviews, technical design discussions, and Agile ceremonies including backlog refinement, sprint planning, and retrospectives.',
    ],
    technologies: [
      'React',
      'TypeScript',
      'Python',
      'AWS',
      'PostgreSQL',
      'Snowflake',
      'Jenkins',
      'Docker',
      'Java',
      'Angular',
    ],
  },
  {
    company: 'Northrop Grumman',
    logo: northropGrummanLogo,
    title: 'Software Development Intern',
    dates: 'Jun 2020 – May 2022',
    location: 'Newport, RI',
    bullets: [
      'Developed software in C#/.NET with a focus on performance, reliability, and maintainability in simulation environments.',
      'Debugged and optimized complex applications, improving system stability and execution efficiency.',
      'Worked within structured software development processes, contributing to software delivery, documentation, and cross-team coordination.',
    ],
    technologies: ['C#', 'C++', '.NET'],
  },
]

export const projects: Project[] = [
  {
    name: 'Reality Ranking Site',
    techStack: ['React + Typescript', 'Node.js', 'PostgreSQL'],
    description: [
      'When a reality competition show ends, it’s hard to recall what your initial opinions are on the contestants. Did you have the winner at the top of your ranking all season? At what point in the season did your opinions change on a person?',
      'This application was designed to capture these insights for both personal users and all user aggregated rankings to provide a snapshot of contestant rankings throughout seasons of competition shows.',
    ],
    image: realityRanking,
  },
  {
    name: 'Home Video Search Application',
    techStack: ['Electron', 'React + Typescript', 'Node.js'],
    description: [
      'My personal catalog of home videos was extensive, so when I personally digitized them as a gift for a member of my family, I wanted to utilize my engineering capabilities to make the most of the digitization and create search functionality.',
      'This application stores tags for each video in the hard drive and allows the user to filter the videos by tags to get the relevant videos. Example: An anniversary is coming up, and I want to pull up all videos of Aunt Becky and Uncle Jesse. I simply select (or search) their tags, and I am able to easily click on the relevant videos.',
    ],
    image: homeVideos,
  },
]
