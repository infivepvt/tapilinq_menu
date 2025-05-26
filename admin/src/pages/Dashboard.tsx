import { TrendingUp, Users, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { getDashboardStats, generateOrders } from '../data/mockData';
import { formatCurrency } from '../lib/utils';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

const Dashboard = () => {
  const stats = getDashboardStats();
  const recentOrders = generateOrders().slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your hotel's performance today</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalEarnings)}</div>
            <p className="text-xs text-muted-foreground">Today's earnings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayOrders}</div>
            <p className="text-xs text-muted-foreground">Orders processed today</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingOrders}</div>
            <p className="text-xs text-muted-foreground">Waiting to be processed</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed Orders</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedOrders}</div>
            <p className="text-xs text-muted-foreground">Successfully delivered</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Recent Orders</h2>
          <Link to="/orders">
            <Button variant="ghost" rightIcon={<ArrowRight className="h-4 w-4" />}>
              View All
            </Button>
          </Link>
        </div>
        
        <Card>
          <CardContent className="p-0">
            <div className="overflow-hidden rounded-lg">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-accent/50">
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Order ID</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Customer</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Table</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Amount</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-accent/30">
                      <td className="px-4 py-3 text-sm">{order.id}</td>
                      <td className="px-4 py-3 text-sm">{order.customerName}</td>
                      <td className="px-4 py-3 text-sm">Table {order.tableNumber}</td>
                      <td className="px-4 py-3 text-sm text-right">{formatCurrency(order.totalAmount)}</td>
                      <td className="px-4 py-3 text-sm">
                        <OrderStatusBadge status={order.status} />
                      </td>
                      <td className="px-4 py-3 text-sm text-right">
                        <Link to={`/orders/${order.id}`}>
                          <Button size="sm" variant="ghost">
                            View
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Extra components for the Dashboard
const ShoppingCart = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <circle cx="8" cy="21" r="1"/>
      <circle cx="19" cy="21" r="1"/>
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
    </svg>
  );
};

const OrderStatusBadge = ({ status }: { status: string }) => {
  const variants: Record<string, { variant: any; label: string }> = {
    pending: { variant: 'warning', label: 'Pending' },
    preparing: { variant: 'primary', label: 'Preparing' },
    ready: { variant: 'secondary', label: 'Ready' },
    delivered: { variant: 'secondary', label: 'Delivered' },
    completed: { variant: 'success', label: 'Completed' },
    cancelled: { variant: 'error', label: 'Cancelled' },
  };

  const { variant, label } = variants[status] || variants.pending;

  return <Badge variant={variant}>{label}</Badge>;
};

export default Dashboard;