const express = require('express');
const Team = require('../models/Team');
const Member = require('../models/Member');

const router = express.Router();

// Get all active team members and regular members (Public - no auth required)
router.get('/team', async (req, res) => {
  try {
    // Get team members (admin-added)
    const teamMembers = await Team.findAll({ is_active: true });
    
    // Get active regular members
    const regularMembers = await Member.findAll({ status: 'active', page: 1, limit: 100 });
    
    // Format team members
    const formattedTeamMembers = teamMembers.map(member => ({
      _id: member.id,
      name: member.name,
      position: member.designation,
      photo: member.photo_url,
      bio: member.bio,
      email: member.email,
      phone: member.phone,
      category: member.category || 'team_member',
      type: 'team_member'
    }));
    
    // Format regular members
    const formattedRegularMembers = regularMembers.members.map(member => ({
      _id: member.id,
      name: member.full_name,
      position: 'Member',
      photo: null, // Regular members don't have photos
      bio: null,
      email: member.email,
      phone: member.phone,
      category: 'regular_member',
      type: 'regular_member',
      memberId: member.member_id,
      membershipType: member.membership_type
    }));
    
    // Combine both types
    const allMembers = [...formattedTeamMembers, ...formattedRegularMembers];
    
    res.json({ 
      success: true, 
      team: allMembers,
      count: allMembers.length,
      teamMembersCount: formattedTeamMembers.length,
      regularMembersCount: formattedRegularMembers.length
    });
  } catch (error) {
    console.error('Public team fetch error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch team members',
      team: [] 
    });
  }
});

module.exports = router;