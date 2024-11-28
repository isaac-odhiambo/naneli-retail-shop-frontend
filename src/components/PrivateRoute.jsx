

/** @jsxImportSource react */
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function PrivateRoute({ children }) {
  // Removed the TypeScript type annotation for `children`
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated); 
  // Removed the RootState type annotation in the `useSelector` function

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}
