import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, FileText, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Transaction {
  id: string;
  amount: number;
  category: string;
  type: 'Income' | 'Expense';
  date: string;
  description: string | null;
}

interface TransactionListProps {
  transactions: Transaction[];
  onTransactionDeleted: () => void;
}

const TransactionList = ({ transactions, onTransactionDeleted }: TransactionListProps) => {
  const { toast } = useToast();

  const handleExportCSV = () => {
    if (transactions.length === 0) {
      toast({
        title: "No data to export",
        description: "Add some transactions first.",
        variant: "destructive",
      });
      return;
    }

    const headers = ['Date', 'Type', 'Category', 'Amount', 'Description'];
    const csvContent = [
      headers.join(','),
      ...transactions.map(t => [
        t.date,
        t.type,
        t.category,
        t.amount,
        t.description || ''
      ].map(field => `"${field}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export successful",
      description: "Your transactions have been exported to CSV.",
    });
  };

  const handleDeleteTransaction = async (id: string) => {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete transaction. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Deleted",
        description: "Transaction deleted successfully.",
      });
      onTransactionDeleted();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Recent Transactions
            </CardTitle>
            <CardDescription>
              Your latest financial activity
            </CardDescription>
          </div>
          <Button
            onClick={handleExportCSV}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No transactions yet. Add your first transaction above!
          </p>
        ) : (
          <div className="space-y-3">
            {transactions.slice(0, 10).map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <Badge
                      variant={transaction.type === 'Income' ? 'default' : 'destructive'}
                      className={
                        transaction.type === 'Income'
                          ? 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900 dark:text-red-200'
                      }
                    >
                      {transaction.type}
                    </Badge>
                    <span className="font-medium">{transaction.category}</span>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(transaction.date)}
                    </span>
                  </div>
                  {transaction.description && (
                    <p className="text-sm text-muted-foreground">
                      {transaction.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`font-bold ${
                      transaction.type === 'Income'
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {transaction.type === 'Income' ? '+' : '-'}
                    ${transaction.amount.toFixed(2)}
                  </span>
                  <Button
                    onClick={() => handleDeleteTransaction(transaction.id)}
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            {transactions.length > 10 && (
              <p className="text-center text-sm text-muted-foreground py-2">
                Showing 10 of {transactions.length} transactions
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionList;