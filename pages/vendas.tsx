import { useEffect, useState } from 'react'
import axios from 'axios'
import Nav from '../components/Nav'

export default function Vendas() {
  const [vendas, setVendas] = useState<any[]>([])
  const [clientes, setClientes] = useState<any[]>([])
  const [jogos, setJogos] = useState<any[]>([])
  const [clienteId, setClienteId] = useState('')
  const [jogoId, setJogoId] = useState('')
  const [quantidade, setQuantidade] = useState('')
  const [preco, setPreco] = useState(0)
  const [busca, setBusca] = useState('')

  useEffect(() => {
    listar()
    axios.get('http://localhost:3008/clientes').then(res => setClientes(res.data))
    axios.get('http://localhost:3008/jogos').then(res => setJogos(res.data))
  }, [])

  const listar = () => {
    const url = busca
      ? `http://localhost:3008/vendas?nome=${encodeURIComponent(busca)}`
      : 'http://localhost:3008/vendas'

    axios.get(url).then(res => setVendas(res.data))
  }

  useEffect(() => {
    listar()
  }, [busca])

  const salvar = async () => {
    const dados = {
      clienteId: Number(clienteId),
      jogoId: Number(jogoId),
      quantidade: Number(quantidade),
      valorTotal: Number(quantidade) * Number(preco)
    }

    try {
      await axios.post('http://localhost:3008/vendas', dados)
      alert('Venda registrada com sucesso!')
      setClienteId('')
      setJogoId('')
      setQuantidade('')
      setPreco(0)
      listar()
    } catch (error: any) {
      const mensagem = error.response?.data?.message || 'Erro ao realizar venda.'
      alert(mensagem)
    }
  }

  const atualizarPreco = (id: string) => {
    const jogoSelecionado = jogos.find(j => j.id === Number(id))
    setPreco(jogoSelecionado?.preco || 0)
  }

  return (
    <div className="container">
      <Nav />
      <h2>Vendas</h2>

      <div className="form">
        <select value={clienteId} onChange={e => setClienteId(e.target.value)}>
          <option value="">Selecione o Cliente</option>
          {clientes.map(c => (
            <option key={c.id} value={c.id}>{c.nome}</option>
          ))}
        </select>

        <select
          value={jogoId}
          onChange={e => {
            setJogoId(e.target.value)
            atualizarPreco(e.target.value)
          }}
        >
          <option value="">Selecione o Jogo</option>
          {jogos.map(j => (
            <option key={j.id} value={j.id}>{j.titulo}</option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Quantidade"
          value={quantidade}
          onChange={e => setQuantidade(e.target.value)}
        />

        <button onClick={salvar}>Registrar Venda</button>
      </div>

      <div className="search">
        <input
          type="text"
          placeholder="Buscar por nome do cliente..."
          value={busca}
          onChange={e => setBusca(e.target.value)}
        />
      </div>

      <table>
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Jogo</th>
            <th>Quantidade</th>
            <th>Valor Total</th>
            <th>Data</th>
          </tr>
        </thead>
        <tbody>
          {vendas.map(v => (
            <tr key={v.id}>
              <td>{v.cliente?.nome}</td>
              <td>{v.jogo?.titulo}</td>
              <td>{v.quantidade}</td>
              <td>R$ {v.valorTotal.toFixed(2)}</td>
              <td>{new Date(v.data).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
