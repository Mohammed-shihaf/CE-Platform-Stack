using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace BackendCsServiceA.Models
{
    public class RecordModel
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("title")]
        public string Title { get; set; } = string.Empty;

        [BsonElement("description")]
        public string Description { get; set; } = string.Empty;

        [BsonElement("createdAt")]
        public string CreatedAt { get; set; } = DateTime.UtcNow.ToString("o");
    }
}
