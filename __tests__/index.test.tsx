import Home from '@/app/page'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'

describe('Homes', () => {
  it('renders a heading', () => {
    render(<Home />)

    const heading = screen.getByRole('main')

    expect(heading).toBeInTheDocument()
  })
})
