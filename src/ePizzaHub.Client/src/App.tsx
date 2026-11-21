import { useCallback, useEffect, useState } from 'react'
import { useIsAuthenticated, useMsal } from '@azure/msal-react'
import { InteractionRequiredAuthError } from '@azure/msal-browser'
import { apiScopes } from './authConfig'
import './App.css'

type Pizza = { id: number; name: string; description: string; price: number }
type Me = { name: string; roles: string[] }

export default function App() {
  const { instance, accounts } = useMsal()
  const isAuthenticated = useIsAuthenticated()
  const [pizzas, setPizzas] = useState<Pizza[]>([])
  const [me, setMe] = useState<Me | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Returns an access token for the API, or null if a redirect to sign in again was started.
  const getToken = useCallback(async (): Promise<string | null> => {
    const account = accounts[0]
    try {
      const result = await instance.acquireTokenSilent({ scopes: apiScopes, account })
      return result.accessToken
    } catch (e) {
      if (e instanceof InteractionRequiredAuthError) {
        await instance.acquireTokenRedirect({ scopes: apiScopes, account })
        return null
      }
      throw e
    }
  }, [instance, accounts])

  async function callApi<T>(path: string, token: string): Promise<T> {
    const r = await fetch(path, { headers: { Authorization: `Bearer ${token}` } })
    if (!r.ok) throw new Error(`HTTP ${r.status}`)
    return r.json()
  }

  useEffect(() => {
    // Signed out: show nothing from the API.
    if (!isAuthenticated || accounts.length === 0) {
      setMe(null)
      setPizzas([])
      setError(null)
      return
    }
    ;(async () => {
      try {
        const token = await getToken()
        if (!token) return
        const [meData, menu] = await Promise.all([
          callApi<Me>('/api/me', token),
          callApi<Pizza[]>('/api/pizzas', token),
        ])
        setMe(meData)
        setPizzas(menu)
        setError(null)
      } catch (e) {
        setError(`Sign-in problem: ${(e as Error).message}`)
      }
    })()
  }, [isAuthenticated, accounts, getToken])

  return (
    <main>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
        <h1>🍕 ePizzaHub</h1>
        {isAuthenticated ? (
          <button onClick={() => instance.logoutRedirect()}>Sign out</button>
        ) : (
          <button onClick={() => instance.loginRedirect({ scopes: apiScopes })}>
            Sign in / Sign up
          </button>
        )}
      </header>

      {!isAuthenticated && <p>Please sign in or sign up to see our menu.</p>}

      {me && (
        <p>
          Welcome, <strong>{me.name}</strong> ({me.roles.join(', ')})
        </p>
      )}
      {error && <p role="alert">{error}</p>}

      {isAuthenticated && (
        <ul>
          {pizzas.map((p) => (
            <li key={p.id}>
              <strong>{p.name}</strong> – ₹{p.price}
              <br />
              <small>{p.description}</small>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
