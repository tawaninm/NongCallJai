import handler from '../dist/server/server.js';

export default async function (req, res) {
  try {
    // 1. Convert Node.js IncomingMessage (req) to Web Request
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const host = req.headers['x-forwarded-host'] || req.headers.host;
    const url = new URL(req.url, `${protocol}://${host}`);

    const options = {
      method: req.method,
      headers: req.headers,
    };

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      options.body = req;
      options.duplex = 'half';
    }

    const webRequest = new Request(url, options);

    // 2. Call the TanStack Start handler
    const webResponse = await handler(webRequest);

    // 3. Convert Web Response back to Node.js ServerResponse (res)
    res.statusCode = webResponse.status;
    
    webResponse.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    if (webResponse.body) {
      const reader = webResponse.body.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(value);
      }
      res.end();
    } else {
      res.end();
    }
  } catch (error) {
    console.error('Serverless Function Error:', error);
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
}
