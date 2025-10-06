const extractDuration = (service: string): number | null => {
  const match = service.match(/\((\d+)min\)/);
  return match ? parseInt(match[1], 10) : null;
};

export default extractDuration;
