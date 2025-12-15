export const getToken = (request) => {
  const authHeader = request.headers.authorization;
  return authHeader && authHeader.split(" ")[1]; // Extrae "Bearer <token>"
};