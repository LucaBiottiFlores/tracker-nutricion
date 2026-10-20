/* Base de alimentos (valores por 100 g / 100 ml, referenciales).
   Fuente principal: USDA FoodData Central + tablas chilenas (Schmidt-Hebbel).
   Campos: kcal, prot (g), carb (g), fat (g), fiber (g), sugar (g), sodium (mg),
           satfat (g), calcium (mg), iron (mg), potassium (mg), vitc (mg).
   u = porciones comunes en gramos (taza, cda, cdta, unidad, porcion). */
window.FOODS = [
  // ---- Cereales y panes ----
  { n:"Avena (cruda)", cat:"Cereales", kcal:389, prot:16.9, carb:66.3, fat:6.9, fiber:10.6, sugar:1, sodium:2, satfat:1.2, calcium:54, iron:4.7, potassium:429, vitc:0, u:{taza:80, cda:10, porcion:40} },
  { n:"Avena (cocida en agua)", cat:"Cereales", kcal:71, prot:2.5, carb:12, fat:1.5, fiber:1.7, sugar:0.3, sodium:4, satfat:0.3, calcium:9, iron:0.9, potassium:61, vitc:0, u:{taza:240, porcion:200} },
  { n:"Avena instantánea Cuisine & Co", cat:"Cereales", kcal:350, prot:12.5, carb:57.3, fat:7.9, fiber:9.9, sugar:1.2, sodium:3, satfat:1.3, calcium:54, iron:4.7, potassium:429, vitc:0, u:{taza:60, cda:10, porcion:30} },
  { n:"Arroz blanco (cocido)", cat:"Cereales", kcal:130, prot:2.7, carb:28.2, fat:0.3, fiber:0.4, sugar:0.1, sodium:1, satfat:0.1, calcium:10, iron:0.2, potassium:35, vitc:0, u:{taza:180, cda:15, porcion:150} },
  { n:"Arroz integral (cocido)", cat:"Cereales", kcal:111, prot:2.6, carb:23, fat:0.9, fiber:1.8, sugar:0.4, sodium:5, satfat:0.2, calcium:10, iron:0.5, potassium:43, vitc:0, u:{taza:180, porcion:150} },
  { n:"Fideos / pasta (cocidos)", cat:"Cereales", kcal:158, prot:5.8, carb:31, fat:0.9, fiber:1.8, sugar:0.6, sodium:1, satfat:0.2, calcium:7, iron:0.5, potassium:44, vitc:0, u:{taza:140, porcion:200} },
  { n:"Quinoa (cocida)", cat:"Cereales", kcal:120, prot:4.4, carb:21.3, fat:1.9, fiber:2.8, sugar:0.9, sodium:7, satfat:0.2, calcium:17, iron:1.5, potassium:172, vitc:0, u:{taza:185, porcion:150} },
  { n:"Pan marraqueta", cat:"Pan", kcal:277, prot:9.5, carb:55, fat:1.9, fiber:2.7, sugar:2.5, sodium:540, satfat:0.4, calcium:52, iron:2.4, potassium:115, vitc:0, u:{unidad:100, porcion:50} },
  { n:"Pan hallulla", cat:"Pan", kcal:289, prot:9.5, carb:55, fat:3.5, fiber:2.5, sugar:3, sodium:520, satfat:0.8, calcium:50, iron:2.3, potassium:110, vitc:0, u:{unidad:55, porcion:55} },
  { n:"Pan de molde integral", cat:"Pan", kcal:247, prot:12, carb:41, fat:3.4, fiber:6, sugar:6, sodium:400, satfat:0.7, calcium:120, iron:2.8, potassium:230, vitc:0, u:{unidad:25, porcion:50} },
  { n:"Mote (cocido)", cat:"Cereales", kcal:90, prot:2.5, carb:20, fat:0.4, fiber:1.5, sugar:0.5, sodium:5, satfat:0.1, calcium:8, iron:0.5, potassium:60, vitc:0, u:{taza:160, porcion:150} },

  // ---- Lácteos y huevos ----
  { n:"Yogur natural (sin azúcar)", cat:"Lácteos", kcal:61, prot:3.5, carb:4.7, fat:3.3, fiber:0, sugar:4.7, sodium:46, satfat:2.1, calcium:121, iron:0.1, potassium:155, vitc:0.5, u:{taza:245, porcion:170} },
  { n:"Yogur batido sabor (con azúcar)", cat:"Lácteos", kcal:85, prot:3.2, carb:14, fat:2.5, fiber:0, sugar:13, sodium:50, satfat:1.6, calcium:110, iron:0.1, potassium:140, vitc:0.5, u:{taza:245, porcion:150} },
  { n:"Yogur Soprole Proteína natural (pote 155 g)", cat:"Lácteos", kcal:68, prot:6.6, carb:6.3, fat:1.8, fiber:0, sugar:6.3, sodium:65, satfat:1.2, calcium:120, iron:0.1, potassium:150, vitc:0.5, u:{unidad:155, porcion:155} },
  { n:"Yogur Soprole Protein Power natural (pote 155 g)", cat:"Lácteos", kcal:84, prot:10.4, carb:7.1, fat:1.5, fiber:0, sugar:0, sodium:59, satfat:1.0, calcium:120, iron:0.1, potassium:150, vitc:0.5, u:{unidad:155, porcion:155} },
  { n:"Yogur Nestlé Goodnes Protein natural (pote 140 g)", cat:"Lácteos", kcal:81, prot:7.2, carb:8.8, fat:1.9, fiber:0, sugar:6.9, sodium:87, satfat:1.2, calcium:120, iron:0.1, potassium:150, vitc:0.5, u:{unidad:140, porcion:140} },
  { n:"Leche entera", cat:"Lácteos", kcal:61, prot:3.2, carb:4.8, fat:3.3, fiber:0, sugar:5.1, sodium:44, satfat:1.9, calcium:113, iron:0.03, potassium:132, vitc:0, u:{taza:240, porcion:200} },
  { n:"Leche descremada", cat:"Lácteos", kcal:34, prot:3.4, carb:5, fat:0.1, fiber:0, sugar:5, sodium:42, satfat:0.1, calcium:122, iron:0.03, potassium:156, vitc:0, u:{taza:240, porcion:200} },
  { n:"Huevo (entero)", cat:"Lácteos y huevos", kcal:155, prot:12.6, carb:1.1, fat:10.6, fiber:0, sugar:1.1, sodium:124, satfat:3.3, calcium:56, iron:1.8, potassium:138, vitc:0, u:{unidad:50, porcion:50} },
  { n:"Clara de huevo", cat:"Lácteos y huevos", kcal:52, prot:10.9, carb:0.7, fat:0.2, fiber:0, sugar:0.7, sodium:166, satfat:0, calcium:7, iron:0.1, potassium:163, vitc:0, u:{unidad:33, porcion:33} },
  { n:"Queso chanco / mantecoso", cat:"Lácteos", kcal:360, prot:24, carb:1.5, fat:28, fiber:0, sugar:0.5, sodium:700, satfat:18, calcium:700, iron:0.2, potassium:90, vitc:0, u:{unidad:25, porcion:25} },

  // ---- Carnes ----
  { n:"Carne vacuno magra (posta, cocida)", cat:"Carnes", kcal:200, prot:28, carb:0, fat:9, fiber:0, sugar:0, sodium:60, satfat:3.5, calcium:8, iron:2.7, potassium:330, vitc:0, u:{porcion:150} },
  { n:"Carne vacuno (lomo liso, cocida)", cat:"Carnes", kcal:230, prot:26, carb:0, fat:13, fiber:0, sugar:0, sodium:60, satfat:5.5, calcium:8, iron:2.5, potassium:310, vitc:0, u:{porcion:150} },
  { n:"Pollo pechuga (cocida, sin piel)", cat:"Carnes", kcal:165, prot:31, carb:0, fat:3.6, fiber:0, sugar:0, sodium:74, satfat:1, calcium:15, iron:1, potassium:256, vitc:0, u:{porcion:150} },
  { n:"Pollo trutro (cocido, con piel)", cat:"Carnes", kcal:230, prot:25, carb:0, fat:14, fiber:0, sugar:0, sodium:90, satfat:3.8, calcium:12, iron:1.1, potassium:230, vitc:0, u:{porcion:150} },
  { n:"Pavo pechuga (cocida)", cat:"Carnes", kcal:135, prot:30, carb:0, fat:1, fiber:0, sugar:0, sodium:70, satfat:0.3, calcium:12, iron:1.2, potassium:280, vitc:0, u:{porcion:150} },
  { n:"Cerdo lomo (cocido)", cat:"Carnes", kcal:230, prot:27, carb:0, fat:13, fiber:0, sugar:0, sodium:65, satfat:4.5, calcium:10, iron:1.2, potassium:350, vitc:0, u:{porcion:150} },

  // ---- Pescados y mariscos ----
  { n:"Reineta (cocida)", cat:"Pescados", kcal:130, prot:20, carb:0, fat:5, fiber:0, sugar:0, sodium:90, satfat:1, calcium:15, iron:0.5, potassium:350, vitc:0, u:{porcion:150} },
  { n:"Salmón (cocido)", cat:"Pescados", kcal:208, prot:20, carb:0, fat:13, fiber:0, sugar:0, sodium:59, satfat:3.1, calcium:9, iron:0.3, potassium:363, vitc:0, u:{porcion:150} },
  { n:"Jurel (cocido)", cat:"Pescados", kcal:160, prot:24, carb:0, fat:6, fiber:0, sugar:0, sodium:80, satfat:1.5, calcium:20, iron:1, potassium:320, vitc:0, u:{porcion:150} },
  { n:"Merluza (cocida)", cat:"Pescados", kcal:90, prot:19, carb:0, fat:1, fiber:0, sugar:0, sodium:80, satfat:0.2, calcium:15, iron:0.4, potassium:380, vitc:0, u:{porcion:150} },
  { n:"Atún en agua (lata)", cat:"Pescados", kcal:116, prot:26, carb:0, fat:1, fiber:0, sugar:0, sodium:340, satfat:0.3, calcium:12, iron:1.3, potassium:230, vitc:0, u:{lata:112, porcion:112} },
  { n:"Atún en aceite (lata)", cat:"Pescados", kcal:198, prot:29, carb:0, fat:8, fiber:0, sugar:0, sodium:400, satfat:1.5, calcium:12, iron:1.4, potassium:200, vitc:0, u:{lata:112, porcion:112} },
  { n:"Caballa Acuenta (lata, escurrida)", cat:"Pescados", kcal:200, prot:19, carb:0, fat:13, fiber:0, sugar:0, sodium:300, satfat:3.5, calcium:12, iron:1.6, potassium:314, vitc:0, u:{lata:280, porcion:100} },
  { n:"Atún Van Camp's (lata, escurrida)", cat:"Pescados", kcal:116, prot:26, carb:0, fat:1, fiber:0, sugar:0, sodium:340, satfat:0.3, calcium:12, iron:1.3, potassium:230, vitc:0, u:{lata:92, porcion:92} },

  // ---- Legumbres (cocidas) ----
  { n:"Porotos (cocidos)", cat:"Legumbres", kcal:127, prot:8.7, carb:22.8, fat:0.5, fiber:6.4, sugar:0.3, sodium:2, satfat:0.1, calcium:28, iron:2.9, potassium:400, vitc:0, u:{taza:170, porcion:200} },
  { n:"Lentejas (cocidas)", cat:"Legumbres", kcal:116, prot:9, carb:20, fat:0.4, fiber:7.9, sugar:1.8, sodium:2, satfat:0.1, calcium:19, iron:3.3, potassium:369, vitc:1.5, u:{taza:200, porcion:200} },
  { n:"Garbanzos (cocidos)", cat:"Legumbres", kcal:164, prot:8.9, carb:27, fat:2.6, fiber:7.6, sugar:4.8, sodium:7, satfat:0.3, calcium:49, iron:2.9, potassium:291, vitc:1.3, u:{taza:160, porcion:200} },

  // ---- Verduras ----
  { n:"Lechuga", cat:"Verduras", kcal:15, prot:1.4, carb:2.9, fat:0.2, fiber:1.3, sugar:0.8, sodium:28, satfat:0, calcium:36, iron:0.9, potassium:194, vitc:9.2, u:{taza:47, porcion:100} },
  { n:"Tomate", cat:"Verduras", kcal:18, prot:0.9, carb:3.9, fat:0.2, fiber:1.2, sugar:2.6, sodium:5, satfat:0, calcium:10, iron:0.3, potassium:237, vitc:13.7, u:{unidad:120, porcion:100} },
  { n:"Zapallo (cocido)", cat:"Verduras", kcal:26, prot:0.8, carb:6.5, fat:0.1, fiber:1.1, sugar:2.8, sodium:1, satfat:0, calcium:15, iron:0.6, potassium:230, vitc:4.7, u:{taza:245, porcion:150} },
  { n:"Brócoli (cocido)", cat:"Verduras", kcal:35, prot:2.4, carb:7.2, fat:0.4, fiber:3.3, sugar:1.4, sodium:41, satfat:0.1, calcium:40, iron:0.7, potassium:293, vitc:64.9, u:{taza:156, porcion:100} },
  { n:"Espinaca (cocida)", cat:"Verduras", kcal:23, prot:3, carb:3.8, fat:0.3, fiber:2.4, sugar:0.4, sodium:70, satfat:0, calcium:136, iron:3.6, potassium:466, vitc:9.8, u:{taza:180, porcion:100} },
  { n:"Zanahoria", cat:"Verduras", kcal:41, prot:0.9, carb:9.6, fat:0.2, fiber:2.8, sugar:4.7, sodium:69, satfat:0, calcium:33, iron:0.3, potassium:320, vitc:5.9, u:{unidad:72, porcion:100} },
  { n:"Choclo (cocido)", cat:"Verduras", kcal:96, prot:3.4, carb:21, fat:1.5, fiber:2.4, sugar:4.5, sodium:1, satfat:0.2, calcium:2, iron:0.5, potassium:218, vitc:5.5, u:{unidad:90, porcion:100} },
  { n:"Cebolla", cat:"Verduras", kcal:40, prot:1.1, carb:9.3, fat:0.1, fiber:1.7, sugar:4.2, sodium:4, satfat:0, calcium:23, iron:0.2, potassium:146, vitc:7.4, u:{unidad:110, porcion:100} },
  { n:"Zapallo italiano", cat:"Verduras", kcal:17, prot:1.2, carb:3.1, fat:0.3, fiber:1, sugar:2.5, sodium:8, satfat:0.1, calcium:16, iron:0.4, potassium:261, vitc:17.9, u:{unidad:100, porcion:100} },
  { n:"Pimentón", cat:"Verduras", kcal:31, prot:1, carb:6, fat:0.3, fiber:2.1, sugar:4.2, sodium:4, satfat:0, calcium:7, iron:0.4, potassium:211, vitc:127, u:{unidad:119, porcion:100} },
  { n:"Palta", cat:"Verduras", kcal:160, prot:2, carb:8.5, fat:14.7, fiber:6.7, sugar:0.7, sodium:7, satfat:2.1, calcium:12, iron:0.6, potassium:485, vitc:10, u:{unidad:150, porcion:100} },

  // ---- Frutas ----
  { n:"Manzana", cat:"Frutas", kcal:52, prot:0.3, carb:13.8, fat:0.2, fiber:2.4, sugar:10.4, sodium:1, satfat:0, calcium:6, iron:0.1, potassium:107, vitc:4.6, u:{unidad:180, porcion:150} },
  { n:"Plátano", cat:"Frutas", kcal:89, prot:1.1, carb:22.8, fat:0.3, fiber:2.6, sugar:12.2, sodium:1, satfat:0.1, calcium:5, iron:0.3, potassium:358, vitc:8.7, u:{unidad:120, porcion:120} },
  { n:"Naranja", cat:"Frutas", kcal:47, prot:0.9, carb:11.8, fat:0.1, fiber:2.4, sugar:9.4, sodium:0, satfat:0, calcium:40, iron:0.1, potassium:181, vitc:53.2, u:{unidad:130, porcion:130} },
  { n:"Pera", cat:"Frutas", kcal:57, prot:0.4, carb:15.2, fat:0.1, fiber:3.1, sugar:9.8, sodium:1, satfat:0, calcium:9, iron:0.2, potassium:116, vitc:4.3, u:{unidad:178, porcion:150} },
  { n:"Uva", cat:"Frutas", kcal:69, prot:0.7, carb:18.1, fat:0.2, fiber:0.9, sugar:15.5, sodium:2, satfat:0.1, calcium:10, iron:0.4, potassium:191, vitc:3.2, u:{taza:151, porcion:100} },
  { n:"Frutilla", cat:"Frutas", kcal:32, prot:0.7, carb:7.7, fat:0.3, fiber:2, sugar:4.9, sodium:1, satfat:0, calcium:16, iron:0.4, potassium:153, vitc:58.8, u:{taza:152, porcion:100} },
  { n:"Kiwi", cat:"Frutas", kcal:61, prot:1.1, carb:14.7, fat:0.5, fiber:3, sugar:9, sodium:3, satfat:0, calcium:34, iron:0.3, potassium:312, vitc:92.7, u:{unidad:76, porcion:100} },
  { n:"Limón", cat:"Frutas", kcal:29, prot:1.1, carb:9.3, fat:0.3, fiber:2.8, sugar:2.5, sodium:2, satfat:0, calcium:26, iron:0.6, potassium:138, vitc:53, u:{unidad:58, porcion:50} },

  // ---- Grasas, frutos secos y semillas ----
  { n:"Aceite de oliva", cat:"Grasas", kcal:884, prot:0, carb:0, fat:100, fiber:0, sugar:0, sodium:2, satfat:13.8, calcium:1, iron:0.6, potassium:1, vitc:0, u:{cda:13.5, cdta:4.5, porcion:13.5} },
  { n:"Semillas de zapallo", cat:"Grasas", kcal:559, prot:30, carb:10.7, fat:49, fiber:6, sugar:1.4, sodium:7, satfat:8.7, calcium:46, iron:8.8, potassium:809, vitc:1.9, u:{cda:12, porcion:20} },
  { n:"Mantequilla", cat:"Grasas", kcal:717, prot:0.9, carb:0.1, fat:81, fiber:0, sugar:0.1, sodium:11, satfat:51, calcium:24, iron:0, potassium:24, vitc:0, u:{cda:14, cdta:5} },
  { n:"Nueces", cat:"Grasas", kcal:654, prot:15.2, carb:13.7, fat:65.2, fiber:6.7, sugar:2.6, sodium:2, satfat:6.1, calcium:98, iron:2.9, potassium:441, vitc:1.3, u:{porcion:28} },
  { n:"Almendras", cat:"Grasas", kcal:579, prot:21.2, carb:21.6, fat:49.9, fiber:12.5, sugar:4.4, sodium:1, satfat:3.8, calcium:269, iron:3.7, potassium:733, vitc:0, u:{porcion:28} },

  // ---- Azúcares y misceláneos ----
  { n:"Azúcar blanca", cat:"Otros", kcal:387, prot:0, carb:100, fat:0, fiber:0, sugar:100, sodium:1, satfat:0, calcium:1, iron:0.1, potassium:2, vitc:0, u:{cda:12, cdta:4, porcion:10} },
  { n:"Miel", cat:"Otros", kcal:304, prot:0.3, carb:82.4, fat:0, fiber:0.2, sugar:82.1, sodium:4, satfat:0, calcium:6, iron:0.4, potassium:52, vitc:0.5, u:{cda:21, cdta:7, porcion:20} },
  { n:"Mermelada", cat:"Otros", kcal:250, prot:0.3, carb:65, fat:0.1, fiber:1, sugar:50, sodium:30, satfat:0, calcium:20, iron:0.5, potassium:77, vitc:8, u:{cda:20, cdta:7, porcion:20} },
  { n:"Café / té (sin azúcar)", cat:"Otros", kcal:1, prot:0.1, carb:0, fat:0, fiber:0, sugar:0, sodium:2, satfat:0, calcium:2, iron:0, potassium:49, vitc:0, u:{taza:240, porcion:240} },

  // ---- Bebidas y alcohol ----
  { n:"Cerveza (normal)", cat:"Alcohol", kcal:43, prot:0.5, carb:3.6, fat:0, fiber:0, sugar:0, sodium:4, satfat:0, calcium:4, iron:0, potassium:27, vitc:0, u:{lata:473, botella:330, porcion:355} },
  { n:"Vino tinto", cat:"Alcohol", kcal:85, prot:0.1, carb:2.6, fat:0, fiber:0, sugar:0.6, sodium:4, satfat:0, calcium:8, iron:0.5, potassium:127, vitc:0, u:{copa:150, porcion:150} },
  { n:"Pisco (40°)", cat:"Alcohol", kcal:231, prot:0, carb:0.3, fat:0, fiber:0, sugar:0, sodium:1, satfat:0, calcium:0, iron:0, potassium:1, vitc:0, u:{trago:60, porcion:60} },
  { n:"Bebida cola normal", cat:"Bebidas", kcal:42, prot:0, carb:10.6, fat:0, fiber:0, sugar:10.6, sodium:4, satfat:0, calcium:2, iron:0, potassium:3, vitc:0, u:{lata:350, vaso:200, porcion:350} },
  { n:"Bebida cola zero", cat:"Bebidas", kcal:0, prot:0, carb:0, fat:0, fiber:0, sugar:0, sodium:12, satfat:0, calcium:2, iron:0, potassium:8, vitc:0, u:{lata:350, vaso:200, porcion:350} },
  { n:"Agua tónica (zero)", cat:"Bebidas", kcal:0, prot:0, carb:0, fat:0, fiber:0, sugar:0, sodium:15, satfat:0, calcium:0, iron:0, potassium:0, vitc:0, u:{vaso:200, porcion:200} },
  { n:"Jugo de naranja (natural)", cat:"Bebidas", kcal:45, prot:0.7, carb:10.4, fat:0.2, fiber:0.2, sugar:8.4, sodium:1, satfat:0, calcium:11, iron:0.2, potassium:200, vitc:50, u:{vaso:250, porcion:250} }
];
