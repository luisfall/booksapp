import pool  from '@/database/connection';
import { Book } from "@/root/types"; 
import { RowDataPacket } from 'mysql2/promise';
 
const getAll = async () => {
  const [rows] = await pool.promise().query('SELECT * FROM books',[]);
  return rows; 
};

const getById = async (id: number) => {
  const [rows] =await pool.promise().query("SELECT * FROM books WHERE id = ?", [id]);
  return rows; 
};

const create = async (authorId:number,title: string) => {
  const [result] = await pool.promise().query("INSERT INTO books (authorId,title) VALUES (?)", [authorId,title]);

  const id = (result as RowDataPacket).insertId;
  return { id,authorId,title };
};

const updateById = async (id: number, entity: Book) => {
  console.log("updateById");
  const entityFound = await getById(id);
  if (entityFound && entityFound.length < 0) { 
    console.log("entityFound");
     const [result] = await pool.promise().query("UPDATE books SET title = ?, authorId = ? WHERE id = ?", [entity.title, entity.authorId,id]);
   
    console.log("result",result);
    return result;
  }
  throw new Error("book not found");
};

const deleteById = async (id: number) => {
  const entityFound = await getById(id);
  
  if (entityFound && entityFound.length > 0) { 
     const [result] = await pool.promise().query("DELETE FROM books WHERE id = ?", [id]);
    return result;
  }
  throw new Error("book not found"); 
};

export const bookProvider = {
  getAll,
  create,
  getById,
  updateById,
  deleteById,
};

export default bookProvider;