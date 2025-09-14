const express = require('express');
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const Pharmacy = require('../models/Pharmacy');
const Medicine = require('../models/Medicine');

const router = express.Router();

// Get all pharmacies
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10, search, village } = req.query;
    const query = { isActive: true };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { owner: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (village) {
      query['address.village'] = { $regex: village, $options: 'i' };
    }

    const pharmacies = await Pharmacy.find(query)
      .select('name owner phone address workingHours')
      .sort({ name: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Pharmacy.countDocuments(query);

    res.json({
      pharmacies,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Pharmacies fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch pharmacies', error: error.message });
  }
});

// Get pharmacy by ID
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findById(req.params.id)
      .populate('medicines.medicineId', 'name genericName category');

    if (!pharmacy) {
      return res.status(404).json({ message: 'Pharmacy not found' });
    }

    res.json({ pharmacy });
  } catch (error) {
    console.error('Pharmacy fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch pharmacy', error: error.message });
  }
});

// Search medicines in pharmacy
router.get('/:id/medicines', optionalAuth, async (req, res) => {
  try {
    const { search, category, page = 1, limit = 10 } = req.query;
    const query = { 'medicines.isAvailable': true };
    
    if (search) {
      query.$or = [
        { 'medicines.name': { $regex: search, $options: 'i' } },
        { 'medicines.genericName': { $regex: search, $options: 'i' } }
      ];
    }

    const pharmacy = await Pharmacy.findById(req.params.id);
    if (!pharmacy) {
      return res.status(404).json({ message: 'Pharmacy not found' });
    }

    let medicines = pharmacy.medicines.filter(med => med.isAvailable);
    
    if (search) {
      medicines = medicines.filter(med => 
        med.name.toLowerCase().includes(search.toLowerCase()) ||
        med.genericName.toLowerCase().includes(search.toLowerCase())
      );
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex * limit;
    const paginatedMedicines = medicines.slice(startIndex, endIndex);

    res.json({
      medicines: paginatedMedicines,
      totalPages: Math.ceil(medicines.length / limit),
      currentPage: page,
      total: medicines.length
    });
  } catch (error) {
    console.error('Pharmacy medicines fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch pharmacy medicines', error: error.message });
  }
});

// Check medicine availability
router.post('/check-availability', optionalAuth, async (req, res) => {
  try {
    const { medicineName, pharmacyId, quantity = 1 } = req.body;

    let query = { 'medicines.isAvailable': true };
    
    if (pharmacyId) {
      query._id = pharmacyId;
    }

    const pharmacies = await Pharmacy.find(query);
    const availablePharmacies = [];

    for (const pharmacy of pharmacies) {
      const medicine = pharmacy.medicines.find(med => 
        med.name.toLowerCase().includes(medicineName.toLowerCase()) ||
        med.genericName.toLowerCase().includes(medicineName.toLowerCase())
      );

      if (medicine && medicine.quantity >= quantity) {
        availablePharmacies.push({
          pharmacyId: pharmacy._id,
          pharmacyName: pharmacy.name,
          address: pharmacy.address,
          medicine: {
            name: medicine.name,
            genericName: medicine.genericName,
            quantity: medicine.quantity,
            price: medicine.price,
            unit: medicine.unit
          }
        });
      }
    }

    res.json({
      medicineName,
      availablePharmacies,
      totalFound: availablePharmacies.length
    });
  } catch (error) {
    console.error('Medicine availability check error:', error);
    res.status(500).json({ message: 'Failed to check medicine availability', error: error.message });
  }
});

// Get nearby pharmacies
router.post('/nearby', optionalAuth, async (req, res) => {
  try {
    const { latitude, longitude, radius = 10 } = req.body; // radius in km

    const pharmacies = await Pharmacy.find({
      isActive: true,
      'address.coordinates': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude]
          },
          $maxDistance: radius * 1000 // convert km to meters
        }
      }
    })
    .select('name owner phone address workingHours')
    .limit(20);

    res.json({
      pharmacies,
      total: pharmacies.length,
      searchRadius: radius
    });
  } catch (error) {
    console.error('Nearby pharmacies fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch nearby pharmacies', error: error.message });
  }
});

// Update medicine stock (for pharmacy owners)
router.put('/:id/medicines/:medicineId/stock', authenticateToken, async (req, res) => {
  try {
    const { quantity, price } = req.body;

    const pharmacy = await Pharmacy.findById(req.params.id);
    if (!pharmacy) {
      return res.status(404).json({ message: 'Pharmacy not found' });
    }

    const medicine = pharmacy.medicines.id(req.params.medicineId);
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found in this pharmacy' });
    }

    medicine.quantity = quantity;
    if (price) {
      medicine.price = price;
    }
    medicine.isAvailable = quantity > 0;

    await pharmacy.save();

    res.json({
      message: 'Medicine stock updated successfully',
      medicine: {
        name: medicine.name,
        quantity: medicine.quantity,
        price: medicine.price,
        isAvailable: medicine.isAvailable
      }
    });
  } catch (error) {
    console.error('Medicine stock update error:', error);
    res.status(500).json({ message: 'Failed to update medicine stock', error: error.message });
  }
});

// Get medicine categories
router.get('/medicines/categories', optionalAuth, async (req, res) => {
  try {
    const categories = await Medicine.distinct('category');
    res.json({ categories });
  } catch (error) {
    console.error('Medicine categories fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch medicine categories', error: error.message });
  }
});

module.exports = router;
