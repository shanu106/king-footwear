const express = require('express');    
const router = express.Router();
const axios = require('axios');
const isLoggedin = require('../middlewares/isLoggedin');

// POST /check-pincode
router.post('/check-pincode', isLoggedin, async (req, res) => {
  console.log('Received pincode check request:', req.body)
  try {
    const { pincode } = req.body
    
    if (!pincode) {
      return res.status(400).json({ isServiceable: false, message: 'Pincode is required' })
    }
    
    const delhivery_url = `https://track.delhivery.com/c/api/pin-codes/json/?filter_codes=${pincode}`
    
    const response = await axios.get(delhivery_url, {
      headers: {
        "Authorization": `Token ${process.env.DELHIVERY_API_KEY}`
      }
    })
    
    const isServiceable = response.data.delivery_codes && response.data.delivery_codes.length > 0
    
    res.json({ 
      isServiceable,
      pincode,
      message: isServiceable ? 'Pincode is serviceable' : 'Pincode is not serviceable'
    })
  } catch (error) {
    console.error('Pincode check error:', error)
    res.status(500).json({ isServiceable: false, message: 'Error checking pincode' })
  }
})



module.exports = router;