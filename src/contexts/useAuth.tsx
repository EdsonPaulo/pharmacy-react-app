import { useToast } from '@chakra-ui/react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useMutation } from 'react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTES, AUTH_ROUTES } from '../constants/routes';
import { postSignIn, postSignUp } from '../services/auth';

interface TFormData {
  name: string;
  email: string;
  password: string;
}

interface TAuthContextData {
  isLoading: boolean;
  isLoggedIn: boolean;
  formData: TFormData;
  user: any;
  handleSignIn: () => void;
  handleSignUp: () => void;
  handleLogout: () => void;
  handleChangeFormData: (args: Partial<TFormData>) => void;
}

export const AuthContext = createContext<TAuthContextData>(
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  {} as TAuthContextData,
);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within a AuthContext');
  return context;
};

export const AuthProvider = (props: any) => {
  const toast = useToast();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [user, setUser] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [formData, setFormData] = useState<TFormData>({
    name: '',
    email: '',
    password: '',
  });
  const { isLoading: isLoadingSignIn, mutate: mutateSignIn } = useMutation(
    'sign-in',
    postSignIn,
  );
  const { isLoading: isLoadingSignUp, mutate: mutateSignUp } = useMutation(
    'sign-up',
    postSignUp,
  );

  const handleLogout = useCallback(() => {
    setUser(null);
    setIsLoggedIn(false);
    navigate(AUTH_ROUTES.AuthSignIn);
  }, [navigate]);

  const handleSignIn = useCallback(() => {
    mutateSignIn(formData, {
      onSuccess: (res) => {
        setUser(res);
        setIsLoggedIn(true);
        toast({
          duration: 2000,
          position: 'top-right',
          variant: 'subtle',
          status: 'success',
          title: 'Login efectuado com sucesso!',
        });
        navigate(ROUTES.Dashboard);
      },
      onError: () => {
        toast({
          duration: 3000,
          position: 'top-right',
          variant: 'subtle',
          status: 'error',
          title: 'Email ou Palavra-passe inválidos',
        });
      },
    });
  }, [formData, mutateSignIn, navigate, toast]);

  const handleSignUp = useCallback(() => {
    mutateSignUp(formData, {
      onSuccess: (res) => {
        setUser(res);
        setIsLoggedIn(true);
        toast({
          duration: 2000,
          position: 'top-right',
          variant: 'subtle',
          status: 'success',
          title: 'Conta criada com sucesso!',
        });
        navigate(ROUTES.Dashboard);
      },
      onError: () => {
        toast({
          duration: 3000,
          position: 'top-right',
          variant: 'subtle',
          status: 'error',
          title: 'Ocorreu um erro ao criar a conta!',
        });
      },
    });
  }, [formData, mutateSignUp, navigate, toast]);

  const handleChangeFormData = useCallback((args: Partial<TFormData>) => {
    setFormData((prev) => ({ ...prev, ...args }));
  }, []);

  useEffect(() => {
    if (!isLoggedIn && !Object.values(AUTH_ROUTES).includes(pathname)) {
      navigate(AUTH_ROUTES.AuthSignIn);
    }
    if (isLoggedIn && Object.values(AUTH_ROUTES).includes(pathname)) {
      navigate(ROUTES.Dashboard);
    }
  }, [navigate, pathname]);

  const memoizedValue = useMemo(
    () => ({
      user,
      isLoggedIn,
      formData,
      isLoading: isLoadingSignIn || isLoadingSignUp,
      handleSignIn,
      handleSignUp,
      handleLogout,
      handleChangeFormData,
    }),
    [
      user,
      isLoggedIn,
      formData,
      isLoadingSignIn,
      isLoadingSignUp,
      handleSignIn,
      handleSignUp,
      handleLogout,
      handleChangeFormData,
    ],
  );

  return <AuthContext.Provider value={memoizedValue} {...props} />;
};
