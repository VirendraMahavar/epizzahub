var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

app.MapGet("/api/health", () => Results.Ok(new { status = "ok" }));

app.MapGet("/api/pizzas", () => new[]
{
    new Pizza(1, "Margherita", "Tomato, mozzarella, basil", 299m),
    new Pizza(2, "Pepperoni", "Pepperoni, mozzarella", 399m),
    new Pizza(3, "Veggie Supreme", "Peppers, onion, olives, corn", 349m),
});

// React router fallback (serves index.html for non-API routes)
app.MapFallbackToFile("index.html");

app.Run();

public record Pizza(int Id, string Name, string Description, decimal Price);

public partial class Program;
