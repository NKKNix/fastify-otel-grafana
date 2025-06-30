import axios from 'axios';
import './tracing';


import Fastify from 'fastify';
import { context, trace } from '@opentelemetry/api';

const app = Fastify();
app.get('/call-service2', async () => {
  const res = await axios.get('http://localhost:3000/ping');
  return res.data;
});

app.get('/info', async () => {
  return { message: 'Hello from Service 3' };
});

app.addHook('onRequest', async (req) => {
  const span = trace.getSpan(context.active());
  const traceId = span?.spanContext().traceId;
  console.log(`[TRACE_ID=${traceId}] ${req.method} ${req.url}`);
});
app.listen({ port: 4002 }, () => {
  console.log('Service 3 listening on http://localhost:4002');
});
