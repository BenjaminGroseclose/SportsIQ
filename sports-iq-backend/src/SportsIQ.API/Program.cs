
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
builder.Services.AddAuth(options =>
{
    options.Domain = builder.Configuration["Auth0:Domain"]!;
    options.Audience = builder.Configuration["Auth0:Audience"]!;
});

// Database
builder.Services.AddDbContext<SportsIQContext>(
    options => options.UseSqlServer(builder.Configuration.GetConnectionString("SportsIQDatabase"))
);

// Repositories
builder.Services.AddScoped<IAccountRepository, AccountRepository>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigins", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
        .AllowAnyHeader()
        .AllowAnyMethod();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseCors("AllowSpecificOrigins");

app.UseAuthentication();
// app.UseAuthorization();

app.MapControllers();

app.Run();