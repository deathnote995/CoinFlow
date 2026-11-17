import Transaction from '../models/Transaction.model.js';
import Wallet from '../models/Wallet.model.js';
import logger from '../utils/logger.js';
import mongoose from 'mongoose';

export const getAnalyticsSummary = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user._id);
        const { walletId, startDate, endDate, month } = req.query;

        // 1. Build Match Query for MongoDB
        const matchConditions = { userId };

        if (walletId) {
            matchConditions.walletId = new mongoose.Types.ObjectId(walletId);
        }

        // Handle Date Filtering (Custom Range or Specific Month YYYY-MM)
        if (startDate && endDate) {
            matchConditions.date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        } else if (month) {
            // e.g., month = "2026-11"
            const start = new Date(`${month}-01T00:00:00.000Z`);
            const end = new Date(start);
            end.setMonth(end.getMonth() + 1);

            matchConditions.date = {
                $gte: start,
                $lt: end
            };
        }

        // 2. Aggregate Category Breakdown (For Pie / Bar Charts)
        const categoryBreakdown = await Transaction.aggregate([
            { $match: matchConditions },
            {
                $group: {
                    _id: { type: '$type', category: '$category' },
                    totalAmount: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    type: '$_id.type',
                    category: '$_id.category',
                    totalAmount: 1,
                    count: 1
                }
            },
            { $sort: { totalAmount: -1 } }
        ]);

        // 3. Aggregate Overall Summary Totals (Income vs Expense)
        const overallTotals = await Transaction.aggregate([
            { $match: matchConditions },
            {
                $group: {
                    _id: '$type',
                    total: { $sum: '$amount' }
                }
            }
        ]);

        let totalIncome = 0;
        let totalExpense = 0;
        overallTotals.forEach(item => {
            if (item._id === 'income') totalIncome = item.total;
            if (item._id === 'expense') totalExpense = item.total;
        });

        // 4. Aggregate Monthly Trend (For historical bar charts / month toggling)
        const monthlyTrend = await Transaction.aggregate([
            { $match: { userId, ...(walletId ? { walletId: new mongoose.Types.ObjectId(walletId) } : {}) } },
            {
                $group: {
                    _id: {
                        year: { $year: '$date' },
                        month: { $month: '$date' },
                        type: '$type'
                    },
                    total: { $sum: '$amount' }
                }
            },
            {
                $sort: { '_id.year': 1, '_id.month': 1 }
            }
        ]);

        return res.status(200).json({
            success: true,
            data: {
                filterApplied: {
                    walletId: walletId || 'All Wallets',
                    startDate: startDate || 'All Time',
                    endDate: endDate || 'All Time',
                    month: month || 'All Time'
                },
                summary: {
                    totalIncome,
                    totalExpense,
                    netSavings: totalIncome - totalExpense
                },
                categoryBreakdown, // Perfect for Pie/Bar charts
                monthlyTrend       // Perfect for historical timeline graphs
            }
        });

    } catch (error) {
        logger.error(`Analytics error: ${error.message}`);
        return res.status(500).json({
            success: false,
            message: 'Server error while generating analytics summary',
            error: error.message
        });
    }
}