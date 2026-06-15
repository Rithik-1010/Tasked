import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import { ThemeProvider } from './context/ThemeContext';
import { SocketProvider } from './context/SocketContext';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SocketProvider>
          <TaskProvider>
            <AppRoutes />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: 'rgba(15,15,18,0.9)',
                  color: '#fff',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(192,132,252,0.2)',
                  borderRadius: '12px',
                  fontSize: '14px'
                },
                success: {
                  iconTheme: { primary: '#34D399', secondary: '#fff' }
                },
                error: {
                  iconTheme: { primary: '#F87171', secondary: '#fff' }
                }
              }}
            />
          </TaskProvider>
        </SocketProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
