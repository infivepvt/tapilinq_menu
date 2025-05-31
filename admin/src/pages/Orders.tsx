import { useEffect, useState } from "react";
import { Search, Eye, X, Check, XCircle } from "lucide-react";
import Input from "../components/ui/Input";
import { Card, CardContent, CardHeader } from "../components/ui/Card";
import { formatCurrency } from "../lib/utils";
import { motion } from "framer-motion";
import socket from "../socket";
import useGetTables from "../hooks/useGetTables";
import useAcceptOrder from "../hooks/useAcceptOrder";
import toast from "react-hot-toast";
import useCompletePrepare from "../hooks/useCompletePrepareOrder";
import useServeOrder from "../hooks/useServeOrder";
import useCompleteOrder from "../hooks/useCompleteOrder";
import useCancleOrder from "../hooks/useCancleOrder";

// Mock data for demonstration
const initialOrders = [
  {
    orderId: "ORD001",
    Table: { name: "Table 1" },
    status: "pending",
    items: [
      {
        name: "Burger",
        price: 10.99,
        isNew: false,
        added: [
          { name: "Cheese", price: 1.5 },
          { name: "Bacon", price: 2.0 },
        ],
        removed: [{ name: "Onion", price: 0.5 }],
      },
      {
        name: "Fries",
        price: 3.99,
        isNew: true,
        added: [],
        removed: [],
      },
    ],
    total: 17.99,
    isNewOrder: true,
  },
  {
    orderId: "ORD002",
    Table: { name: "Table 2" },
    status: "preparing",
    items: [
      {
        name: "Pizza",
        price: 15.99,
        isNew: false,
        added: [],
        removed: [],
      },
      {
        name: "Salad",
        price: 7.99,
        isNew: false,
        added: [{ name: "Chicken", price: 3.0 }],
        removed: [],
      },
      {
        name: "Soda",
        price: 2.99,
        isNew: true,
        added: [],
        removed: [],
      },
    ],
    total: 29.97,
    isNewOrder: false,
  },
  {
    orderId: "ORD003",
    Table: { name: "Table 3" },
    status: "ready",
    items: [
      {
        name: "Pasta",
        price: 12.99,
        isNew: false,
        added: [],
        removed: [],
      },
    ],
    total: 12.99,
    isNewOrder: false,
  },
];

const statusStyles = {
  pending:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100",
  preparing: "bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-100",
  ready: "bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100",
  accepted:
    "bg-purple-100 text-purple-800 dark:bg-purple-700 dark:text-purple-100",
  served: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100",
};

