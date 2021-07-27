// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {ErrorBoundary} from 'react-error-boundary'

import {
  PokemonForm,
  fetchPokemon,
  PokemonInfoFallback,
  PokemonDataView,
} from '../pokemon'

const IDLE = 'idle'
const PENDING = 'pending'
const RESOLVED = 'resolved'
const REJECTED = 'rejected'

function PokemonInfo({pokemonName}) {
  const [state, setState] = React.useState({
    status: pokemonName ? PENDING : IDLE,
    pokemon: null,
    error: null,
  })

  const {status, error, pokemon} = state

  React.useEffect(() => {
    if (!pokemonName) {
      return
    }

    setState({status: PENDING})

    fetchPokemon(pokemonName)
      .then(pokemonData => {
        setState({status: RESOLVED, pokemon: pokemonData})
      })
      .catch(error => {
        setState({status: REJECTED, error})
      })
  }, [pokemonName])

  if (status === REJECTED) {
    throw error
  }

  if (status === PENDING) {
    return <PokemonInfoFallback name={pokemonName} />
  }

  if (status === IDLE) {
    return 'Submit a pokemon'
  }

  if (status === RESOLVED) {
    return <PokemonDataView pokemon={pokemon} />
  }
}

function ErrorFallback({error, resetErrorBoundary}) {
  return (
    <div role="alert">
      There was an error:{' '}
      <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try Again!</button>
    </div>
  )
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  function handleReset() {
    setPokemonName('')
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          onReset={handleReset}
          resetKeys={[pokemonName]}
        >
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
