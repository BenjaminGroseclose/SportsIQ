
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using SportsIQ.Application;
using SportsIQ.Application.Interfaces;
using SportsIQ.Domain.Core;
using SportsIQ.Domain.PlayerRanking;
using SportsIQ.Domain.SportPlayer;
using SportsIQ.Infrastructure;
using SportsIQ.Infrastructure.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// Add controller services
builder.Services.AddControllers();

// Add OpenAPI/Swagger documentation
builder.Services.AddOpenApi();

// Services
builder.Services.AddScoped<IAccountService, AccountService>();
builder.Services.AddScoped<ICoreService, CoreService>();

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
builder.Services.AddScoped<IBaseRepository<Account>, BaseRepository<Account>>();
builder.Services.AddScoped<IBaseRepository<Sport>, BaseRepository<Sport>>();
builder.Services.AddScoped<IBaseRepository<Team>, BaseRepository<Team>>();
builder.Services.AddScoped<IBaseRepository<Season>, BaseRepository<Season>>();
builder.Services.AddScoped<IBaseRepository<PlayerRanking>, BaseRepository<PlayerRanking>>();
builder.Services.AddScoped<IBaseRepository<PlayerComparison>, BaseRepository<PlayerComparison>>();
builder.Services.AddScoped<IBaseRepository<Player>, BaseRepository<Player>>();

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