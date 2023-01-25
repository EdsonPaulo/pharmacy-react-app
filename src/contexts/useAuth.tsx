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
import { getMeUser, postSignIn, postSignUp } from '../services/auth';
import { UserTypeEnum } from '../typescript/enums';
import { IUser } from '../typescript/types';

interface TFormData {
  name: string;
  email: string;
  password: string;
}

interface TAuthContextData {
  isLoading: boolean;
  isLoggedIn: boolean;
  formData: TFormData;
  user: IUser;
  handleSignIn: () => void;
  handleSignUp: () => void;
  handleLogout: () => void;
  handleGetUserData: () => void;
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
  const { isLoading: isLoadingUser, mutate: mutateGetMeUser } = useMutation(
    'get-me-user',
    getMeUser,
  );
  const { isLoading: isLoadingSignIn, mutate: mutateSignIn } = useMutation(
    'sign-In',
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
      onSuccess: (u) => {
        setUser(u);
        setIsLoggedIn(true);
        toast({
          duration: 2000,
          position: 'top-right',
          variant: 'subtle',
          status: 'success',
          title: 'Login efectuado com sucesso!',
        });
        navigate(
          u?.userType !== UserTypeEnum.CUSTOMER
            ? ROUTES.Dashboard
            : ROUTES.StoreFront,
        );
        localStorage.setItem('access_token', u.accessToken);
      },
      onError: (e: any) => {
        toast({
          duration: 3000,
          position: 'top-right',
          variant: 'subtle',
          status: 'error',
          title: e?.response?.data?.message ?? 'Email ou palavra-passe errada!',
        });
      },
    });
  }, [formData, mutateSignIn, navigate, toast]);

  const handleSignUp = useCallback(() => {
    mutateSignUp(formData, {
      onSuccess: (u) => {
        setUser(u);
        setIsLoggedIn(true);
        toast({
          duration: 2000,
          position: 'top-right',
          variant: 'subtle',
          status: 'success',
          title: 'Conta criada com sucesso!',
        });
        navigate(
          u?.userType !== UserTypeEnum.CUSTOMER
            ? ROUTES.Dashboard
            : ROUTES.StoreFront,
        );
        localStorage.setItem('access_token', u.accessToken);
      },
      onError: (e: any) => {
        toast({
          duration: 3000,
          position: 'top-right',
          variant: 'subtle',
          status: 'error',
          title:
            e?.response?.data?.message ?? 'Ocorreu um erro ao criar a conta!',
        });
      },
    });
  }, [formData, mutateSignUp, navigate, toast]);

  const handleChangeFormData = useCallback((args: Partial<TFormData>) => {
    setFormData((prev) => ({ ...prev, ...args }));
  }, []);

  const handleGetUserData = useCallback(() => {
    mutateGetMeUser(undefined, {
      onSuccess: (u) => {
        setUser(u);
        setIsLoggedIn(true);
      },
      onError: () => {
        handleLogout();
      },
    });
  }, [handleLogout, mutateGetMeUser]);

  useEffect(() => {
    if (!isLoggedIn && !Object.values(AUTH_ROUTES).includes(pathname)) {
      navigate(AUTH_ROUTES.AuthSignIn);
    }
    if (isLoggedIn && Object.values(AUTH_ROUTES).includes(pathname)) {
      navigate(
        user?.userType !== UserTypeEnum.CUSTOMER
          ? ROUTES.Dashboard
          : ROUTES.StoreFront,
      );
    }
  }, [navigate, pathname, isLoggedIn, user?.userType]);

  useEffect(() => {
    handleGetUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const memoizedValue = useMemo(
    () => ({
      user,
      isLoggedIn,
      formData,
      isLoading: isLoadingUser || isLoadingSignIn || isLoadingSignUp,
      handleSignIn,
      handleSignUp,
      handleLogout,
      handleChangeFormData,
      handleGetUserData,
    }),
    [
      user,
      isLoggedIn,
      formData,
      isLoadingUser,
      isLoadingSignIn,
      isLoadingSignUp,
      handleSignIn,
      handleSignUp,
      handleLogout,
      handleChangeFormData,
      handleGetUserData,
    ],
  );

  return <AuthContext.Provider value={memoizedValue} {...props} />;
};
