using MongoDB.Driver;
using BackendCsServiceA.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddGrpc();

// MongoDB dependency injection
var mongoUri = Environment.GetEnvironmentVariable("MONGO_URI") ?? "mongodb://localhost:27017/ceplatform";
builder.Services.AddSingleton<IMongoClient>(new MongoClient(mongoUri));
builder.Services.AddScoped<IMongoDatabase>(sp => sp.GetRequiredService<IMongoClient>().GetDatabase("ceplatform"));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });
});

var app = builder.Build();

app.UseCors("AllowAll");
app.MapControllers();
app.MapGrpcService<RecordServiceImpl>();

app.MapGet("/health", () => Results.Ok(new { status = "ok", service = "backend-cs-service-a" }));

Console.WriteLine("[cs-service-a] Kestrel server & gRPC service starting on port 50051 & REST 3000...");
app.Run("http://0.0.0.0:3000");
