import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, PieChart, BarChart3, Shield, Smartphone } from 'lucide-react';

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  const handleGetStarted = () => {
    navigate('/auth');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 px-4" style={{ background: 'var(--gradient-primary)' }}>
        <div className="container mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white/20 backdrop-blur-sm rounded-full">
              <DollarSign className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Take Control of Your
            <span className="block">Financial Future</span>
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Track expenses, monitor income, and visualize your financial health with our intuitive personal finance tracker. 
            Make informed decisions with beautiful charts and detailed insights.
          </p>
          <Button 
            onClick={handleGetStarted}
            size="lg" 
            className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6 h-auto font-semibold"
          >
            Get Started Free
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Everything You Need to Manage Your Money</h2>
            <p className="text-xl text-muted-foreground">
              Powerful features designed to give you complete financial visibility
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <TrendingUp className="h-10 w-10 text-primary mb-4" />
                <CardTitle>Expense Tracking</CardTitle>
                <CardDescription>
                  Effortlessly categorize and track all your expenses with detailed descriptions and dates
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <PieChart className="h-10 w-10 text-primary mb-4" />
                <CardTitle>Visual Analytics</CardTitle>
                <CardDescription>
                  Beautiful pie charts and bar graphs help you understand your spending patterns at a glance
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <BarChart3 className="h-10 w-10 text-primary mb-4" />
                <CardTitle>Income vs Expenses</CardTitle>
                <CardDescription>
                  Monitor your financial health with monthly comparisons of income and expenses
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Shield className="h-10 w-10 text-primary mb-4" />
                <CardTitle>Secure & Private</CardTitle>
                <CardDescription>
                  Your financial data is encrypted and secure with industry-standard security practices
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Smartphone className="h-10 w-10 text-primary mb-4" />
                <CardTitle>Mobile Responsive</CardTitle>
                <CardDescription>
                  Access your financial dashboard from any device with our fully responsive design
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <DollarSign className="h-10 w-10 text-primary mb-4" />
                <CardTitle>Export Data</CardTitle>
                <CardDescription>
                  Export your transaction history to CSV for external analysis or backup purposes
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto text-center">
          <Card className="max-w-2xl mx-auto border-2">
            <CardHeader className="pb-6">
              <CardTitle className="text-3xl mb-4">Ready to Start Your Financial Journey?</CardTitle>
              <CardDescription className="text-lg">
                Join thousands of users who have taken control of their finances with our easy-to-use tracker
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleGetStarted}
                size="lg" 
                className="text-lg px-8 py-6 h-auto font-semibold"
              >
                Create Your Free Account
              </Button>
              <p className="text-sm text-muted-foreground mt-4">
                No credit card required • Free forever • Setup in 2 minutes
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t bg-background">
        <div className="container mx-auto text-center">
          <p className="text-muted-foreground">
            © 2024 Finance Tracker. Built for your financial success.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
