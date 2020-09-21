export default function prettyTicketStatus (value) {
  switch (value) {
    case 2: return 'Open'
    case 3: return 'Pending'
    case 4: return 'Resolved'
    case 5: return 'Closed'
    case 6: return 'Waiting on Customer'
    case 7: return 'Waiting on Third Party'
    default: return 'Unknown'
  }
}