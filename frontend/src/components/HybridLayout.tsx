import { useAuth } from '../context/AuthContext';
import Layout from './Layout';
import PublicLayout from './PublicLayout';

const HybridLayout = () => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <Layout /> : <PublicLayout />;
};

export default HybridLayout;
