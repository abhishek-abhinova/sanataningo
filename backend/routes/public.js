const express = require('express');
const router = express.Router();

// Organization info
router.get('/info', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.json({
    name: process.env.ORG_NAME,
    address: process.env.ORG_ADDRESS,
    email: process.env.ORG_EMAIL,
    phone: process.env.ORG_PHONE
  });
});

// Team members data
router.get('/team', async (req, res) => {
  try {
    const Team = require('../models/Team');
    const { homepage, about } = req.query;
    const filter = { active: true };
    
    if (homepage === 'true') filter.showOnHomepage = true;
    if (about === 'true') filter.showOnAbout = true;
    
    const team = await Team.find(filter).sort({ order: 1, createdAt: -1 });
    
    // Fallback to static data if no team members in database
    if (team.length === 0) {
      const teamMembers = [
    // Founder
    {
      id: 1,
      name: 'Shri Goutam Chandra Biswas',
      position: 'Founder & President',
      image: '/images/p4.jpeg',
      description: 'Visionary founder dedicated to preserving Sanatan Dharma values and serving humanity through compassionate leadership.'
    },
    // Trustees
    {
      id: 2,
      name: 'Shri Ajit Ray',
      position: 'Trustee',
      image: '/images/p1.jpeg',
      description: 'A devoted follower of Sanatan Sanskriti committed to serving society through dharma, awareness, and compassion.'
    },
    {
      id: 3,
      name: 'Shri Dinesh Bairagi',
      position: 'Trustee',
      image: '/images/p2.jpeg',
      description: 'A spiritual thinker and scholar guiding the Sangathan\'s cultural preservation and Sanatan awareness programs.'
    },
    {
      id: 4,
      name: 'Shri Shreebash Halder',
      position: 'Trustee',
      image: '/images/p3.jpeg',
      description: 'Dedicated to executing social welfare activities, charity drives, and community upliftment programs.'
    },
    // Executive Committee Members (in correct order)
    {
      id: 5,
      name: 'Shri Amiyo Govinda Biswas',
      position: 'Executive Member',
      image: '/images/amiyo-govinda-biswas.jpeg',
      description: 'Dedicated to organizational development and strategic planning for community welfare.'
    },
    {
      id: 6,
      name: 'Shri Pratap Malik',
      position: 'Executive Member',
      image: '/images/pratap-malik.jpeg',
      description: 'Specialist in event management and cultural program coordination.'
    },
    {
      id: 7,
      name: 'Shri Tarak Chandra Pal',
      position: 'Executive Member',
      image: '/images/tarak-chandra-pal.jpeg',
      description: 'Expert in strategic planning and organizational development.'
    },
    {
      id: 8,
      name: 'Dr. Uttam Kumar Biswas',
      position: 'Executive Member',
      image: '/images/dr.-uttam-kumar-biswas.jpeg',
      description: 'Medical professional contributing to healthcare initiatives and community wellness programs.'
    },
    {
      id: 9,
      name: 'Shri Bijon Biswas',
      position: 'Executive Member',
      image: '/images/bijan-biswas.jpeg',
      description: 'Committed to cultural preservation and traditional value promotion.'
    },
    {
      id: 10,
      name: 'Shri Arun Kumar Biswas',
      position: 'Executive Member',
      image: '/images/arun-kumar-biswas.jpeg',
      description: 'Focused on educational initiatives and youth development programs.'
    },
    {
      id: 11,
      name: 'Shri Sudin Biswas',
      position: 'Executive Member',
      image: '/images/sudin-biswas-noida.jpeg',
      description: 'Regional coordinator for Noida activities and local community programs.'
    },
    {
      id: 12,
      name: 'Shri Aleep Biswas',
      position: 'Executive Member',
      image: '/images/aleep-biswas.jpeg',
      description: 'Committed to educational initiatives and skill development programs.'
    },
    {
      id: 13,
      name: 'Shri Shyamlal Chaudhary',
      position: 'Executive Member',
      image: '/images/Shyamlalchaudhary.jpeg',
      description: 'Dedicated to community service and social welfare initiatives.'
    },
    {
      id: 14,
      name: 'Shri Tapash Biswas',
      position: 'Executive Member',
      image: '/images/tapash-biswas.jpeg',
      description: 'Expert in community development and outreach programs.'
    },
    {
      id: 15,
      name: 'Shri Pronit Roy',
      position: 'Executive Member',
      image: '/images/pronit-roy.jpeg',
      description: 'Expert in communication and public relations management.'
    },
    {
      id: 16,
      name: 'Shri Mrinal Biswas',
      position: 'Executive Member',
      image: '/images/mrinal-kanti-biswas.jpeg',
      description: 'Dedicated to financial management and resource mobilization.'
    },
    {
      id: 17,
      name: 'Shri Deepu Sarkar',
      position: 'Executive Member',
      image: '/images/mr.-deepu-sarkar.jpeg',
      description: 'Expert in organizational management and administrative coordination.'
    },
    {
      id: 18,
      name: 'Shri Neuton Roy',
      position: 'Executive Member',
      image: '/images/neuton-roy.jpeg',
      description: 'Focused on technology integration and digital outreach initiatives.'
    },
    {
      id: 19,
      name: 'Shri Somenath Biswas',
      position: 'Executive Member',
      image: '/images/mr-somenath-biswas.jpeg',
      description: 'Specialist in community engagement and social welfare coordination.'
    },
    {
      id: 20,
      name: 'Shri Bijon Kumar Biswas',
      position: 'Executive Member',
      image: '/images/bijon-kumar-biswas-delhi.jpeg',
      description: 'Regional coordinator for Delhi activities and community outreach programs.'
    },
    {
      id: 21,
      name: 'Shri Subash Biswas Somendra',
      position: 'Executive Member',
      image: '/images/subhash-kumar.jpeg',
      description: 'Dedicated to community service and volunteer coordination.'
    },
    {
      id: 22,
      name: 'Shri Somendra Srivastava',
      position: 'Executive Member',
      image: '/images/somendra-srivastava.jpeg',
      description: 'Focused on legal affairs and compliance management.'
    },
    {
      id: 23,
      name: 'Dr. Shyama Shree Chaki',
      position: 'Executive Member',
      image: '/images/drshyamasreechaki.jpeg',
      description: 'Medical professional dedicated to healthcare and wellness programs.'
    }
      ];
      return res.json(teamMembers);
    }
    
    res.json(team);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch team data' });
  }
});

