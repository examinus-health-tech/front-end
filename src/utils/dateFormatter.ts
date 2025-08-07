export function formatDateToBrazilian(dateString: string): string {
  try {
    const date = new Date(dateString);

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Data inválida';
    }

    // Format day and month with leading zeros
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    // Format hours and minutes with leading zeros
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${day}/${month}/${year} - ${hours}h${minutes}`;
  } catch (error) {
    return 'Data inválida';
  }
}
