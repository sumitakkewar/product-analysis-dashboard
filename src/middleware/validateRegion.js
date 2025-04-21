import { Region } from "../models/index.js";

export const validateRegion = async (req, res, next) => {
    const { regionId } = req.query;
  
    // Validate regionId if provided
    if (!regionId) {
      return res.status(400).json({
        error: 'regionId is required'
      });
    }

    // check if region exists
    const region = await Region.findByPk(regionId)

    if(!region) {
        return res.status(404).json({
            error: 'Region not found!'
        });
    }
  
    next();
  }; 