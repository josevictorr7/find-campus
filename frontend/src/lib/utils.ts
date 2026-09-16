export function formatDate(dateString?: string): string {
  if (!dateString) return new Date().toLocaleDateString('pt-BR');
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateString;
  }
}

export function getStatusBadgeVariant(status: string): 'lost' | 'found' | 'returned' | 'default' {
  switch (status.toLowerCase()) {
    case 'perdido':
      return 'lost';
    case 'encontrado':
      return 'found';
    case 'devolvido':
      return 'returned';
    default:
      return 'default';
  }
}
