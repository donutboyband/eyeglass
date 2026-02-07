import { useState } from 'react'
import './App.css'

// Sample components to test React Fiber detection

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary'
}

function Button({ children, onClick, variant = 'primary' }: ButtonProps) {
  return (
    <button
      className={`btn btn-${variant}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

interface CardProps {
  title: string
  children: React.ReactNode
}

function Card({ title, children }: CardProps) {
  return (
    <div className="card">
      <h2>{title}</h2>
      {children}
    </div>
  )
}

interface InputFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

function InputField({ label, value, onChange, placeholder }: InputFieldProps) {
  return (
    <div className="input-field">
      <label>{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  )
}

interface TextAreaProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
}

function TextArea({ label, value, onChange, placeholder, rows = 4 }: TextAreaProps) {
  return (
    <div className="input-field">
      <label>{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
      />
    </div>
  )
}

function Header() {
  return (
    <header className="header">
      <h1>Eyeglass React Test</h1>
      <p>Testing React Fiber component detection</p>
    </header>
  )
}

function App() {
  const [count, setCount] = useState(0)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')

  return (
    <div className="app">
      <Header />

      <main>
        <Card title="Counter Example">
          <p>Current count: <strong>{count}</strong></p>
          <div className="button-group">
            <Button variant="secondary" onClick={() => setCount(c => c - 1)}>
              Decrement
            </Button>
            <Button onClick={() => setCount(c => c + 1)}>
              Increment
            </Button>
            <Button variant="secondary" onClick={() => setCount(0)}>
              Reset
            </Button>
          </div>
        </Card>

        <Card title="Form Example">
          <InputField
            label="Name"
            value={name}
            onChange={setName}
            placeholder="Enter your name..."
          />
          <InputField
            label="Email"
            value={email}
            onChange={setEmail}
            placeholder="Enter your email..."
          />
          <InputField
            label="Phone"
            value={phone}
            onChange={setPhone}
            placeholder="Enter your phone number..."
          />
          <TextArea
            label="Message"
            value={message}
            onChange={setMessage}
            placeholder="Enter your message..."
          />
          <Button onClick={() => alert(`Hello, ${name}!`)}>
            Submit
          </Button>
        </Card>

        <Card title="Nested Components">
          <p>Click on different elements to see their React component info in the Eyeglass inspector.</p>
          <ul>
            <li>Component names should be detected</li>
            <li>File paths should be shown (in dev mode)</li>
            <li>Props should be visible</li>
          </ul>
        </Card>
      </main>
    </div>
  )
}

export default App
