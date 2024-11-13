

  function updateProjectList(projects) {
    projectList.innerHTML = '';
  
    projects.forEach(project => {
      const card = document.createElement("div");
      card.classList.add("project-card");
  
      const image = document.createElement("img");
      image.src = project.image;
      image.alt = project.title;
      card.appendChild(image);
  
      const title = document.createElement("h2");
      title.textContent = project.title;
      card.appendChild(title);
  
      const description = document.createElement("p");
      description.classList.add("desc");
      description.textContent = project.description;
      card.appendChild(description);
  
      const tags = document.createElement("ul");
      tags.classList.add("tag-list");
      project.tags.forEach(tag => {
        const tagItem = document.createElement("li");
        tagItem.textContent = tag;
        tags.appendChild(tagItem);
      });
  
      const date = document.createElement("p");
      date.classList.add("date");
      date.textContent = project.date;
      card.appendChild(date);
  
      card.appendChild(tags);
  
      // Create modal for project with sliding image/video/article carousel
      const modal = document.createElement("div");
      modal.classList.add("modal");
  
      modal.innerHTML = `
        <div class="modal-content">
          <div class="modal-header">
            <h2>${project.title}</h2>
            <span class="close">&times;</span>
          </div>
          <div class="modal-body">
            <div class="left-column">
              <div class="carousel">
                <div class="carousel-content">
                  ${project.media.map(media => `
                    <div class="carousel-item" data-type="${media.type}">
                      ${media.type === "article" 
                        ? `
                          <img src="${media.image}" alt="${project.title}" />
                          <a href="${media.url}" target="_blank" class="view-article-button">View Article</a>
                        `
                        : `<${media.type === "video" ? "video autoplay loop muted" : "img"} src="${media.url}" 
                            ${media.type === "video" ? "controls autoplay muted loop" : ""} 
                            alt="${project.title}" />`
                      }
                    </div>`).join('')}
                </div>
                <div class="carousel-label">Image</div>
                <button class="prev">&#10094;</button>
                <button class="next">&#10095;</button>
              </div>
              <ul class="tag-list">
                ${project.tags.map(tag => `<li>${tag}</li>`).join('')}
              </ul>
              <div class="links">
                <a href="${project.github}" target="_blank">View on GitHub</a>
                ${project.video ? `<a href="${project.video}" target="_blank">Watch Demo</a>` : ''}
              </div>
            </div>
            <div class="right-column">
              <p>${project.longDescription || "No detailed description available."}</p>
            </div>
          </div>
        </div>
      `;
  
      modalView.appendChild(modal);
  
      // Carousel Functionality
      const carouselContent = modal.querySelector('.carousel-content');
      const carouselItems = modal.querySelectorAll('.carousel-item');
      const label = modal.querySelector('.carousel-label');
      let currentSlide = 0;
      let autoSlideInterval;
  
      function showSlide(index) {
        currentSlide = (index + carouselItems.length) % carouselItems.length;
        carouselContent.style.transform = `translateX(-${currentSlide * 100}%)`;
        const type = carouselItems[currentSlide].getAttribute("data-type");
        label.textContent = type.charAt(0).toUpperCase() + type.slice(1);
  
        // Set label to be clickable for articles
        if (type === "article") {
          label.classList.add("clickable");
          label.onclick = () => window.open(carouselItems[currentSlide].querySelector(".view-article-button").href, "_blank");
        } else {
          label.classList.remove("clickable");
          label.onclick = null;
        }
      }
  
      function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
          showSlide(currentSlide + 1);
        }, 5000); // Change slide every 5 seconds
      }
  
      function stopAutoSlide() {
        clearInterval(autoSlideInterval);
      }
  
      modal.querySelector('.next').onclick = () => {
        showSlide(currentSlide + 1);
        stopAutoSlide(); // Stops auto-slide on manual control
        startAutoSlide(); // Restart auto-slide after manual control
      };
      
      modal.querySelector('.prev').onclick = () => {
        showSlide(currentSlide - 1);
        stopAutoSlide();
        startAutoSlide();
      };
  
      // Start auto-sliding on modal open and set up autoplay
      card.addEventListener('click', () => {
        modal.style.display = "flex";
        showSlide(0); // Reset carousel on open
        startAutoSlide();
      });
  
      // Close modal and stop auto-slide
      const close = modal.querySelector(".close");
      close.onclick = () => {
        modal.style.display = "none";
        stopAutoSlide();
      };
  
      projectList.appendChild(card);
    });
  }


