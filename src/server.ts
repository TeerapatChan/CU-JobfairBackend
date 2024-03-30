import express from "express";

const server = express();
const PORT = 2345;

server.listen(PORT, () => console.log(`Server is starting at port ${PORT}`));
