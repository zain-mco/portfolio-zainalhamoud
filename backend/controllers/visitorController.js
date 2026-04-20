const prisma = require('../config/prisma');

// Helper function to parse user agent
const parseUserAgent = (userAgent) => {
  const ua = userAgent.toLowerCase();
  
  // Browser detection
  let browser = 'Unknown';
  if (ua.includes('chrome') && !ua.includes('edge')) browser = 'Chrome';
  else if (ua.includes('firefox')) browser = 'Firefox';
  else if (ua.includes('safari') && !ua.includes('chrome')) browser = 'Safari';
  else if (ua.includes('edge')) browser = 'Edge';
  else if (ua.includes('opera') || ua.includes('opr')) browser = 'Opera';
  
  // OS detection
  let os = 'Unknown';
  if (ua.includes('windows')) os = 'Windows';
  else if (ua.includes('mac')) os = 'macOS';
  else if (ua.includes('linux')) os = 'Linux';
  else if (ua.includes('android')) os = 'Android';
  else if (ua.includes('ios') || ua.includes('iphone') || ua.includes('ipad')) os = 'iOS';
  
  // Device detection
  let device = 'Desktop';
  if (ua.includes('mobile')) device = 'Mobile';
  else if (ua.includes('tablet')) device = 'Tablet';
  
  return { browser, os, device };
};

// @desc    Track a new visitor
// @route   POST /api/visitors/track
// @access  Public
exports.trackVisitor = async (req, res) => {
  try {
    // Get IP address (handle proxies)
    const ipAddress = req.headers['x-forwarded-for']?.split(',')[0] || 
                      req.headers['x-real-ip'] || 
                      req.connection.remoteAddress || 
                      req.socket.remoteAddress;
    
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const referrer = req.headers['referer'] || req.headers['referrer'] || 'Direct';
    
    // Parse user agent
    const { browser, os, device } = parseUserAgent(userAgent);
    
    // Check if this IP visited recently (within last 30 minutes to avoid duplicate counts)
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    const recentVisit = await prisma.visitor.findFirst({
      where: {
        ipAddress,
        timestamp: { gte: thirtyMinutesAgo }
      }
    });
    
    if (!recentVisit) {
      // Create new visitor record
      await prisma.visitor.create({
        data: {
          ipAddress,
          userAgent,
          browser,
          os,
          device,
          referrer
        }
      });
      
      res.status(201).json({
        success: true,
        message: 'Visitor tracked successfully'
      });
    } else {
      res.status(200).json({
        success: true,
        message: 'Recent visit already tracked'
      });
    }
  } catch (error) {
    console.error('Error tracking visitor:', error);
    res.status(500).json({
      success: false,
      message: 'Error tracking visitor'
    });
  }
};

// @desc    Get visitor statistics
// @route   GET /api/visitors/stats
// @access  Private (Admin only)
exports.getVisitorStats = async (req, res) => {
  try {
    // Total unique visitors
    const totalVisitors = await prisma.visitor.count();
    
    // Visitors today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const visitorsToday = await prisma.visitor.count({
      where: { timestamp: { gte: today } }
    });
    
    // Visitors this week
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const visitorsThisWeek = await prisma.visitor.count({
      where: { timestamp: { gte: weekAgo } }
    });
    
    // Visitors this month
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    const visitorsThisMonth = await prisma.visitor.count({
      where: { timestamp: { gte: monthAgo } }
    });
    
    // Browser statistics using groupBy
    const browserStatsRaw = await prisma.visitor.groupBy({
      by: ['browser'],
      _count: { browser: true },
      orderBy: { _count: { browser: 'desc' } },
      take: 5
    });
    const browserStats = browserStatsRaw.map(item => ({
      _id: item.browser,
      count: item._count.browser
    }));
    
    // OS statistics
    const osStatsRaw = await prisma.visitor.groupBy({
      by: ['os'],
      _count: { os: true },
      orderBy: { _count: { os: 'desc' } },
      take: 5
    });
    const osStats = osStatsRaw.map(item => ({
      _id: item.os,
      count: item._count.os
    }));
    
    // Device statistics
    const deviceStatsRaw = await prisma.visitor.groupBy({
      by: ['device'],
      _count: { device: true },
      orderBy: { _count: { device: 'desc' } }
    });
    const deviceStats = deviceStatsRaw.map(item => ({
      _id: item.device,
      count: item._count.device
    }));
    
    // Daily visitors for the last 30 days using raw SQL
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const dailyVisitorsRaw = await prisma.$queryRaw`
      SELECT DATE("timestamp") as date, COUNT(*)::int as count
      FROM visitors
      WHERE "timestamp" >= ${thirtyDaysAgo}
      GROUP BY DATE("timestamp")
      ORDER BY date ASC
    `;
    const dailyVisitors = dailyVisitorsRaw.map(item => ({
      _id: item.date.toISOString().split('T')[0],
      count: item.count
    }));
    
    res.status(200).json({
      success: true,
      data: {
        totalVisitors,
        visitorsToday,
        visitorsThisWeek,
        visitorsThisMonth,
        browserStats,
        osStats,
        deviceStats,
        dailyVisitors
      }
    });
  } catch (error) {
    console.error('Error getting visitor stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving visitor statistics'
    });
  }
};

// @desc    Get recent visitors
// @route   GET /api/visitors/recent
// @access  Private (Admin only)
exports.getRecentVisitors = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    
    const visitors = await prisma.visitor.findMany({
      orderBy: { timestamp: 'desc' },
      take: limit
    });
    
    res.status(200).json({
      success: true,
      count: visitors.length,
      data: visitors
    });
  } catch (error) {
    console.error('Error getting recent visitors:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving recent visitors'
    });
  }
};