const projectList = document.getElementById("project-list");
const modalView = document.getElementById("modal-view");
let allProjects = [];

fetch("data/project-data.json")
  .then((response) => response.json())
  .then((data) => {
    allProjects = data.projects;

    // Sort projects by date from latest to oldest
    allProjects.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB - dateA; // Compare in descending order
    });

    // Render all project cards
    updateProjectList(allProjects);
});



const blogList = document.getElementById("blog-list");
let allBlogs = [];

// Fetch the blog data (replace 'data/blog-data.json' with your actual data path)
fetch("data/blog-data.json")
  .then((response) => response.json())
  .then((data) => {
    // Parse and sort the blogs by date (latest to oldest)
    allBlogs = data.blogs.sort((a, b) => {
      const dateA = new Date(`${a.date} 01`); // Add day to parse date
      const dateB = new Date(`${b.date} 01`);
      return dateB - dateA; // Sort in descending order
    });

    // Render all blog cards
    updateBlogList(allBlogs);
  });

function updateBlogList(blogs) {
  blogList.innerHTML = '';

  blogs.forEach(blog => {
    const card = document.createElement("div");
    card.classList.add("blog-card");

    // Make the entire card clickable by adding an event listener
    card.addEventListener('click', () => {
      window.open(blog.url, '_blank'); // Open the blog link in a new tab
    });

    const image = document.createElement("img");
    image.src = blog.image;
    image.alt = blog.title;
    card.appendChild(image);

    const title = document.createElement("h2");
    title.textContent = blog.title;
    card.appendChild(title);

    const description = document.createElement("p");
    description.classList.add("desc");
    description.textContent = blog.description;
    card.appendChild(description);

    const date = document.createElement("p");
    date.classList.add("date");
    date.textContent = blog.date;
    card.appendChild(date);

    // Append the card to the blog list
    blogList.appendChild(card);
  });
}


  const skillsContainer = document.getElementById('skills-container');
  fetch('data/skills.json')
  .then((response)=>response.json())
  .then((data)=>{
    const skills = data.skills;

    skills.forEach((skill)=>{
      console.log("Reading Json")
      const skill_card=document.createElement("div");
      skill_card.classList.add("skill-card");
      const icon=document.createElement("i");
      icon.classList.add(skill.icon);
      skill_card.appendChild(icon);
      const title=document.createElement("h3");
      const des=document.createElement("p");
      const meter=document.createElement("meter");
      title.textContent=skill.title;
      des.textContent=skill.description;
      skill_card.append(title);
      skill_card.append(des);
      skill_card.append(meter);
      meter.min="0";
      meter.max="1";
      meter.value=skill.level;
      
      skillsContainer.appendChild(skill_card);

    });
  });
  $(document).ready(function(){
    $('.carousel').slick({
      autoplay: true,
      autoplaySpeed: 3000,
      dots: true,
      infinite: true,
      speed: 500,
      fade: true,
      cssEase: 'linear'
    });
  });

// setInterval(changeBackgroundImage, 3000); // Change image every 3 seconds
const aboutVideo = document.querySelector('#about-video');
const aboutImageOverlay = document.querySelector('.about-image-overlay');
const videoSources = [
    '../images/videos/aloha.mp4',
    '../images/videos/b2.mp4',
    '../images/videos/robocon3.mp4',
    '../images/videos/robocon2.mp4',
    '../images/videos/robocon4.mp4',
    '../images/videos/robocon5.mp4',
    '../images/videos/autorobot.mp4',
    '../images/videos/drne.mp4',
    '../images/videos/ariac.mp4',
    '../images/videos/quadruped.mp4',
    '../images/videos/auto_vehicle.mp4',
    '../images/videos/firefly.mp4',
]; // Replace with your actual video paths
let videoIndex = 0;

