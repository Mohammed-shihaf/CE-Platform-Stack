using System.Collections.Concurrent;
using Grpc.Core;
using Ceplatform;
using MongoDB.Driver;
using BackendCsServiceA.Models;

namespace BackendCsServiceA.Services
{
    public class RecordServiceImpl : RecordService.RecordServiceBase
    {
        private readonly IMongoCollection<RecordModel> _collection;
        private static readonly ConcurrentBag<IServerStreamWriter<Record>> _subscribers = new();

        public RecordServiceImpl(IMongoDatabase database)
        {
            _collection = database.GetCollection<RecordModel>("records");
        }

        public static void NotifyRecordCreated(Record record)
        {
            foreach (var sub in _subscribers)
            {
                try
                {
                    sub.WriteAsync(record);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"[cs-service-a][grpc] subscriber write error: {ex.Message}");
                }
            }
        }

        public override async Task<Record> GetRecord(GetRecordRequest request, ServerCallContext context)
        {
            var filter = Builders<RecordModel>.Filter.Eq(r => r.Id, request.Id);
            var doc = await _collection.Find(filter).FirstOrDefaultAsync();

            if (doc == null)
            {
                throw new RpcException(new Status(StatusCode.NotFound, "record not found"));
            }

            return new Record
            {
                Id = doc.Id ?? string.Empty,
                Title = doc.Title,
                Description = doc.Description,
                CreatedAt = doc.CreatedAt
            };
        }

        public override async Task WatchRecords(WatchRecordsRequest request, IServerStreamWriter<Record> responseStream, ServerCallContext context)
        {
            Console.WriteLine("[cs-service-a][grpc] client subscribed to WatchRecords");
            _subscribers.Add(responseStream);

            try
            {
                while (!context.CancellationToken.IsCancellationRequested)
                {
                    await Task.Delay(1000, context.CancellationToken);
                }
            }
            catch (TaskCanceledException)
            {
                Console.WriteLine("[cs-service-a][grpc] WatchRecords client disconnected");
            }
        }
    }
}
