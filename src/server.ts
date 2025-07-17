// src/index.ts
import './tracing'; 

import { metrics } from '@opentelemetry/api';
import Fastify, { FastifyRequest, FastifyReply } from 'fastify';

const app = Fastify();

const meter = metrics.getMeter('fastify-app-meter');

const httpRequestCounter = meter.createCounter('http_requests_total', {
  description: 'Total number of HTTP requests',
});

// Best Practice: ใช้ 'onResponse' hook เพื่อนับทุก request ที่เดียว
app.addHook('onResponse', async (request: FastifyRequest, reply: FastifyReply) => {
  httpRequestCounter.add(1, { 
    'http.method': request.method, 
    'http.status_code': reply.statusCode 
  });
});


app.get('/ping', async (request: FastifyRequest, reply: FastifyReply) => {
  return { pong: 'it works!' };
});

app.get('/test', async (request: FastifyRequest, reply: FastifyReply) => {
  return { testbro: 'test route' };
});

app.post('/test', async (request: FastifyRequest, reply: FastifyReply) => {
  return { testbro: 'test route' };
});

const start = async () => {
  try {
    await app.listen({ port: 3000, host: '0.0.0.0' });
    console.log(`Server listening at http://localhost:3000`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();