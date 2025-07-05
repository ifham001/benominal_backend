import adminAuthSchema from "../../models/admin/admin-schema.js";
import productSchema from "../../models/admin/product-schema.js";
import OrderSchema from "../../models/users/order-schema.js";
import authSchema from "../../models/users/auth-schema.js";

const getDashboardData = async (req, res, next) => {
    try {
        // Since there's only one admin, get the first admin (optional - can be removed if not needed)
        const admin = await adminAuthSchema.findOne();

        // Get current date for today's orders
        const today = new Date();
        const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

        // Parallel queries for better performance
        const [
            totalProducts,
            totalUsers,
            allTimeOrders,
            allTimeRevenue,
            todaysOrders,
            pendingOrders
        ] = await Promise.all([
            // Total Products
            productSchema.countDocuments(),
            
            // Total Users
            authSchema.countDocuments(),
            
            // All-Time Orders
            OrderSchema.countDocuments(),
            
            // All-Time Revenue - sum of all totalAmount
            OrderSchema.aggregate([
                {
                    $group: {
                        _id: null,
                        totalRevenue: { $sum: "$totalAmount" }
                    }
                }
            ]),
            
            // Today's Orders
            OrderSchema.countDocuments({
                createdAt: {
                    $gte: startOfToday,
                    $lt: endOfToday
                }
            }),
            
            // Pending Orders
            OrderSchema.countDocuments({
                status: 'pending'
            })
        ]);

        // Extract revenue value from aggregation result
        const revenue = allTimeRevenue.length > 0 ? allTimeRevenue[0].totalRevenue : 0;

        // Prepare dashboard data
        const dashboardData = {
            totalProducts,
            totalUsers,
            allTimeOrders,
            allTimeRevenue: revenue,
            todaysOrders,
            pendingOrders
        };

        // Add admin info if admin exists
        if (admin) {
            dashboardData.adminInfo = {
                name: admin.name,
                email: admin.email,
                totalManagedProducts: admin.products.length,
                totalManagedUsers: admin.users.length,
                totalManagedOrders: admin.orders.length
            };
        }

        res.status(200).json({
            success: true,
            message: "Dashboard data retrieved successfully",
            data: dashboardData
        });

    } catch (error) {
        console.error("Dashboard controller error:", error);
        next(error);
    }
};

export { getDashboardData };