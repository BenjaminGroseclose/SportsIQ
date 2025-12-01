
var builder = WebApplication.CreateBuilder(args);

// Add controller services
builder.Services.AddControllers();

// Add OpenAPI/Swagger documentation
builder.Services.AddOpenApi();

// Services

// Auth
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority = "https://dev--isjyw9f.us.auth0.com/";
    });


// Database


var app = builder.Build();

// Configure middleware pipeline
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthorization();

// Map controller routes
app.MapControllers();

app.Run();