// Gallery images
router.get('/gallery', async (req, res) => {
  try {
    const Gallery = require('../models/Gallery');
    const { homepage } = req.query;
    const filter = { published: true };
    
    if (homepage === 'true') filter.showOnHomepage = true;
    
    const images = await Gallery.find(filter).sort({ createdAt: -1 });
    
    // Fallback to static data if no images in database
    if (images.length === 0) {
      const galleryImages = [
        { id: 1, url: '/images/photo1.jpeg', caption: 'Community Service Program' },
        { id: 2, url: '/images/photo2.jpeg', caption: 'Cultural Event' },
        { id: 3, url: '/images/photo3.jpeg', caption: 'Educational Initiative' },
        { id: 4, url: '/images/photo4.jpeg', caption: 'Spiritual Gathering' },
        { id: 5, url: '/images/photo5.jpeg', caption: 'Charity Drive' }
      ];
      return res.json(galleryImages);
    }
    
    res.json({ images });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch gallery images' });
  }
});

// Trustees data
router.get('/trustees', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const trustees = [
    {
      id: 1,
      name: 'Shri Goutam Chandra Biswas',
      position: 'Founder & President',
      image: '/images/p4.jpeg',
      description: 'Visionary founder dedicated to preserving Sanatan Dharma values and serving humanity through compassionate leadership.'
    },
    {
      id: 2,
      name: 'Shri Ajit Ray',
      position: 'Trustee',
      image: '/images/p1.jpeg',
      description: 'A devoted follower of Sanatan Sanskriti committed to serving society through dharma, awareness, and compassion.'
    },
    {
      id: 3,
      name: 'Shri Dinesh Bairagi',
      position: 'Trustee',
      image: '/images/p2.jpeg',
      description: 'A spiritual thinker and scholar guiding the Sangathan\'s cultural preservation and Sanatan awareness programs.'
    },
    {
      id: 4,
      name: 'Shri Shreebash Halder',
      position: 'Trustee',
      image: '/images/p3.jpeg',
      description: 'Dedicated to executing social welfare activities, charity drives, and community upliftment programs.'
    }
  ];
  
  res.json(trustees);
});

