
import { Train, SeatStatus } from './types';

const generateSeats = () => {
  const seats = [];
  for (let i = 1; i <= 40; i++) {
    const random = Math.random();
    let status = SeatStatus.AVAILABLE;
    if (random < 0.2) status = SeatStatus.BOOKED;
    else if (random < 0.35) status = SeatStatus.RESERVED;
    
    seats.push({
      id: `seat-${i}-${Math.random().toString(36).substr(2, 9)}`,
      number: `${Math.ceil(i/4)}${String.fromCharCode(65 + (i-1)%4)}`,
      status
    });
  }
  return seats;
};

export const MOCK_TRAINS: Train[] = [
  {
    id: 'T101',
    name: 'Amaravati-Pune Express',
    number: '12158',
    from: 'Amaravati',
    to: 'Pune',
    departureTime: '21:30',
    arrivalTime: '08:45',
    price: 850,
    availableSeats: 24,
    seats: generateSeats()
  },
  {
    id: 'T102',
    name: 'Amaravati-Nagpur Passenger',
    number: '51261',
    from: 'Amaravati',
    to: 'Nagpur',
    departureTime: '06:15',
    arrivalTime: '09:30',
    price: 320,
    availableSeats: 32,
    seats: generateSeats()
  },
  {
    id: 'T103',
    name: 'Amaravati-Akola Intercity',
    number: '12112',
    from: 'Amaravati',
    to: 'Akola',
    departureTime: '13:00',
    arrivalTime: '14:45',
    price: 180,
    availableSeats: 12,
    seats: generateSeats()
  },
  {
    id: 'T104',
    name: 'Amaravati-Mumbai Superfast',
    number: '12159',
    from: 'Amaravati',
    to: 'Mumbai',
    departureTime: '19:00',
    arrivalTime: '06:15',
    price: 1250,
    availableSeats: 18,
    seats: generateSeats()
  },
  {
    id: 'T105',
    name: 'Amaravati-Delhi Rajdhani Exp',
    number: '12433',
    from: 'Amaravati',
    to: 'Delhi',
    departureTime: '15:20',
    arrivalTime: '10:40',
    price: 2450,
    availableSeats: 15,
    seats: generateSeats()
  },
  {
    id: 'T106',
    name: 'Amaravati-Hyderabad Special',
    number: '07122',
    from: 'Amaravati',
    to: 'Hyderabad',
    departureTime: '22:10',
    arrivalTime: '11:20',
    price: 980,
    availableSeats: 28,
    seats: generateSeats()
  },
  {
    id: 'T107',
    name: 'Amaravati-Bangalore City Exp',
    number: '16501',
    from: 'Amaravati',
    to: 'Bangalore',
    departureTime: '08:45',
    arrivalTime: '14:30',
    price: 1650,
    availableSeats: 21,
    seats: generateSeats()
  },
  {
    id: 'T108',
    name: 'Amaravati-Chennai Central',
    number: '12655',
    from: 'Amaravati',
    to: 'Chennai',
    departureTime: '11:30',
    arrivalTime: '07:15',
    price: 1520,
    availableSeats: 30,
    seats: generateSeats()
  },
  {
    id: 'T109',
    name: 'Amaravati-Ahmedabad Navjivan',
    number: '12656',
    from: 'Amaravati',
    to: 'Ahmedabad',
    departureTime: '17:50',
    arrivalTime: '12:10',
    price: 1100,
    availableSeats: 14,
    seats: generateSeats()
  },
  {
    id: 'T110',
    name: 'Amaravati-Surat Intercity',
    number: '19002',
    from: 'Amaravati',
    to: 'Surat',
    departureTime: '05:30',
    arrivalTime: '13:45',
    price: 740,
    availableSeats: 25,
    seats: generateSeats()
  },
  {
    id: 'T111',
    name: 'Amaravati-Jabalpur Mail',
    number: '12188',
    from: 'Amaravati',
    to: 'Jabalpur',
    departureTime: '23:15',
    arrivalTime: '08:20',
    price: 650,
    availableSeats: 35,
    seats: generateSeats()
  },
  {
    id: 'T112',
    name: 'Amaravati-Raipur Express',
    number: '12808',
    from: 'Amaravati',
    to: 'Raipur',
    departureTime: '04:00',
    arrivalTime: '12:45',
    price: 520,
    availableSeats: 19,
    seats: generateSeats()
  },
  {
    id: 'T113',
    name: 'Amaravati-Indore Humsafar',
    number: '20917',
    from: 'Amaravati',
    to: 'Indore',
    departureTime: '20:30',
    arrivalTime: '09:00',
    price: 1350,
    availableSeats: 10,
    seats: generateSeats()
  },
  {
    id: 'T114',
    name: 'Amaravati-Bhopal Superfast',
    number: '12154',
    from: 'Amaravati',
    to: 'Bhopal',
    departureTime: '14:20',
    arrivalTime: '21:50',
    price: 880,
    availableSeats: 22,
    seats: generateSeats()
  },
  {
    id: 'T115',
    name: 'Amaravati-Varanasi Special',
    number: '01027',
    from: 'Amaravati',
    to: 'Varanasi',
    departureTime: '09:10',
    arrivalTime: '11:45',
    price: 1890,
    availableSeats: 16,
    seats: generateSeats()
  }
];
