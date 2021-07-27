// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
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
    status: IDLE,
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
    return (
      <div role="alert">
        There was an error:{' '}
        <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
      </div>
    )
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

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <PokemonInfo pokemonName={pokemonName} />
      </div>
    </div>
  )
}

export default App
