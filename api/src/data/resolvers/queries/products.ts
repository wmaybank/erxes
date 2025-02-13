import { ProductCategories, Products, Tags } from '../../../db/models';
import {
  PRODUCT_STATUSES,
  TAG_TYPES
} from '../../../db/models/definitions/constants';
import { checkPermission, requireLogin } from '../../permissions/wrappers';
import { IContext } from '../../types';
import { escapeRegExp, paginate } from '../../utils';

const productQueries = {
  /**
   * Products list
   */
  async products(
    _root,
    {
      type,
      categoryId,
      searchValue,
      tag,
      ids,
      excludeIds,
      ...pagintationArgs
    }: {
      ids: string[];
      excludeIds: boolean;
      type: string;
      categoryId: string;
      searchValue: string;
      tag: string;
      page: number;
      perPage: number;
    },
    { commonQuerySelector }: IContext
  ) {
    const filter: any = commonQuerySelector;

    filter.status = { $ne: PRODUCT_STATUSES.DELETED };

    if (type) {
      filter.type = type;
    }

    if (categoryId) {
      const category = await ProductCategories.getProductCatogery({
        _id: categoryId,
        status: { $in: [null, 'active'] }
      });

      const product_category_ids = await ProductCategories.find(
        { order: { $regex: new RegExp(category.order) } },
        { _id: 1 }
      );
      filter.categoryId = { $in: product_category_ids };
    } else {
      const notActiveCategories = await ProductCategories.find({
        status: { $nin: [null, 'active'] }
      });

      filter.categoryId = { $nin: notActiveCategories.map(e => e._id) };
    }

    if (ids && ids.length > 0) {
      filter._id = { [excludeIds ? '$nin' : '$in']: ids };
    }

    if (tag) {
      filter.tagIds = { $in: [tag] };
    }

    // search =========
    if (searchValue) {
      const fields = [
        {
          name: { $in: [new RegExp(`.*${escapeRegExp(searchValue)}.*`, 'i')] }
        },
        { code: { $in: [new RegExp(`.*${escapeRegExp(searchValue)}.*`, 'i')] } }
      ];

      filter.$or = fields;
    }

    return paginate(
      Products.find(filter)
        .sort('code')
        .lean(),
      pagintationArgs
    );
  },

  /**
   * Get all products count. We will use it in pager
   */
  productsTotalCount(
    _root,
    { type }: { type: string },
    { commonQuerySelector }: IContext
  ) {
    const filter: any = commonQuerySelector;

    filter.status = { $ne: PRODUCT_STATUSES.DELETED };

    if (type) {
      filter.type = type;
    }

    return Products.find(filter).countDocuments();
  },

  productCategories(
    _root,
    {
      parentId,
      searchValue,
      status
    }: { parentId: string; searchValue: string; status: string },
    { commonQuerySelector }: IContext
  ) {
    const filter: any = commonQuerySelector;

    filter.status = { $nin: ['disabled', 'archived'] };

    if (status && status !== 'active') {
      filter.status = status;
    }

    if (parentId) {
      filter.parentId = parentId;
    }

    if (searchValue) {
      filter.name = new RegExp(`.*${searchValue}.*`, 'i');
    }

    return ProductCategories.find(filter)
      .sort({ order: 1 })
      .lean();
  },

  productCategoriesTotalCount(_root) {
    return ProductCategories.find().countDocuments();
  },

  productDetail(_root, { _id }: { _id: string }) {
    return Products.findOne({ _id }).lean();
  },

  productCategoryDetail(_root, { _id }: { _id: string }) {
    return ProductCategories.findOne({ _id }).lean();
  },

  async productCountByTags() {
    const counts = {};

    // Count products by tag =========
    const tags = await Tags.find({ type: TAG_TYPES.PRODUCT }).lean();

    for (const tag of tags) {
      counts[tag._id] = await Products.find({
        tagIds: tag._id,
        status: { $ne: PRODUCT_STATUSES.DELETED }
      }).countDocuments();
    }

    return counts;
  }
};

requireLogin(productQueries, 'productsTotalCount');
checkPermission(productQueries, 'products', 'showProducts', []);
checkPermission(productQueries, 'productCategories', 'showProducts', []);
checkPermission(productQueries, 'productCountByTags', 'showProducts', []);

export default productQueries;