// Function to smoothly change the video source with a fade transition
function changeBackgroundVideo() {
  aboutVideo.style.opacity = '0'; // Fade out current video
  setTimeout(() => {
      videoIndex = (videoIndex + 1) % videoSources.length;
      aboutVideo.src = videoSources[videoIndex];
      aboutVideo.play();
      aboutVideo.style.opacity = '1'; // Fade in new video
  }, 1000); // Wait for fade-out transition to complete
}

// Start with the image overlay, then fade it out and start the video slideshow
setTimeout(() => {
  aboutImageOverlay.style.opacity = '0'; // Fade out the image overlay
  aboutVideo.style.opacity = '1'; // Fade in the video
  aboutVideo.src = videoSources[videoIndex];
  aboutVideo.play();

  // Start the video slideshow with smooth transitions after the initial fade-in
  setInterval(changeBackgroundVideo, 6000); // Interval slightly longer than video switch delay
}, 1500); // Initial 1-second delay to display the image



function openModal() {
  document.getElementById("resumeModal").style.display = "block";
}

function closeModal() {
  document.getElementById("resumeModal").style.display = "none";
}

// Close the modal if the user clicks outside of it
window.onclick = function(event) {
  const modal = document.getElementById("resumeModal");
  if (event.target === modal) {
      modal.style.display = "none";
  }
}

// Select elements
const aboutContent = document.querySelector('.about-content');
const workCards = document.querySelectorAll('.work-card');
const educationCards = document.querySelectorAll('.education-card');
let projectCards; // Declare projectCards here to make it accessible globally
let blogCards;

// Use setTimeout to wait for project cards to be added to the DOM
setTimeout(() => {
  projectCards = document.querySelectorAll('.project-card'); // Assign the NodeList to the global variable
  console.log("projectCards after delay:", projectCards); // Check if elements exist after a delay
  blogCards = document.querySelectorAll('.blog-card');
}, 100);

// Check if element is at least partially in view
function isElementInView(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top < (window.innerHeight || document.documentElement.clientHeight) + 100 &&
        rect.bottom > -1000
    );
}

// Handle scroll and toggle "in-view" class for both aboutContent and workCards
function handleScroll() {
    // Handle .about-content visibility
    if (isElementInView(aboutContent)) {
        aboutContent.classList.add('in-view');
        aboutContent.classList.remove('out-of-view');
    } else {
        aboutContent.classList.remove('in-view');
        aboutContent.classList.add('out-of-view');
    }

    // Handle each .work-card visibility
    workCards.forEach(card => {
        if (isElementInView(card)) {
            card.classList.add('in-view');
        } else {
            card.classList.remove('in-view');
        }
    });

    // Handle each .education-card visibility
    educationCards.forEach(card => {
        if (isElementInView(card)) {
            card.classList.add('in-view');
            console.log('Element in view:', card); // Debug line
        } else {
            card.classList.remove('in-view');
        }
    });

    // Handle each .project-card visibility, ensuring projectCards is defined
    if (projectCards) {
        projectCards.forEach((card,index) => {
            if (isElementInView(card)) {
              setTimeout(() => {
                card.classList.add('in-view');
                console.log('Element in view:', card); // Debug line
            }, index * 100); // 100ms delay per card, adjust for slower or faster delay
            } else {
                card.classList.remove('in-view');
            }
        });
    }

    if (blogCards) {
      blogCards.forEach((card,index) => {
          if (isElementInView(card)) {
            setTimeout(() => {
              card.classList.add('in-view');
              console.log('Element in view:', card); // Debug line
          }, index * 100); // 100ms delay per card, adjust for slower or faster delay
          } else {
              card.classList.remove('in-view');
          }
      });
  }
}

// Throttle function to limit the frequency of scroll and resize events
function throttle(fn, delay) {
    let lastCall = 0;
    return function (...args) {
        const now = new Date().getTime();
        if (now - lastCall < delay) return;
        lastCall = now;
        return fn(...args);
    };
}

// Add throttled scroll and resize event listeners
const throttledHandleScroll = throttle(handleScroll, 100);
window.addEventListener('scroll', throttledHandleScroll);
window.addEventListener('resize', throttledHandleScroll); // Ensures responsiveness on resize

