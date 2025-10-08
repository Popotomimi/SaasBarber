interface History {
  _id: string;
  name: string;
  phone: string;
  services: string[];
  barbers: string[];
  dates: Date[];
  amount: number;
}

export default History;
