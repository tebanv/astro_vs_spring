import { writable } from 'svelte/store';

// Definir las reglas de tipo de variable iniciales
const initialVariableTypeRules = [  
  { name: 'numeric', label: 'Numérico' },
  { name: 'string', label: 'Texto' },
  { name: 'uuid', label: 'Alfanumérico' },
  { name: 'binary', label: 'Binario' },
  { name: 'boolean', label: 'Booleano' }
];

// Crear el store con las reglas iniciales
export const categoriesStore = writable({
  variableTypeRules: initialVariableTypeRules
});
