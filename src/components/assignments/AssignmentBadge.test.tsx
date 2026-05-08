import { render, screen } from '@testing-library/react'
import { AssignmentBadge } from './AssignmentBadge'
import { useAssignmentStore } from '@/store/assignmentStore'

// Mock the assignment store
jest.mock('@/store/assignmentStore')

describe('AssignmentBadge', () => {
  const mockUseAssignmentStore = useAssignmentStore as unknown as jest.Mock

  beforeEach(() => {
    mockUseAssignmentStore.mockImplementation((selector) =>
      selector({ assignments: [] })
    )
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders nothing when no assignments exist', () => {
    const { container } = render(<AssignmentBadge gameId="castle-defense" />)
    expect(container.firstChild).toBeNull()
  })

  it('renders nothing when no assignments match the game', () => {
    mockUseAssignmentStore.mockImplementation((selector) =>
      selector({
        assignments: [
          {
            id: 'assignment-1',
            gameIds: ['dragon-rider'],
            status: 'active',
            dueDate: undefined,
          },
        ],
      })
    )

    const { container } = render(<AssignmentBadge gameId="castle-defense" />)
    expect(container.firstChild).toBeNull()
  })

  it('renders "Due" badge for active assignment with matching game', () => {
    mockUseAssignmentStore.mockImplementation((selector) =>
      selector({
        assignments: [
          {
            id: 'assignment-1',
            gameIds: ['castle-defense'],
            status: 'active',
            dueDate: new Date(Date.now() + 86400000), // tomorrow
          },
        ],
      })
    )

    render(<AssignmentBadge gameId="castle-defense" />)
    expect(screen.getByText('Due')).toBeInTheDocument()
  })

  it('renders "Assignment" badge for active assignment with past due date', () => {
    mockUseAssignmentStore.mockImplementation((selector) =>
      selector({
        assignments: [
          {
            id: 'assignment-1',
            gameIds: ['castle-defense'],
            status: 'active',
            dueDate: new Date(Date.now() - 86400000), // yesterday
          },
        ],
      })
    )

    render(<AssignmentBadge gameId="castle-defense" />)
    expect(screen.getByText('Assignment')).toBeInTheDocument()
  })

  it('renders count for multiple due assignments', () => {
    mockUseAssignmentStore.mockImplementation((selector) =>
      selector({
        assignments: [
          {
            id: 'assignment-1',
            gameIds: ['castle-defense'],
            status: 'active',
            dueDate: new Date(Date.now() + 86400000),
          },
          {
            id: 'assignment-2',
            gameIds: ['castle-defense'],
            status: 'active',
            dueDate: new Date(Date.now() + 172800000),
          },
        ],
      })
    )

    render(<AssignmentBadge gameId="castle-defense" />)
    expect(screen.getByText('2 Due')).toBeInTheDocument()
  })

  it('ignores non-active assignments', () => {
    mockUseAssignmentStore.mockImplementation((selector) =>
      selector({
        assignments: [
          {
            id: 'assignment-1',
            gameIds: ['castle-defense'],
            status: 'completed',
            dueDate: new Date(Date.now() + 86400000),
          },
        ],
      })
    )

    const { container } = render(<AssignmentBadge gameId="castle-defense" />)
    expect(container.firstChild).toBeNull()
  })
})
