const express = require('express');
const router = express.Router();

// Bring in Models & Utils
const Brand = require('../../models/brand');
const Product = require('../../models/product');
const Merchant = require('../../models/merchant');
const auth = require('../../middleware/auth');
const role = require('../../middleware/role');
const store = require('../../utils/store');
const { ROLES, MERCHANT_STATUS } = require('../../constants');

// Add brand - Admin only (for platform-wide brands)
router.post('/add', auth, role.check(ROLES.Admin), async (req, res) => {
  try {
    const name = req.body.name;
    const description = req.body.description;
    const isActive = req.body.isActive;

    if (!description || !name) {
      return res
        .status(400)
        .json({ error: 'You must enter description & name.' });
    }

    const brand = new Brand({
      name,
      description,
      isActive
    });

    const brandDoc = await brand.save();

    res.status(200).json({
      success: true,
      message: `Brand has been added successfully!`,
      brand: brandDoc
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

// Add merchant brand - Merchants can add their own brands
router.post('/merchant/add', auth, role.check(ROLES.Merchant), async (req, res) => {
  try {
    const name = req.body.name;
    const description = req.body.description;
    const merchantId = req.user.merchant;

    if (!description || !name) {
      return res
        .status(400)
        .json({ error: 'You must enter description & name.' });
    }

    // Check if merchant already has a brand
    const existingBrand = await Brand.findOne({ merchant: merchantId });
    if (existingBrand) {
      return res
        .status(400)
        .json({ error: 'You already have a brand. You can only have one brand per merchant account.' });
    }

    const brand = new Brand({
      name,
      description,
      merchant: merchantId,
      isActive: true
    });

    const brandDoc = await brand.save();

    // Update merchant record with new brand
    await Merchant.findOneAndUpdate(
      { _id: merchantId },
      { brand: brandDoc._id }
    );

    res.status(200).json({
      success: true,
      message: `Brand has been added successfully!`,
      brand: brandDoc
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

// Update merchant brand - Merchants can update their own brand
router.put('/merchant/update/:id', auth, role.check(ROLES.Merchant), async (req, res) => {
  try {
    const brandId = req.params.id;
    const merchantId = req.user.merchant;
    const { name, description, isActive } = req.body;

    // Verify the brand belongs to this merchant
    const brand = await Brand.findOne({ _id: brandId, merchant: merchantId });
    if (!brand) {
      return res
        .status(400)
        .json({ error: 'Brand not found or you do not have permission to update this brand.' });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (isActive !== undefined) updateData.isActive = isActive;

    const updatedBrand = await Brand.findOneAndUpdate(
      { _id: brandId, merchant: merchantId },
      updateData,
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: `Brand has been updated successfully!`,
      brand: updatedBrand
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

// fetch store brands api
router.get('/list', async (req, res) => {
  try {
    const brands = await Brand.find({
      isActive: true
    }).populate('merchant', 'name');

    res.status(200).json({
      brands
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

// fetch brands api
router.get(
  '/',
  auth,
  role.check(ROLES.Admin, ROLES.Merchant),
  async (req, res) => {
    try {
      let brands = null;

      if (req.user.merchant) {
        brands = await Brand.find({
          merchant: req.user.merchant
        }).populate('merchant', 'name');
      } else {
        brands = await Brand.find({}).populate('merchant', 'name');
      }

      res.status(200).json({
        brands
      });
    } catch (error) {
      res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
      });
    }
  }
);

// fetch merchant's own brand
router.get(
  '/merchant/my-brand',
  auth,
  role.check(ROLES.Merchant),
  async (req, res) => {
    try {
      const merchantId = req.user.merchant;
      
      const brand = await Brand.findOne({
        merchant: merchantId
      }).populate('merchant', 'name email');

      if (!brand) {
        return res.status(404).json({
          error: 'No brand found for this merchant. Please create a brand first.'
        });
      }

      res.status(200).json({
        success: true,
        brand
      });
    } catch (error) {
      res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
      });
    }
  }
);

router.get('/:id', async (req, res) => {
  try {
    const brandId = req.params.id;

    const brandDoc = await Brand.findOne({ _id: brandId }).populate(
      'merchant',
      '_id'
    );

    if (!brandDoc) {
      return res.status(404).json({
        message: `Cannot find brand with the id: ${brandId}.`
      });
    }

    res.status(200).json({
      brand: brandDoc
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

router.get(
  '/list/select',
  auth,
  role.check(ROLES.Admin, ROLES.Merchant),
  async (req, res) => {
    try {
      let brands = null;

      if (req.user.merchant) {
        brands = await Brand.find(
          {
            merchant: req.user.merchant
          },
          'name'
        );
      } else {
        brands = await Brand.find({}, 'name');
      }

      res.status(200).json({
        brands
      });
    } catch (error) {
      res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
      });
    }
  }
);

router.put(
  '/:id',
  auth,
  role.check(ROLES.Admin, ROLES.Merchant),
  async (req, res) => {
    try {
      const brandId = req.params.id;
      const update = req.body.brand;
      const query = { _id: brandId };
      const { slug } = req.body.brand;

      const foundBrand = await Brand.findOne({
        $or: [{ slug }]
      });

      if (foundBrand && foundBrand._id != brandId) {
        return res.status(400).json({ error: 'Slug is already in use.' });
      }

      await Brand.findOneAndUpdate(query, update, {
        new: true
      });

      res.status(200).json({
        success: true,
        message: 'Brand has been updated successfully!'
      });
    } catch (error) {
      res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
      });
    }
  }
);

router.put(
  '/:id/active',
  auth,
  role.check(ROLES.Admin, ROLES.Merchant),
  async (req, res) => {
    try {
      const brandId = req.params.id;
      const update = req.body.brand;
      const query = { _id: brandId };

      // disable brand(brandId) products
      if (!update.isActive) {
        const products = await Product.find({ brand: brandId });
        store.disableProducts(products);
      }

      await Brand.findOneAndUpdate(query, update, {
        new: true
      });

      res.status(200).json({
        success: true,
        message: 'Brand has been updated successfully!'
      });
    } catch (error) {
      res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
      });
    }
  }
);

router.delete(
  '/delete/:id',
  auth,
  role.check(ROLES.Admin),
  async (req, res) => {
    try {
      const brandId = req.params.id;
      await deactivateMerchant(brandId);
      const brand = await Brand.deleteOne({ _id: brandId });

      res.status(200).json({
        success: true,
        message: `Brand has been deleted successfully!`,
        brand
      });
    } catch (error) {
      res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
      });
    }
  }
);

const deactivateMerchant = async brandId => {
  const brandDoc = await Brand.findOne({ _id: brandId }).populate(
    'merchant',
    '_id'
  );
  if (!brandDoc || !brandDoc.merchant) return;
  const merchantId = brandDoc.merchant._id;
  const query = { _id: merchantId };
  const update = {
    status: MERCHANT_STATUS.Waiting_Approval,
    isActive: false,
    brand: null
  };
  return await Merchant.findOneAndUpdate(query, update, {
    new: true
  });
};

module.exports = router;
