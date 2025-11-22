const express = require('express');
const router = express.Router();

// Organization info
router.get('/info', (req, res) => {
  res.json({
    name: process.env.ORG_NAME,
    address: process.env.ORG_ADDRESS,
    email: process.env.ORG_EMAIL,
    phone: process.env.ORG_PHONE
  });
});

// Team members data
router.get('/team', (req, res) => {
  const teamMembers = [
    {
      id: 1,
      name: 'Shri Ajit Ray',
      position: 'Founder',
      image: '/images/p1.jpeg',
      description: 'A devoted follower of Sanatan Sanskriti committed to serving society through dharma, awareness, and compassion.'
    },
    {
      id: 2,
      name: 'Shri Dinesh Bairagi',
      position: 'Founder',
      image: '/images/p2.jpeg',
      description: 'A spiritual thinker and scholar guiding the Sangathan\'s cultural preservation and Sanatan awareness programs.'
    },
    {
      id: 3,
      name: 'Shri Shreebash Halder',
      position: 'Founder',
      image: '/images/p3.jpeg',
      description: 'Dedicated to executing social welfare activities, charity drives, and community upliftment programs.'
    },
    {
      id: 4,
      name: 'Shri Goutam Chandra Biswas',
      position: 'Founder',
      image: '/images/p4.jpeg',
      description: 'Works closely with the next generation to promote dharmic values and leadership development.'
    }
  ];
  
  res.json(teamMembers);
});

// Gallery images
router.get('/gallery', (req, res) => {
  const galleryImages = [
    { id: 1, url: '/images/photo1.jpeg', caption: 'Community Service Program' },
    { id: 2, url: '/images/photo2.jpeg', caption: 'Cultural Event' },
    { id: 3, url: '/images/photo3.jpeg', caption: 'Educational Initiative' },
    { id: 4, url: '/images/photo4.jpeg', caption: 'Spiritual Gathering' },
    { id: 5, url: '/images/photo5.jpeg', caption: 'Charity Drive' }
  ];
  
  res.json(galleryImages);
});

// Activities data
router.get('/activities', (req, res) => {
  const activities = [
    {
      id: 1,
      title: 'Educational Programs',
      description: 'Promoting education and literacy in underserved communities',
      icon: 'fas fa-graduation-cap'
    },
    {
      id: 2,
      title: 'Healthcare Services',
      description: 'Providing medical assistance and health awareness programs',
      icon: 'fas fa-heartbeat'
    },
    {
      id: 3,
      title: 'Cultural Preservation',
      description: 'Preserving and promoting Sanatan Dharma traditions and values',
      icon: 'fas fa-om'
    },
    {
      id: 4,
      title: 'Community Development',
      description: 'Empowering communities through various development initiatives',
      icon: 'fas fa-hands-helping'
    }
  ];
  
  res.json(activities);
});

module.exports = router;