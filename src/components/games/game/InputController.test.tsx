import { render, screen, fireEvent } from '@testing-library/react'
import { InputController } from './InputController'

describe('InputController', () => {
  it('updates state on change', () => {
    render(<InputController onSubmit={jest.fn()} />)
    const input = screen.getByRole('textbox') as HTMLInputElement
    
    fireEvent.change(input, { target: { value: 'Manzana' } })
    expect(input.value).toBe('Manzana')
  })

  it('calls onSubmit and clears input on Enter', () => {
    const onSubmit = jest.fn()
    render(<InputController onSubmit={onSubmit} />)
    const input = screen.getByRole('textbox') as HTMLInputElement
    
    fireEvent.change(input, { target: { value: 'Manzana' } })
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })
    
    expect(onSubmit).toHaveBeenCalledWith('Manzana')
    expect(input.value).toBe('')
  })

  it('maintains focus on desktop so typing works immediately', () => {
    const onSubmit = jest.fn()
    render(<InputController onSubmit={onSubmit} />)
    const input = screen.getByRole('textbox') as HTMLInputElement
    
    // Input should be focused on mount
    expect(document.activeElement).toBe(input)
  })

  it('refocuses input on window click for desktop', () => {
    const onSubmit = jest.fn()
    render(<InputController onSubmit={onSubmit} />)
    const input = screen.getByRole('textbox') as HTMLInputElement
    
    // Blur the input
    input.blur()
    expect(document.activeElement).not.toBe(input)
    
    // Click on window should refocus
    fireEvent.click(window)
    expect(document.activeElement).toBe(input)
  })

  it('refocuses input on window keydown for desktop', () => {
    const onSubmit = jest.fn()
    render(<InputController onSubmit={onSubmit} />)
    const input = screen.getByRole('textbox') as HTMLInputElement
    
    // Blur the input
    input.blur()
    expect(document.activeElement).not.toBe(input)
    
    // Keydown on window should refocus
    fireEvent.keyDown(window, { key: 'a' })
    expect(document.activeElement).toBe(input)
  })

  it('processes typing immediately after start without requiring a click', () => {
    const onSubmit = jest.fn()
    render(<InputController onSubmit={onSubmit} />)
    const input = screen.getByRole('textbox') as HTMLInputElement
    
    // Type directly without clicking first
    fireEvent.change(input, { target: { value: 'spell' } })
    expect(input.value).toBe('spell')
  })
})
