const aircraftGroups = {
  "Бизнес-джеты": {
    "Gulfstream G600":        { takeoff: 1795, range: 12000, capacity: 19, cruise: 903 },
    "Dassault Falcon 8X":     { takeoff: 1790, range: 12000, capacity: 16, cruise: 900 },
    "Cessna Citation CJ4":    { takeoff: 970,  range: 3700,  capacity: 10, cruise: 835 }
  },
  "Турбовинтовые региональные": {
    "Dash 8 Q400":            { takeoff: 1390, range: 2000,  capacity: 78, cruise: 667 },
    "ATR 72-600":             { takeoff: 1315, range: 1500,  capacity: 70, cruise: 511 },
    "ATR 42-500":             { takeoff: 1050, range: 1100,  capacity: 50, cruise: 556 }
  },
  "Региональные реактивные": {
    "Embraer E195-E2":        { takeoff: 2110, range: 4800,  capacity: 132, cruise: 870 },
    "Embraer E175 (MTOW)":    { takeoff: 1724, range: 3700,  capacity: 88,  cruise: 829 }
  },
  "Магистральные узкофюзеляжные": {
    "Airbus A320-200":        { takeoff: 2000, range: 6100,  capacity: 180, cruise: 828 },
    "Boeing 737-800":         { takeoff: 2316, range: 5436,  capacity: 189, cruise: 842 }
  },
  "STOL и лёгкие региональные": {
    "Learjet 75 Liberty":     { takeoff: 1260, range: 3800,  capacity: 9,  cruise: 860 },
    "Pilatus PC-12":          { takeoff: 793,  range: 3400,  capacity: 9,  cruise: 528 },
    "Beechcraft King Air 350":{ takeoff: 1006, range: 3300,  capacity: 11, cruise: 578 },
    "HondaJet HA-420":        { takeoff: 1050, range: 2200,  capacity: 6,  cruise: 782 },
    "Cessna 208 Caravan":     { takeoff: 660,  range: 1900,  capacity: 14, cruise: 341 },
    "Cessna 408 SkyCourier":  { takeoff: 1100, range: 1600,  capacity: 19, cruise: 370 },
    "Let L-410 Turbolet":     { takeoff: 610,  range: 1500,  capacity: 19, cruise: 405 },
    "Viking DHC-6 Twin Otter":{ takeoff: 366,  range: 1400,  capacity: 19, cruise: 338 }
  }
};
