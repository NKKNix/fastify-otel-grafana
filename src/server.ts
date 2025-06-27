// server.ts
import { context, trace } from '@opentelemetry/api';
import './tracing'; // ต้องมาก่อนการ import อื่น ๆ
import Fastify from 'fastify';

const app = Fastify();

app.get('/ping', async (request, reply) => {
  return { pong: 'it works!' };
});
app.get('/test',async(request, reply) => {
    return { testbro : 'test route' };
})

app.addHook('onRequest', async (req) => {
  const span = trace.getSpan(context.active());
  const traceId = span?.spanContext().traceId;
  console.log(`[TRACE_ID=${traceId}] ${req.method} ${req.url}`);
});

app.listen({ port: 3000 }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
