import handlerImport from '../dist/server/server.js';

const handler = handlerImport.default || handlerImport;

export default async function (req, res) {
  try {
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const host = req.headers['x-forwarded-host'] || req.headers.host || 'localhost';
    const url = new URL(req.url || '/', `${protocol}://${host}`);

    // Flatten headers to string values
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
