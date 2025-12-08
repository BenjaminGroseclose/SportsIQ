
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using SportsIQ.Application;
using SportsIQ.Application.Interfaces;
using SportsIQ.Infrastructure;
using SportsIQ.Infrastructure.Interfaces;
using SportsIQ.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Add controller services
builder.Services.AddControllers();

// Add OpenAPI/Swagger documentation
builder.Services.AddOpenApi();

// Services
builder.Services.AddScoped<IAccountService, AccountService>();

// Auth
var domain = builder.Configuration["Auth0:Domain"];
var audience = builder.Configuration["Auth0:Audience"];

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    // The "Authority" is who issued the token (Auth0)
    options.Authority = domain;
    options.Audience = audience;

    // OPTIONAL: If you get "Issuer" validation errors in development
    options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
    {
        ValidateAudience = true,
        ValidateIssuerSigningKey = true
    };
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
        policy
            .WithOrigins("http://localhost:4200")
            .AllowAnyHeader()  // Allows Authorization header
            .AllowAnyMethod()  // Allows all HTTP methods
            .AllowCredentials(); // Allows credentials in CORS requests
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
app.UseAuthorization();

app.MapControllers();

app.Run();