using Microsoft.Identity.Web;

var builder = WebApplication.CreateBuilder(args);

// Microsoft Entra External ID (customer tenant): validates the bearer token sent by the React app.
builder.Services
    .AddAuthentication("Bearer")
    .AddMicrosoftIdentityWebApi(builder.Configuration.GetSection("AzureAd"));

builder.Services.AddAuthorizationBuilder()
    .AddPolicy("Admin", p => p.RequireRole("Admin"));

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

app.UseAuthentication();
app.UseAuthorization();

app.MapGet("/api/health", () => Results.Ok(new { status = "ok" }));

app.MapGet("/api/pizzas", () => new[]
{
    new Pizza(1, "Margherita", "Tomato, mozzarella, basil", 299m),
    new Pizza(2, "Pepperoni", "Pepperoni, mozzarella", 399m),
    new Pizza(3, "Veggie Supreme", "Peppers, onion, olives, corn", 349m),
}).RequireAuthorization();

// Returns who is signed in. Anyone who signed up and has no explicit role is a Customer.
app.MapGet("/api/me", (HttpContext ctx) =>
{
    var user = ctx.User;
    var name = user.FindFirst("name")?.Value
               ?? user.FindFirst("preferred_username")?.Value
               ?? user.FindFirst("emails")?.Value
               ?? "Customer";

    var roles = user.FindAll("roles").Select(c => c.Value)
                    .Concat(user.FindAll(System.Security.Claims.ClaimTypes.Role).Select(c => c.Value))
                    .Distinct()
                    .ToList();
    if (roles.Count == 0) roles.Add("Customer");

    return Results.Ok(new { name, roles });
}).RequireAuthorization();

// React router fallback (serves index.html for non-API routes)
app.MapFallbackToFile("index.html");

app.Run();

public record Pizza(int Id, string Name, string Description, decimal Price);

public partial class Program;
