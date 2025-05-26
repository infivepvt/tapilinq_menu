import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  UserPlus,
  User,
  X,
  Check,
} from "lucide-react";
import { generateOrders, users } from "../data/mockData";
import { formatCurrency } from "../lib/utils";
import Button from "../components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import { OrderStatus } from "../data/mockData";
import useGetOrder from "../hooks/useGetOrder";

const OrderDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isAssigningWaiter, setIsAssigningWaiter] = useState(false);

  const allOrders = generateOrders();

  const availableWaiters = users.filter((user) => user.role === "waiter");

  const [order, setOrder] = useState(null);

  const { getOrder } = useGetOrder();

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await getOrder(id);
        console.log(data);
        setOrder(data.order);
      } catch (error) {
        console.log(error);
      }
    };
    load();
  }, []);

  if (!order) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-xl font-semibold mb-2">Order Not Found</h1>
        <p className="text-muted-foreground mb-4">
          The order you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => navigate("/orders")}>Back to Orders</Button>
      </div>
    );
  }

  const [editedStatus, setEditedStatus] = useState<OrderStatus>(order.status);

  const handleCancel = () => {
    setIsEditing(false);
    setEditedStatus(order.status);
  };

  const handleSave = () => {
    // In a real app, this would call an API to update the order
    setIsEditing(false);
  };

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => navigate("/orders")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Order {order.id}
            </h1>
            <p className="text-muted-foreground">
              {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            leftIcon={<Pencil className="h-4 w-4" />}
            onClick={() => setIsEditing(!isEditing)}
          >
            Edit Order
          </Button>
          <Button variant="outline" leftIcon={<Trash2 className="h-4 w-4" />}>
            Cancel Order
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Order info */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Order Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Customer
                </dt>
                <dd className="mt-1 text-foreground">{order.customerName}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Table Number
                </dt>
                <dd className="mt-1 text-foreground">#{order.tableNumber}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Total Amount
                </dt>
                <dd className="mt-1 text-foreground font-bold">
                  {formatCurrency(order.totalAmount)}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Status
                </dt>
                <dd className="mt-1">
                  {isEditing ? (
                    <select
                      value={editedStatus}
                      onChange={(e) =>
                        setEditedStatus(e.target.value as OrderStatus)
                      }
                      className="block w-full rounded-md border border-input bg-background px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="pending">Pending</option>
                      <option value="preparing">Preparing</option>
                      <option value="ready">Ready</option>
                      <option value="delivered">Delivered</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  ) : (
                    <OrderStatusBadge status={order.status} />
                  )}
                </dd>
              </div>
            </dl>

            {/* Waiter Assignment */}
            <div className="mt-6 border-t border-border pt-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Assigned Waiter
              </h3>

              {order.waiterId ? (
                <div className="flex items-center space-x-3 p-3 rounded-md border border-border bg-background">
                  {order.waiterAvatar ? (
                    <img
                      src={order.waiterAvatar}
                      alt={order.waiterName || ""}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                      <User className="h-5 w-5" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium">{order.waiterName}</p>
                    <p className="text-sm text-muted-foreground">
                      Assigned to this order
                    </p>
                  </div>
                </div>
              ) : (
                <Button
                  leftIcon={<UserPlus className="h-4 w-4" />}
                  onClick={() => setIsAssigningWaiter(true)}
                >
                  Assign Waiter
                </Button>
              )}
            </div>

            {isEditing && (
              <div className="mt-6 flex justify-end space-x-2">
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>Save Changes</Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order status and timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Status Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="relative border-l border-primary/30">
              <li className="mb-6 ml-6">
                <div className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Check className="h-3.5 w-3.5" />
                </div>
                <h3 className="flex items-center text-sm font-semibold">
                  Order Created
                </h3>
                <p className="text-xs text-muted-foreground">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
                <p className="mt-1 text-sm">
                  Order placed for Table #{order.tableNumber}
                </p>
              </li>

              {order.waiterId && (
                <li className="mb-6 ml-6">
                  <div className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <h3 className="text-sm font-semibold">Waiter Assigned</h3>
                  <p className="text-xs text-muted-foreground">
                    {new Date(order.updatedAt).toLocaleString()}
                  </p>
                  <p className="mt-1 text-sm">
                    {order.waiterName} assigned to the order
                  </p>
                </li>
              )}

              {order.status === "completed" && (
                <li className="ml-6">
                  <div className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-success text-white">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <h3 className="text-sm font-semibold">Order Completed</h3>
                  <p className="text-xs text-muted-foreground">
                    {new Date(order.updatedAt).toLocaleString()}
                  </p>
                  <p className="mt-1 text-sm">
                    Order successfully delivered and paid
                  </p>
                </li>
              )}

              {order.status === "cancelled" && (
                <li className="ml-6">
                  <div className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-error text-white">
                    <X className="h-3.5 w-3.5" />
                  </div>
                  <h3 className="text-sm font-semibold">Order Cancelled</h3>
                  <p className="text-xs text-muted-foreground">
                    {new Date(order.updatedAt).toLocaleString()}
                  </p>
                </li>
              )}
            </ol>
          </CardContent>
        </Card>
      </div>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-3 text-sm font-medium text-muted-foreground">
                    Product
                  </th>
                  <th className="pb-3 text-sm font-medium text-muted-foreground">
                    Variant
                  </th>
                  <th className="pb-3 text-sm font-medium text-muted-foreground">
                    Features
                  </th>
                  <th className="pb-3 text-right text-sm font-medium text-muted-foreground">
                    Price
                  </th>
                  <th className="pb-3 text-right text-sm font-medium text-muted-foreground">
                    Qty
                  </th>
                  <th className="pb-3 text-right text-sm font-medium text-muted-foreground">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {order.items.map((item) => (
                  <tr key={item.id} className="hover:bg-accent/20">
                    <td className="py-4 text-sm">{item.productName}</td>
                    <td className="py-4 text-sm">{item.variantName}</td>
                    <td className="py-4 text-sm">
                      <div className="flex flex-wrap gap-1">
                        {item.features.length > 0 ? (
                          item.features.map((feature, index) => (
                            <Badge key={index} variant="outline">
                              {feature}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-muted-foreground">None</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 text-right text-sm">
                      {formatCurrency(item.price)}
                    </td>
                    <td className="py-4 text-right text-sm">{item.quantity}</td>
                    <td className="py-4 text-right text-sm font-medium">
                      {formatCurrency(item.price * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t border-border">
                <tr>
                  <td colSpan={5} className="pt-4 text-right font-medium">
                    Total
                  </td>
                  <td className="pt-4 text-right font-bold">
                    {formatCurrency(order.totalAmount)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Waiter Assignment Modal */}
      {isAssigningWaiter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div
            className="fixed inset-0"
            onClick={() => setIsAssigningWaiter(false)}
          />
          <div className="relative bg-card rounded-lg shadow-lg w-full max-w-md p-6">
            <button
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
              onClick={() => setIsAssigningWaiter(false)}
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-bold mb-4">Assign Waiter to Order</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Select a waiter to assign to this order
            </p>
            <div className="grid gap-3 mb-4">
              {availableWaiters.map((waiter) => (
                <button
                  key={waiter.id}
                  className="flex items-center gap-3 p-3 rounded-md hover:bg-accent/50 border border-border"
                  onClick={() => setIsAssigningWaiter(false)}
                >
                  {waiter.avatar ? (
                    <img
                      src={waiter.avatar}
                      alt={waiter.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                      {waiter.name.charAt(0)}
                    </div>
                  )}
                  <div className="text-left">
                    <p className="font-medium">{waiter.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {waiter.email}
                    </p>
                  </div>
                </button>
              ))}
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsAssigningWaiter(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const OrderStatusBadge = ({ status }: { status: string }) => {
  const variants: Record<string, { variant: any; label: string }> = {
    pending: { variant: "warning", label: "Pending" },
    preparing: { variant: "primary", label: "Preparing" },
    ready: { variant: "secondary", label: "Ready" },
    delivered: { variant: "secondary", label: "Delivered" },
    completed: { variant: "success", label: "Completed" },
    cancelled: { variant: "error", label: "Cancelled" },
  };

  const { variant, label } = variants[status] || variants.pending;

  return <Badge variant={variant}>{label}</Badge>;
};

export default OrderDetails;