const Orders = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [tables, setTables] = useState([]);
  const { getTables } = useGetTables();

  const statusPriority = {
    pending: 0,
    preparing: 1,
    prepared: 2,
    served: 3,
    noOrders: 4, // artificial status for tables with no orders
  };

  const sortedTables = [...tables].sort((a, b) => {
    const orderA = a.Orders[0];
    const orderB = b.Orders[0];

    const statusA = orderA?.status ?? "noOrders";
    const statusB = orderB?.status ?? "noOrders";

    const priorityDiff = statusPriority[statusA] - statusPriority[statusB];

    if (priorityDiff !== 0) return priorityDiff;

    const dateA = new Date(orderA?.updatedAt ?? 0);
    const dateB = new Date(orderB?.updatedAt ?? 0);

    return dateA - dateB; // older orders first
  });

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await getTables();
        setTables(data.tables);
      } catch (error) {
        console.log(error);
      }
    };

    load();
    socket.on("refetchOrders", () => {
      load();
    });

    return () => {
      socket.off("refetchOrders");
    };
  }, []);

  const openModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const { acceptOrder } = useAcceptOrder();

  const handleAcceptOrder = async (orderId) => {
    try {
      const { data } = await acceptOrder(orderId);
      toast.success("Order accepted");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const { completePrepare } = useCompletePrepare();

  const handleCompletePrepare = async (orderId) => {
    try {
      const { data } = await completePrepare(orderId);
      toast.success("Order preparation completed");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const { serveOrder } = useServeOrder();

  const handleServeOrder = async (orderId) => {
    try {
      const { data } = await serveOrder(orderId);
      toast.success("Order delivered");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const { completeOrder } = useCompleteOrder();

  const handleCompleteOrder = async (orderId) => {
    try {
      const { data } = await completeOrder(orderId);
      toast.success("Order completed");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const { cancleOrder } = useCancleOrder();

  const handleCancelOrder = async (orderId) => {
    try {
      const { data } = await cancleOrder(orderId);
      toast.success("Order cancelled");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const renderActionButton = (order) => {
    switch (order.status) {
      case "pending":
        return (
          <button
            onClick={() => handleAcceptOrder(order.orderId)}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors text-lg font-semibold flex items-center justify-center gap-2"
          >
            <Check className="h-6 w-6" /> Accept Order
          </button>
        );
      case "preparing":
        return (
          <button
            onClick={() => handleServeOrder(order.orderId)}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors text-lg font-semibold flex items-center justify-center gap-2"
          >
            <Check className="h-6 w-6" /> Deliver Order
          </button>
        );
      case "prepared":
        return (
          <button
            onClick={() => handleServeOrder(order.orderId)}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors text-lg font-semibold flex items-center justify-center gap-2"
          >
            <Check className="h-6 w-6" /> Serve
          </button>
        );
      case "served":
        return (
          <button
            onClick={() => {
              if (
                window.confirm("Are you sure you want to complete this order?")
              ) {
                handleCompleteOrder(order.orderId);
              }
            }}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors text-lg font-semibold flex items-center justify-center gap-2"
          >
            <Check className="h-6 w-6" /> Complete
          </button>
        );
      default:
        return null;
    }
  };

  const renderCancelButton = (order) => {
    const isDisabled = order.status === "served";
    return (
      <button
        onClick={() => {
          if (window.confirm("Are you sure you want to cancel this order?")) {
            handleCancelOrder(order.orderId);
          }
        }}
        disabled={isDisabled}
        className={`w-full bg-red-600 text-white py-3 px-4 rounded-lg transition-colors text-lg font-semibold flex items-center justify-center gap-2 ${
          isDisabled ? "opacity-50 cursor-not-allowed" : "hover:bg-red-700"
        }`}
      >
        <XCircle className="h-6 w-6" /> Cancel Order
      </button>
    );
  };

  return (
    <div className="space-y-8 p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md mx-4 max-h-[80vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Order {selectedOrder.orderId} - {selectedOrder.Table.name}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  Status
                </span>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    statusStyles[selectedOrder.status] ||
                    "bg-gray-200 text-gray-800"
                  }`}
                >
                  {selectedOrder.status.toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Items
                </h3>
                <ul className="space-y-4">
                  {selectedOrder.OrderItems.map((item, index) => {
                    let productItem = JSON.parse(item.properties);
                    return (
                      <li
                        key={index}
                        className={`p-2 rounded-md ${
                          parseInt(item.isNew) === 1
                            ? "bg-blue-600 text-white"
                            : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="flex items-center gap-2 font-medium">
                            {productItem.product.name}
                            {parseInt(item.isNew) === 1 && (
                              <span className="text-xs bg-blue-900 text-white px-2 py-0.5 rounded-full font-semibold">
                                NEW
                              </span>
                            )}
                          </span>
                          <span
                            className={
                              parseInt(item.isNew) === 1
                                ? "text-white"
                                : "text-gray-600 dark:text-gray-400"
                            }
                          >
                            {formatCurrency(item.price)}
                          </span>
                        </div>
                        {item.note && (
                          <div className="mt-5">
                            <span>
                              <strong className="text-blue-400">
                                Instructions :{" "}
                              </strong>
                              {item.note}
                            </span>
                          </div>
                        )}
                        {productItem.addedIngredients?.length > 0 && (
                          <ul
                            className={`ml-4 mt-1 text-sm ${
                              parseInt(item.isNew) === 1
                                ? "text-green-200"
                                : "text-green-600 dark:text-green-400"
                            }`}
                          >
                            {productItem.addedIngredients.map((extra, i) => (
                              <li key={i}>
                                + {extra.name} ({formatCurrency(extra.price)})
                              </li>
                            ))}
                          </ul>
                        )}
                        {productItem.removedIngredients?.length > 0 && (
                          <ul
                            className={`ml-4 mt-1 text-sm ${
                              parseInt(item.isNew) === 1
                                ? "text-red-200"
                                : "text-red-600 dark:text-red-400"
                            }`}
                          >
                            {productItem.removedIngredients.map((extra, i) => (
                              <li key={i}>
                                - {extra.name} ({formatCurrency(extra.price)})
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  Total
                </h3>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(selectedOrder.total)}
                </p>
              </div>
              <div className="space-y-2">
                {renderActionButton(selectedOrder)}
                {renderCancelButton(selectedOrder)}
              </div>
            </div>
            <button
              onClick={closeModal}
              className="mt-6 w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {sortedTables.length > 0 ? (
          sortedTables.map((table, index) => {
            const tableOrders = table.Orders;
            const latestOrder = tableOrders[0];

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                <Card
                  className={`flex flex-col justify-between h-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden ${
                    latestOrder?.status === "pending" ? "animate-pulse" : ""
                  }`}
                >
                  <CardHeader className="flex flex-row items-center justify-between pb-4">
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {table.name}
                      </h2>
                      {latestOrder && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Last updated: Just now
                        </p>
                      )}
                    </div>
                    {latestOrder && (
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          statusStyles[latestOrder.status] ||
                          "bg-gray-200 text-gray-800"
                        }`}
                      >
                        {latestOrder.status.toUpperCase()}
                      </span>
                    )}
                  </CardHeader>
                  <CardContent className="pt-0 flex-grow">
                    {latestOrder ? (
                      <div className="space-y-6 h-full flex flex-col justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                            Items
                          </h3>
                          <div className="border border-gray-100 dark:border-gray-700 rounded-lg p-4 bg-gray-300 dark:bg-gray-900 max-h-60 overflow-y-auto">
                            <ul className="space-y-4">
                              {latestOrder.OrderItems.map((item, index) => {
                                let propertise = JSON.parse(item.properties);

                                return (
                                  <motion.li
                                    key={index}
                                    animate={
                                      parseInt(item.isNew) === 1
                                        ? {
                                            backgroundColor: [
                                              "#3B82F6",
                                              "#2563EB",
                                            ],
                                            scale: [1.05, 1],
                                          }
                                        : {}
                                    }
                                    transition={
                                      parseInt(item.isNew) === 1
                                        ? {
                                            duration: 1.5,
                                            repeat: Infinity,
                                            repeatType: "reverse",
                                          }
                                        : {}
                                    }
                                    className="p-2 rounded-md"
                                  >
                                    <div
                                      className={`flex justify-between items-center ${
                                        parseInt(item.isNew) === 1
                                          ? "text-white"
                                          : "text-gray-700 dark:text-gray-300"
                                      }`}
                                    >
                                      <span className="flex items-center gap-2 font-medium">
                                        {propertise.product.name} x{" "}
                                        {propertise.quantity}
                                        {parseInt(item.isNew) === 1 && (
                                          <span className="text-xs bg-blue-900 text-white px-2 py-0.5 rounded-full font-semibold">
                                            NEW
                                          </span>
                                        )}
                                      </span>
                                      <span
                                        className={
                                          parseInt(item.isNew) === 1
                                            ? "text-white"
                                            : "text-gray-600 dark:text-gray-400"
                                        }
                                      >
                                        {formatCurrency(
                                          propertise.variant.price
                                        )}
                                      </span>
                                    </div>
                                    {propertise.addedIngredients?.length >
                                      0 && (
                                      <ul
                                        className={`ml-4 mt-1 text-sm ${
                                          parseInt(item.isNew) === 1
                                            ? "text-green-200"
                                            : "text-green-600 dark:text-green-400"
                                        }`}
                                      >
                                        {propertise.addedIngredients.map(
                                          (extra, i) => (
                                            <li key={i}>
                                              + {extra.name} (
                                              {formatCurrency(extra.price)})
                                            </li>
                                          )
                                        )}
                                      </ul>
                                    )}
                                    {propertise.removedIngredients?.length >
                                      0 && (
                                      <ul
                                        className={`ml-4 mt-1 text-sm ${
                                          parseInt(item.isNew) === 1
                                            ? "text-red-200"
                                            : "text-red-600 dark:text-red-400"
                                        }`}
                                      >
                                        {propertise.removedIngredients.map(
                                          (extra, i) => (
                                            <li key={i}>
                                              - {extra.name} (
                                              {formatCurrency(extra.price)})
                                            </li>
                                          )
                                        )}
                                      </ul>
                                    )}
                                  </motion.li>
                                );
                              })}
                            </ul>
                          </div>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                            Total
                          </h3>
                          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {formatCurrency(latestOrder.total)}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <button
                            onClick={() => openModal(latestOrder)}
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-base font-medium flex items-center justify-center gap-2"
                          >
                            <Eye className="h-5 w-5" /> View Full Order
                          </button>
                          {renderActionButton(latestOrder)}
                          {renderCancelButton(latestOrder)}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-10">
                        <p className="text-gray-500 dark:text-gray-400 text-lg">
                          No orders placed for this table yet.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })
        ) : (
          <p className="text-lg text-gray-500 dark:text-gray-400 col-span-full text-center">
            No tables found. Try adjusting your search.
          </p>
        )}
      </div>
    </div>
  );
};

export default Orders;
