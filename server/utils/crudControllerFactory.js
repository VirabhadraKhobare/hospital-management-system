export const createCrudController = (Model, options = {}) => {
  const {
    populate = '',
    searchFields = [],
    defaultSort = { createdAt: -1 },
    readFilter = () => ({ isActive: true })
  } = options;

  return {
    create: async (req, res, next) => {
      try {
        const item = await Model.create(req.body);
        const created = populate ? await Model.findById(item._id).populate(populate) : item;
        return res.status(201).json(created);
      } catch (error) {
        return next(error);
      }
    },

    list: async (req, res, next) => {
      try {
        const { page = 1, limit = 10, search = '' } = req.query;
        const filter = readFilter(req);

        if (search && searchFields.length > 0) {
          filter.$or = searchFields.map((field) => ({
            [field]: { $regex: search, $options: 'i' }
          }));
        }

        const skip = (Number(page) - 1) * Number(limit);

        const [data, total] = await Promise.all([
          Model.find(filter)
            .populate(populate)
            .sort(defaultSort)
            .skip(skip)
            .limit(Number(limit)),
          Model.countDocuments(filter)
        ]);

        return res.json({
          data,
          pagination: {
            total,
            page: Number(page),
            limit: Number(limit),
            pages: Math.ceil(total / Number(limit))
          }
        });
      } catch (error) {
        return next(error);
      }
    },

    getById: async (req, res, next) => {
      try {
        const doc = await Model.findOne({ _id: req.params.id, ...readFilter(req) }).populate(populate);

        if (!doc) {
          res.status(404);
          throw new Error('Resource not found');
        }

        return res.json(doc);
      } catch (error) {
        return next(error);
      }
    },

    update: async (req, res, next) => {
      try {
        const doc = await Model.findOneAndUpdate(
          { _id: req.params.id, ...readFilter(req) },
          req.body,
          { new: true, runValidators: true }
        ).populate(populate);

        if (!doc) {
          res.status(404);
          throw new Error('Resource not found');
        }

        return res.json(doc);
      } catch (error) {
        return next(error);
      }
    },

    remove: async (req, res, next) => {
      try {
        const doc = await Model.findOneAndUpdate(
          { _id: req.params.id, ...readFilter(req) },
          { isActive: false },
          { new: true }
        );

        if (!doc) {
          res.status(404);
          throw new Error('Resource not found');
        }

        return res.json({ message: 'Resource deleted successfully' });
      } catch (error) {
        return next(error);
      }
    }
  };
};
