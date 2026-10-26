# Sarah Norton's website

Hi! This is my personal portfolio! LinkedIn is a bit superficial and a printed pdf of my CV is a bit unpersonal. Therefore, this website was created to showcase my work as a developer and photographer, with some additional room for presenting my design and user experience projects as well🤝

The website is built with [Astro](https://astro.build/) and [React](https://react.dev/). Astro provides the page structure and routing,
while React is used for interactive parts of the site, such as the photography gallery and programming-project details.

This website is constantly in progress, so feel free to visit it occasionally!

## What can you find here?

The site currently includes:

- **About** — an introduction about me and my background in computer science,
  media, and communication.
- **Photography** — a gallery of landscapes, people, and some nice moments captured through the camera lense.
- **Programming** — selected school and side projects, along with the technologies and tools used.
- **Design & UX** — a home for visual design and user experience work; this section is still being expanded.
- **Contact** — a way to get in touch! (still tinkering on how I would like to solve this part)

Project data and site content live in the `src/` directory, while static assets such as images and logos live in `public/`. Currently working on using image links with Cloudflare's R2 to improve loading time, so the images will hopefully be removed soon.

## Long-term goals

The long-term goal is to make this a well-maintained portfolio rather
than a static collection of links. Planned direction includes:

- expanding the programming, photography, and design case studies with more
  context and finished work
- continuing to refine the visual identity and interactions of the site
- keeping the portfolio current as I complete new projects

The site is deployed with the
[Astro Cloudflare adapter](https://docs.astro.build/en/guides/integrations-guide/cloudflare/)
and is configured for Cloudflare assets and an R2 photography bucket (what I am currently working on!). The Cloudflare configuration is intended to support a reliable production site and a scalable place for photography assets as the portfolio grows.

## Run locally

### Prerequisites

- [Node.js](https://nodejs.org/) **22.12.0 or newer**
- npm

### Setup

From the repository root, install the dependencies:

```sh
npm install
```

Start the Astro development server:

```sh
npm run dev
```

Then open <http://localhost:4321> in a browser. Astro will watch the source files and reloads the page as you make changes.

### Useful commands

| Command                  | Purpose                                                   |
| ------------------------ | --------------------------------------------------------- |
| `npm run dev`            | Start the local development server                        |
| `npm run build`          | Run Astro checks and create a production build in `dist/` |
| `npm run preview`        | Preview the built site locally                            |
| `npm run check`          | Run Astro checks, ESLint, and Prettier validation         |
| `npm run format`         | Format the project with Prettier                          |
| `npm run lint`           | Run ESLint                                                |
| `npm run generate-types` | Generate Cloudflare Worker types with Wrangler            |

To test the production build locally:

```sh
npm run build
npm run preview
```

Some production Cloudflare functionality, such as the R2 bucket binding,
requires the appropriate Cloudflare/Wrangler configuration and credentials.
The normal `npm run dev` workflow is sufficient for working on the site's
pages, components, styling, and local static assets.

## Project structure

```text
.
├── public/              # Static images, logos, and other public assets
├── src/
│   ├── components/      # Astro and React UI components
│   ├── data/            # Project and gallery data
│   ├── layouts/         # Shared page layouts
│   └── pages/           # Routes and page-specific styles
├── astro.config.mjs     # Astro and Cloudflare configuration
├── package.json         # Scripts and dependencies
└── wrangler.jsonc       # Cloudflare Worker and R2 configuration
```

# Generative AI Declaration

The design was actually made by me already back in 2024, but time was not sufficient to implement the most intricate of details. I therefore put the development process on hold, and as React updated its version and my previous routing solution quickly got outdated, I didn't feel like I had the time to finish the project. Yet, here I am, back in 2026, in the age of LLMs and agentic mode.

Generative AI tools, including GitHub Copilot, Anthropic's Claude, and Figma's built-in code generation features, have therefore been used throughout this project. I take full responsibility for the code, including any errors or issues it may contain. I do my best to review, understand, and test the generated code, fix bugs, and make adjustments where necessary.

If you discover any vulnerabilities, encounter bugs, or have any questions, please don't hesitate to reach out!
