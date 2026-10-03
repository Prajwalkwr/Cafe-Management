import MenuItem from '../models/MenuItem.js';
import Reservation from '../models/Reservation.js';
import { TABLE_COUNT, kathmanduToday } from '../../shared/site.js';

export async function getStats(req, res, next) {
  try {
    const today = kathmanduToday();
    const [total, pending, confirmed, completed, todayCount, menuItems, activeToday] = await Promise.all([
      Reservation.countDocuments(),
      Reservation.countDocuments({ status: 'pending' }),
      Reservation.countDocuments({ status: 'confirmed' }),
      Reservation.countDocuments({ status: 'completed' }),
      Reservation.countDocuments({ date: today }),
      MenuItem.countDocuments(),
      Reservation.countDocuments({ date: today, status: { $in: ['pending', 'confirmed'] } }),
    ]);

    return res.json({
      stats: {
        today: todayCount,
        total,
        pending,
        confirmed,
        completed,
        menuItems,
        availableTables: Math.max(0, TABLE_COUNT - activeToday),
        tableCount: TABLE_COUNT,
      },
    });
  } catch (error) {
    return next(error);
  }
}
