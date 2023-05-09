import bookProvider from "@/database/providers/books/books.provider";
import { notAllowedResponse } from "@/root/api/responses/notAllowedResponse";
import { NextApiRequest, NextApiResponse } from "next";

async function getById(req: NextApiRequest, res: NextApiResponse) {
  const id = Number(req.query.id);
  try {
    const result = await bookProvider.getById(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
}

async function updateById(req: NextApiRequest, res: NextApiResponse) {
  const id = Number(req.query.id);
  const title = String(req.query.title);
  const authorId = Number(req.query.authorId);
  //TODO: validate the format of the body
  const { name } = req.body;
  try {
    await bookProvider.updateById(id, { id, title,authorId });
    res.status(200).json({ id, message: "Information updated" });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
}

async function deleteById(req: NextApiRequest, res: NextApiResponse) {
  const id = Number(req.query.id);
  try {
    //TODO: validate the format of the body
    await bookProvider.deleteById(id);
    res.status(200).json({ id, message: "Information deleted" });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
}

const handlers: any = {};
handlers["GET"] = (req: NextApiRequest, res: NextApiResponse) => getById(req, res);
handlers["PUT"] = (req: NextApiRequest, res: NextApiResponse) => updateById(req, res);
handlers["DELETE"] = (req: NextApiRequest, res: NextApiResponse) => deleteById(req, res);

export default function booksByIdController(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;


  const handler = handlers[method as keyof typeof handlers](req,res);
  return handler! || notAllowedResponse(res, method!);
}