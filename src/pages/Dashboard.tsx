import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { LogOut, RefreshCw } from 'lucide-react';
import StatsCards from '@/components/StatsCards';
import TransactionForm from '@/components/TransactionForm';
import TransactionList from '@/components/TransactionList';
import ExpenseChart from '@/components/ExpenseChart';
import IncomeExpenseChart from '@/components/IncomeExpenseChart';

interface Transaction {
  id: string;
  amount: number;
  category: string;
  type: 'Income' | 'Expense';
  date: string;
  description: string | null;
}

const Dashboard = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const fetchTransactions = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load transactions. Please try again.",
        variant: "destructive",
      });
    } else {
      setTransactions(data || []);
    }
    setLoading(false);
  };

  const createSampleData = async () => {
    if (!user) return;

    const sampleTransactions = [
      { user_id: user.id, amount: 3500, category: 'Salary' as any, type: 'Income' as any, date: '2024-01-15', description: 'Monthly salary' },
      { user_id: user.id, amount: 1200, category: 'Food' as any, type: 'Expense' as any, date: '2024-01-10', description: 'Groceries and dining' },
      { user_id: user.id, amount: 500, category: 'Transport' as any, type: 'Expense' as any, date: '2024-01-08', description: 'Gas and car maintenance' },
      { user_id: user.id, amount: 200, category: 'Entertainment' as any, type: 'Expense' as any, date: '2024-01-05', description: 'Movies and games' },
      { user_id: user.id, amount: 800, category: 'Bills' as any, type: 'Expense' as any, date: '2024-01-01', description: 'Rent and utilities' },
      { user_id: user.id, amount: 2800, category: 'Salary' as any, type: 'Income' as any, date: '2023-12-15', description: 'Previous month salary' },
      { user_id: user.id, amount: 300, category: 'Shopping' as any, type: 'Expense' as any, date: '2023-12-20', description: 'Clothing and accessories' },
    ];

    const { error } = await supabase
      .from('transactions')
      .insert(sampleTransactions);

    if (error) {
      console.error('Error creating sample data:', error);
    } else {
      toast({
        title: "Sample data added",
        description: "Some sample transactions have been added to get you started!",
      });
      fetchTransactions();
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [user]);

  useEffect(() => {
    // Add sample data if no transactions exist
    if (transactions.length === 0 && !loading && user) {
      createSampleData();
    }
  }, [transactions.length, loading, user]);

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Calculate statistics
  const totalIncome = transactions
    .filter(t => t.type === 'Income')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'Expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const balance = totalIncome - totalExpenses;

  // Prepare expense chart data
  const expensesByCategory = transactions
    .filter(t => t.type === 'Expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
      return acc;
    }, {} as Record<string, number>);

  const expenseChartData = Object.entries(expensesByCategory).map(([category, amount]) => ({
    category,
    amount,
    percentage: (amount / totalExpenses) * 100,
  }));

  // Prepare income vs expense chart data
  const monthlyData = transactions.reduce((acc, t) => {
    const month = new Date(t.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    if (!acc[month]) {
      acc[month] = { income: 0, expenses: 0 };
    }
    if (t.type === 'Income') {
      acc[month].income += Number(t.amount);
    } else {
      acc[month].expenses += Number(t.amount);
    }
    return acc;
  }, {} as Record<string, { income: number; expenses: number }>);

  const incomeExpenseChartData = Object.entries(monthlyData)
    .map(([month, data]) => ({ month, ...data }))
    .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())
    .slice(-6); // Last 6 months

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Finance Tracker</h1>
              <p className="text-sm text-muted-foreground">
                Welcome back, {user?.email}
              </p>
            </div>
            <Button onClick={handleSignOut} variant="outline" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Stats Cards */}
        <StatsCards
          totalIncome={totalIncome}
          totalExpenses={totalExpenses}
          balance={balance}
          transactionCount={transactions.length}
        />

        {/* Transaction Form */}
        <TransactionForm onTransactionAdded={fetchTransactions} />

        {/* Charts */}
        <div className="grid gap-8 lg:grid-cols-2">
          <ExpenseChart data={expenseChartData} />
          <IncomeExpenseChart data={incomeExpenseChartData} />
        </div>

        {/* Transaction List */}
        <TransactionList
          transactions={transactions}
          onTransactionDeleted={fetchTransactions}
        />
      </div>
    </div>
  );
};

export default Dashboard;