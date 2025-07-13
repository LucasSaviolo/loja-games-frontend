import Link from 'next/link'

export default function Nav() {
  return (
    <nav className="nav-container">
      <ul className="nav-list">
        <li><Link href="/">Home</Link></li>
        <li><Link href="/clientes">Clientes</Link></li>
        <li><Link href="/jogos">Jogos</Link></li>
        <li><Link href="/vendas">Vendas</Link></li>
      </ul>
    </nav>
  )
}
