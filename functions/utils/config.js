exports.BASE_URL = process.env.BASE_URL;

exports.COOKIE_SECURE = process.env.NODE_ENV !== 'development';

exports.ENDPOINT = '/api';

exports.GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
exports.GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

exports.SECRET = process.env.SECRET || 'SUPERSECRET';