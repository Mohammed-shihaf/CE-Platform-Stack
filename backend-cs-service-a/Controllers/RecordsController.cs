using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using BackendCsServiceA.Models;
using BackendCsServiceA.Services;
using Ceplatform;

namespace BackendCsServiceA.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RecordsController : ControllerBase
    {
        private readonly IMongoCollection<RecordModel> _collection;

        public RecordsController(IMongoDatabase database)
        {
            _collection = database.GetCollection<RecordModel>("records");
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var records = await _collection.Find(_ => true).ToListAsync();
            return Ok(records);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            var filter = Builders<RecordModel>.Filter.Eq(r => r.Id, id);
            var record = await _collection.Find(filter).FirstOrDefaultAsync();
            if (record == null) return NotFound(new { error = "record not found" });
            return Ok(record);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateRecordDto dto)
        {
            var model = new RecordModel
            {
                Title = dto.Title,
                Description = dto.Description,
                CreatedAt = DateTime.UtcNow.ToString("o")
            };

            await _collection.InsertOneAsync(model);

            var wireRecord = new Record
            {
                Id = model.Id ?? string.Empty,
                Title = model.Title,
                Description = model.Description,
                CreatedAt = model.CreatedAt
            };

            RecordServiceImpl.NotifyRecordCreated(wireRecord);

            return CreatedAtAction(nameof(GetById), new { id = model.Id }, model);
        }
    }

    public class CreateRecordDto
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
    }
}