// Executive members data
router.get('/executives', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const executives = [
    {
      id: 5,
      name: 'Shri Amiyo Govinda Biswas',
      position: 'Executive Member',
      image: '/images/amiyo-govinda-biswas.jpeg',
      description: 'Dedicated to organizational development and strategic planning for community welfare.'
    },
    {
      id: 6,
      name: 'Shri Pratap Malik',
      position: 'Executive Member',
      image: '/images/pratap-malik.jpeg',
      description: 'Specialist in event management and cultural program coordination.'
    },
    {
      id: 7,
      name: 'Shri Tarak Chandra Pal',
      position: 'Executive Member',
      image: '/images/tarak-chandra-pal.jpeg',
      description: 'Expert in strategic planning and organizational development.'
    },
    {
      id: 8,
      name: 'Dr. Uttam Kumar Biswas',
      position: 'Executive Member',
      image: '/images/dr.-uttam-kumar-biswas.jpeg',
      description: 'Medical professional contributing to healthcare initiatives and community wellness programs.'
    },
    {
      id: 9,
      name: 'Shri Bijon Biswas',
      position: 'Executive Member',
      image: '/images/bijan-biswas.jpeg',
      description: 'Committed to cultural preservation and traditional value promotion.'
    },
    {
      id: 10,
      name: 'Shri Arun Kumar Biswas',
      position: 'Executive Member',
      image: '/images/arun-kumar-biswas.jpeg',
      description: 'Focused on educational initiatives and youth development programs.'
    },
    {
      id: 11,
      name: 'Shri Sudin Biswas',
      position: 'Executive Member',
      image: '/images/sudin-biswas-noida.jpeg',
      description: 'Regional coordinator for Noida activities and local community programs.'
    },
    {
      id: 12,
      name: 'Shri Aleep Biswas',
      position: 'Executive Member',
      image: '/images/aleep-biswas.jpeg',
      description: 'Committed to educational initiatives and skill development programs.'
    },
    {
      id: 13,
      name: 'Shri Shyamlal Chaudhary',
      position: 'Executive Member',
      image: '/images/Shyamlalchaudhary.jpeg',
      description: 'Dedicated to community service and social welfare initiatives.'
    },
    {
      id: 14,
      name: 'Shri Tapash Biswas',
      position: 'Executive Member',
      image: '/images/tapash-biswas.jpeg',
      description: 'Expert in community development and outreach programs.'
    },
    {
      id: 15,
      name: 'Shri Pronit Roy',
      position: 'Executive Member',
      image: '/images/pronit-roy.jpeg',
      description: 'Expert in communication and public relations management.'
    },
    {
      id: 16,
      name: 'Shri Mrinal Biswas',
      position: 'Executive Member',
      image: '/images/mrinal-kanti-biswas.jpeg',
      description: 'Dedicated to financial management and resource mobilization.'
    },
    {
      id: 17,
      name: 'Shri Deepu Sarkar',
      position: 'Executive Member',
      image: '/images/mr.-deepu-sarkar.jpeg',
      description: 'Expert in organizational management and administrative coordination.'
    },
    {
      id: 18,
      name: 'Shri Neuton Roy',
      position: 'Executive Member',
      image: '/images/neuton-roy.jpeg',
      description: 'Focused on technology integration and digital outreach initiatives.'
    },
    {
      id: 19,
      name: 'Shri Somenath Biswas',
      position: 'Executive Member',
      image: '/images/mr-somenath-biswas.jpeg',
      description: 'Specialist in community engagement and social welfare coordination.'
    },
    {
      id: 20,
      name: 'Shri Bijon Kumar Biswas',
      position: 'Executive Member',
      image: '/images/bijon-kumar-biswas-delhi.jpeg',
      description: 'Regional coordinator for Delhi activities and community outreach programs.'
    },
    {
      id: 21,
      name: 'Shri Subash Biswas Somendra',
      position: 'Executive Member',
      image: '/images/subhash-kumar.jpeg',
      description: 'Dedicated to community service and volunteer coordination.'
    },
    {
      id: 22,
      name: 'Shri Somendra Srivastava',
      position: 'Executive Member',
      image: '/images/somendra-srivastava.jpeg',
      description: 'Focused on legal affairs and compliance management.'
    },
    {
      id: 23,
      name: 'Dr. Shyama Shree Chaki',
      position: 'Executive Member',
      image: '/images/drshyamasreechaki.jpeg',
      description: 'Medical professional dedicated to healthcare and wellness programs.'
    }
  ];
  
  res.json(executives);
});

// Activities data
router.get('/activities', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
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