import capitalOneLogo from '../assets/capital-one-logo.png'
import northropGrummanLogo from '../assets/northrop-grumman-logo.png'
import realityRanking from '../assets/reality-ranking.jpg'
import homeVideos from '../assets/home-videos.jpg'
import rrHome from '../assets/projects/rr-home.jpg'
import rrInsights from '../assets/projects/rr-insights.jpg'
import rrContestant from '../assets/projects/rr-contestant.jpg'
import hvSearch from '../assets/projects/hv-search.jpg'
import hvFilter from '../assets/projects/hv-filter.jpg'
import hvAdmin from '../assets/projects/hv-admin.jpg'
import giftOrganizer from '../assets/gift-organizer.jpg'
import goHome from '../assets/projects/go-home.jpg'
import goBook from '../assets/projects/go-book.jpg'
import goIdea from '../assets/projects/go-idea.jpg'

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
  { id: 'projects', label: 'Projects & Certs' },
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

export interface Certification {
  name: string
  /** Short mark shown in the badge circle until a `badge` image is added. */
  short: string
  issuer: string
  /** e.g. 'Mar 2024'; omitted from the card when blank. */
  earned?: string
  /** Official badge image, e.g. downloaded from Credly. */
  badge?: string
  /** Verification link, e.g. a Credly or Scrum Alliance profile. */
  link?: string
}

/** One box in a flow diagram. */
export interface DiagramNode {
  title: string
  detail?: string
  /** Where it runs or what it is, shown as a small label (e.g. "GitHub Pages"). */
  tag?: string
}

/** A left-to-right (top-to-bottom on phones) flow: each stage holds one or more boxes. */
export interface Diagram {
  title: string
  caption?: string
  stages: {
    nodes: DiagramNode[]
    /** Label on the arrow leading to the next stage. */
    link?: string
  }[]
}

export interface Screenshot {
  src: string
  alt: string
  caption: string
}

/** Shown in the "Learn more" dialog. */
export interface ProjectDetails {
  overview: string[]
  links?: { label: string; href: string }[]
  screenshots: Screenshot[]
  diagrams: Diagram[]
  hosting: { label: string; value: string }[]
  highlights: { title: string; body: string }[]
}

