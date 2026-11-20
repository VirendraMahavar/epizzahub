# ePizzaHub Cloud

Azure + .NET + React pizza ordering platform (learning project).

## Layout
- `src/ePizzaHub.Api` – ASP.NET Core minimal API (also serves the built React app from `wwwroot`)
- `src/ePizzaHub.Client` – React + TypeScript (Vite)
- `tests/ePizzaHub.Tests` – xUnit tests

## Run locally
```
# terminal 1 – API on http://localhost:5080
dotnet run --project src/ePizzaHub.Api

# terminal 2 – React dev server on http://localhost:5173 (proxies /api to the API)
cd src/ePizzaHub.Client && npm install && npm run dev
```

## Build for deploy
```
cd src/ePizzaHub.Client && npm ci && npm run build   # writes into src/ePizzaHub.Api/wwwroot
dotnet publish src/ePizzaHub.Api -c Release -o publish
```

Secrets never go in this repo – use user-secrets locally and Key Vault in Azure.
