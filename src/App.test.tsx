import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import App from './App'

describe('App', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders chat UI', () => {
    render(<App />)
    expect(screen.getByText('LLM Agent chat')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Ask about weather in any city')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument()
  })

  it('allows user to type a message', () => {
    render(<App />)
    const textarea = screen.getByPlaceholderText('Ask about weather in any city')
    fireEvent.change(textarea, { target: { value: 'weather in pune' } })
    expect(textarea).toHaveValue('weather in pune')
  })

  it('shows reply on successful API call', async () => {
    ;(fetch as any).mockResolvedValueOnce({
      json: async () => ({ reply: 'Sunny 30°C' })
    })

    render(<App />)
    fireEvent.change(screen.getByPlaceholderText('Ask about weather in any city'), { target: { value: 'weather in pune' } })
    fireEvent.click(screen.getByRole('button', { name: /send/i }))

    await waitFor(() => {
      expect(screen.getByText('Sunny 30°C')).toBeInTheDocument()
    })
  })

  it('shows error message on API failure', async () => {
    ;(fetch as any).mockRejectedValueOnce(new Error('Network error'))

    render(<App />)
    fireEvent.change(screen.getByPlaceholderText('Ask about weather in any city'), { target: { value: 'weather in pune' } })
    fireEvent.click(screen.getByRole('button', { name: /send/i }))

    await waitFor(() => {
      expect(screen.getByText('failed to get response from server')).toBeInTheDocument()
    })
  })
})
