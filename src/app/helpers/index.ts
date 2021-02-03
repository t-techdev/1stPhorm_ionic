export function mySQLFormattedDate(newDate?: Date) {
  if (!newDate) {
    newDate = new Date();
  }
  const year = newDate.getFullYear();
  const month = (newDate.getMonth() + 1).toString().padStart(2, '0');
  const day = newDate.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

import { environment } from '../../environments/environment';

export function apiUrl(endpoint: string) {
  return `${environment.apiUrl}${endpoint}`;
}
