import { useEffect, useState } from 'react'
import axios from 'axios'
import Nav from '../components/Nav'

export default function Jogos() {
  const [jogos, setJogos] = useState([])
  const [titulo, setTitulo] = useState('')
  const [preco, setPreco] = useState('')
  const [quantidade, setQuantidade] = useState('')
  const [busca, setBusca] = useState('')
  const [editandoId, setEditandoId] = useState<number | null>(null)

  useEffect(() => {
    carregar()
  }, [])

  const carregar = async () => {
    const res = await axios.get('http://localhost:3008/jogos')
    setJogos(res.data)
  }

  const salvar = async () => {
    if (!titulo || !preco || !quantidade) return alert('Preencha todos os campos')

    const dados = {
      titulo,
      preco: parseFloat(preco),
      quantidade: parseInt(quantidade)
    }

    if (editandoId) {
      await axios.put(`http://localhost:3008/jogos/${editandoId}`, dados)
      setEditandoId(null)
    } else {
      await axios.post('http://localhost:3008/jogos', dados)
    }

    setTitulo('')
    setPreco('')
    setQuantidade('')
    carregar()
  }

  const excluir = async (id: number) => {
    if (confirm('Deseja realmente excluir?')) {
      await axios.delete(`http://localhost:3008/jogos/${id}`)
      carregar()
    }
  }

  const editar = (jogo: any) => {
    setEditandoId(jogo.id)
    setTitulo(jogo.titulo)
    setPreco(jogo.preco.toString())
    setQuantidade(jogo.quantidade.toString())
  }

  const filtrar = async () => {
    if (!busca) {
      carregar()
      return
    }

    const res = await axios.get(`http://localhost:3008/jogos?titulo=${busca}`)
    setJogos(res.data)
  }

  return (
    <div className="container">
      <Nav />
      <h2>Jogos</h2>

      <div className="form">
        <input
          type="text"
          placeholder="Título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />
        <input
          type="number"
          placeholder="Preço"
          value={preco}
          onChange={(e) => setPreco(e.target.value)}
        />
        <input
          type="number"
          placeholder="Quantidade"
          value={quantidade}
          onChange={(e) => setQuantidade(e.target.value)}
        />
        <button onClick={salvar}>{editandoId ? 'Atualizar' : 'Cadastrar'}</button>
      </div>

      <div className="form">
        <input
          type="text"
          placeholder="Buscar por título"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        <button onClick={filtrar}>Buscar</button>
      </div>

      <ul className="list">
        {jogos.map((j: any) => (
          <li key={j.id}>
            <strong>{j.titulo}</strong> — R$ {j.preco.toFixed(2)} ({j.quantidade} unidades)
            <div>
              <button onClick={() => editar(j)}>Editar</button>
              <button onClick={() => excluir(j.id)}>Excluir</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
