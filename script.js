'use strict';

///////////////////////////////////////
// Modal window
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const dotContainer = document.querySelector('.dots');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

//That's an old-school method:
// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

//Better way of looping:
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});
///////////////////////////////////////
///////////////////////////////////////
//Page Navigation
// document.querySelectorAll('.nav__link').forEach(function (link) {
//   link.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href'); //'#section--?'
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

//Event delegation:
//1.Add event to all elements .nav--links
//2.Determine what element originated the element
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  //Matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href'); //'#section--?'
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

///////////////////////////////////////
///////////////////////////////////////
//Implementing Smooth Scrolling

//.btn--scroll-to
const btnScrollTo = document.querySelector('.btn--scroll-to');
//#section--1
const section1 = document.querySelector('#section--1');

btnScrollTo.addEventListener('click', function (e) {
  // const s1coords = section1.getBoundingClientRect();

  //Scrooling:
  // window.scrollTo(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // );

  //Better to create an object for scrooling:
  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  //Even better scrolling method:
  section1.scrollIntoView({ behavior: 'smooth' }); //***
});

//Building a Tabbed Component

//Selections:
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

//Operations:
//Bad practice:
// tabs.forEach(el => el.addEventListener('click', () => console.log('TAB')));

//Good practice:
tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  console.log(clicked);

  //Guard clause. If nothing is clicked finish function.
  if (!clicked) return;

  //Diactivate tab
  tabsContent.forEach(con =>
    con.classList.remove('operations__content--active')
  );
  tabs.forEach(t => t.classList.remove('operations__tab--active'));

  //Activate Tab
  clicked.classList.add('operations__tab--active');
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//Here in event we will not use 'click', instead we gonna use 'mouseover'. It is actually same as 'mousecenter' with one big difference - 'mouseover' can bable.
//Menu fade animation
const nav = document.querySelector('.nav');

const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const linked = e.target;
    const siblings = linked.closest('.nav').querySelectorAll('.nav__link');
    const logo = linked.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== linked) {
        el.style.opacity = this;
      }
    });
    logo.style.opacity = this;
  }
};

nav.addEventListener('mouseover', handleHover.bind(0.5));

nav.addEventListener('mouseout', handleHover.bind(1));

//Sticky Navigation

/*
const callback = function (entries, observer) {
  entries.forEach(entry => console.log(entry));
}; //This callBack function will be called as soon as target will intersect the root element at the threshold specified point.

const options = {
  root: null, //root is an element that we want to intersects with a target. By saying null we define that an element will be simply entire viewport.
  threshold: [0, 0.2],
};

const observer = new IntersectionObserver(callback, options);
observer.observe(section1); //section1 is a target
*/

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height; //90

const obsCallback = function (entries, _) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  if (entry.isIntersecting) nav.classList.remove('sticky');
};

const obsOpt = {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`, //This actually add/remove certain margin to our root
};

const obsHeader = new IntersectionObserver(obsCallback, obsOpt);
obsHeader.observe(header);

//Reveal Sections
const allSections = document.querySelectorAll('.section');

const obsCallBackSec = function (entries, observer) {
  const [entry] = entries;

  //Guard
  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(obsCallBackSec, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

//Lazy loading images
//We need only images with 'data-src' parameter.
const imgTarget = document.querySelectorAll('img[data-src]');

function imgCallBackObs(entries, observer) {
  const [entry] = entries;

  //Guard
  if (!entry.isIntersecting) return;

  //Replacing src with data-src
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
}

const imgObserver = new IntersectionObserver(imgCallBackObs, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTarget.forEach(target => imgObserver.observe(target));

//Slider
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const slider = document.querySelector('.slider');

  const btnSliderLeft = document.querySelector('.slider__btn--left');
  const btnSliderRight = document.querySelector('.slider__btn--right');

  const maxSlide = slides.length;
  let currentSlide = 0;

  slider.style.overflow = 'visible';

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };
  goToSlide(0);

  const nextSlide = function () {
    if (currentSlide > maxSlide - 1) {
      currentSlide = 0;
    } else {
      currentSlide++;
    }
    goToSlide(currentSlide);
    activateDot(currentSlide);
  };

  const prevSlide = function () {
    if (currentSlide === 0) {
      currentSlide = maxSlide - 1;
    } else {
      currentSlide--;
    }
    goToSlide(currentSlide);
    activateDot(currentSlide);
  };

  //Next Slide
  btnSliderRight.addEventListener('click', nextSlide);
  //Prev Slide
  btnSliderLeft.addEventListener('click', prevSlide);

  //Attaching keyboard
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  //Dots
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class='dots__dot' data-slide='${i}'></button>`
      );
    });
  };

  createDots();

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));
    document
      .querySelector(`.dots__dot[data-slide='${slide}']`)
      .classList.add('dots__dot--active');
  };

  activateDot(0);

  //using event delegation
  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();
