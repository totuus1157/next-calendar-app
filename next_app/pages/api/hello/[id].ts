import apidata from "../../data";

export default function handler(
  req: { query: { id: any } },
  res: { json: (arg0: any) => void }
): void {
  const {
    query: { id },
  } = req;

  res.json(apidata[id]);
}
