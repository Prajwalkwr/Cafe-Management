import Testimonial from '../models/Testimonial.js';

export async function listTestimonials(req, res, next) {
  try {
    const items = await Testimonial.find().sort({ order: 1 });
    return res.json({
      items: items.map((item) => ({
        id: item._id,
        quote: item.quote,
        name: item.name,
        role: item.role,
        rating: item.rating,
      })),
    });
  } catch (error) {
    return next(error);
  }
}
