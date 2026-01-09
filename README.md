# Zachary Baca - Software Engineer Portfolio

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![EmailJS](https://img.shields.io/badge/EmailJS-FP-orange?style=for-the-badge)

## 📖 About The Project

This project is a modern reconstruction of my personal portfolio, originally built with a **Node.js/Express/Pug** architecture. I have fully migrated the codebase to a **React Single Page Application (SPA)** powered by **Vite** to demonstrate fluency in the MERN stack ecosystem and modern frontend practices.

The application serves as a central hub to showcase my software engineering projects, offering detailed case studies, live demos, and code repository links for each.

### ✨ Key Features

* **Component-Based Architecture:** Replaced Pug templates with reusable functional React components (ProjectCard, Layout, Sidebar).
* **Client-Side Routing:** Utilizes `react-router-dom` (v6) for seamless navigation between projects and the about page without page reloads.
* **Custom Animations:** Features a custom "Push" sidebar navigation for mobile devices, mimicking the original CSS/JS transitions using React State.
* **Functional Contact Form:** Integrated **EmailJS** to handle form submissions directly from the browser, replacing the previous server-side Node.js mailer.
* **Responsive Design:** Fully responsive layout that adapts to mobile, tablet, and desktop viewports using custom CSS Grid and Flexbox.

## 🛠️ Built With

* **Framework:** [React.js](https://reactjs.org/) (v18)
* **Build Tool:** [Vite](https://vitejs.dev/)
* **Routing:** [React Router v6](https://reactrouter.com/)
* **Styling:** Custom CSS3 & Normalize.css
* **Email Service:** [EmailJS](https://www.emailjs.com/)

## 🚀 Getting Started

To run this project locally on your machine, follow these steps.

### Prerequisites

* npm

    ```sh
    npm install npm@latest -g
    ```

### Installation

1. Clone the repo

    ```sh
    git clone [https://github.com/zacharybaca/react-portfolio-v2.git](https://github.com/zacharybaca/react-portfolio-v2.git)
    ```

2. Install NPM packages

    ```sh
    npm install
    ```

3. Enter your EmailJS Public Key in `src/pages/About.jsx` (Optional for form functionality)

    ```js
    publicKey: 'YOUR_PUBLIC_KEY'
    ```

4. Start the development server

    ```sh
    npm run dev
    ```

## 📂 Project Structure

```text
src/
├── components/       # Reusable UI components
│   ├── Layout.jsx    # Main wrapper & mobile nav logic
│   ├── Sidebar.jsx   # Profile sidebar
│   └── ProjectCard.jsx # Grid item component
├── pages/            # Page-level components
│   ├── Home.jsx      # Portfolio grid
│   ├── About.jsx     # Bio, Skills, & Contact Form
│   └── ProjectDetail.jsx # Dynamic project pages
├── styles/           # Global CSS files
└── data.json         # Project data source
