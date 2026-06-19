import { useRouteError, isRouteErrorResponse, useNavigate } from 'react-router-dom';
import { AlertTriangle, RefreshCcw, Home, WifiOff, ServerCrash } from 'lucide-react';
import { motion } from 'framer-motion';

function getErrorInfo(error: unknown): { title: string; description: string; icon: typeof ServerCrash } {
  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return {
        title: 'Página no encontrada',
        description: 'La página que buscas no existe o fue movida.',
        icon: AlertTriangle,
      };
    }
    return {
      title: `Error ${error.status}`,
      description: error.statusText || 'Ocurrió un error en la navegación.',
      icon: AlertTriangle,
    };
  }

  if (error instanceof TypeError && error.message.includes('fetch')) {
    return {
      title: 'Sin conexión al servidor',
      description: 'No se pudo conectar con la API. Verifica que el servidor y la base de datos estén en línea.',
      icon: WifiOff,
    };
  }

  return {
    title: 'Error inesperado',
    description: 'La aplicación encontró un problema. Por favor, intenta recargar la página.',
    icon: ServerCrash,
  };
}

export const ErrorPage = () => {
  const error = useRouteError();
  const navigate = useNavigate();
  const { title, description, icon: Icon } = getErrorInfo(error);

  const technicalMessage =
    error instanceof Error
      ? error.message
      : isRouteErrorResponse(error)
        ? `${error.status} – ${error.statusText}`
        : 'Error desconocido';

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full p-10 text-center"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.15, type: 'spring', stiffness: 200 }}
          className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <Icon className="w-9 h-9 text-rose-500" />
        </motion.div>

        {/* Title & Description */}
        <h1 className="text-2xl font-bold text-slate-800 mb-2">{title}</h1>
        <p className="text-slate-500 text-sm leading-relaxed mb-6">{description}</p>

        {/* Technical detail (collapsible) */}
        <details className="text-left mb-8 group">
          <summary className="text-xs text-slate-400 cursor-pointer hover:text-slate-600 transition-colors select-none">
            Ver detalle técnico
          </summary>
          <pre className="mt-2 text-xs text-rose-600 bg-rose-50 rounded-lg p-3 overflow-x-auto whitespace-pre-wrap break-words">
            {technicalMessage}
          </pre>
        </details>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
          >
            <RefreshCcw className="w-4 h-4" />
            Reintentar
          </button>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
          >
            <Home className="w-4 h-4" />
            Ir al inicio
          </button>
        </div>
      </motion.div>
    </div>
  );
};
