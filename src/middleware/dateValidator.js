const validateDate = (date) => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(date)) return false;
  
  const parsedDate = new Date(date);
  return parsedDate.toString() !== 'Invalid Date';
};

const getDefaultDateRange = () => {
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  
  return {
    startDate: startOfMonth.toISOString().split('T')[0],
    endDate: today.toISOString().split('T')[0]
  };
};

export const dateValidator = (req, res, next) => {
  const { startDate, endDate } = req.query;
  const defaultDates = getDefaultDateRange();

  // Validate startDate if provided
  if (startDate && !validateDate(startDate)) {
    return res.status(400).json({
      error: 'Invalid startDate format. Please use YYYY-MM-DD format.'
    });
  }

  // Validate endDate if provided
  if (endDate && !validateDate(endDate)) {
    return res.status(400).json({
      error: 'Invalid endDate format. Please use YYYY-MM-DD format.'
    });
  }

  // Set default dates if not provided
  req.query.startDate = startDate || defaultDates.startDate;
  req.query.endDate = endDate || defaultDates.endDate;

  // Validate date range
  const start = new Date(req.query.startDate);
  const end = new Date(req.query.endDate);

  if (start > end) {
    return res.status(400).json({
      error: 'startDate must be before or equal to endDate'
    });
  }

  // Add date range information to the response locals
  res.locals.dateRange = {
    startDate: req.query.startDate,
    endDate: req.query.endDate
  };

  next();
}; 