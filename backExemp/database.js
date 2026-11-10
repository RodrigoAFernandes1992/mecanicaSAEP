import postgres from 'postgres';
const sql = postgres('postgres://postgres:senaisp@localhost:5432/mecanica');
//trocar apenas /mecanica para o nome do BD
//verificar node_modules e se está na pasta correta
export default sql;