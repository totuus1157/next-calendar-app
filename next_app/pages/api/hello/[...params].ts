import apidata from "../../data";

export default function handler(
  req: { query: { params: [any, any] } },
  res: { json: (arg0: { id: any; item: any }) => void }
): void {
  const {
    query: {
      params: [id, item],
    },
  } = req;

  const result = { id: id, item: apidata[id][item] };
  res.json(result);
}
