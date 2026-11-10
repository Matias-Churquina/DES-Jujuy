import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/store/auth';
import { Button, Input } from '@/components/ui';
import { useToast } from '@/components/Toast';

const DEMO_USERS = [
  { email: 'admin@des.com', label: 'Administrador' },
  { email: 'carlos.chofer@des.com', label: 'Chofer' },
  { email: 'ana.pasajero@des.com', label: 'Pasajero' },
];

export default function Login() {
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(email, password);
      const routes: Record<string, string> = {
        ADMIN: '/admin',
        CHOFER: '/chofer',
        PASAJERO: '/pasajero',
      };
      navigate(routes[user.rol] || '/pasajero');
    } catch (err: any) {
      toast('error', err.response?.data?.message || 'Credenciales inválidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-600 to-purple-700 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-10 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary-600">DES</h1>
          <p className="text-gray-500 dark:text-gray-400 dark:text-gray-500 mt-2">Destino Express Service</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" required />
          <Input label="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Ingresando...' : 'Iniciar Sesión'}
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500 mb-3 font-medium">Cuentas de desarrollo:</p>
          <div className="space-y-2">
            {DEMO_USERS.map((u) => (
              <button
                key={u.email}
                type="button"
                onClick={() => { setEmail(u.email); setPassword('demo123'); }}
                className="w-full text-left px-3 py-2 text-xs bg-gray-50 dark:bg-gray-700/50 hover:bg-primary-50 dark:bg-primary-900/30 hover:text-primary-700 rounded-lg transition-colors"
              >
                <span className="font-medium">{u.label}</span> — {u.email}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
