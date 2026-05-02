export function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
}

export function calculateDaysLeft(expiryDateString: string): number {
  if (!expiryDateString) return 0;
  const expiryDate = new Date(expiryDateString);
  const today = new Date();
  
  // Reset time to midnight for accurate day calculation
  today.setHours(0, 0, 0, 0);
  expiryDate.setHours(0, 0, 0, 0);
  
  const diffTime = expiryDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  
  return diffDays;
}

export function getWarrantyStatus(expiryDateString: string): 'active' | 'expiring' | 'expired' {
  if (!expiryDateString) return 'expired';
  const daysLeft = calculateDaysLeft(expiryDateString);
  
  if (daysLeft < 0) {
    return 'expired';
  } else if (daysLeft <= 30) {
    return 'expiring';
  } else {
    return 'active';
  }
}
