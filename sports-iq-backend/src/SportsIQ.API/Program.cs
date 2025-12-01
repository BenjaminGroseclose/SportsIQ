

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using SportsIQ.Infrastructure;
using SportsIQ.Infrastructure.Interfaces;
using SportsIQ.Infrastructure.Repositories;

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
builder.Services.AddDbContext<SportsIQContext>(
    options => options.UseSqlServer(builder.Configuration.GetConnectionString("SportsIQDatabase"))
);

// Repositories
builder.Services.AddScoped<IAccountRepository, AccountRepository>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseCors("AllowSpecificOrigins");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();