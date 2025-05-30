import express from "express";
import http from "http";
import { Server } from "socket.io";

export const app = express();
export const server = http.createServer(app);
export const io = new Server(server);

export let onlineCustomers = [];

io.on("connection", (socket) => {
  socket.on("joinAdmin", () => {
    console.log("admin joined to room");
    socket.join("admin");
  });

  socket.on("joinCustomer", (data) => {
    socket.join("customer");

    let exists = onlineCustomers.find(
      (c) =>
        c.socketId === socket.id ||
        (c.username === data.username &&
          parseInt(c.tableId) === parseInt(data.tableId))
    );

    if (exists) {
      let newC = onlineCustomers.filter(
        (oc) => oc.socketId !== exists.socketId
      );
      onlineCustomers = [
        ...newC,
        {
          socketId: socket.id,
          ...data,
        },
      ];
    } else {
      onlineCustomers.push({
        socketId: socket.id,
        ...data,
      });
    }
  });

  socket.on("updateCustomer", (data) => {
    socket.join("customer");

    let exists = onlineCustomers.find(
      (c) =>
        c.socketId === socket.id ||
        (c.username === data.username &&
          parseInt(c.tableId) === parseInt(data.tableId))
    );

    if (exists) {
      let newC = onlineCustomers.filter(
        (oc) => oc.socketId !== exists.socketId
      );
      onlineCustomers = [
        ...newC,
        {
          socketId: socket.id,
          ...data,
        },
      ];
    } else {
      onlineCustomers.push({
        socketId: socket.id,
        ...data,
      });
    }

    // if (existsIndex !== -1) {
    //   onlineCustomers.splice(existsIndex, 1);
    // }
  });

  socket.on("newOrder", (data) => {
    console.log("neworder", data);
    io.to("admin").emit("refetchOrders");
  });

  //   socket.on("joinOrderRoom", (orderId) => {
  //     socket.join(`order_${orderId}`);
  //   });
});
