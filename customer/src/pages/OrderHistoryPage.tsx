import React, { useEffect, useState } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import OrderStatus from "../components/ui/OrderStatus";
import ChatPopup from "../components/ui/ChatPopup";
import { format } from "../utils/dateUtils";
import useGetOrders from "../hooks/useGetOrders";
import socket from "../socket";
import toast from "react-hot-toast";

const OrderHistoryPage: React.FC = () => {
  const [pastOrders, setPastOrders] = useState([]);

  const { getOrders } = useGetOrders();

  console.log(pastOrders);
  

  useEffect(() => {
    const load = async () => {
      let o = localStorage.getItem("orders");
      let orders = [];
      if (o) {
        orders = JSON.parse(o) || [];
      }
      try {
        const { data } = await getOrders(orders);
        setPastOrders(data.pastOrders);
      } catch (error) {
        console.log(error);
      }
    };
    load();

    socket.on("changeOrderStatus", (data) => {
      load();
      let o = pastOrders.find((ord) => ord.orderId);
      if (o) {
        toast.success(data.message);
      }
    });

    return () => {
      socket.off("changeOrderStatus");
    };
  }, []);

  // Function to map status to custom text
  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Waiting for Acceptance";
      case "preparing":
        return "Waiting to Prepare";
      case "prepairing":
        return "In Preparation";
      case "prepared":
        return "Order Prepared";
      case "served":
        return "Order Served";
      case "completed":
        return "Order Completed";
      case "cancelled":
        return "Order Cancelled";
      default:
        return "Unknown Status";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Header />

      <main className="flex-grow pt-20 pb-16">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center md:text-left">
            Order History
          </h1>

          {pastOrders.length > 0 ? (
            <div className="space-y-6">
              {pastOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700"
                >
                  <div className="p-4 md:p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                          Order #{order.orderId}
                        </h3>
                        <div className="flex items-center space-x-4">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {format(new Date(order.createdAt))}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Table #{order.Table.name}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 md:mt-0">
                        <OrderStatus
                          status={order.status}
                          customText={getStatusText(order.status)} // Pass custom text
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 md:p-6">
                    <div className="space-y-4">
                      {order.OrderItems.map((item, index) => {
                        let orderData = JSON.parse(item.properties);
                        return (
                          <div key={index} className="flex justify-between">
                            <div>
                              <h4 className="font-medium text-gray-800 dark:text-white">
                                {item.quantity} x {orderData.product.name}
                              </h4>
                              {(orderData.addedIngredients.length > 0 ||
                                orderData.removedIngredients.length > 0 ||
                                orderData.specialNote) && (
                                <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                  {orderData.addedIngredients.length > 0 && (
                                    <div className="text-green-600 dark:text-green-400">
                                      +{" "}
                                      {orderData.addedIngredients
                                        .map((ingredient) => ingredient.name)
                                        .join(", ")}
                                    </div>
                                  )}

                                  {orderData.removedIngredients.length > 0 && (
                                    <div className="text-red-600 dark:text-red-400">
                                      -{" "}
                                      {orderData.removedIngredients
                                        .map((ingredient) => ingredient.name)
                                        .join(", ")}
                                    </div>
                                  )}

                                  {item.note && (
                                    <div className="mt-1 italic text-blue-300">
                                      "{item.note}"
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                            <p className="text-gray-700 dark:text-gray-300">
                              Rs.{item.total.toFixed(2)}
                            </p>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between items-center">
                        <p className="font-semibold text-gray-900 dark:text-white text-[14px]">
                          Tax
                        </p>
                        <p className="font-semibold text-blue-600 dark:text-blue-400 text-[14px]">
                          Rs.{order.tax.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <p className="font-semibold text-gray-900 dark:text-white text-[14px]">
                          Service Charge
                        </p>
                        <p className="font-semibold text-blue-600 dark:text-blue-400 text-[14px]">
                          Rs.{order.serviceCharge.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex justify-between items-center mt-3">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          Total
                        </p>
                        <p className="font-semibold text-blue-600 dark:text-blue-400">
                          Rs.{order.total.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                No order history
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                You haven't placed any orders yet.
              </p>
            </div>
          )}
        </div>
      </main>

      <ChatPopup />
      <Footer />
    </div>
  );
};

export default OrderHistoryPage;
