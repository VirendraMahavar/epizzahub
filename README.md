# ePizzaHub Cloud

Azure + .NET pizza ordering platform (learning project).

## Layout
- `src/ePizzaHub.Web` – ASP.NET Core web app (Razor Pages)
- `tests/ePizzaHub.Tests` – xUnit tests

## Run
```
dotnet run --project src/ePizzaHub.Web
dotnet test
```

Secrets never go in this repo – use user-secrets locally and Key Vault in Azure.