export interface Project {
  name: string
  techStack: string[]
  description: string[]
  image?: string
  link?: string
  details?: ProjectDetails
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
    details: {
      overview: [
        'Reality Ranking lets viewers rank the contestants of a reality show after each episode, then see how everyone’s rankings shift over a season. It’s a full-stack web app: a React single-page app talks to an Express API backed by PostgreSQL, with contestant photos in object storage.',
        'Shows run in one of two modes. Weekly shows open ranking for a set window after each episode airs; daily shows like Big Brother open a new ranking every Eastern-time calendar day, and the server creates (and backfills) those day entries itself.',
      ],
      links: [
        { label: 'Live site', href: 'https://henryrayner1.github.io/reality_ranking/' },
        { label: 'Source on GitHub', href: 'https://github.com/henryrayner1/reality_ranking' },
      ],
      screenshots: [
        {
          src: rrHome,
          alt: 'Reality Ranking homepage with show cards for currently airing shows',
          caption: 'Homepage: pick a show that’s currently airing or browse past seasons.',
        },
        {
          src: rrInsights,
          alt: 'Insights table showing contestant photos ranked by episode, with an average column',
          caption: 'Insights: every user’s rankings aggregated per episode, with a season average.',
        },
        {
          src: rrContestant,
          alt: 'A contestant’s trend chart of average favorite and winner rank across episodes',
          caption: 'By contestant: average favorite and winner rank over the season, against the shrinking cast.',
        },
      ],
      diagrams: [
        {
          title: 'Architecture',
          caption: 'The frontend and backend deploy separately and only share the JSON API.',
          stages: [
            {
              nodes: [
                {
                  title: 'React SPA',
                  detail: 'React Query, Redux, dnd-kit, Recharts',
                  tag: 'GitHub Pages',
                },
              ],
              link: 'HTTPS · JSON',
            },
            {
              nodes: [
                {
                  title: 'Express API',
                  detail: 'Zod validation, token auth, Prisma',
                  tag: 'Render',
                },
              ],
              link: 'Prisma · S3 API',
            },
            {
              nodes: [
                { title: 'PostgreSQL', detail: 'Shows, seasons, rankings', tag: 'Neon' },
                { title: 'Contestant photos', detail: 'Uploaded from the admin tools', tag: 'Cloudflare R2' },
              ],
            },
          ],
        },
        {
          title: 'Data model',
          caption: 'Each ranking belongs to a user and an episode.',
          stages: [
            { nodes: [{ title: 'Show', detail: 'Ranking mode: by episode or daily' }], link: 'has many' },
            { nodes: [{ title: 'Season', detail: 'Premiere and end dates' }], link: 'has many' },
            {
              nodes: [
                { title: 'Episode', detail: 'Air date opens ranking' },
                { title: 'Contestant', detail: 'Photo, status' },
              ],
              link: 'has many',
            },
            {
              nodes: [
                { title: 'Ranking', detail: 'A user’s ordered list' },
                { title: 'Elimination', detail: 'At most one per contestant' },
              ],
            },
          ],
        },
        {
          title: 'Deployment',
          stages: [
            { nodes: [{ title: 'Push to main', tag: 'GitHub' }], link: 'triggers' },
            {
              nodes: [{ title: 'Build', detail: 'Type-check, Vite build, SPA 404 fallback', tag: 'GitHub Actions' }],
              link: 'publishes',
            },
            { nodes: [{ title: 'Static site', tag: 'GitHub Pages' }] },
          ],
        },
      ],
      hosting: [
        { label: 'Frontend', value: 'GitHub Pages, built and deployed by GitHub Actions on every push to main' },
        { label: 'API', value: 'Node.js + Express on Render' },
        { label: 'Database', value: 'Serverless PostgreSQL on Neon, accessed through Prisma' },
        { label: 'Images', value: 'Cloudflare R2, so uploads survive Render’s ephemeral disk' },
      ],
      highlights: [
        {
          title: 'Drag-and-drop ranking',
          body: 'Users reorder contestant cards with dnd-kit. Eliminated contestants drop to the bottom and lock from the episode they leave.',
        },
        {
          title: 'Season insights',
          body: 'Rankings from every user are averaged per episode into a table and per-contestant trend charts, with a toggle to see only your own submissions.',
        },
        {
          title: 'Time-zone-aware daily shows',
          body: 'Daily rankings follow Eastern-time days, so the server fills in any missed days since the premiere and stops at the season’s end date.',
        },
        {
          title: 'Secure accounts',
          body: 'Passwords are hashed with bcrypt, and sessions use signed, expiring tokens checked with constant-time comparison.',
        },
        {
          title: 'Admin tools',
          body: 'Admins add shows, seasons and contestants, paste or drop in photos, and switch a show between weekly and daily ranking.',
        },
        {
          title: 'Tested',
          body: 'Components are covered by Vitest and React Testing Library tests that sit beside each component.',
        },
      ],
    },
  },
  {
    name: 'Home Video Search Application',
    techStack: ['Electron', 'React + Typescript', 'Node.js'],
    description: [
      'My personal catalog of home videos was extensive, so when I personally digitized them as a gift for a member of my family, I wanted to utilize my engineering capabilities to make the most of the digitization and create search functionality.',
      'This application stores tags for each video in the hard drive and allows the user to filter the videos by tags to get the relevant videos. Example: An anniversary is coming up, and I want to pull up all videos of Aunt Becky and Uncle Jesse. I simply select (or search) their tags, and I am able to easily click on the relevant videos.',
    ],
    image: homeVideos,
    details: {
      overview: [
        'A desktop app that ships on the same external drive as the digitized home videos. Family members open it, pick the people, places or occasions they’re looking for, and click a result to play it in their usual video player. Everything runs offline from the drive.',
        'Each video’s tags start from its filename and are then refined by hand in the app’s tag editor. Edits are saved back to the drive, so the catalog keeps improving as people use it.',
      ],
      screenshots: [
        {
          src: hvSearch,
          alt: 'Home video search screen with a tag cloud and videos grouped by year',
          caption: 'Search: every tag with its video count, and the catalog grouped by year.',
        },
        {
          src: hvFilter,
          alt: 'Search filtered to the Christmas tag, showing matching videos and related tags',
          caption: 'Filtering narrows the tag cloud to tags that still have matches.',
        },
        {
          src: hvAdmin,
          alt: 'Tag editor with one video selected and its tags shown as removable chips',
          caption: 'Edit Tags: add or remove a video’s tags, with suggestions from tags already in use.',
        },
      ],
      diagrams: [
        {
          title: 'Architecture',
          caption: 'Electron’s two processes only talk through a small, typed bridge.',
          stages: [
            {
              nodes: [
                { title: 'Renderer', detail: 'React UI: search, filters, tag editor', tag: 'Chromium' },
              ],
              link: 'window.electron',
            },
            {
              nodes: [
                {
                  title: 'Preload bridge',
                  detail: 'Exposes openFile, getTagOverrides, setVideoTags',
                  tag: 'contextBridge',
                },
              ],
              link: 'IPC invoke',
            },
            {
              nodes: [
                { title: 'Main process', detail: 'Checks each call’s sender, saves tags, tray and menu', tag: 'Node.js' },
              ],
              link: 'fs · shell',
            },
            {
              nodes: [
                { title: 'Video drive', detail: 'Videos and saved tag edits', tag: 'External SSD' },
                { title: 'Default video player', tag: 'OS' },
              ],
            },
          ],
        },
        {
          title: 'Building the catalog',
          caption: 'Run once over the drive before packaging. The app itself never scans files.',
          stages: [
            {
              nodes: [
                { title: 'Video files', detail: 'Named like “1994_12_25 Christmas Morning.mp4”' },
                { title: 'cropVideos.py', detail: 'Trims black bars from the files first', tag: 'ffmpeg' },
              ],
              link: 'scanned by',
            },
            {
              nodes: [{ title: 'generateTags.py', detail: 'Month and title words become tags', tag: 'Python' }],
              link: 'writes',
            },
            {
              nodes: [{ title: 'video_tags.json', detail: 'Bundled into the app' }],
              link: 'packaged by',
            },
            {
              nodes: [{ title: 'electron-builder', detail: 'macOS, Windows and Linux builds' }],
            },
          ],
        },
      ],
      hosting: [
        { label: 'Runs on', value: 'The viewer’s own computer, launched from the video drive. No server, no internet needed' },
        { label: 'Platforms', value: 'macOS (Apple silicon), Windows (portable .exe) and Linux (AppImage), packaged with electron-builder' },
        { label: 'Data', value: 'The tag catalog is bundled into the app; tag edits are saved in a file on the drive itself' },
      ],
      highlights: [
        {
          title: 'Locked-down IPC',
          body: 'The renderer has no Node access. Three bridge methods are its only way to the system, and the main process checks every call came from the app’s own window.',
        },
        {
          title: 'Edits that survive',
          body: 'Tag changes are written to a temp file and renamed into place, with saves queued one at a time, so a crash or double-click can’t corrupt the catalog.',
        },
        {
          title: 'Search that narrows',
          body: 'Selecting tags shows only videos with all of them, and the remaining tag list shrinks to tags that would still find something.',
        },
        {
          title: 'Fully offline',
          body: 'Fonts and icons are bundled, so the app looks the same on any computer the drive is plugged into.',
        },
        {
          title: 'Video prep scripts',
          body: 'Python scripts generate starting tags from filenames and use ffmpeg’s crop detection to strip black bars, with a dry-run report first.',
        },
        {
          title: 'Tested',
          body: 'Vitest unit tests cover the tag store and tray; Playwright end-to-end tests launch the real Electron app.',
        },
      ],
    },
  },
  {
    name: 'Gathered: Gift Idea Organizer',
    techStack: ['React + Typescript', 'Express', 'PostgreSQL'],
    description: [
      'Good gift ideas tend to show up at random times, like a passing comment or something spotted months before a birthday, and they’re easy to forget by the time the occasion arrives.',
      'Gathered gives each person in your life their own private page of gift ideas. Ideas can be things to buy, plans to make or simply something to do, each with an occasion, price and notes, and they move to a “Given” list once they’ve been given.',
    ],
    image: giftOrganizer,
    details: {
      overview: [
        'Gathered is a private gift-idea organizer. Each person gets a page of their own. Ideas go in through a one-line quick-add with an optional occasion, then open up for notes, a price or a link. Checking an idea off moves it to that person’s Given list.',
        'It’s a single full-stack service: one Express server provides the JSON API and also serves the built React app, so the whole thing deploys to Render as one web service, with its data in Neon PostgreSQL.',
      ],
      links: [{ label: 'Live site', href: 'https://gift-organizer.onrender.com/' }],
      screenshots: [
        {
          src: goHome,
          alt: 'Gathered sign-in page with the headline “Remember the perfect thing.” beside a create-account form',
          caption: 'Sign-in page: every account gets its own private gift book.',
        },
        {
          src: goBook,
          alt: 'Gift book with a list of people on the left and one person’s gift ideas on the right',
          caption: 'Gift book: people on the left, the selected person’s ideas on the right.',
        },
        {
          src: goIdea,
          alt: 'An expanded gift idea showing its notes with edit and delete actions',
          caption: 'Ideas open up to show notes, with edit and delete actions.',
        },
      ],
      diagrams: [
        {
          title: 'Architecture',
          caption: 'The browser only ever talks to one origin, so there’s no CORS to manage.',
          stages: [
            {
              nodes: [{ title: 'React SPA', detail: 'React Router, Tailwind CSS', tag: 'Browser' }],
              link: 'same origin · /api',
            },
            {
              nodes: [
                {
                  title: 'Express server',
                  detail: 'Serves the app and JSON API, Zod validation, session cookie',
                  tag: 'Render',
                },
              ],
              link: 'Prisma',
            },
            {
              nodes: [{ title: 'PostgreSQL', detail: 'Users, people, gift ideas', tag: 'Neon' }],
            },
          ],
        },
        {
          title: 'Data model',
          caption: 'Deleting a person or an account removes everything under it.',
          stages: [
            { nodes: [{ title: 'User', detail: 'Email, bcrypt password hash' }], link: 'has many' },
            { nodes: [{ title: 'Person', detail: 'Relationship, birthday, color' }], link: 'has many' },
            { nodes: [{ title: 'Gift idea', detail: 'Occasion, price, link, status from idea to given' }] },
          ],
        },
        {
          title: 'Deployment',
          caption: 'Defined in a render.yaml Blueprint.',
          stages: [
            { nodes: [{ title: 'Push to main', tag: 'GitHub' }], link: 'triggers' },
            { nodes: [{ title: 'Build', detail: 'Server and client in one npm workspace build', tag: 'Render' }], link: 'then' },
            {
              nodes: [
                {
                  title: 'Migrate and start',
                  detail: 'Prisma migrations over a direct connection, then the server starts',
                  tag: 'Render',
                },
              ],
            },
          ],
        },
      ],
      hosting: [
        { label: 'App and API', value: 'One Node.js web service on Render, defined in a render.yaml Blueprint' },
        {
          label: 'Database',
          value: 'Serverless PostgreSQL on Neon in the same region, with pooled connections for the app and a direct one for migrations',
        },
        { label: 'Sessions', value: 'A signed JWT in an httpOnly, SameSite cookie, so page scripts never see the token' },
      ],
      highlights: [
        {
          title: 'Private by design',
          body: 'Every query is scoped to the signed-in account, and an idea can only be attached to one of your own people.',
        },
        {
          title: 'Secure accounts',
          body: 'Passwords are hashed with bcrypt, sessions live in an httpOnly cookie, and the account menu covers changing your password or deleting your account.',
        },
        {
          title: 'Quick capture',
          body: 'A one-line quick-add with an occasion picker gets an idea down in seconds, and the details can wait.',
        },
        {
          title: 'Made for phones',
          body: 'People and ideas become separate screens, rows swipe left to delete, and inputs and dialogs are tuned so iOS doesn’t zoom or scroll the page behind them.',
        },
        {
          title: 'One deployable',
          body: 'The server hosts the built React app as well as the API, so frontend and backend ship together in a single Render service.',
        },
        {
          title: 'SQLite to Postgres',
          body: 'It started on a local SQLite database and moved to Neon with a one-off import script that copies everything in a single transaction.',
        },
      ],
    },
  },
]

export const certifications: Certification[] = [
  {
    name: 'AWS Certified Solutions Architect – Associate',
    short: 'AWS',
    issuer: 'Amazon Web Services',
  },
  {
    name: 'Certified Scrum Product Owner (CSPO)',
    short: 'CSPO',
    issuer: 'Scrum Alliance',
  },
  {
    name: 'Google Data Analytics Professional Certificate',
    short: 'GDA',
    issuer: 'Google',
  },
]
