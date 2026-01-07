import { Category, Product } from "@/types/pos";

export const categories: Category[] = [
  { id: "bebidas", name: "Bebidas", productCount: 8 },
  { id: "entradas", name: "Entradas", productCount: 6 },
  { id: "platos-fuertes", name: "Platos Fuertes", productCount: 12 },
  { id: "postres", name: "Postres", productCount: 5 },
  { id: "combos", name: "Combos", productCount: 4 },
  { id: "extras", name: "Extras", productCount: 6 },
];

export const products: Product[] = [
  // Bebidas
  {
    id: "b1",
    name: "Coca-Cola",
    price: 75,
    categoryId: "bebidas",
    hasModifiers: true,
    modifierGroups: [
      {
        id: "tamano",
        name: "Tamaño",
        required: true,
        minSelection: 1,
        maxSelection: 1,
        modifiers: [
          { id: "pequeno", name: "Pequeño", price: 0 },
          { id: "mediano", name: "Mediano", price: 25 },
          { id: "grande", name: "Grande", price: 50 },
        ],
      },
      {
        id: "hielo",
        name: "Hielo",
        required: false,
        minSelection: 0,
        maxSelection: 1,
        modifiers: [
          { id: "sin-hielo", name: "Sin hielo", price: 0 },
          { id: "poco-hielo", name: "Poco hielo", price: 0 },
          { id: "extra-hielo", name: "Extra hielo", price: 0 },
        ],
      },
    ],
  },
  {
    id: "b2",
    name: "Jugo de Chinola",
    price: 120,
    categoryId: "bebidas",
    hasModifiers: true,
    modifierGroups: [
      {
        id: "azucar",
        name: "Azúcar",
        required: false,
        minSelection: 0,
        maxSelection: 1,
        modifiers: [
          { id: "sin-azucar", name: "Sin azúcar", price: 0 },
          { id: "poca-azucar", name: "Poca azúcar", price: 0 },
          { id: "normal", name: "Normal", price: 0 },
        ],
      },
    ],
  },
  {
    id: "b3",
    name: "Agua Mineral",
    price: 50,
    categoryId: "bebidas",
    hasModifiers: false,
  },
  {
    id: "b4",
    name: "Cerveza Presidente",
    price: 150,
    categoryId: "bebidas",
    hasModifiers: true,
    modifierGroups: [
      {
        id: "tamano",
        name: "Tamaño",
        required: true,
        minSelection: 1,
        maxSelection: 1,
        modifiers: [
          { id: "pequena", name: "Pequeña", price: 0 },
          { id: "grande", name: "Grande", price: 75 },
          { id: "jumbo", name: "Jumbo", price: 125 },
        ],
      },
    ],
  },
  {
    id: "b5",
    name: "Morir Soñando",
    price: 150,
    categoryId: "bebidas",
    hasModifiers: false,
  },
  // Entradas
  {
    id: "e1",
    name: "Tostones con Queso",
    price: 250,
    categoryId: "entradas",
    hasModifiers: true,
    modifierGroups: [
      {
        id: "extras",
        name: "Extras",
        required: false,
        minSelection: 0,
        maxSelection: 3,
        modifiers: [
          { id: "extra-queso", name: "Extra queso", price: 50 },
          { id: "salsa-golf", name: "Salsa golf", price: 25 },
          { id: "bacon", name: "Bacon", price: 75 },
        ],
      },
    ],
  },
  {
    id: "e2",
    name: "Empanadas (3 uds)",
    price: 180,
    categoryId: "entradas",
    hasModifiers: true,
    modifierGroups: [
      {
        id: "relleno",
        name: "Relleno",
        required: true,
        minSelection: 1,
        maxSelection: 1,
        modifiers: [
          { id: "carne", name: "Carne", price: 0 },
          { id: "pollo", name: "Pollo", price: 0 },
          { id: "queso", name: "Queso", price: 0 },
        ],
      },
    ],
  },
  {
    id: "e3",
    name: "Yaroa",
    price: 350,
    categoryId: "entradas",
    hasModifiers: true,
    modifierGroups: [
      {
        id: "proteina",
        name: "Proteína",
        required: true,
        minSelection: 1,
        maxSelection: 1,
        modifiers: [
          { id: "pollo", name: "Pollo", price: 0 },
          { id: "carne", name: "Carne", price: 50 },
          { id: "mixta", name: "Mixta", price: 75 },
        ],
      },
      {
        id: "extras",
        name: "Extras",
        required: false,
        minSelection: 0,
        maxSelection: 5,
        modifiers: [
          { id: "extra-queso", name: "Extra queso", price: 50 },
          { id: "extra-carne", name: "Extra carne", price: 100 },
          { id: "sin-cebolla", name: "Sin cebolla", price: 0 },
        ],
      },
    ],
  },
  // Platos Fuertes
  {
    id: "p1",
    name: "La Bandera Dominicana",
    price: 350,
    categoryId: "platos-fuertes",
    hasModifiers: true,
    modifierGroups: [
      {
        id: "carne",
        name: "Tipo de Carne",
        required: true,
        minSelection: 1,
        maxSelection: 1,
        modifiers: [
          { id: "pollo-guisado", name: "Pollo guisado", price: 0 },
          { id: "carne-guisada", name: "Carne guisada", price: 50 },
          { id: "chuleta", name: "Chuleta", price: 75 },
        ],
      },
    ],
  },
  {
    id: "p2",
    name: "Mofongo",
    price: 450,
    categoryId: "platos-fuertes",
    hasModifiers: true,
    modifierGroups: [
      {
        id: "relleno",
        name: "Relleno",
        required: true,
        minSelection: 1,
        maxSelection: 1,
        modifiers: [
          { id: "chicharron", name: "Chicharrón", price: 0 },
          { id: "camarones", name: "Camarones", price: 150 },
          { id: "pollo", name: "Pollo", price: 50 },
          { id: "carne", name: "Carne", price: 100 },
        ],
      },
    ],
  },
  {
    id: "p3",
    name: "Sancocho",
    price: 400,
    categoryId: "platos-fuertes",
    hasModifiers: false,
  },
  {
    id: "p4",
    name: "Churrasco",
    price: 650,
    categoryId: "platos-fuertes",
    hasModifiers: true,
    modifierGroups: [
      {
        id: "termino",
        name: "Término",
        required: true,
        minSelection: 1,
        maxSelection: 1,
        modifiers: [
          { id: "tres-cuartos", name: "3/4", price: 0 },
          { id: "bien-cocido", name: "Bien cocido", price: 0 },
          { id: "termino-medio", name: "Término medio", price: 0 },
        ],
      },
      {
        id: "extras",
        name: "Acompañantes extra",
        required: false,
        minSelection: 0,
        maxSelection: 3,
        modifiers: [
          { id: "tostones", name: "Tostones", price: 75 },
          { id: "ensalada", name: "Ensalada", price: 50 },
          { id: "papas-fritas", name: "Papas fritas", price: 75 },
        ],
      },
    ],
  },
  {
    id: "p5",
    name: "Pescado Frito",
    price: 550,
    categoryId: "platos-fuertes",
    hasModifiers: false,
  },
  {
    id: "p6",
    name: "Mangú con Los Tres Golpes",
    price: 280,
    categoryId: "platos-fuertes",
    hasModifiers: false,
  },
  // Postres
  {
    id: "d1",
    name: "Flan de Coco",
    price: 150,
    categoryId: "postres",
    hasModifiers: false,
  },
  {
    id: "d2",
    name: "Tres Leches",
    price: 180,
    categoryId: "postres",
    hasModifiers: false,
  },
  {
    id: "d3",
    name: "Helado",
    price: 120,
    categoryId: "postres",
    hasModifiers: true,
    modifierGroups: [
      {
        id: "sabor",
        name: "Sabor",
        required: true,
        minSelection: 1,
        maxSelection: 2,
        modifiers: [
          { id: "chocolate", name: "Chocolate", price: 0 },
          { id: "vainilla", name: "Vainilla", price: 0 },
          { id: "fresa", name: "Fresa", price: 0 },
        ],
      },
    ],
  },
  // Combos
  {
    id: "c1",
    name: "Combo Familiar",
    price: 1200,
    categoryId: "combos",
    hasModifiers: false,
  },
  {
    id: "c2",
    name: "Combo Pareja",
    price: 750,
    categoryId: "combos",
    hasModifiers: false,
  },
  // Extras
  {
    id: "x1",
    name: "Arroz Blanco",
    price: 80,
    categoryId: "extras",
    hasModifiers: false,
  },
  {
    id: "x2",
    name: "Habichuelas",
    price: 80,
    categoryId: "extras",
    hasModifiers: false,
  },
  {
    id: "x3",
    name: "Ensalada",
    price: 100,
    categoryId: "extras",
    hasModifiers: false,
  },
];
