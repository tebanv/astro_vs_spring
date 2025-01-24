import { writable } from 'svelte/store';

// Definir las reglas de tipo de variable iniciales
const initialVariableTypeRules = [  
  { name: 'numeric' },
  { name: 'string' },
  { name: 'uuid' },
  { name: 'binary' },
  { name: 'boolean' }
];

// Crear el store con las reglas iniciales
export const categoriesStore = writable({
  variableTypeRules: initialVariableTypeRules
});
