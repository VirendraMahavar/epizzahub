import { useEffect, useState } from 'react'
import './App.css'

type Pizza = { id: number; name: string; description: string; price: number }

export default function App() {
  const [pizzas, setPizzas] = useState<Pizza[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/pizzas')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then(setPizzas)
      .catch((e) => setError(e.message))
  }, [])

  return (
    <main>
      <h1>🍕 ePizzaHub</h1>
      {error && <p role="alert">Could not load menu: {error}</p>}
      <ul>
        {pizzas.map((p) => (
          <li key={p.id}>
            <strong>{p.name}</strong> – ₹{p.price}
            <br />
            <small>{p.description}</small>
          </li>
        ))}
      </ul>
    </main>
  )
}
