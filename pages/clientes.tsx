import { useEffect, useState } from 'react'
import axios from 'axios'
import Nav from '../components/Nav'

export default function Clientes() {
  const [clientes, setClientes] = useState([])
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [busca, setBusca] = useState('')
  const [editandoId, setEditandoId] = useState<number | null>(null)

  useEffect(() => {
    carregar()
  }, [])

  const carregar = async () => {
    const res = await axios.get('http://localhost:3008/clientes')
    setClientes(res.data)
  }

  const salvar = async () => {
    if (!nome || !email) return alert('Preencha todos os campos')

    if (editandoId) {
      await axios.put(`http://localhost:3008/clientes/${editandoId}`, { nome, email })
      setEditandoId(null)
    } else {
      await axios.post('http://localhost:3008/clientes', { nome, email })
    }

    setNome('')
    setEmail('')
    carregar()
  }

  const excluir = async (id: number) => {
    if (confirm('Deseja realmente excluir?')) {
      await axios.delete(`http://localhost:3008/clientes/${id}`)
      carregar()
    }
  }

  const editar = (cliente: any) => {
    setEditandoId(cliente.id)
    setNome(cliente.nome)
    setEmail(cliente.email)
  }

  const filtrar = async () => {
    if (!busca) {
      carregar()
      return
    }

    const res = await axios.get(`http://localhost:3008/clientes?nome=${busca}`)
    setClientes(res.data)
  }

  return (
    <div className="container">
      <Nav />
      <h2>Clientes</h2>

      <div className="form">
        <input
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={salvar}>{editandoId ? 'Atualizar' : 'Cadastrar'}</button>
      </div>

      <div className="form">
        <input
          type="text"
          placeholder="Buscar por nome"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        <button onClick={filtrar}>Buscar</button>
      </div>

      <ul className="list">
        {clientes.map((c: any) => (
          <li key={c.id}>
            <strong>{c.nome}</strong> — {c.email}
            <div>
              <button onClick={() => editar(c)}>Editar</button>
              <button onClick={() => excluir(c.id)}>Excluir</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
