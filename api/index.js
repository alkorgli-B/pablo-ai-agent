module.exports = async function handler(req, res) {
  var html = '<!DOCTYPE html>' +
    '<html lang="ar" dir="rtl">' +
    '<head>' +
    '<meta charset="UTF-8">' +
    '<meta name="viewport" content="width=device-width, initial-scale=1.0">' +
    '<title>Pablo AI Agent</title>' +
    '<style>' +
    'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; ' +
    'background: #0f172a; color: #e2e8f0; display: flex; justify-content: center; align-items: center; ' +
    'min-height: 100vh; margin: 0; }' +
    '.container { text-align: center; max-width: 500px; padding: 2rem; }' +
    'h1 { font-size: 2.5rem; margin-bottom: 0.5rem; }' +
    'p { font-size: 1.1rem; color: #94a3b8; line-height: 1.6; }' +
    '.status { display: inline-block; background: #065f46; color: #6ee7b7; ' +
    'padding: 0.3rem 1rem; border-radius: 999px; font-size: 0.9rem; margin-top: 1rem; }' +
    'a { color: #60a5fa; text-decoration: none; }' +
    '</style>' +
    '</head>' +
    '<body>' +
    '<div class="container">' +
    '<h1>Pablo AI</h1>' +
    '<p>An autonomous AI agent that tweets on X (Twitter) using Claude AI.</p>' +
    '<div class="status">Active</div>' +
    '<p style="margin-top: 2rem; font-size: 0.9rem;">' +
    '<a href="/api/test">API Status</a>' +
    '</p>' +
    '</div>' +
    '</body>' +
    '</html>';

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  return res.status(200).send(html);
};
