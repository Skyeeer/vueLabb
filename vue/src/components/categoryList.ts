export const categories = [
  { id: 9, name: 'General Knowledge' },
  { id: 11, name: 'Film' },
  { id: 12, name: 'Music' },
  { id: 15, name: 'Video Games' },
  { id: 23, name: 'History' },
];

export function getCategoryNameById(id: number): string {
  const category = categories.find((category) => category.id === id);
  return category ? category.name : 'Unknown Category';
}
