import handlerImport from '../dist/server/server.js';

// Extract the fetch handler from the imported module
// It could be default.fetch, or just fetch depending on the build output.
const handlerObj = handlerImport.default || handlerImport;
const handler = typeof handlerObj === 'function' ? handlerObj : handlerObj.fetch;

export default async function (req, res) {
  try {
    if (typeof handler !== 'function') {
      throw new Error('Could not find fetch handler. Export keys: ' + Object.keys(handlerObj).join(', '));
    }

    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const host = req.headers['x-forwarded-host'] || req.headers.host || 'localhost';
    const url = new URL(req.url || '/', `${protocol}://${host}`);

    const flattenedHeaders = {};
    for (const [key, value] of Object.entries(req.headers)) {
      if (Array.isArray(value)) {
        flattenedHeaders[key] = value.join(', ');
      } else if (value !== undefined) {
        flattenedHeaders[key] = value;
      }
    }

    const options = {
      method: req.method || 'GET',
      headers: flattenedHeaders,
    };

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      const buffers = [];
      for await (const chunk of req) {
        buffers.push(chunk);
      }
      options.body = Buffer.concat(buffers);
    }

    const webRequest = new Request(url.toString(), options);

    const webResponse = await handler(webRequest);

    res.statusCode = webResponse.status || 200;
    
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
    res.end('Internal Server Error: ' + (error.message || error.toString()));
  }
}