/*
///////////////////////////////////////
///////////////////////////////////////
//Types of Events and Event Handlers
///////////////////////////////////////
//Besides 'click' we can use 'mouseenter' event:
const h1 = document.querySelector('h1');
const alertH1 = function () {
  alert(`Son of the holy mom!`);
};

h1.addEventListener('mouseenter', alertH1);

//old school
// h1.onmouseenter = function () {
//   alert(`Son of the holy mom double!`);
// };

//Remove event listener after 3 sec
setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 3000);

///////////////////////////////////////
///////////////////////////////////////
//Event Propagation in Practice
///////////////////////////////////////

//click event (or any others) are happening with propogation to all elements, f/ex: nav -> navLinks -> link

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const randomColor = () =>
  `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

document.querySelector('.nav__link').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log(e.target, e.currentTarget);
  //We can stop event propogation👇🏻
  e.stopPropagation();
});

document.querySelector('.nav__links').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log(e.target, e.currentTarget);
});

document.querySelector('.nav').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log(e.target, e.currentTarget);
});

///////////////////////////////////////
///////////////////////////////////////
//Selecting, creating and deleting elements.

//Selecting elements
console.log(document.documentElement); //Just selecting 'document' in order to get html is not enough. Always use documentElement!

console.log(document.body); //To get just 'body' of entire html.

console.log(document.head); //To get 'head'.

console.log(document.querySelector('.header')); //To get first element of .header class.

const allSections = document.querySelectorAll('.section'); //To get all elements of a '.section' class.

document.getElementById('section--1'); //To get element by its ID.

const allButtons = document.getElementsByTagName('button'); //getElementsByTagName method returns so called HTMLCollection rather than NodeList(as querySelectorAll does) and this HTMLCollection is LIVE, if we will delete f/ex one button it will be shown in this particular list.

console.log(allButtons);

console.log(document.getElementsByClassName('btn')); //Also will return HTMLCOllection (LIVE).

//Creating and inserting elements

// .insertAdjacentHTML //Approach that we did in a Bankist App.

const message = document.createElement('div');//We created a div element.

message.classList.add('cookie-message');//Added special class ti it.

// message.textContent = `We use cookies to improve functionality and analytics`; just message

message.innerHTML = `We use cookies to improve functionality and analytics.<button class="btn btn--close-cookie">Got it!</button>`; html itself

//And now we can insert all this to our html.
const header = document.querySelector('.header');

//header.prepend(message); //Prepanding is basically adds first child to the selected element.

header.append(message); //Appending is adding last child to the selected element.//appendChild

//'message' element that we prepand and append unique. So it can be only in one place. If we want to have 'message' in two places at the same time we should clone it, as below:
// header.append(message.cloneNode(true));

//Moreover there's two other methods: before and after. So the 'message' will appear exactly before 'header' element and exactly 'after'
// header.before(message);
// header.after(message);

//DELETING elements

document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    message.remove(); //We simply can write that
  });

///////////////////////////////////////
///////////////////////////////////////
//Styles, Attributes and Classes.

//Styles
message.style.backgroundColor = '#37383d';
message.style.width = '120%';

//We can see in a console only that syles which we set manually, because they are inline style (we can see them in html elements).

console.log(message.style.backgroundColor); //work
console.log(message.style.color); //does NOT work

//However if we want to get all styles we can use:
console.log(getComputedStyle(message));

//or specific one:
console.log(getComputedStyle(message).color);

//Let us change the height of 'message' simply adding 30px:
message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';

//setProperty method
//If we want to set a specific property to style we can use that:
document.documentElement.style.setProperty('--color-primary', 'grey');

//ATTRIBUTES
const logo = document.querySelector('.nav__logo');
//Now we can access to attributes. NOTE: We can access to the attributes only if its standard ones.

//We can access to:
console.log(logo.alt);

//We CANNOT access to this:
console.log(logo.designer); //undefined

//But we can do this:
console.log(logo.1('designer')); //Sultik-multik
console.log(logo.setAttribute('company', 'Bankist')); //new attribute

//We can manipulate with attributes:
logo.alt = 'Beautiful Bankist';

//Regarding to 'img' with an attribute of 'src'. There's two ways of getting that: 'absolute version' and 'relative version'.

console.log(logo.src); // - absolute
console.log(logo.getAttribute('src')); // - relative

//Same for href
const link = document.querySelector('.nav__link--btn');

console.log(link.href); // - absolute
console.log(link.getAttribute('href')); // - relative

//Data attributes
console.log(logo.dataset.versionNumber); //3.0

//Classes
logo.classList.add('class');
logo.classList.remove('class');
logo.classList.toggle('class');
logo.classList.contains('class');


///////////////////////////////////////
///////////////////////////////////////
//DOM Traversing

const h1 = document.querySelector('h1');

//CHILD
console.log(h1.querySelectorAll('.highlight'));
console.log(h1.childNodes);

//More useful👇🏻
console.log(h1.children);

//we can manipulate with it:
h1.firstElementChild.style.color = 'white';
h1.lastElementChild.style.color = 'orangered';

//PARENTS
console.log(h1.parentNode);
h1.closest('.header').style.background = 'var(--gradient-secondary)';
h1.closest('h1').style.background = 'pink';

//SIBLINGS
console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);

//To get all childrens
console.log(h1.parentElement.children);
[...h1.parentElement.children].forEach(el => {
  if (el !== h1) {
    el.style.transform = 'scale(0.5)';
  }
});
*/

//LIFECYCLE DOM EVENT

document.addEventListener('DOMContentLoaded', function (e) {
  console.log('DOM HTML JS', e);
});

window.addEventListener('load', function (e) {
  console.log('Page fully load', e);
});

//Before leaving site. Message asking

// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault();
//   console.log(e);
//   e.returnValue = '';
// });
