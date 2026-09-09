import { createApp } from './app.js';
import { createClient, watchRecords } from './grpc-client.js';
import { indexRecord } from './es.js';
import { publishRecordCreated } from './sns.js';
import { sendNotificationEmail } from './ses.js';

const PORT = process.env.PORT || 3001;
const app = createApp();

app.listen(PORT, () => {
  console.log(`[service-b][ts] HTTP search service listening on :${PORT}`);
});

const grpcClient = createClient();

watchRecords(grpcClient, async (record: { id: string; title: string; description: string; createdAt: string }) => {
  console.log('[service-b][ts] received Record via gRPC stream:', record);

  try {
    await indexRecord(record);
    console.log(`[service-b][ts] indexed record ${record.id} into Elasticsearch`);
  } catch (err: any) {
    console.error('[service-b][ts] Elasticsearch index failed:', err.message);
  }

  try {
    await publishRecordCreated(record);
  } catch (err: any) {
    console.error('[service-b][ts] SNS publish failed:', err.message);
  }

  try {
    await sendNotificationEmail(record);
  } catch (err: any) {
    console.error('[service-b][ts] SES send failed:', err.message);
  }
});
