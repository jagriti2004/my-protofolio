# Jagriti Prakash | Portfolio Website

A personal portfolio website for **Jagriti Prakash**, MCA student at Graphic Era Deemed University. It uses a glossy white and beige design, works on phones and desktops, and is built with plain HTML, CSS and JavaScript. There is nothing to install and no build step.

## Features

- Glossy glass-style design in white and beige, with a warm dark theme toggle
- Typing animation for the role line in the hero section
- Scroll progress bar, active section highlight in the navigation and a back-to-top button
- Mobile menu, smooth scrolling and sections that fade in as you scroll
- Animated number counters in the About section
- Skills filter (Frontend, Backend and data, Emerging tech) built from a JavaScript list
- Education timeline
- Projects section built from a JavaScript list
- Contact buttons built from your details, including a "Copy email" button
- 3D card tilt, magnetic buttons and moving background glow on desktop
- Respects the "reduce motion" setting and supports keyboard navigation

## Project structure

```
jagriti-portfolio/
├── index.html        Page structure and content
├── css/
│   └── style.css     Theme, layout and animations
├── js/
│   └── main.js       All interactive features and your editable data
└── README.md
```

## Run it locally

1. Download or clone this repository.
2. Open `index.html` in your browser.

You can also use the Live Server extension in VS Code for automatic reloading.

## Customise it

Open `js/main.js`. The editable content is at the top of the file.

**Contact links** (they appear in the Contact section):

```js
contact: {
  email: "name@example.com",
  linkedin: "https://www.linkedin.com/in/your-id",
  github: "https://github.com/your-username",
  resume: "assets/Jagriti-Prakash-Resume.pdf"
}
```

Leave a value as `""` to hide that button. If you add a resume, create an `assets` folder and put the PDF inside it.

**Projects:**

```js
const PROJECTS = [
  {
    title: "Library Management System",
    desc: "A Laravel app to manage books, members and issue records.",
    tech: ["Laravel", "MySQL", "CSS"],
    demo: "https://example.com",
    code: "https://github.com/your-username/library-system"
  }
];
```

**Skills:** edit the `SKILLS` list in the same file. **Typing words:** edit `PROFILE.roles`.

**Colours:** change the variables at the top of `css/style.css` (`--bg`, `--accent`, `--ink` and so on).

## Deploy on GitHub Pages

1. Create a new repository on GitHub and upload all files from this folder.
2. Go to **Settings > Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, select the `main` branch and the `/ (root)` folder, then save.
4. After a minute, your site will be live at `https://your-username.github.io/repository-name/`.

## Tech stack

- HTML5
- CSS3 (custom properties, grid, flexbox, backdrop-filter)
- JavaScript (ES6, no libraries)
- Google Fonts: Plus Jakarta Sans, Figtree and JetBrains Mono

## About

Built by **Jagriti Prakash**, MCA (Year 1) at Graphic Era Deemed University. Completed BCA at Purnea University.
Skills: HTML, CSS, DBMS, Laravel, AI/ML and Cloud Computing.

## License

This project is open for personal use and learning. Add a license of your choice before sharing it as a template.
