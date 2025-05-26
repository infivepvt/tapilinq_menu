import express from "express";
import http from "http";
import { Server } from "socket.io";

export const app = express();
export const server = http.createServer(app);
export const io = new Server(server);

io.on("connection", (socket) => {
  socket.on("joinAdmin", () => {
    console.log("admin joined to room");
    socket.join("admin");
  });

  socket.on("joinCustomer", () => {
    console.log("Customer joined to room");
    socket.join("customer");
  });

  socket.on("newOrder", (data) => {
    console.log("neworder", data);
    io.to("admin").emit("refetchOrders");
  });

  //   socket.on("joinOrderRoom", (orderId) => {
  //     socket.join(`order_${orderId}`);
  //   });
});
