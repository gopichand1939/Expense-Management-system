import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import testRoutes from './routes/test.route';

import authRoutes from './routes/auth.route';
import adminRoutes from './routes/admin.route';
import managerRoutes from './routes/manager.route';
import employeeRoutes from './routes/employee.route';
import expenseRoutes from './routes/expense.route';
import budgetRoutes from './routes/budget.route';
import dashboardRoutes from './routes/dashboard.route';
import notificationRoutes from './routes/notification.route';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use('/uploads', express.static('uploads'));

// ✅ ROUTES
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/manager', managerRoutes);
app.use('/employee', employeeRoutes);
app.use('/expenses', expenseRoutes);
app.use('/budget', budgetRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/notifications', notificationRoutes);

app.use('/test', testRoutes);



const PORT = process.env.PORT || 5000;

app.get('/', (_req, res) => {
  res.send('🚀 EMS backend is running!');
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

// ✅ Export app for Jest Testing
export default app;
