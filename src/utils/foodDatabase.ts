import { FoodItem } from '../types';

export const foodDatabase: FoodItem[] = [
  {
    id: '1',
    name: 'Frango',
    preparation: 'Grelhado',
    energy: 165,
    protein: 31,
    fat: 3.6,
    carb: 0
  },
  {
    id: '2',
    name: 'Arroz',
    preparation: 'Cozido',
    energy: 130,
    protein: 2.7,
    fat: 0.3,
    carb: 28
  },
  {
    id: '3',
    name: 'Feijão',
    preparation: 'Cozido',
    energy: 127,
    protein: 8.7,
    fat: 0.5,
    carb: 23
  },
  {
    id: '4',
    name: 'Ovo',
    preparation: 'Cozido',
    energy: 155,
    protein: 13,
    fat: 11,
    carb: 1.1
  },
  {
    id: '5',
    name: 'Atum',
    preparation: 'Enlatado em água',
    energy: 116,
    protein: 26,
    fat: 0.8,
    carb: 0
  },
  {
    id: '6',
    name: 'Salmão',
    preparation: 'Grelhado',
    energy: 208,
    protein: 25,
    fat: 12,
    carb: 0
  },
  {
    id: '7',
    name: 'Batata',
    preparation: 'Cozida',
    energy: 77,
    protein: 2,
    fat: 0.1,
    carb: 17
  },
  {
    id: '8',
    name: 'Brócolis',
    preparation: 'Cozido',
    energy: 34,
    protein: 2.8,
    fat: 0.4,
    carb: 7
  },
  {
    id: '9',
    name: 'Queijo muçarela',
    preparation: 'Não se aplica',
    energy: 280,
    protein: 28,
    fat: 17,
    carb: 2.2
  },
  {
    id: '10',
    name: 'Iogurte grego',
    preparation: 'Natural',
    energy: 59,
    protein: 10,
    fat: 0.4,
    carb: 3.6
  },
  {
    id: '11',
    name: 'Aveia',
    preparation: 'Cozida',
    energy: 68,
    protein: 2.4,
    fat: 1.4,
    carb: 12
  },
  {
    id: '12',
    name: 'Banana',
    preparation: 'Crua',
    energy: 89,
    protein: 1.1,
    fat: 0.3,
    carb: 23
  },
  {
    id: '13',
    name: 'Maçã',
    preparation: 'Crua',
    energy: 52,
    protein: 0.3,
    fat: 0.2,
    carb: 14
  },
  {
    id: '14',
    name: 'Espinafre',
    preparation: 'Cozido',
    energy: 23,
    protein: 2.9,
    fat: 0.4,
    carb: 3.8
  },
  {
    id: '15',
    name: 'Abacate',
    preparation: 'Cru',
    energy: 160,
    protein: 2,
    fat: 15,
    carb: 9
  },
  {
    id: '16',
    name: 'Amêndoas',
    preparation: 'Cruas',
    energy: 579,
    protein: 21,
    fat: 50,
    carb: 22
  },
  {
    id: '17',
    name: 'Pão integral',
    preparation: 'Não se aplica',
    energy: 247,
    protein: 13,
    fat: 4.2,
    carb: 41
  },
  {
    id: '18',
    name: 'Leite',
    preparation: 'Integral',
    energy: 61,
    protein: 3.2,
    fat: 3.3,
    carb: 4.8
  },
  {
    id: '19',
    name: 'Lentilha',
    preparation: 'Cozida',
    energy: 116,
    protein: 9,
    fat: 0.4,
    carb: 20
  },
  {
    id: '20',
    name: 'Quinoa',
    preparation: 'Cozida',
    energy: 120,
    protein: 4.4,
    fat: 1.9,
    carb: 22
  }
];

export const searchFoods = (query: string): FoodItem[] => {
  const lowerQuery = query.toLowerCase();
  return foodDatabase.filter(food => 
    food.name.toLowerCase().includes(lowerQuery) ||
    food.preparation.toLowerCase().includes(lowerQuery)
  );
}; 