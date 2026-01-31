export const getStats = async (req, res, next) => {
    try {
        const stats = {
            totalUsers: 150,
            activeUsers: 45,
            loginAttempts: 1250,
            successRate: "96%"
        };
        
        res.json({
            message: "Stats retrieved successfully",
            data: stats
        });
    } catch (error) {
        next(error);
    }
};

export const getUptime = async (req, res, next) => {
    try {
        const uptime = process.uptime();
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        
        res.json({
            message: "Uptime retrieved successfully",
            data: {
                uptime: `${hours}h ${minutes}m`,
                uptime_seconds: Math.floor(uptime),
                server_time: new Date().toISOString(),
                status: "healthy"
            }
        });
    } catch (error) {
        next(error);
    }
};