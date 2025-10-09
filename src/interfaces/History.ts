interface History {
  _id: string;
  name: string;
  phone: string;
  services: string[];
  barbers: string[];
  dates: Date[];
  amount: number;
  times?: string[];
}

export default History;
