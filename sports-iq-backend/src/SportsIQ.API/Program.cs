

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
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
    {
        options.Authority = "https://dev--isjyw9f.us.auth0.com/";
        options.Audience = "https://sportsiq.api";
        options.RequireHttpsMetadata = true;
        options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = "https://dev--isjyw9f.us.auth0.com/",
            ValidateAudience = true,
            ValidAudience = "https://sportsiq.api",
            ValidateLifetime = true
        };

            // Add logging for debugging
        options.Events = new JwtBearerEvents
        {
            OnAuthenticationFailed = context =>
            {
                Console.WriteLine($"Authentication failed: {context.Exception}");
                return Task.CompletedTask;
            },
            OnTokenValidated = context =>
            {
                Console.WriteLine("Token validated successfully");
                return Task.CompletedTask;
            },
            OnChallenge = context =>
            {
                Console.WriteLine($"OnChallenge error: {context.Error}, {context.ErrorDescription}");
                return Task.CompletedTask;
            }
        };
    }
);

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